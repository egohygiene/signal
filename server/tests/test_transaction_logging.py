"""Tests for transaction logging behavior gated behind the debug flag."""

import logging
from unittest.mock import MagicMock

import pytest

from plaid_adapter import NormalizedTransaction


def _mock_adapter(normalized_transactions):
    """Return a mock PlaidAdapter that returns the given transactions."""
    mock = MagicMock()
    mock.get_transactions.return_value = {
        "transactions": [],
        "accounts": [{"id": "acc_001"}],
        "request_id": "req_1",
    }
    mock.normalize_transactions.return_value = normalized_transactions
    return mock


_SAMPLE_TRANSACTIONS = [
    NormalizedTransaction(
        transaction_id="tx_001",
        account_id="acc_001",
        amount=42.50,
        date="2024-01-15",
        name="Starbucks",
        merchant_name="Starbucks",
        pending=False,
    )
]


@pytest.mark.asyncio
async def test_detailed_logs_appear_at_debug_level(client, monkeypatch, caplog):
    """Detailed transaction info (merchant names) is logged at DEBUG level."""
    import main

    monkeypatch.setattr(main, "plaid_adapter", _mock_adapter(_SAMPLE_TRANSACTIONS))

    with caplog.at_level(logging.DEBUG, logger="main"):
        response = await client.post(
            "/api/plaid/transactions",
            json={},
            headers={"X-Access-Token": "valid-token"},
        )

    assert response.status_code == 200
    messages = [r.message for r in caplog.records]
    assert any("Starbucks" in m for m in messages), (
        "Expected merchant name 'Starbucks' in DEBUG-level logs"
    )
    assert any("PLAID TRANSACTION SUMMARY" in m for m in messages)


@pytest.mark.asyncio
async def test_detailed_logs_suppressed_at_info_level(client, monkeypatch, caplog):
    """Detailed transaction info (merchant names) is NOT logged at INFO level."""
    import main

    monkeypatch.setattr(main, "plaid_adapter", _mock_adapter(_SAMPLE_TRANSACTIONS))

    with caplog.at_level(logging.INFO, logger="main"):
        response = await client.post(
            "/api/plaid/transactions",
            json={},
            headers={"X-Access-Token": "valid-token"},
        )

    assert response.status_code == 200
    messages = [r.message for r in caplog.records]
    assert not any("Starbucks" in m for m in messages), (
        "Merchant name 'Starbucks' must not appear in INFO-level logs"
    )
    assert not any("PLAID TRANSACTION SUMMARY" in m for m in messages), (
        "Transaction summary header must not appear in INFO-level logs"
    )
    # Non-sensitive request-level log must still be present
    assert any("Fetching Plaid transactions" in m for m in messages)


@pytest.mark.asyncio
async def test_post_request_log_masks_account_ids(client, monkeypatch, caplog):
    """POST /api/plaid/transactions request log shows count, not raw account IDs."""
    import main

    monkeypatch.setattr(main, "plaid_adapter", _mock_adapter(_SAMPLE_TRANSACTIONS))

    with caplog.at_level(logging.INFO, logger="main"):
        response = await client.post(
            "/api/plaid/transactions",
            json={"account_ids": ["acc_001", "acc_002"]},
            headers={"X-Access-Token": "valid-token"},
        )

    assert response.status_code == 200
    messages = [r.message for r in caplog.records]
    # Raw account IDs must not appear in logs
    assert not any("acc_001" in m or "acc_002" in m for m in messages), (
        "Raw account IDs must not appear in INFO-level request logs"
    )
    # Masked count must appear
    assert any("2 account(s)" in m for m in messages)
