import { describe, expect, it } from 'vitest';

import {
  type Account,
  type AllocationRule,
  type Budget,
  type Category,
  type Pool,
  SCHEMA_VERSION,
  type Transaction,
} from './index';

describe('SCHEMA_VERSION', () => {
  it('equals "v1"', () => {
    expect(SCHEMA_VERSION).toBe('v1');
  });
});

describe('Transaction type', () => {
  it('accepts a valid transaction object', () => {
    const tx: Transaction = {
      id: 'tx-1',
      accountId: 'acc-1',
      categoryId: 'cat-1',
      poolId: null,
      amount: 100.5,
      currency: 'USD',
      date: '2024-01-15',
      description: 'Grocery store',
    };
    expect(tx.id).toBe('tx-1');
    expect(tx.categoryId).toBe('cat-1');
    expect(tx.poolId).toBeNull();
  });

  it('allows null categoryId and poolId', () => {
    const tx: Transaction = {
      id: 'tx-2',
      accountId: 'acc-1',
      categoryId: null,
      poolId: null,
      amount: 50,
      currency: 'USD',
      date: '2024-01-16',
      description: 'Unknown',
    };
    expect(tx.categoryId).toBeNull();
    expect(tx.poolId).toBeNull();
  });
});

describe('Category type', () => {
  it('accepts a valid category object', () => {
    const cat: Category = {
      id: 'cat-1',
      name: 'Food',
      parentId: null,
      poolId: null,
    };
    expect(cat.id).toBe('cat-1');
    expect(cat.name).toBe('Food');
    expect(cat.parentId).toBeNull();
    expect(cat.poolId).toBeNull();
  });

  it('accepts a category with a parent', () => {
    const cat: Category = {
      id: 'cat-2',
      name: 'Groceries',
      parentId: 'cat-1',
      poolId: null,
    };
    expect(cat.parentId).toBe('cat-1');
  });

  it('accepts a category with a pool reference', () => {
    const cat: Category = {
      id: 'cat-3',
      name: 'Savings',
      parentId: null,
      poolId: 'pool-1',
    };
    expect(cat.poolId).toBe('pool-1');
  });
});

describe('Budget type', () => {
  it('accepts a valid budget object', () => {
    const budget: Budget = {
      id: 'bud-1',
      name: 'Monthly Food',
      categoryId: 'cat-1',
      amount: 500,
      currency: 'USD',
      period: 'monthly',
      startDate: '2024-01-01',
      endDate: null,
    };
    expect(budget.period).toBe('monthly');
    expect(budget.endDate).toBeNull();
  });

  it('accepts all valid budget period values', () => {
    const periods: Budget['period'][] = ['weekly', 'monthly', 'yearly', 'custom'];
    for (const period of periods) {
      const b: Budget = {
        id: 'bud-x',
        name: 'Test',
        categoryId: 'cat-1',
        amount: 100,
        currency: 'USD',
        period,
        startDate: '2024-01-01',
        endDate: null,
      };
      expect(b.period).toBe(period);
    }
  });
});

describe('Pool type', () => {
  it('accepts a valid pool object', () => {
    const pool: Pool = {
      id: 'pool-1',
      name: 'Emergency Fund',
      currency: 'USD',
      targetAmount: 10000,
    };
    expect(pool.targetAmount).toBe(10000);
  });

  it('allows null targetAmount', () => {
    const pool: Pool = {
      id: 'pool-2',
      name: 'Spending',
      currency: 'USD',
      targetAmount: null,
    };
    expect(pool.targetAmount).toBeNull();
  });
});

describe('AllocationRule type', () => {
  it('accepts a valid allocation rule with percentage', () => {
    const rule: AllocationRule = {
      id: 'rule-1',
      name: 'Savings 20%',
      poolId: 'pool-1',
      categoryId: null,
      percentage: 20,
      fixedAmount: null,
      currency: null,
    };
    expect(rule.percentage).toBe(20);
    expect(rule.fixedAmount).toBeNull();
  });

  it('accepts a valid allocation rule with fixed amount', () => {
    const rule: AllocationRule = {
      id: 'rule-2',
      name: 'Fixed $50',
      poolId: 'pool-1',
      categoryId: 'cat-1',
      percentage: null,
      fixedAmount: 50,
      currency: 'USD',
    };
    expect(rule.fixedAmount).toBe(50);
    expect(rule.percentage).toBeNull();
  });
});

describe('Account type', () => {
  it('accepts a valid account object', () => {
    const account: Account = {
      id: 'acc-1',
      name: 'Main Checking',
      type: 'checking',
      currency: 'USD',
      balance: 1500.0,
    };
    expect(account.type).toBe('checking');
  });

  it('accepts all valid account types', () => {
    const types: Account['type'][] = ['checking', 'savings', 'credit', 'investment', 'other'];
    for (const type of types) {
      const a: Account = {
        id: 'acc-x',
        name: 'Test',
        type,
        currency: 'USD',
        balance: null,
      };
      expect(a.type).toBe(type);
    }
  });

  it('allows null balance', () => {
    const account: Account = {
      id: 'acc-2',
      name: 'Unknown',
      type: 'other',
      currency: 'EUR',
      balance: null,
    };
    expect(account.balance).toBeNull();
  });
});
