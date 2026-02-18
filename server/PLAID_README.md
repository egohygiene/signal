# Plaid Adapter

A Python adapter for integrating with the Plaid API to fetch and normalize financial transaction data.

## Features

- Initialize Plaid client using environment variables
- Support for sandbox, development, and production environments
- Fetch transactions for connected accounts
- Normalize transaction data to a consistent structure
- Comprehensive error handling and logging
- No database persistence (data logged to console)

## Setup

### 1. Get Plaid API Credentials

1. Sign up for a Plaid account at https://dashboard.plaid.com/signup
2. Navigate to Team Settings > Keys
3. Copy your `client_id` and `secret` (sandbox credentials work for testing)

### 2. Configure Environment Variables

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and add your Plaid credentials:

```env
PLAID_CLIENT_ID=your_client_id_here
PLAID_SECRET=your_secret_here
PLAID_ENV=sandbox
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Run the Server

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Usage

### Getting Sandbox Access Token

For sandbox testing, you need to:

1. Use Plaid Link to connect a sandbox account
2. Exchange the public token for an access token
3. Use the access token to fetch transactions

For quick testing with Plaid's sandbox, you can use their test credentials:
- Username: `user_good`
- Password: `pass_good`

### API Endpoints

#### Health Check

Check if Plaid is configured:

```bash
curl http://localhost:8000/health
```

Response:
```json
{
  "status": "healthy",
  "version": "0.1.0",
  "plaid_configured": true
}
```

#### Fetch Transactions

Fetch and normalize transactions:

```bash
curl -X POST http://localhost:8000/api/plaid/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "access_token": "access-sandbox-xxx",
    "start_date": "2024-01-01",
    "end_date": "2024-12-31"
  }'
```

Optional parameters:
- `start_date`: Start date in YYYY-MM-DD format (defaults to 30 days ago)
- `end_date`: End date in YYYY-MM-DD format (defaults to today)
- `account_ids`: Array of specific account IDs to filter

Response:
```json
{
  "transactions": [
    {
      "transaction_id": "xxx",
      "account_id": "xxx",
      "amount": 12.34,
      "date": "2024-01-15",
      "name": "Coffee Shop",
      "merchant_name": "Local Coffee",
      "category": ["Food and Drink", "Restaurants", "Coffee Shop"],
      "pending": false,
      "payment_channel": "in store",
      "iso_currency_code": "USD"
    }
  ],
  "total_count": 42,
  "accounts_count": 2,
  "request_id": "xxx"
}
```

### Console Logging

When transactions are fetched, detailed information is logged to the server console:

```
================================================================================
PLAID TRANSACTION SUMMARY
================================================================================
Total transactions fetched: 42
Accounts involved: 2
Date range: 2024-01-01 to 2024-12-31
--------------------------------------------------------------------------------
Transaction 1:
  ID: xxx
  Date: 2024-01-15
  Name: Coffee Shop
  Amount: $12.34 USD
  Category: Food and Drink, Restaurants
  Pending: False
...
================================================================================
```

## Error Handling

The adapter handles various error scenarios:

1. **Missing Credentials**: Returns 503 Service Unavailable
2. **Invalid Access Token**: Returns 500 with Plaid error details
3. **API Errors**: Logs error and returns appropriate HTTP status
4. **Invalid Date Format**: Returns 500 with validation error

All errors are logged to the server console with full details.

## Testing with Sandbox

Plaid's sandbox environment provides test data without connecting real accounts:

1. Use sandbox credentials in your `.env` file
2. Follow Plaid Link integration guide: https://plaid.com/docs/link/web/
3. Use test credentials (username: `user_good`, password: `pass_good`)
4. Exchange public token for access token
5. Use access token to fetch transactions via the API endpoint

## API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Security Notes

- Never commit your `.env` file with real credentials
- Use environment-specific credentials (sandbox for dev, production for prod)
- Access tokens should be stored securely and never exposed in logs
- The adapter automatically masks sensitive parts of tokens in logs

## Next Steps

- Integrate Plaid Link in the UI for user authentication
- Add webhook support for transaction updates
- Implement database persistence for transactions
- Add support for additional Plaid products (Balance, Identity, etc.)
