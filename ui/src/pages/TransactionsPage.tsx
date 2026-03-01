import { ErrorBoundary } from '@egohygiene/signal/components/ErrorBoundary';
import { TransactionsList } from '@egohygiene/signal/features/transactions';
import { useTransactionsQuery } from '@egohygiene/signal/query/useTransactionsQuery';
import { type JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

export function TransactionsPage(): JSX.Element {
  const { t } = useTranslation('common');
  const { isLoading, isError } = useTransactionsQuery();
  const { pathname } = useLocation();

  return (
    <main>
      <h1>{t('pages.transactions')}</h1>
      {isLoading && <p role="status">Loading transactions…</p>}
      {isError && <p role="alert">Failed to load transactions.</p>}
      {!isLoading && !isError && (
        <ErrorBoundary resetKeys={[pathname]}>
          <TransactionsList />
        </ErrorBoundary>
      )}
    </main>
  );
}
