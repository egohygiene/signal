import type { Budget } from '../../schema/v1/budget';
import type { Category } from '../../schema/v1/category';
import type { CategoryTotal } from '../budgets/budgetCalculations';

export type PoolSpendingTotal = {
  poolId: string;
  total: number;
};

export type PoolBudgetTotal = {
  poolId: string;
  budgetTotal: number;
};

/**
 * Computes total spending per pool by aggregating category spending totals
 * for all categories that are mapped to a pool.
 */
export function computePoolSpendingTotals(
  categories: Category[],
  categoryTotals: CategoryTotal[],
): PoolSpendingTotal[] {
  const categoryPoolMap = new Map<string, string>(
    categories
      .filter((c): c is Category & { poolId: string } => c.poolId !== null)
      .map((c) => [c.id, c.poolId]),
  );

  const totals = new Map<string, number>();

  for (const ct of categoryTotals) {
    const poolId = categoryPoolMap.get(ct.categoryId);
    if (poolId === undefined) continue;
    totals.set(poolId, (totals.get(poolId) ?? 0) + ct.total);
  }

  return Array.from(totals.entries()).map(([poolId, total]) => ({ poolId, total }));
}

/**
 * Computes total budget amounts per pool by summing budgets for categories
 * that are mapped to a pool.
 */
export function computePoolBudgetTotals(
  categories: Category[],
  budgets: Budget[],
): PoolBudgetTotal[] {
  const categoryPoolMap = new Map<string, string>(
    categories
      .filter((c): c is Category & { poolId: string } => c.poolId !== null)
      .map((c) => [c.id, c.poolId]),
  );

  const totals = new Map<string, number>();

  for (const budget of budgets) {
    const poolId = categoryPoolMap.get(budget.categoryId);
    if (poolId === undefined) continue;
    totals.set(poolId, (totals.get(poolId) ?? 0) + budget.amount);
  }

  return Array.from(totals.entries()).map(([poolId, budgetTotal]) => ({ poolId, budgetTotal }));
}
