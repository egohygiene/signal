import { useMemo } from 'react';

import { useAppStore } from '../../store/useAppStore';
import type { BudgetComparison } from './budgetCalculations';
import { compareBudgets, computeCategoryTotals } from './budgetCalculations';

export type { BudgetComparison };

/**
 * Returns budget comparisons for the given year and month, computed from store state.
 * Defaults to the current UTC year and month when not provided.
 */
export function useBudgetSummary(year?: number, month?: number): BudgetComparison[] {
  const transactions = useAppStore((s) => s.transactions.items);
  const budgets = useAppStore((s) => s.budgets.items);

  const now = new Date();
  const resolvedYear = year ?? now.getUTCFullYear();
  const resolvedMonth = month ?? now.getUTCMonth() + 1;

  return useMemo(() => {
    const totals = computeCategoryTotals(transactions, resolvedYear, resolvedMonth);
    return compareBudgets(budgets, totals);
  }, [transactions, budgets, resolvedYear, resolvedMonth]);
}
