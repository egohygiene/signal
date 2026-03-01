"""Tests for the PlaidAdapter stub (no real API calls)."""

import pytest

from plaid_adapter import NormalizedTransaction, PlaidAdapter


class TestNormalizedTransaction:
    """Unit tests for the NormalizedTransaction model."""

    def test_required_fields(self):
        """NormalizedTransaction can be constructed with required fields."""
        tx = NormalizedTransaction(
            transaction_id="tx_001",
            account_id="acc_001",
            amount=42.50,
            date="2024-01-15",
            name="Coffee Shop",
            pending=False,
        )
        assert tx.transaction_id == "tx_001"
        assert tx.account_id == "acc_001"
        assert tx.amount == 42.50
        assert tx.date == "2024-01-15"
        assert tx.name == "Coffee Shop"
        assert tx.pending is False

    def test_optional_fields_default_to_none(self):
        """Optional fields default to None when not provided."""
        tx = NormalizedTransaction(
            transaction_id="tx_002",
            account_id="acc_002",
            amount=10.00,
            date="2024-01-16",
            name="Grocery Store",
            pending=True,
        )
        assert tx.merchant_name is None
        assert tx.category is None
        assert tx.payment_channel is None
        assert tx.iso_currency_code is None

    def test_optional_fields_set(self):
        """Optional fields are stored when provided."""
        tx = NormalizedTransaction(
            transaction_id="tx_003",
            account_id="acc_003",
            amount=5.00,
            date="2024-01-17",
            name="Amazon",
            merchant_name="Amazon.com",
            category=["Shopping", "Online"],
            pending=False,
            payment_channel="online",
            iso_currency_code="USD",
        )
        assert tx.merchant_name == "Amazon.com"
        assert tx.category == ["Shopping", "Online"]
        assert tx.payment_channel == "online"
        assert tx.iso_currency_code == "USD"


class TestPlaidAdapterNormalize:
    """Unit tests for PlaidAdapter.normalize_transaction (no API calls)."""

    @pytest.fixture
    def adapter(self, monkeypatch):
        """Return a PlaidAdapter without a real Plaid client."""
        monkeypatch.setattr(
            "plaid_adapter.plaid.ApiClient", lambda config: None
        )
        monkeypatch.setattr(
            "plaid_adapter.plaid_api.PlaidApi", lambda client: None
        )
        return PlaidAdapter(
            client_id="fake_client_id",
            secret="fake_secret",
            environment="sandbox",
        )

    def test_normalize_transaction_from_dict(self, adapter):
        """normalize_transaction handles a plain dict correctly."""
        raw = {
            "transaction_id": "tx_100",
            "account_id": "acc_100",
            "amount": 99.99,
            "date": "2024-02-01",
            "name": "Test Merchant",
            "pending": False,
        }
        tx = adapter.normalize_transaction(raw)
        assert tx.transaction_id == "tx_100"
        assert tx.amount == 99.99
        assert tx.pending is False

    def test_normalize_transaction_missing_optional_fields(self, adapter):
        """normalize_transaction uses defaults for missing optional fields."""
        raw = {
            "transaction_id": "tx_101",
            "account_id": "acc_101",
            "amount": 0.0,
            "date": "2024-02-02",
            "name": "",
            "pending": True,
        }
        tx = adapter.normalize_transaction(raw)
        assert tx.merchant_name is None
        assert tx.category is None

    def test_normalize_transactions_skips_invalid(self, adapter, caplog):
        """normalize_transactions skips malformed entries and logs a warning."""
        import logging

        good = {
            "transaction_id": "tx_200",
            "account_id": "acc_200",
            "amount": 1.0,
            "date": "2024-03-01",
            "name": "Valid",
            "pending": False,
        }
        # Pass None — not a dict and has no to_dict(), so normalize_transaction
        # will raise AttributeError when it calls tx.get(...).
        bad = None

        with caplog.at_level(logging.WARNING, logger="plaid_adapter"):
            results = adapter.normalize_transactions([good, bad])

        assert len(results) == 1
        assert results[0].transaction_id == "tx_200"

    def test_invalid_environment_raises(self, monkeypatch):
        """PlaidAdapter raises ValueError for an unknown environment."""
        with pytest.raises(ValueError, match="Invalid environment"):
            PlaidAdapter(
                client_id="id",
                secret="secret",
                environment="unknown_env",
            )
