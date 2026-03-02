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

    def test_normalize_transaction_missing_transaction_id_raises(self, adapter):
        """normalize_transaction raises ValueError when transaction_id is absent."""
        raw = {
            "account_id": "acc_x",
            "amount": 5.0,
            "date": "2024-04-01",
            "name": "Merchant",
            "pending": False,
        }
        with pytest.raises(ValueError, match="transaction_id"):
            adapter.normalize_transaction(raw)

    def test_normalize_transaction_empty_transaction_id_raises(self, adapter):
        """normalize_transaction raises ValueError when transaction_id is empty string."""
        raw = {
            "transaction_id": "",
            "account_id": "acc_x",
            "amount": 5.0,
            "date": "2024-04-01",
            "name": "Merchant",
            "pending": False,
        }
        with pytest.raises(ValueError, match="transaction_id"):
            adapter.normalize_transaction(raw)

    def test_normalize_transaction_missing_account_id_raises(self, adapter):
        """normalize_transaction raises ValueError when account_id is absent."""
        raw = {
            "transaction_id": "tx_x",
            "amount": 5.0,
            "date": "2024-04-01",
            "name": "Merchant",
            "pending": False,
        }
        with pytest.raises(ValueError, match="account_id"):
            adapter.normalize_transaction(raw)

    def test_normalize_transaction_empty_account_id_raises(self, adapter):
        """normalize_transaction raises ValueError when account_id is empty string."""
        raw = {
            "transaction_id": "tx_x",
            "account_id": "",
            "amount": 5.0,
            "date": "2024-04-01",
            "name": "Merchant",
            "pending": False,
        }
        with pytest.raises(ValueError, match="account_id"):
            adapter.normalize_transaction(raw)

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


def _make_sync_response(added, has_more, next_cursor="cursor_next", accounts=None, request_id="req_1"):
    """Build a mock transactions_sync response dict."""

    class MockResponse:
        def to_dict(self_inner):
            return {
                "added": added,
                "modified": [],
                "removed": [],
                "has_more": has_more,
                "next_cursor": next_cursor,
                "accounts": accounts or [],
                "request_id": request_id,
            }

    return MockResponse()


