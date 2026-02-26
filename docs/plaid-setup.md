# Plaid Developer Setup

## Overview

This document walks through setting up a Plaid developer account for local development, verifying sandbox credentials, generating API keys, and storing them safely — all without triggering production billing.

---

## 1. Create a Plaid Developer Account

1. Go to [https://dashboard.plaid.com/signup](https://dashboard.plaid.com/signup).
2. Sign up with your name, email, and a strong password.
3. On the questionnaire, select **"Personal project"** or **"I'm building something new"** as the use case.
4. Verify your email address when prompted.

---

## 2. Pricing Model and Developer Tier

Plaid offers a **free development tier** with the following characteristics:

| Feature              | Free (Development)         |
| -------------------- | -------------------------- |
| Sandbox environment  | Unlimited, always free     |
| Development items    | Up to 100 live Items       |
| Production access    | Requires manual approval   |
| Billing              | Only triggered in Production |

**Key points:**

- The **Sandbox** environment is fully synthetic — no real bank credentials, no real money, no billing.
- The **Development** environment connects real bank accounts but is limited to 100 Items (linked accounts) and is still free.
- **Production** requires applying for access and agreeing to a pricing plan. Do not request Production access unless you intend to go live.
- Always confirm your current tier at [https://dashboard.plaid.com/team/billing](https://dashboard.plaid.com/team/billing).

---

## 3. Generate API Keys

1. Log in to [https://dashboard.plaid.com](https://dashboard.plaid.com).
2. Navigate to **Team → Keys** (or go directly to [https://dashboard.plaid.com/team/keys](https://dashboard.plaid.com/team/keys)).
3. Note the following credentials:

   | Key            | Description                                  |
   | -------------- | -------------------------------------------- |
   | `client_id`    | Your unique application identifier           |
   | `secret`       | Environment-specific secret (Sandbox / Development / Production) |

4. Copy the **Sandbox** secret — this is what you will use for local development.

> ⚠️ Never commit API keys to version control. See [Section 5](#5-environment-variable-storage) for safe storage.

---

## 4. Test the Sandbox Connection Manually

Plaid provides a quickstart you can run locally to verify that your credentials work before integrating them into this project.

### Option A — curl smoke test

```bash
curl --request POST \
  --url https://sandbox.plaid.com/sandbox/public_token/create \
  --header 'Content-Type: application/json' \
  --data '{
    "client_id": "<YOUR_CLIENT_ID>",
    "secret": "<YOUR_SANDBOX_SECRET>",
    "institution_id": "ins_109508",
    "initial_products": ["transactions"]
  }'
```

A successful response returns a `public_token` and confirms that your credentials are valid.

### Option B — Plaid Quickstart (Node or Python)

```bash
git clone https://github.com/plaid/quickstart.git
cd quickstart
cp .env.example .env
# Fill in PLAID_CLIENT_ID, PLAID_SECRET, and set PLAID_ENV=sandbox
```

Follow the README inside the quickstart repository to spin up the demo UI and link a sandbox bank account.

---

## 5. Environment Variable Storage

Store Plaid credentials as environment variables. **Never hard-code them in source files.**

### Required variables

```dotenv
PLAID_CLIENT_ID=your_client_id_here
PLAID_SECRET=your_sandbox_secret_here
PLAID_ENV=sandbox
```

### Local development

Create a `.env` file at the root of the project (already listed in `.gitignore`):

```bash
cp .env.example .env   # if an example file exists
# or create .env manually and add the variables above
```

Load the file in the server before making any Plaid API calls:

```python
# server/main.py (example — python-dotenv)
from dotenv import load_dotenv
load_dotenv()
```

### CI / deployed environments

Inject variables through your secrets manager (GitHub Actions secrets, AWS Secrets Manager, Vault, etc.) rather than committing a `.env` file.

---

## 6. Cost Awareness

| Action                                | Cost                                   |
| ------------------------------------- | -------------------------------------- |
| Sandbox API calls                     | Free, unlimited                        |
| Development API calls (≤ 100 Items)   | Free                                   |
| Development API calls (> 100 Items)   | Requires Production upgrade            |
| Production API calls                  | Per-Item pricing (see Plaid dashboard) |
| Requesting Production access          | Manual review; billing begins on use   |

**Checklist before going to Production:**

- [ ] Read the current Plaid pricing page: [https://plaid.com/pricing/](https://plaid.com/pricing/)
- [ ] Confirm you understand per-Item charges for each product (Transactions, Auth, Identity, etc.)
- [ ] Only request Production access when the application is ready for real users
- [ ] Set up billing alerts in the Plaid dashboard

---

## 7. References

- Plaid Dashboard: [https://dashboard.plaid.com](https://dashboard.plaid.com)
- Plaid API Documentation: [https://plaid.com/docs/](https://plaid.com/docs/)
- Plaid Quickstart: [https://github.com/plaid/quickstart](https://github.com/plaid/quickstart)
- Plaid Pricing: [https://plaid.com/pricing/](https://plaid.com/pricing/)
- Plaid Sandbox Guide: [https://plaid.com/docs/sandbox/](https://plaid.com/docs/sandbox/)
