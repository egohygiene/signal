# Server–UI Schema Contract

## Overview

This document defines the schema contract between the FastAPI backend (`server/`) and the TypeScript frontend (`ui/`). Its purpose is to prevent schema drift and provide clear guidance for future contributors integrating new data sources (e.g., Plaid).

---

## Source of Truth

**The canonical domain models live in `ui/src/schema/v1/`.**

All TypeScript types exported from that directory are the authoritative definitions for every domain entity. The backend must conform to these types when serializing API responses. Any proposed change to a domain model must originate in the frontend schema and be propagated to the backend—not the reverse.

---

## Domain Models (v1)

### `Account`

```typescript
// ui/src/schema/v1/account.ts
export type AccountType = 'checking' | 'savings' | 'credit' | 'investment' | 'other';

export type Account = {
  id: string;
  name: string;
  type: AccountType;
  currency: string;   // ISO 4217 currency code, e.g. "USD"
  balance: number | null;
};
```

### `Transaction`

```typescript
// ui/src/schema/v1/transaction.ts
export type Transaction = {
  id: string;
  accountId: string;
  categoryId: string | null;
  poolId: string | null;
  amount: number;     // positive = credit, negative = debit
  currency: string;   // ISO 4217
  date: string;       // ISO 8601 date string, e.g. "2024-01-15"
  description: string;
};
```

### `Category`

```typescript
// ui/src/schema/v1/category.ts
export type Category = {
  id: string;
  name: string;
  parentId: string | null;   // null = top-level category
  poolId: string | null;
};
```

### `Pool`

```typescript
// ui/src/schema/v1/pool.ts
export type Pool = {
  id: string;
  name: string;
  currency: string;
  targetAmount: number | null;
};
```

### `Budget`

```typescript
// ui/src/schema/v1/budget.ts
export type BudgetPeriod = 'weekly' | 'monthly' | 'yearly' | 'custom';

export type Budget = {
  id: string;
  name: string;
  categoryId: string;
  amount: number;
  currency: string;
  period: BudgetPeriod;
  startDate: string;    // ISO 8601
  endDate: string | null;
};
```

### `AllocationRule`

```typescript
// ui/src/schema/v1/allocation-rule.ts
export type AllocationRule = {
  id: string;
  name: string;
  poolId: string;
  categoryId: string | null;
  percentage: number | null;   // mutually exclusive with fixedAmount
  fixedAmount: number | null;  // mutually exclusive with percentage
  currency: string | null;
};
```

---

## Versioning Strategy

- Schema versions are expressed as directory paths: `ui/src/schema/v1/`, `ui/src/schema/v2/`, etc.
- The current version constant is exported from the index: `export const SCHEMA_VERSION = 'v1'`.
- A new version directory is created only for **breaking changes** (field removal, type narrowing, rename).
- **Non-breaking additions** (optional fields, new union members) may be made within the current version.
- When a new version is introduced, the previous version must remain importable until all consumers are migrated.

---

## Backend Integration Requirements

Any backend endpoint that returns domain data must:

1. **Serialize responses using field names and types that exactly match the TypeScript definitions above.** Field names are camelCase.
2. **Use the schema version in the API path**, e.g. `/api/v1/transactions`, so clients can detect version mismatches.
3. **Not add undocumented extra fields** to responses. Any new field must first be added to the TypeScript schema, reviewed, and merged before the backend emits it.
4. **Normalize third-party data** (e.g., Plaid) into the contract types before returning it to the UI. See `server/plaid_adapter.py` for the existing normalization pattern.

---

## Schema Ownership and Evolution

| Concern | Owner |
|---|---|
| TypeScript schema types | Frontend (`ui/src/schema/`) |
| Backend serialization | Server (`server/`) must match frontend types |
| New field proposals | Raise a PR touching `ui/src/schema/v1/` first |
| Breaking changes | Require a new version directory and migration plan |
| Schema versioning decisions | Agreed upon by both frontend and backend maintainers |

When Plaid or any other third-party integration introduces new data, the process is:

1. Propose the new/changed TypeScript type in `ui/src/schema/v1/` (or a new version).
2. Update backend normalization logic to map the third-party payload to the agreed type.
3. Update `schema.test.ts` to cover the new shape.
4. Merge frontend schema changes before or together with backend changes—never after.
