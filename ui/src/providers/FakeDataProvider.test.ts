import { describe, expect, it } from 'vitest';

import type { Budget } from '../schema/v1/budget';
import type { Category } from '../schema/v1/category';
import type { Pool } from '../schema/v1/pool';
import type { Transaction } from '../schema/v1/transaction';
import { createFakeDataProvider } from './FakeDataProvider';

describe('FakeDataProvider', () => {
  it('returns a provider with all required methods', () => {
    const provider = createFakeDataProvider();
    expect(typeof provider.getTransactions).toBe('function');
    expect(typeof provider.getCategories).toBe('function');
    expect(typeof provider.getBudgets).toBe('function');
    expect(typeof provider.getPools).toBe('function');
  });

  it('getTransactions returns 50 transactions matching the Transaction schema', async () => {
    const provider = createFakeDataProvider();
    const transactions: Transaction[] = await provider.getTransactions();
    expect(transactions).toHaveLength(50);
    for (const tx of transactions) {
      expect(typeof tx.id).toBe('string');
      expect(typeof tx.accountId).toBe('string');
      expect(typeof tx.amount).toBe('number');
      expect(typeof tx.currency).toBe('string');
      expect(typeof tx.date).toBe('string');
      expect(typeof tx.description).toBe('string');
      expect(tx.categoryId === null || typeof tx.categoryId === 'string').toBe(true);
      expect(tx.poolId === null || typeof tx.poolId === 'string').toBe(true);
    }
  });

  it('getCategories returns categories matching the Category schema', async () => {
    const provider = createFakeDataProvider();
    const categories: Category[] = await provider.getCategories();
    expect(categories.length).toBeGreaterThan(0);
    for (const cat of categories) {
      expect(typeof cat.id).toBe('string');
      expect(typeof cat.name).toBe('string');
      expect(cat.parentId === null || typeof cat.parentId === 'string').toBe(true);
      expect(cat.poolId === null || typeof cat.poolId === 'string').toBe(true);
    }
  });

  it('getBudgets returns budgets matching the Budget schema', async () => {
    const provider = createFakeDataProvider();
    const budgets: Budget[] = await provider.getBudgets();
    expect(budgets.length).toBeGreaterThan(0);
    const validPeriods = ['weekly', 'monthly', 'yearly', 'custom'];
    for (const budget of budgets) {
      expect(typeof budget.id).toBe('string');
      expect(typeof budget.name).toBe('string');
      expect(typeof budget.categoryId).toBe('string');
      expect(typeof budget.amount).toBe('number');
      expect(typeof budget.currency).toBe('string');
      expect(validPeriods).toContain(budget.period);
      expect(typeof budget.startDate).toBe('string');
      expect(budget.endDate === null || typeof budget.endDate === 'string').toBe(true);
    }
  });

  it('getPools returns pools matching the Pool schema', async () => {
    const provider = createFakeDataProvider();
    const pools: Pool[] = await provider.getPools();
    expect(pools.length).toBeGreaterThan(0);
    for (const pool of pools) {
      expect(typeof pool.id).toBe('string');
      expect(typeof pool.name).toBe('string');
      expect(typeof pool.currency).toBe('string');
      expect(pool.targetAmount === null || typeof pool.targetAmount === 'number').toBe(true);
    }
  });

  it('produces deterministic output on repeated calls', async () => {
    const provider1 = createFakeDataProvider();
    const provider2 = createFakeDataProvider();
    const tx1 = await provider1.getTransactions();
    const tx2 = await provider2.getTransactions();
    expect(tx1).toEqual(tx2);
  });

  it('transaction categoryIds reference valid category ids', async () => {
    const provider = createFakeDataProvider();
    const [transactions, categories] = await Promise.all([
      provider.getTransactions(),
      provider.getCategories(),
    ]);
    const categoryIds = new Set(categories.map((c) => c.id));
    for (const tx of transactions) {
      if (tx.categoryId !== null) {
        expect(categoryIds.has(tx.categoryId)).toBe(true);
      }
    }
  });

  it('transaction poolIds reference valid pool ids', async () => {
    const provider = createFakeDataProvider();
    const [transactions, pools] = await Promise.all([provider.getTransactions(), provider.getPools()]);
    const poolIds = new Set(pools.map((p) => p.id));
    for (const tx of transactions) {
      if (tx.poolId !== null) {
        expect(poolIds.has(tx.poolId)).toBe(true);
      }
    }
  });

  it('category poolIds reference valid pool ids', async () => {
    const provider = createFakeDataProvider();
    const [categories, pools] = await Promise.all([provider.getCategories(), provider.getPools()]);
    const poolIds = new Set(pools.map((p) => p.id));
    for (const cat of categories) {
      if (cat.poolId !== null) {
        expect(poolIds.has(cat.poolId)).toBe(true);
      }
    }
  });
});
