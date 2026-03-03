"""Tests for error-handling paths in the Signal API endpoints."""

import pytest


@pytest.mark.asyncio
async def test_transactions_get_missing_access_token(client):
    """GET /api/transactions without X-Access-Token header returns 422."""
    response = await client.get("/api/transactions")
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_transactions_get_empty_access_token(client):
    """GET /api/transactions with a blank token returns 400."""
    response = await client.get(
        "/api/transactions",
        headers={"X-Access-Token": "   "},
    )
    assert response.status_code == 400
    assert "empty" in response.json()["detail"].lower()


@pytest.mark.asyncio
async def test_transactions_get_invalid_start_date(client):
    """GET /api/transactions with a bad start_date format returns 400."""
    response = await client.get(
        "/api/transactions",
        params={"start_date": "01-15-2024"},
        headers={"X-Access-Token": "valid-token"},
    )
    assert response.status_code == 400
    assert "start_date" in response.json()["detail"]


@pytest.mark.asyncio
async def test_transactions_get_invalid_end_date(client):
    """GET /api/transactions with a bad end_date format returns 400."""
    response = await client.get(
        "/api/transactions",
        params={"end_date": "not-a-date"},
        headers={"X-Access-Token": "valid-token"},
    )
    assert response.status_code == 400
    assert "end_date" in response.json()["detail"]


@pytest.mark.asyncio
async def test_transactions_get_plaid_not_configured(client):
    """GET /api/transactions returns 503 when Plaid adapter is not set up."""
    response = await client.get(
        "/api/transactions",
        headers={"X-Access-Token": "valid-token"},
    )
    assert response.status_code == 503
    assert "not configured" in response.json()["detail"].lower()


@pytest.mark.asyncio
async def test_plaid_transactions_post_missing_access_token(client):
    """POST /api/plaid/transactions without X-Access-Token header returns 422."""
    response = await client.post("/api/plaid/transactions")
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_plaid_transactions_post_empty_access_token(client):
    """POST /api/plaid/transactions with a blank token returns 400."""
    response = await client.post(
        "/api/plaid/transactions",
        json={},
        headers={"X-Access-Token": "   "},
    )
    assert response.status_code == 400
    assert "empty" in response.json()["detail"].lower()


@pytest.mark.asyncio
async def test_plaid_transactions_post_plaid_not_configured(client):
    """POST /api/plaid/transactions returns 503 when Plaid is not configured."""
    response = await client.post(
        "/api/plaid/transactions",
        json={},
        headers={"X-Access-Token": "fake-token"},
    )
    assert response.status_code == 503
    assert "not configured" in response.json()["detail"].lower()


@pytest.mark.asyncio
async def test_not_found_endpoint(client):
    """An unknown endpoint returns 404."""
    response = await client.get("/nonexistent")
    assert response.status_code == 404
