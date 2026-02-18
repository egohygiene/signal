"""Plaid API adapter for fetching financial data."""

import logging
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

import plaid
from plaid.api import plaid_api
from plaid.model.transactions_get_request import TransactionsGetRequest
from plaid.model.transactions_get_request_options import TransactionsGetRequestOptions
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
        Fetch transactions from Plaid API.

        Args:
            access_token: Plaid access token for the account
            start_date: Start date in YYYY-MM-DD format (defaults to 30 days ago)
            end_date: End date in YYYY-MM-DD format (defaults to today)
            account_ids: Optional list of specific account IDs to fetch

        Returns:
            Dictionary containing transactions and account information

        Raises:
            Exception: If API call fails
        """
        try:
            # Set default date range if not provided
            if not end_date:
                end_date = datetime.now().strftime("%Y-%m-%d")
            if not start_date:
                start_date = (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d")

            logger.info(
                f"Fetching transactions from {start_date} to {end_date} "
                f"for token ending in ...{access_token[-4:]}"
            )

            # Create request options
            options = None
            if account_ids:
                options = TransactionsGetRequestOptions(account_ids=account_ids)

            # Create transactions request
            request = TransactionsGetRequest(
                access_token=access_token,
                start_date=datetime.strptime(start_date, "%Y-%m-%d").date(),
                end_date=datetime.strptime(end_date, "%Y-%m-%d").date(),
                options=options,
            )

            # Fetch transactions
            response = self.client.transactions_get(request)

            # Convert response to dict for easier access
            response_dict = response.to_dict()

            logger.info(
                f"Successfully fetched "
                f"{len(response_dict['transactions'])} "
                f"transactions"
            )

            return {
                "accounts": response_dict.get("accounts", []),
                "transactions": response_dict.get("transactions", []),
                "total_transactions": response_dict.get(
                    "total_transactions", 0
                ),
                "request_id": response_dict.get("request_id"),
            }

        except plaid.ApiException as e:
            logger.error(f"Plaid API error: {e}")
            error_response = e.body if hasattr(e, "body") else str(e)
            logger.error(f"Error details: {error_response}")
            raise Exception(f"Failed to fetch transactions: {error_response}")
        except Exception as e:
            logger.error(f"Unexpected error fetching transactions: {e}")
            raise

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
