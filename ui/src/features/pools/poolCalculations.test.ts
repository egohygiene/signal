import { describe, expect, it } from 'vitest';

import type { Budget } from '../../schema/v1/budget';
import type { Category } from '../../schema/v1/category';
import type { CategoryTotal } from '../budgets/budgetCalculations';
import { computePoolBudgetTotals, computePoolSpendingTotals } from './poolCalculations';

const makeCategory = (overrides: Partial<Category> = {}): Category => ({
  id: 'cat-1',
  name: 'Food',
  parentId: null,
  poolId: 'pool-1',
  ...overrides,
});

const makeBudget = (overrides: Partial<Budget> = {}): Budget => ({
  id: 'bud-1',
  name: 'Food Budget',
  categoryId: 'cat-1',
  amount: 200,
  currency: 'USD',
  period: 'monthly',
  startDate: '2024-01-01',
  endDate: null,
  ...overrides,
});

describe('computePoolSpendingTotals', () => {
  it('returns an empty array when there are no categories', () => {
    const totals: CategoryTotal[] = [{ categoryId: 'cat-1', total: 100 }];
    expect(computePoolSpendingTotals([], totals)).toHaveLength(0);
  });

  it('returns an empty array when there are no category totals', () => {
    const categories = [makeCategory()];
    expect(computePoolSpendingTotals(categories, [])).toHaveLength(0);
  });

  it('maps a category total to its pool', () => {
    const categories = [makeCategory({ id: 'cat-1', poolId: 'pool-1' })];
    const totals: CategoryTotal[] = [{ categoryId: 'cat-1', total: 150 }];
    const result = computePoolSpendingTotals(categories, totals);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ poolId: 'pool-1', total: 150 });
  });

  it('sums multiple categories belonging to the same pool', () => {
    const categories = [
      makeCategory({ id: 'cat-1', poolId: 'pool-1' }),
      makeCategory({ id: 'cat-2', poolId: 'pool-1' }),
    ];
    const totals: CategoryTotal[] = [
      { categoryId: 'cat-1', total: 100 },
      { categoryId: 'cat-2', total: 75 },
    ];
    const result = computePoolSpendingTotals(categories, totals);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ poolId: 'pool-1', total: 175 });
  });

  it('handles multiple pools separately', () => {
    const categories = [
      makeCategory({ id: 'cat-1', poolId: 'pool-1' }),
      makeCategory({ id: 'cat-2', poolId: 'pool-2' }),
    ];
    const totals: CategoryTotal[] = [
      { categoryId: 'cat-1', total: 100 },
      { categoryId: 'cat-2', total: 50 },
    ];
    const result = computePoolSpendingTotals(categories, totals);
    expect(result).toHaveLength(2);
    const pool1 = result.find((r) => r.poolId === 'pool-1');
    const pool2 = result.find((r) => r.poolId === 'pool-2');
    expect(pool1?.total).toBe(100);
    expect(pool2?.total).toBe(50);
  });

  it('excludes categories with null poolId', () => {
    const categories = [makeCategory({ id: 'cat-1', poolId: null })];
    const totals: CategoryTotal[] = [{ categoryId: 'cat-1', total: 100 }];
    expect(computePoolSpendingTotals(categories, totals)).toHaveLength(0);
  });

  it('excludes category totals with no matching category', () => {
    const categories = [makeCategory({ id: 'cat-1', poolId: 'pool-1' })];
    const totals: CategoryTotal[] = [{ categoryId: 'cat-unknown', total: 100 }];
    expect(computePoolSpendingTotals(categories, totals)).toHaveLength(0);
  });
});

describe('computePoolBudgetTotals', () => {
  it('returns an empty array when there are no categories', () => {
    const budgets = [makeBudget()];
    expect(computePoolBudgetTotals([], budgets)).toHaveLength(0);
  });

  it('returns an empty array when there are no budgets', () => {
    const categories = [makeCategory()];
    expect(computePoolBudgetTotals(categories, [])).toHaveLength(0);
  });

  it('maps a budget to its category pool', () => {
    const categories = [makeCategory({ id: 'cat-1', poolId: 'pool-1' })];
    const budgets = [makeBudget({ categoryId: 'cat-1', amount: 300 })];
    const result = computePoolBudgetTotals(categories, budgets);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ poolId: 'pool-1', budgetTotal: 300 });
  });

  it('sums multiple budgets for categories belonging to the same pool', () => {
    const categories = [
      makeCategory({ id: 'cat-1', poolId: 'pool-1' }),
      makeCategory({ id: 'cat-2', poolId: 'pool-1' }),
    ];
    const budgets = [
      makeBudget({ id: 'bud-1', categoryId: 'cat-1', amount: 200 }),
      makeBudget({ id: 'bud-2', categoryId: 'cat-2', amount: 150 }),
    ];
    const result = computePoolBudgetTotals(categories, budgets);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ poolId: 'pool-1', budgetTotal: 350 });
  });

  it('handles multiple pools separately', () => {
    const categories = [
      makeCategory({ id: 'cat-1', poolId: 'pool-1' }),
      makeCategory({ id: 'cat-2', poolId: 'pool-2' }),
    ];
    const budgets = [
      makeBudget({ id: 'bud-1', categoryId: 'cat-1', amount: 200 }),
      makeBudget({ id: 'bud-2', categoryId: 'cat-2', amount: 100 }),
    ];
    const result = computePoolBudgetTotals(categories, budgets);
    expect(result).toHaveLength(2);
    const pool1 = result.find((r) => r.poolId === 'pool-1');
    const pool2 = result.find((r) => r.poolId === 'pool-2');
    expect(pool1?.budgetTotal).toBe(200);
    expect(pool2?.budgetTotal).toBe(100);
  });

  it('excludes categories with null poolId', () => {
    const categories = [makeCategory({ id: 'cat-1', poolId: null })];
    const budgets = [makeBudget({ categoryId: 'cat-1', amount: 200 })];
    expect(computePoolBudgetTotals(categories, budgets)).toHaveLength(0);
  });

  it('excludes budgets with no matching category', () => {
    const categories = [makeCategory({ id: 'cat-1', poolId: 'pool-1' })];
    const budgets = [makeBudget({ categoryId: 'cat-unknown', amount: 200 })];
    expect(computePoolBudgetTotals(categories, budgets)).toHaveLength(0);
  });
});
