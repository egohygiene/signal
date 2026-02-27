import type { Budget } from '../schema/v1/budget';
import type { Category } from '../schema/v1/category';
import type { Pool } from '../schema/v1/pool';
import type { Transaction } from '../schema/v1/transaction';

export type DataProvider = {
  getTransactions: () => Promise<Transaction[]>;
  getCategories: () => Promise<Category[]>;
  getBudgets: () => Promise<Budget[]>;
  getPools: () => Promise<Pool[]>;
};
