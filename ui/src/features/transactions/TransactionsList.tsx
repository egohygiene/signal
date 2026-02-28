import { selectCategories, selectTransactions, useAppStore } from '@egohygiene/signal/store';
import { type JSX, useMemo } from 'react';

export function TransactionsList(): JSX.Element {
  const transactions = useAppStore(selectTransactions);
  const categories = useAppStore(selectCategories);

  const categoryMap = useMemo(() => new Map(categories.map((c) => [c.id, c.name])), [categories]);

  if (transactions.length === 0) {
    return <p>No transactions found.</p>;
  }

  return (
    <ul>
      {transactions.map((tx) => (
        <li key={tx.id}>
          <span data-field="date">{tx.date}</span>
          {' — '}
          <span data-field="merchant">{tx.description}</span>
          {' — '}
          <span data-field="amount">{tx.currency} {tx.amount.toFixed(2)}</span>
          {' — '}
          <span data-field="account">{tx.accountId}</span>
          {' — '}
          <span data-field="category">{tx.categoryId ? (categoryMap.get(tx.categoryId) ?? tx.categoryId) : '—'}</span>
        </li>
      ))}
    </ul>
  );
}
