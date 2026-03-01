"""Tests for the health and root endpoints."""

import pytest


@pytest.mark.asyncio
async def test_root_endpoint(client):
    """Root endpoint returns a welcome message."""
    response = await client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to Signal API"}


@pytest.mark.asyncio
async def test_health_endpoint_returns_200(client):
    """Health endpoint returns HTTP 200."""
    response = await client.get("/health")
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_health_endpoint_schema(client):
    """Health endpoint response contains required fields."""
    response = await client.get("/health")
    body = response.json()
    assert "status" in body
    assert "version" in body
    assert "plaid_configured" in body


@pytest.mark.asyncio
async def test_health_endpoint_status_value(client):
    """Health endpoint reports 'healthy' status."""
    response = await client.get("/health")
    assert response.json()["status"] == "healthy"


@pytest.mark.asyncio
async def test_health_endpoint_plaid_not_configured(client):
    """Health endpoint reports Plaid as unconfigured when no credentials are set."""
    response = await client.get("/health")
    # In the test environment no Plaid credentials are provided, so the adapter
    # should not be initialized.
    assert response.json()["plaid_configured"] is False
