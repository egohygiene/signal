import { describe, expect, it } from 'vitest';

import { queryKeys } from './queryKeys';

describe('queryKeys', () => {
  it('budgets.all returns the correct key', () => {
    expect(queryKeys.budgets.all()).toEqual(['budgets']);
  });

  it('categories.all returns the correct key', () => {
    expect(queryKeys.categories.all()).toEqual(['categories']);
  });

  it('pools.all returns the correct key', () => {
    expect(queryKeys.pools.all()).toEqual(['pools']);
  });

  it('transactions.all returns the correct key', () => {
    expect(queryKeys.transactions.all()).toEqual(['transactions']);
  });
});
