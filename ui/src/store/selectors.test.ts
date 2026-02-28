import { beforeEach, describe, expect, it } from 'vitest';

import type { Budget } from '../schema/v1/budget';
import type { Category } from '../schema/v1/category';
import type { Pool } from '../schema/v1/pool';
import type { Transaction } from '../schema/v1/transaction';
import {
  selectBudgets,
  selectCategories,
  selectPools,
  selectSetBudgets,
  selectSetCategories,
  selectSetPools,
  selectSetSettings,
  selectSetTransactions,
  selectSettings,
  selectTransactions,
} from './selectors';
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

describe('store selectors', () => {
  beforeEach(() => {
    useAppStore.setState({
      transactions: { items: [] },
      categories: { items: [] },
      budgets: { items: [] },
      pools: { items: [] },
      settings: { currency: 'USD', locale: 'en-US' },
    });
  });

  it('selectTransactions returns transaction items', () => {
    useAppStore.setState({ transactions: { items: [mockTransaction] } });
    expect(selectTransactions(useAppStore.getState())).toEqual([mockTransaction]);
  });

  it('selectCategories returns category items', () => {
    useAppStore.setState({ categories: { items: [mockCategory] } });
    expect(selectCategories(useAppStore.getState())).toEqual([mockCategory]);
  });

  it('selectBudgets returns budget items', () => {
    useAppStore.setState({ budgets: { items: [mockBudget] } });
    expect(selectBudgets(useAppStore.getState())).toEqual([mockBudget]);
  });

  it('selectPools returns pool items', () => {
    useAppStore.setState({ pools: { items: [mockPool] } });
    expect(selectPools(useAppStore.getState())).toEqual([mockPool]);
  });

  it('selectSettings returns settings state', () => {
    expect(selectSettings(useAppStore.getState())).toEqual({ currency: 'USD', locale: 'en-US' });
  });

  it('selectSetTransactions returns the setTransactions action', () => {
    const fn = selectSetTransactions(useAppStore.getState());
    expect(typeof fn).toBe('function');
    fn({ items: [mockTransaction] });
    expect(useAppStore.getState().transactions.items).toHaveLength(1);
  });

  it('selectSetCategories returns the setCategories action', () => {
    const fn = selectSetCategories(useAppStore.getState());
    expect(typeof fn).toBe('function');
    fn({ items: [mockCategory] });
    expect(useAppStore.getState().categories.items).toHaveLength(1);
  });

  it('selectSetBudgets returns the setBudgets action', () => {
    const fn = selectSetBudgets(useAppStore.getState());
    expect(typeof fn).toBe('function');
    fn({ items: [mockBudget] });
    expect(useAppStore.getState().budgets.items).toHaveLength(1);
  });

  it('selectSetPools returns the setPools action', () => {
    const fn = selectSetPools(useAppStore.getState());
    expect(typeof fn).toBe('function');
    fn({ items: [mockPool] });
    expect(useAppStore.getState().pools.items).toHaveLength(1);
  });

  it('selectSetSettings returns the setSettings action', () => {
    const fn = selectSetSettings(useAppStore.getState());
    expect(typeof fn).toBe('function');
    fn({ currency: 'EUR', locale: 'de-DE' });
    expect(useAppStore.getState().settings).toEqual({ currency: 'EUR', locale: 'de-DE' });
  });
});
