import { useMemo } from 'react';

import { useAppStore } from '../../store/useAppStore';
import { computeCategoryTotals } from '../budgets/budgetCalculations';
import { computePoolBudgetTotals, computePoolSpendingTotals } from './poolCalculations';

export type PoolSummary = {
  poolId: string;
  spendingTotal: number;
  budgetTotal: number;
};

/**
 * Returns pool summaries (spending and budget totals) for the given year and month,
 * computed from store state. Defaults to the current UTC year and month when not provided.
 */
export function usePoolSummary(year?: number, month?: number): PoolSummary[] {
  const transactions = useAppStore((s) => s.transactions.items);
  const categories = useAppStore((s) => s.categories.items);
  const budgets = useAppStore((s) => s.budgets.items);

  const now = new Date();
  const resolvedYear = year ?? now.getUTCFullYear();
  const resolvedMonth = month ?? now.getUTCMonth() + 1;

  return useMemo(() => {
    const categoryTotals = computeCategoryTotals(transactions, resolvedYear, resolvedMonth);
    const spendingTotals = computePoolSpendingTotals(categories, categoryTotals);
    const budgetTotals = computePoolBudgetTotals(categories, budgets);

    const spendingMap = new Map(spendingTotals.map((st) => [st.poolId, st.total]));
    const budgetMap = new Map(budgetTotals.map((bt) => [bt.poolId, bt.budgetTotal]));
    const allPoolIds = new Set([
      ...spendingTotals.map((st) => st.poolId),
      ...budgetTotals.map((bt) => bt.poolId),
    ]);

    return Array.from(allPoolIds).map((poolId) => ({
      poolId,
      spendingTotal: spendingMap.get(poolId) ?? 0,
      budgetTotal: budgetMap.get(poolId) ?? 0,
    }));
  }, [transactions, categories, budgets, resolvedYear, resolvedMonth]);
}
