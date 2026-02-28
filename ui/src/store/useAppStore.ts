import { create, type StateCreator } from 'zustand';
import { devtools } from 'zustand/middleware';

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

const storeCreator: StateCreator<AppStore, [], []> = (set) => ({
  ...initialState,
  setTransactions: (transactions) => set({ transactions }),
  setCategories: (categories) => set({ categories }),
  setBudgets: (budgets) => set({ budgets }),
  setPools: (pools) => set({ pools }),
  setSettings: (settings) => set({ settings }),
});

export const useAppStore = create<AppStore>()(
  devtools(storeCreator, { name: 'AppStore', enabled: import.meta.env.DEV }),
);
