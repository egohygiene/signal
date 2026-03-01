import { createHttpDataProvider } from '@egohygiene/signal/providers/HttpDataProvider';
import { describe, expect, it } from 'vitest';

describe('HttpDataProvider (via MSW)', () => {
  const provider = createHttpDataProvider();

  it('fetches transactions from /api/transactions', async () => {
    const transactions = await provider.getTransactions();
    expect(Array.isArray(transactions)).toBe(true);
    expect(transactions.length).toBeGreaterThan(0);
    expect(transactions[0]).toMatchObject({
      id: expect.any(String),
      accountId: expect.any(String),
      amount: expect.any(Number),
      currency: expect.any(String),
      date: expect.any(String),
      description: expect.any(String),
    });
  });

  it('fetches categories from /api/categories', async () => {
    const categories = await provider.getCategories();
    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
    expect(categories[0]).toMatchObject({ id: expect.any(String), name: expect.any(String) });
  });

  it('fetches budgets from /api/budgets', async () => {
    const budgets = await provider.getBudgets();
    expect(Array.isArray(budgets)).toBe(true);
    expect(budgets.length).toBeGreaterThan(0);
    expect(budgets[0]).toMatchObject({ id: expect.any(String), amount: expect.any(Number) });
  });

  it('fetches pools from /api/pools', async () => {
    const pools = await provider.getPools();
    expect(Array.isArray(pools)).toBe(true);
    expect(pools.length).toBeGreaterThan(0);
    expect(pools[0]).toMatchObject({ id: expect.any(String), name: expect.any(String) });
  });
});
