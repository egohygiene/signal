import type { Budget } from '@egohygiene/signal/schema/v1/budget';
import type { CategoryTotal } from '@egohygiene/signal/utils/transactionUtils';

export type BudgetComparison = {
  budget: Budget;
  spent: number;
  remaining: number;
  isOverBudget: boolean;
  percentageUsed: number;
};

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
    const percentageUsed = budget.amount > 0 ? (spent / budget.amount) * 100 : spent > 0 ? 100 : 0;
    return {
      budget,
      spent,
      remaining,
      isOverBudget: spent > budget.amount,
      percentageUsed,
    };
  });
}
