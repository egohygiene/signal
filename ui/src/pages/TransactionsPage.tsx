import { TransactionsList } from '@egohygiene/signal/features/transactions';
import { useTransactionsQuery } from '@egohygiene/signal/query/useTransactionsQuery';
import { type JSX } from 'react';
import { useTranslation } from 'react-i18next';

export function TransactionsPage(): JSX.Element {
  const { t } = useTranslation('common');
  const { isLoading, isError } = useTransactionsQuery();

  return (
    <main>
      <h1>{t('pages.transactions')}</h1>
      {isLoading && <p role="status">Loading transactions…</p>}
      {isError && <p role="alert">Failed to load transactions.</p>}
      {!isLoading && !isError && <TransactionsList />}
    </main>
  );
}
