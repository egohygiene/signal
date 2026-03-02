"""Plaid API adapter for fetching financial data."""

import logging
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional, Set

import plaid
from plaid.api import plaid_api
from plaid.model.transactions_sync_request import TransactionsSyncRequest
from pydantic import BaseModel

logger = logging.getLogger(__name__)


class NormalizedTransaction(BaseModel):
    """Normalized transaction structure."""

    transaction_id: str
    account_id: str
    amount: float
    date: str
    name: str
    merchant_name: Optional[str] = None
    category: Optional[List[str]] = None
    pending: bool
    payment_channel: Optional[str] = None
    iso_currency_code: Optional[str] = None


class PlaidAdapter:
    """Adapter for interacting with Plaid API."""

    def __init__(
        self,
        client_id: str,
        secret: str,
        environment: str = "sandbox",
    ):
        """
        Initialize Plaid client.

        Args:
            client_id: Plaid client ID
            secret: Plaid secret key
            environment: Plaid environment (sandbox, production)
        """
        self.client_id = client_id
        self.secret = secret
        self.environment = environment

        # Map environment string to Plaid environment enum
        env_map = {
            "sandbox": plaid.Environment.Sandbox,
            "production": plaid.Environment.Production,
        }

        if environment not in env_map:
            raise ValueError(
                f"Invalid environment: {environment}. "
                f"Must be one of: {', '.join(env_map.keys())}"
            )

        # Initialize Plaid configuration
        configuration = plaid.Configuration(
            host=env_map[environment],
            api_key={
                "clientId": client_id,
                "secret": secret,
            },
        )

        # Create Plaid API client
        api_client = plaid.ApiClient(configuration)
        self.client = plaid_api.PlaidApi(api_client)

        logger.info(f"Plaid adapter initialized in {environment} mode")

    def get_transactions(
        self,
        access_token: str,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
        account_ids: Optional[List[str]] = None,
    ) -> Dict[str, Any]:
        """
        Fetch all transactions from Plaid API using cursor-based pagination.

        Iterates through all pages using ``next_cursor`` until ``has_more``
        is ``False``, aggregating every page of ``added`` transactions.
        Transactions are deduplicated by ``transaction_id`` across pages.
        Optional ``start_date``/``end_date`` filters are applied after all
        pages have been fetched.

        Args:
            access_token: Plaid access token for the account
            start_date: Optional start date in YYYY-MM-DD format to filter
                results (defaults to 30 days ago when used for display only)
            end_date: Optional end date in YYYY-MM-DD format to filter results
            account_ids: Optional list of account IDs to restrict results to

        Returns:
            Dictionary containing transactions and account information

        Raises:
            Exception: If a Plaid API error occurs during pagination
        """
        # Resolve display-only defaults for logging
        log_start = start_date or (
            datetime.now() - timedelta(days=30)
        ).strftime("%Y-%m-%d")
        log_end = end_date or datetime.now().strftime("%Y-%m-%d")

        logger.info(
            f"Fetching transactions from {log_start} to {log_end} "
            f"for token ending in ...{access_token[-4:]}"
        )

        all_transactions: List[Dict[str, Any]] = []
        seen_ids: Set[str] = set()
        accounts: List[Any] = []
        request_id: Optional[str] = None
        cursor: Optional[str] = None
        page = 0

        try:
            while True:
                page += 1
                # Build the sync request; omit cursor on the first call so
                # Plaid returns the full history from the beginning.
                if cursor:
                    request = TransactionsSyncRequest(
                        access_token=access_token,
                        cursor=cursor,
                    )
                else:
                    request = TransactionsSyncRequest(
                        access_token=access_token,
                    )

                response = self.client.transactions_sync(request)
                response_dict = response.to_dict()

                # Capture accounts from the first non-empty response; keep first request_id
                accounts = accounts or response_dict.get("accounts", [])
                request_id = request_id or response_dict.get("request_id")

                # Deduplicate added transactions by transaction_id
                for tx in response_dict.get("added", []):
                    tx_id = tx.get("transaction_id")
                    if tx_id and tx_id not in seen_ids:
                        seen_ids.add(tx_id)
                        all_transactions.append(tx)

                logger.debug(
                    f"Page {page}: fetched "
                    f"{len(response_dict.get('added', []))} added transactions "
                    f"(running total: {len(all_transactions)})"
                )

                has_more = response_dict.get("has_more", False)
                cursor = response_dict.get("next_cursor")

                if not has_more:
                    break

        except plaid.ApiException as e:
            logger.error(
                f"Plaid API error on page {page} "
                f"({len(all_transactions)} transactions already fetched): {e}"
            )
            error_response = e.body if hasattr(e, "body") else str(e)
            logger.error(f"Error details: {error_response}")
            raise Exception(f"Failed to fetch transactions: {error_response}")
        except Exception as e:
            logger.error(
                f"Unexpected error fetching transactions on page {page}: {e}"
            )
            raise

        # Apply optional account_ids filter post-fetch
        if account_ids:
            account_ids_set = set(account_ids)
            all_transactions = [
                tx
                for tx in all_transactions
                if tx.get("account_id") in account_ids_set
            ]

        # Apply optional date range filter post-fetch
        if start_date or end_date:
            start_dt = (
                datetime.strptime(start_date, "%Y-%m-%d").date()
                if start_date
                else None
            )
            end_dt = (
                datetime.strptime(end_date, "%Y-%m-%d").date()
                if end_date
                else None
            )
            filtered = []
            for tx in all_transactions:
                tx_date_raw = tx.get("date")
                if tx_date_raw is None:
                    filtered.append(tx)
                    continue
                # date may be a date object or an ISO string
                if isinstance(tx_date_raw, str):
                    try:
                        tx_date = datetime.strptime(tx_date_raw, "%Y-%m-%d").date()
                    except ValueError:
                        filtered.append(tx)
                        continue
                else:
                    tx_date = tx_date_raw
                if start_dt and tx_date < start_dt:
                    continue
                if end_dt and tx_date > end_dt:
                    continue
                filtered.append(tx)
            all_transactions = filtered

        logger.info(
            f"Successfully fetched {len(all_transactions)} transactions "
            f"across {page} page(s)"
        )

        return {
            "accounts": accounts,
            "transactions": all_transactions,
            "total_transactions": len(all_transactions),
            "request_id": request_id,
        }

    def normalize_transaction(self, transaction: Any) -> NormalizedTransaction:
        """
        Normalize a Plaid transaction to a consistent structure.

        Args:
            transaction: Raw Plaid transaction object

        Returns:
            Normalized transaction model
        """
        # Handle both dict and object formats
        if isinstance(transaction, dict):
            tx = transaction
        else:
            tx = (
                transaction.to_dict()
                if hasattr(transaction, "to_dict")
                else transaction
            )

        return NormalizedTransaction(
            transaction_id=tx.get("transaction_id", ""),
            account_id=tx.get("account_id", ""),
            amount=float(tx.get("amount", 0.0)),
            date=tx.get("date", ""),
            name=tx.get("name", ""),
            merchant_name=tx.get("merchant_name"),
            category=tx.get("category"),
            pending=tx.get("pending", False),
            payment_channel=tx.get("payment_channel"),
            iso_currency_code=tx.get("iso_currency_code"),
        )

    def normalize_transactions(
        self, transactions: List[Any]
    ) -> List[NormalizedTransaction]:
        """
        Normalize a list of Plaid transactions.

        Args:
            transactions: List of raw Plaid transaction objects

        Returns:
            List of normalized transaction models
        """
        normalized = []
        for tx in transactions:
            try:
                normalized.append(self.normalize_transaction(tx))
            except Exception as e:
                logger.warning(f"Failed to normalize transaction: {e}")
                continue

        logger.info(f"Successfully normalized {len(normalized)} transactions")
        return normalized
