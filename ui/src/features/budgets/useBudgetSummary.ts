import { selectBudgets, selectTransactions, useAppStore } from '@egohygiene/signal/store';
import { computeCategoryTotals } from '@egohygiene/signal/utils/transactionUtils';
import { useMemo } from 'react';

import type { BudgetComparison } from './budgetCalculations';
import { compareBudgets } from './budgetCalculations';

export type { BudgetComparison };

/**
 * Returns budget comparisons for the given year and month, computed from store state.
 * Defaults to the current UTC year and month when not provided.
 */
export function useBudgetSummary(year?: number, month?: number): BudgetComparison[] {
  const transactions = useAppStore(selectTransactions);
  const budgets = useAppStore(selectBudgets);

  return useMemo(() => {
    const resolvedYear = year ?? new Date().getUTCFullYear();
    const resolvedMonth = month ?? new Date().getUTCMonth() + 1;
    const totals = computeCategoryTotals(transactions, resolvedYear, resolvedMonth);
    return compareBudgets(budgets, totals);
  }, [transactions, budgets, year, month]);
}
