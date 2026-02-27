import { useDataProvider } from '@egohygiene/signal/providers/useDataProvider';
import { useQuery } from '@tanstack/react-query';
import { type JSX } from 'react';
import { useTranslation } from 'react-i18next';

export function TransactionsPage(): JSX.Element {
  const { t } = useTranslation('common');
  const dataProvider = useDataProvider();

  const { data: transactions = [], isLoading, isError } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => dataProvider.getTransactions(),
  });

  return (
    <main>
      <h1>{t('pages.transactions')}</h1>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Failed to load transactions.</p>}
      {!isLoading && !isError && (
        <ul>
          {transactions.map((tx) => (
            <li key={tx.id}>
              {tx.date} — {tx.description} — {tx.currency} {tx.amount.toFixed(2)}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
