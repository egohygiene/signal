import { create } from 'zustand';

import type { AppState, AppStore } from './types';

const initialState: AppState = {
  transactions: { items: [] },
  categories: { items: [] },
  budgets: { items: [] },
  pools: { items: [] },
  settings: {
    currency: 'USD',
    locale: 'en-US',
  },
};

export const useAppStore = create<AppStore>((set) => ({
  ...initialState,
  setTransactions: (transactions) => set({ transactions }),
  setCategories: (categories) => set({ categories }),
  setBudgets: (budgets) => set({ budgets }),
  setPools: (pools) => set({ pools }),
  setSettings: (settings) => set({ settings }),
}));
