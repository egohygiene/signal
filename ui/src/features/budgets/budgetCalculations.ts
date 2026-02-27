import type { Budget } from '../../schema/v1/budget';
import type { Transaction } from '../../schema/v1/transaction';

export type CategoryTotal = {
  categoryId: string;
  total: number;
};

export type BudgetComparison = {
  budget: Budget;
  spent: number;
  remaining: number;
  isOverBudget: boolean;
};

/**
 * Returns true if the given date string falls within the specified year and month (1-based).
 */
export function isInMonth(dateStr: string, year: number, month: number): boolean {
  const date = new Date(dateStr);
  return date.getUTCFullYear() === year && date.getUTCMonth() + 1 === month;
}

/**
 * Computes total spending per categoryId for transactions in the given year/month.
 */
export function computeCategoryTotals(
  transactions: Transaction[],
  year: number,
  month: number,
): CategoryTotal[] {
  const totals = new Map<string, number>();

  for (const tx of transactions) {
    if (tx.categoryId === null) continue;
    if (!isInMonth(tx.date, year, month)) continue;
    totals.set(tx.categoryId, (totals.get(tx.categoryId) ?? 0) + tx.amount);
  }

  return Array.from(totals.entries()).map(([categoryId, total]) => ({ categoryId, total }));
}

/**
 * Compares a list of budgets against actual spending totals.
 */
export function compareBudgets(
  budgets: Budget[],
  categoryTotals: CategoryTotal[],
): BudgetComparison[] {
  const totalMap = new Map(categoryTotals.map((ct) => [ct.categoryId, ct.total]));

  return budgets.map((budget) => {
    const spent = totalMap.get(budget.categoryId) ?? 0;
    const remaining = budget.amount - spent;
    return {
      budget,
      spent,
      remaining,
      isOverBudget: spent > budget.amount,
    };
  });
}
