import { useAppStore } from '@egohygiene/signal/store';
import { type JSX, useMemo } from 'react';

export function TransactionsList(): JSX.Element {
  const transactions = useAppStore((s) => s.transactions.items);
  const categories = useAppStore((s) => s.categories.items);

  const categoryMap = useMemo(() => new Map(categories.map((c) => [c.id, c.name])), [categories]);

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
