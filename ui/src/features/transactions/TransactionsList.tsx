import { useAppStore } from '@egohygiene/signal/store';
import { type JSX } from 'react';

export function TransactionsList(): JSX.Element {
  const transactions = useAppStore((s) => s.transactions.items);

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
        </li>
      ))}
    </ul>
  );
}
