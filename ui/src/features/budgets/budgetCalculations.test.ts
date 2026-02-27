import { describe, expect, it } from 'vitest';

import type { Budget } from '../../schema/v1/budget';
import type { Transaction } from '../../schema/v1/transaction';
import {
  compareBudgets,
  computeCategoryTotals,
  isInMonth,
} from './budgetCalculations';

const makeTransaction = (overrides: Partial<Transaction> = {}): Transaction => ({
  id: 'tx-1',
  accountId: 'acc-1',
  categoryId: 'cat-1',
  poolId: null,
  amount: 50,
  currency: 'USD',
  date: '2024-03-15',
  description: 'Test',
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

describe('isInMonth', () => {
  it('returns true for a date in the given year and month', () => {
    expect(isInMonth('2024-03-15', 2024, 3)).toBe(true);
  });

  it('returns false for a date in a different month', () => {
    expect(isInMonth('2024-04-01', 2024, 3)).toBe(false);
  });

  it('returns false for a date in a different year', () => {
    expect(isInMonth('2023-03-15', 2024, 3)).toBe(false);
  });
});

describe('computeCategoryTotals', () => {
  it('returns an empty array when there are no transactions', () => {
    expect(computeCategoryTotals([], 2024, 3)).toHaveLength(0);
  });

  it('sums transactions for the same category in the given month', () => {
    const transactions = [
      makeTransaction({ id: 'tx-1', categoryId: 'cat-1', amount: 50, date: '2024-03-10' }),
      makeTransaction({ id: 'tx-2', categoryId: 'cat-1', amount: 75, date: '2024-03-20' }),
    ];
    const totals = computeCategoryTotals(transactions, 2024, 3);
    expect(totals).toHaveLength(1);
    expect(totals[0]).toEqual({ categoryId: 'cat-1', total: 125 });
  });

  it('handles multiple categories separately', () => {
    const transactions = [
      makeTransaction({ id: 'tx-1', categoryId: 'cat-1', amount: 50, date: '2024-03-10' }),
      makeTransaction({ id: 'tx-2', categoryId: 'cat-2', amount: 80, date: '2024-03-15' }),
    ];
    const totals = computeCategoryTotals(transactions, 2024, 3);
    expect(totals).toHaveLength(2);
    const cat1 = totals.find((t) => t.categoryId === 'cat-1');
    const cat2 = totals.find((t) => t.categoryId === 'cat-2');
    expect(cat1?.total).toBe(50);
    expect(cat2?.total).toBe(80);
  });

  it('excludes transactions outside the given month', () => {
    const transactions = [
      makeTransaction({ id: 'tx-1', categoryId: 'cat-1', amount: 50, date: '2024-03-10' }),
      makeTransaction({ id: 'tx-2', categoryId: 'cat-1', amount: 75, date: '2024-04-01' }),
    ];
    const totals = computeCategoryTotals(transactions, 2024, 3);
    expect(totals).toHaveLength(1);
    expect(totals[0]?.total).toBe(50);
  });

  it('excludes transactions with null categoryId', () => {
    const transactions = [
      makeTransaction({ id: 'tx-1', categoryId: null, amount: 50, date: '2024-03-10' }),
    ];
    const totals = computeCategoryTotals(transactions, 2024, 3);
    expect(totals).toHaveLength(0);
  });
});

describe('compareBudgets', () => {
  it('returns an empty array when there are no budgets', () => {
    expect(compareBudgets([], [])).toHaveLength(0);
  });

  it('returns a comparison with zero spent when no transactions match', () => {
    const budget = makeBudget({ categoryId: 'cat-1', amount: 200 });
    const [result] = compareBudgets([budget], []);
    expect(result?.spent).toBe(0);
    expect(result?.remaining).toBe(200);
    expect(result?.isOverBudget).toBe(false);
  });

  it('computes remaining correctly when under budget', () => {
    const budget = makeBudget({ categoryId: 'cat-1', amount: 200 });
    const [result] = compareBudgets([budget], [{ categoryId: 'cat-1', total: 150 }]);
    expect(result?.spent).toBe(150);
    expect(result?.remaining).toBe(50);
    expect(result?.isOverBudget).toBe(false);
  });

  it('marks isOverBudget true when spending exceeds budget amount', () => {
    const budget = makeBudget({ categoryId: 'cat-1', amount: 100 });
    const [result] = compareBudgets([budget], [{ categoryId: 'cat-1', total: 150 }]);
    expect(result?.spent).toBe(150);
    expect(result?.remaining).toBe(-50);
    expect(result?.isOverBudget).toBe(true);
  });

  it('attaches the original budget to the result', () => {
    const budget = makeBudget();
    const [result] = compareBudgets([budget], []);
    expect(result?.budget).toBe(budget);
  });
});