class TestGetTransactionsPagination:
    """Tests for cursor-based pagination in PlaidAdapter.get_transactions."""

    @pytest.fixture
    def adapter(self, monkeypatch):
        """Return a PlaidAdapter with a mocked Plaid client."""
        monkeypatch.setattr("plaid_adapter.plaid.ApiClient", lambda config: None)
        monkeypatch.setattr("plaid_adapter.plaid_api.PlaidApi", lambda client: None)
        instance = PlaidAdapter(
            client_id="fake_client_id",
            secret="fake_secret",
            environment="sandbox",
        )
        return instance

    def _make_tx(self, tx_id, date="2024-01-10", account_id="acc_1"):
        return {
            "transaction_id": tx_id,
            "account_id": account_id,
            "amount": 10.0,
            "date": date,
            "name": "Merchant",
            "pending": False,
        }

    def test_single_page_returns_all_transactions(self, adapter):
        """Single page (has_more=False) returns all added transactions."""
        txs = [self._make_tx("tx_1"), self._make_tx("tx_2")]
        calls = [_make_sync_response(txs, has_more=False, accounts=[{"id": "acc_1"}])]
        adapter.client = type("FakeClient", (), {"transactions_sync": lambda self, req: calls.pop(0)})()

        result = adapter.get_transactions("access-token-abc")

        assert len(result["transactions"]) == 2
        assert result["total_transactions"] == 2
        assert result["accounts"] == [{"id": "acc_1"}]
        assert result["request_id"] == "req_1"

    def test_multiple_pages_aggregated(self, adapter):
        """All pages are fetched and their transactions are aggregated."""
        page1_txs = [self._make_tx("tx_1"), self._make_tx("tx_2")]
        page2_txs = [self._make_tx("tx_3"), self._make_tx("tx_4")]
        page3_txs = [self._make_tx("tx_5")]

        responses = iter([
            _make_sync_response(page1_txs, has_more=True, next_cursor="c1"),
            _make_sync_response(page2_txs, has_more=True, next_cursor="c2"),
            _make_sync_response(page3_txs, has_more=False, next_cursor="c3"),
        ])
        adapter.client = type("FakeClient", (), {"transactions_sync": lambda self, req: next(responses)})()

        result = adapter.get_transactions("access-token-abc")

        assert len(result["transactions"]) == 5
        assert result["total_transactions"] == 5

    def test_duplicate_transactions_deduplicated(self, adapter):
        """Duplicate transaction_ids across pages are not included twice."""
        tx = self._make_tx("tx_dup")
        responses = iter([
            _make_sync_response([tx], has_more=True, next_cursor="c1"),
            _make_sync_response([tx], has_more=False),  # same tx_id repeated
        ])
        adapter.client = type("FakeClient", (), {"transactions_sync": lambda self, req: next(responses)})()

        result = adapter.get_transactions("access-token-abc")

        assert len(result["transactions"]) == 1
        assert result["transactions"][0]["transaction_id"] == "tx_dup"

    def test_account_ids_filter_applied_post_fetch(self, adapter):
        """Only transactions matching account_ids are returned."""
        txs = [
            self._make_tx("tx_a", account_id="acc_a"),
            self._make_tx("tx_b", account_id="acc_b"),
        ]
        responses = iter([_make_sync_response(txs, has_more=False)])
        adapter.client = type("FakeClient", (), {"transactions_sync": lambda self, req: next(responses)})()

        result = adapter.get_transactions("tok", account_ids=["acc_a"])

        assert len(result["transactions"]) == 1
        assert result["transactions"][0]["transaction_id"] == "tx_a"

    def test_date_filter_applied_post_fetch(self, adapter):
        """Transactions outside the requested date range are excluded."""
        txs = [
            self._make_tx("tx_old", date="2024-01-01"),
            self._make_tx("tx_mid", date="2024-01-15"),
            self._make_tx("tx_new", date="2024-02-01"),
        ]
        responses = iter([_make_sync_response(txs, has_more=False)])
        adapter.client = type("FakeClient", (), {"transactions_sync": lambda self, req: next(responses)})()

        result = adapter.get_transactions("tok", start_date="2024-01-10", end_date="2024-01-20")

        assert len(result["transactions"]) == 1
        assert result["transactions"][0]["transaction_id"] == "tx_mid"

    def test_plaid_api_error_raises_exception(self, adapter):
        """A PlaidApiException during pagination is raised as a generic Exception."""
        import plaid

        def raise_api_error(_self, req):
            exc = plaid.ApiException(status=500, reason="Internal Server Error")
            exc.body = '{"error_code": "INTERNAL_SERVER_ERROR"}'
            raise exc

        adapter.client = type("FakeClient", (), {"transactions_sync": raise_api_error})()

        with pytest.raises(Exception, match="Failed to fetch transactions"):
            adapter.get_transactions("access-token-abc")

    def test_plaid_api_error_mid_pagination_raises(self, adapter):
        """A PlaidApiException on page 2 is raised after partial data fetched."""
        import plaid

        page1_txs = [self._make_tx("tx_1")]
        call_count = [0]

        def side_effect(_self, req):
            call_count[0] += 1
            if call_count[0] == 1:
                return _make_sync_response(page1_txs, has_more=True, next_cursor="c1")
            exc = plaid.ApiException(status=500, reason="Server Error")
            exc.body = '{"error_code": "INTERNAL_SERVER_ERROR"}'
            raise exc

        adapter.client = type("FakeClient", (), {"transactions_sync": side_effect})()

        with pytest.raises(Exception, match="Failed to fetch transactions"):
            adapter.get_transactions("access-token-abc")
