import type { Transaction } from '@egohygiene/signal/schema/v1/transaction';

export type CategoryTotal = {
  categoryId: string;
  total: number;
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
