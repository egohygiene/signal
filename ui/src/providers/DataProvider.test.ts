import { beforeEach, describe, expect, it } from 'vitest';

import type { DataProvider } from './DataProvider';

describe('DataProvider type', () => {
  let provider: DataProvider;

  beforeEach(() => {
    provider = {
      getTransactions: () => Promise.resolve([]),
      getCategories: () => Promise.resolve([]),
      getBudgets: () => Promise.resolve([]),
      getPools: () => Promise.resolve([]),
    };
  });

  it('can be satisfied by an object with all required methods', () => {
    expect(typeof provider.getTransactions).toBe('function');
    expect(typeof provider.getCategories).toBe('function');
    expect(typeof provider.getBudgets).toBe('function');
    expect(typeof provider.getPools).toBe('function');
  });

  it('getTransactions returns a Promise', async () => {
    const result = provider.getTransactions();
    expect(result).toBeInstanceOf(Promise);
    await expect(result).resolves.toEqual([]);
  });

  it('getCategories returns a Promise', async () => {
    const result = provider.getCategories();
    expect(result).toBeInstanceOf(Promise);
    await expect(result).resolves.toEqual([]);
  });

  it('getBudgets returns a Promise', async () => {
    const result = provider.getBudgets();
    expect(result).toBeInstanceOf(Promise);
    await expect(result).resolves.toEqual([]);
  });

  it('getPools returns a Promise', async () => {
    const result = provider.getPools();
    expect(result).toBeInstanceOf(Promise);
    await expect(result).resolves.toEqual([]);
  });
});
