import { faker } from '@faker-js/faker';

import type { Budget } from '../schema/v1/budget';
import type { Category } from '../schema/v1/category';
import type { Pool } from '../schema/v1/pool';
import type { Transaction } from '../schema/v1/transaction';
import type { DataProvider } from './DataProvider';

const SEED = 42;

const CATEGORY_NAMES = [
  'Food & Dining',
  'Groceries',
  'Restaurants',
  'Transportation',
  'Fuel',
  'Public Transit',
  'Housing',
  'Utilities',
  'Entertainment',
  'Shopping',
  'Health & Fitness',
  'Travel',
  'Education',
  'Personal Care',
];

const POOL_NAMES = ['Emergency Fund', 'Vacation', 'Home Down Payment', 'Retirement', 'Car Replacement'];

const CURRENCIES = ['USD'];

function buildCategories(rng: typeof faker, pools: Pool[]): Category[] {
  const parents = CATEGORY_NAMES.slice(0, 7).map((name, i) => ({
    id: `cat-parent-${i + 1}`,
    name,
    parentId: null,
    poolId: rng.datatype.boolean() ? pools[i % pools.length].id : null,
  }));
  const children = CATEGORY_NAMES.slice(7).map((name, i) => ({
    id: `cat-child-${i + 1}`,
    name,
    parentId: parents[i % parents.length].id,
    poolId: rng.datatype.boolean() ? pools[i % pools.length].id : null,
  }));
  return [...parents, ...children];
}

function buildPools(rng: typeof faker): Pool[] {
  return POOL_NAMES.map((name, i) => ({
    id: `pool-${i + 1}`,
    name,
    currency: CURRENCIES[0],
    targetAmount: rng.number.int({ min: 1000, max: 50000 }),
  }));
}

function buildBudgets(rng: typeof faker, categories: Category[]): Budget[] {
  const periods: Budget['period'][] = ['weekly', 'monthly', 'yearly', 'custom'];
  return categories.slice(0, 6).map((cat, i) => ({
    id: `budget-${i + 1}`,
    name: `${cat.name} Budget`,
    categoryId: cat.id,
    amount: rng.number.int({ min: 100, max: 2000 }),
    currency: CURRENCIES[0],
    period: periods[i % periods.length],
    startDate: '2024-01-01',
    endDate: null,
  }));
}

function buildTransactions(rng: typeof faker, categories: Category[], pools: Pool[]): Transaction[] {
  return Array.from({ length: 50 }, (_, i) => {
    const cat = rng.helpers.arrayElement(categories);
    const pool = rng.datatype.boolean() ? rng.helpers.arrayElement(pools) : null;
    const date = rng.date.between({ from: '2024-01-01', to: '2024-12-31' });
    return {
      id: `tx-${i + 1}`,
      accountId: `acc-${rng.number.int({ min: 1, max: 3 })}`,
      categoryId: cat.id,
      poolId: pool ? pool.id : null,
      amount: parseFloat(rng.finance.amount({ min: 1, max: 500, dec: 2 })),
      currency: CURRENCIES[0],
      date: date.toISOString().slice(0, 10),
      description: rng.finance.transactionDescription(),
    };
  });
}

function createSeededFaker(): typeof faker {
  faker.seed(SEED);
  return faker;
}

export function createFakeDataProvider(): DataProvider {
  const rng = createSeededFaker();
  const pools = buildPools(rng);
  const categories = buildCategories(rng, pools);
  const budgets = buildBudgets(rng, categories);
  const transactions = buildTransactions(rng, categories, pools);

  return {
    getTransactions: () => Promise.resolve(transactions),
    getCategories: () => Promise.resolve(categories),
    getBudgets: () => Promise.resolve(budgets),
    getPools: () => Promise.resolve(pools),
  };
}
