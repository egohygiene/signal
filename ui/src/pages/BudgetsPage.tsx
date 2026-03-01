import { ErrorBoundary } from '@egohygiene/signal/components/ErrorBoundary';
import { BudgetsList } from '@egohygiene/signal/features/budgets';
import { useBudgetsQuery } from '@egohygiene/signal/query/useBudgetsQuery';
import { type JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

export function BudgetsPage(): JSX.Element {
  const { t } = useTranslation('common');
  const { isLoading, isError } = useBudgetsQuery();
  const { pathname } = useLocation();

  return (
    <main>
      <h1>{t('pages.budgets')}</h1>
      {isLoading && <p role="status">Loading budgets…</p>}
      {isError && <p role="alert">Failed to load budgets.</p>}
      {!isLoading && !isError && (
        <ErrorBoundary resetKeys={[pathname]}>
          <BudgetsList />
        </ErrorBoundary>
      )}
    </main>
  );
}
