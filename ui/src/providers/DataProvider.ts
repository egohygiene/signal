import type { Budget } from '@egohygiene/signal/schema/v1/budget';
import type { Category } from '@egohygiene/signal/schema/v1/category';
import type { Pool } from '@egohygiene/signal/schema/v1/pool';
import type { Transaction } from '@egohygiene/signal/schema/v1/transaction';

export type DataProvider = {
  getTransactions: () => Promise<Transaction[]>;
  getCategories: () => Promise<Category[]>;
  getBudgets: () => Promise<Budget[]>;
  getPools: () => Promise<Pool[]>;
};
