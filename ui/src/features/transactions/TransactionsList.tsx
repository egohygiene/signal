import { useDataProvider } from '@egohygiene/signal/providers/useDataProvider';
import { useQuery } from '@tanstack/react-query';
import { type JSX } from 'react';

export function TransactionsList(): JSX.Element {
  const dataProvider = useDataProvider();

  const { data: transactions = [], isLoading, isError } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => dataProvider.getTransactions(),
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Failed to load transactions.</p>;
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
        </li>
      ))}
    </ul>
  );
}
