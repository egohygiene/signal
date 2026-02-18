"""Main FastAPI application entry point."""

import logging
import sys
from contextlib import asynccontextmanager
from typing import List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pydantic_settings import BaseSettings, SettingsConfigDict

from plaid_adapter import PlaidAdapter, NormalizedTransaction


class Settings(BaseSettings):
    """Application settings with environment variable loading."""

    app_name: str = "Signal API"
    app_version: str = "0.1.0"
    debug: bool = False
    log_level: str = "INFO"
    # For multiple origins, use JSON array format:
    # ["http://localhost:5173", "http://localhost:3000"]
    cors_origins: List[str] = ["http://localhost:5173"]

    # Plaid API settings
    plaid_client_id: Optional[str] = None
    plaid_secret: Optional[str] = None
    plaid_env: str = "sandbox"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )


def setup_logging(log_level: str) -> None:
    """Configure structured logging."""
    logging.basicConfig(
        level=getattr(logging, log_level.upper()),
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        handlers=[logging.StreamHandler(sys.stdout)],
    )


# Load settings
settings = Settings()

# Setup logging
setup_logging(settings.log_level)
logger = logging.getLogger(__name__)

# Initialize Plaid adapter if credentials are configured
plaid_adapter: Optional[PlaidAdapter] = None
if settings.plaid_client_id and settings.plaid_secret:
    try:
        plaid_adapter = PlaidAdapter(
            client_id=settings.plaid_client_id,
            secret=settings.plaid_secret,
            environment=settings.plaid_env,
        )
        logger.info("Plaid adapter initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize Plaid adapter: {e}")
else:
    logger.warning(
        "Plaid credentials not configured. Set PLAID_CLIENT_ID and PLAID_SECRET "
        "environment variables to enable Plaid integration."
    )


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifespan events."""
    # Startup
    logger.info(f"Starting {settings.app_name} v{settings.app_version}")
    logger.info(f"Debug mode: {settings.debug}")
    logger.info(f"CORS origins: {settings.cors_origins}")
    yield
    # Shutdown
    logger.info("Shutting down application")


# Create FastAPI app
app = FastAPI(
    title=settings.app_name,
    description="Backend API for Signal application",
    version=settings.app_version,
    debug=settings.debug,
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Root endpoint."""
    logger.debug("Root endpoint called")
    return {"message": "Welcome to Signal API"}


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    logger.debug("Health check endpoint called")
    return {
        "status": "healthy",
        "version": settings.app_version,
        "plaid_configured": plaid_adapter is not None,
    }


class TransactionsRequest(BaseModel):
    """Request model for fetching transactions."""

    access_token: str
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    account_ids: Optional[List[str]] = None


class TransactionsResponse(BaseModel):
    """Response model for transactions."""

    transactions: List[NormalizedTransaction]
    total_count: int
    accounts_count: int
    request_id: Optional[str] = None


@app.get("/transactions", response_model=TransactionsResponse)
async def get_transactions(
    access_token: str,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    account_ids: Optional[str] = None,
):
    """
    Fetch and normalize transactions from Plaid API (GET endpoint).

    This is a passthrough endpoint that fetches transactions for a given access
    token and returns normalized transaction data.

    Args:
        access_token: Plaid access token (required query parameter)
        start_date: Optional start date in YYYY-MM-DD format
        end_date: Optional end date in YYYY-MM-DD format
        account_ids: Optional comma-separated list of account IDs

    Returns:
        Normalized transactions with metadata

    Raises:
        HTTPException: If Plaid is not configured or API call fails
    """
    if not plaid_adapter:
        logger.error("Plaid adapter not configured")
        raise HTTPException(
            status_code=503,
            detail="Plaid integration is not configured. "
            "Please set PLAID_CLIENT_ID and PLAID_SECRET environment variables.",
        )

    try:
        # Parse account_ids from comma-separated string if provided
        account_ids_list = None
        if account_ids:
            account_ids_list = [aid.strip() for aid in account_ids.split(",")]

        # Log request details (excluding sensitive data)
        logger.info(
            f"Fetching transactions - "
            f"start_date: {start_date}, "
            f"end_date: {end_date}, "
            f"account_ids: {account_ids_list}"
        )

        # Fetch transactions from Plaid
        result = plaid_adapter.get_transactions(
            access_token=access_token,
            start_date=start_date,
            end_date=end_date,
            account_ids=account_ids_list,
        )

        # Normalize transactions
        normalized_transactions = plaid_adapter.normalize_transactions(
            result.get("transactions", [])
        )

        logger.info(f"Successfully fetched {len(normalized_transactions)} transactions")

        return TransactionsResponse(
            transactions=normalized_transactions,
            total_count=len(normalized_transactions),
            accounts_count=len(result.get("accounts", [])),
            request_id=result.get("request_id"),
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching transactions: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch transactions: {str(e)}",
        )


@app.post("/api/plaid/transactions", response_model=TransactionsResponse)
async def get_plaid_transactions(request: TransactionsRequest):
    """
    Fetch and normalize transactions from Plaid API.

    This endpoint fetches transactions for a given access token and returns
    normalized transaction data. Logs results to the server console.

    Args:
        request: Transaction request with access token and optional filters

    Returns:
        Normalized transactions with metadata

    Raises:
        HTTPException: If Plaid is not configured or API call fails
    """
    if not plaid_adapter:
        logger.error("Plaid adapter not configured")
        raise HTTPException(
            status_code=503,
            detail="Plaid integration is not configured. "
            "Please set PLAID_CLIENT_ID and PLAID_SECRET environment variables.",
        )

    try:
        # Log request details (excluding sensitive data)
        logger.info(
            f"Fetching Plaid transactions - "
            f"start_date: {request.start_date}, "
            f"end_date: {request.end_date}, "
            f"account_ids: {request.account_ids}"
        )

        # Fetch transactions from Plaid
        result = plaid_adapter.get_transactions(
            access_token=request.access_token,
            start_date=request.start_date,
            end_date=request.end_date,
            account_ids=request.account_ids,
        )

        # Normalize transactions
        normalized_transactions = plaid_adapter.normalize_transactions(
            result.get("transactions", [])
        )

        # Log transaction summary to console
        logger.info("=" * 80)
        logger.info("PLAID TRANSACTION SUMMARY")
        logger.info("=" * 80)
        logger.info(f"Total transactions fetched: {len(normalized_transactions)}")
        logger.info(f"Accounts involved: {len(result.get('accounts', []))}")
        logger.info(
            f"Date range: {request.start_date or 'last 30 days'} to "
            f"{request.end_date or 'today'}"
        )
        logger.info("-" * 80)

        # Log individual transactions
        for i, tx in enumerate(normalized_transactions[:10], 1):  # Log first 10
            logger.info(f"Transaction {i}:")
            logger.info(f"  ID: {tx.transaction_id}")
            logger.info(f"  Date: {tx.date}")
            logger.info(f"  Name: {tx.name}")
            logger.info(f"  Amount: ${tx.amount:.2f} {tx.iso_currency_code or 'USD'}")
            logger.info(
                f"  Category: "
                f"{', '.join(tx.category) if tx.category else 'Uncategorized'}"
            )
            logger.info(f"  Pending: {tx.pending}")

        if len(normalized_transactions) > 10:
            logger.info(
                f"... and {len(normalized_transactions) - 10} more transactions"
            )

        logger.info("=" * 80)

        return TransactionsResponse(
            transactions=normalized_transactions,
            total_count=len(normalized_transactions),
            accounts_count=len(result.get("accounts", [])),
            request_id=result.get("request_id"),
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching Plaid transactions: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch transactions: {str(e)}",
        )
