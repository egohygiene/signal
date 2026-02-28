import type { AppActions, AppStore, Budget, Category, Pool, SettingsState, Transaction } from './types';

export const selectTransactions = (s: AppStore): Transaction[] => s.transactions.items;

export const selectCategories = (s: AppStore): Category[] => s.categories.items;

export const selectBudgets = (s: AppStore): Budget[] => s.budgets.items;

export const selectPools = (s: AppStore): Pool[] => s.pools.items;

export const selectSettings = (s: AppStore): SettingsState => s.settings;

export const selectSetTransactions = (s: AppStore): AppActions['setTransactions'] => s.setTransactions;

export const selectSetCategories = (s: AppStore): AppActions['setCategories'] => s.setCategories;

export const selectSetBudgets = (s: AppStore): AppActions['setBudgets'] => s.setBudgets;

export const selectSetPools = (s: AppStore): AppActions['setPools'] => s.setPools;

export const selectSetSettings = (s: AppStore): AppActions['setSettings'] => s.setSettings;
