import type { Budget } from '@egohygiene/signal/schema/v1/budget';
import type { Category } from '@egohygiene/signal/schema/v1/category';
import type { Pool } from '@egohygiene/signal/schema/v1/pool';
import type { Transaction } from '@egohygiene/signal/schema/v1/transaction';

export type { Budget, Category, Pool, Transaction };

export type TransactionsState = {
  items: Transaction[];
};

export type CategoriesState = {
  items: Category[];
};

export type BudgetsState = {
  items: Budget[];
};

export type PoolsState = {
  items: Pool[];
};

export type SettingsState = {
  currency: string;
  locale: string;
};

export type AppState = {
  transactions: TransactionsState;
  categories: CategoriesState;
  budgets: BudgetsState;
  pools: PoolsState;
  settings: SettingsState;
};

export type AppActions = {
  setTransactions: (transactions: TransactionsState) => void;
  setCategories: (categories: CategoriesState) => void;
  setBudgets: (budgets: BudgetsState) => void;
  setPools: (pools: PoolsState) => void;
  setSettings: (settings: SettingsState) => void;
};

export type AppStore = AppState & AppActions;
