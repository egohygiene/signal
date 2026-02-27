export type Transaction = {
  id: string;
};

export type Category = {
  id: string;
};

export type Budget = {
  id: string;
};

export type Pool = {
  id: string;
};

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
