import { BudgetSchema } from '@egohygiene/signal/schema/v1/budget';
import { CategorySchema } from '@egohygiene/signal/schema/v1/category';
import { PoolSchema } from '@egohygiene/signal/schema/v1/pool';
import { TransactionSchema } from '@egohygiene/signal/schema/v1/transaction';
import { z } from 'zod';

import type { DataProvider } from './DataProvider';

async function fetchJson<T>(schema: z.ZodType<T>, url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${url}`);
  }
  const json: unknown = await response.json();
  return schema.parse(json);
}

export function createHttpDataProvider(): DataProvider {
  return {
    getTransactions: () => fetchJson(z.array(TransactionSchema), '/api/transactions'),
    getCategories: () => fetchJson(z.array(CategorySchema), '/api/categories'),
    getBudgets: () => fetchJson(z.array(BudgetSchema), '/api/budgets'),
    getPools: () => fetchJson(z.array(PoolSchema), '/api/pools'),
  };
}
