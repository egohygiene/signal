import { beforeEach, describe, expect, it } from 'vitest';

import type { Budget } from '../schema/v1/budget';
import type { Category } from '../schema/v1/category';
import type { Pool } from '../schema/v1/pool';
import type { Transaction } from '../schema/v1/transaction';
import { useAppStore } from './useAppStore';

const mockTransaction: Transaction = {
  id: 'tx-1',
  accountId: 'acc-1',
  categoryId: null,
  poolId: null,
  amount: 42.5,
  currency: 'USD',
  date: '2024-01-01',
  description: 'Test transaction',
};

const mockCategory: Category = { id: 'cat-1', name: 'Food', parentId: null };

const mockBudget: Budget = {
  id: 'bud-1',
  name: 'Food Budget',
  categoryId: 'cat-1',
  amount: 500,
  currency: 'USD',
  period: 'monthly',
  startDate: '2024-01-01',
  endDate: null,
};

const mockPool: Pool = { id: 'pool-1', name: 'Emergency Fund', currency: 'USD', targetAmount: null };

describe('useAppStore', () => {
  beforeEach(() => {
    useAppStore.setState({
      transactions: { items: [] },
      categories: { items: [] },
      budgets: { items: [] },
      pools: { items: [] },
      settings: { currency: 'USD', locale: 'en-US' },
    });
  });

  it('initializes with empty transaction items', () => {
    const state = useAppStore.getState();
    expect(state.transactions.items).toHaveLength(0);
  });

  it('initializes with empty category items', () => {
    const state = useAppStore.getState();
    expect(state.categories.items).toHaveLength(0);
  });

  it('initializes with empty budget items', () => {
    const state = useAppStore.getState();
    expect(state.budgets.items).toHaveLength(0);
  });

  it('initializes with empty pool items', () => {
    const state = useAppStore.getState();
    expect(state.pools.items).toHaveLength(0);
  });

  it('initializes with default settings', () => {
    const state = useAppStore.getState();
    expect(state.settings.currency).toBe('USD');
    expect(state.settings.locale).toBe('en-US');
  });

  it('setTransactions updates transaction state', () => {
    useAppStore.getState().setTransactions({ items: [mockTransaction] });
    expect(useAppStore.getState().transactions.items).toHaveLength(1);
    expect(useAppStore.getState().transactions.items[0]?.id).toBe('tx-1');
  });

  it('setCategories updates category state', () => {
    useAppStore.getState().setCategories({ items: [mockCategory] });
    expect(useAppStore.getState().categories.items).toHaveLength(1);
    expect(useAppStore.getState().categories.items[0]?.id).toBe('cat-1');
  });

  it('setBudgets updates budget state', () => {
    useAppStore.getState().setBudgets({ items: [mockBudget] });
    expect(useAppStore.getState().budgets.items).toHaveLength(1);
    expect(useAppStore.getState().budgets.items[0]?.id).toBe('bud-1');
  });

  it('setPools updates pool state', () => {
    useAppStore.getState().setPools({ items: [mockPool] });
    expect(useAppStore.getState().pools.items).toHaveLength(1);
    expect(useAppStore.getState().pools.items[0]?.id).toBe('pool-1');
  });

  it('setSettings updates settings state', () => {
    useAppStore.getState().setSettings({ currency: 'EUR', locale: 'de-DE' });
    expect(useAppStore.getState().settings.currency).toBe('EUR');
    expect(useAppStore.getState().settings.locale).toBe('de-DE');
  });
});
