import { useBudgetsQuery } from '@egohygiene/signal/query/useBudgetsQuery';
import { type JSX } from 'react';
import { useTranslation } from 'react-i18next';

import { BudgetsList } from '../features/budgets/BudgetsList';

export function BudgetsPage(): JSX.Element {
  const { t } = useTranslation('common');
  const { isLoading, isError } = useBudgetsQuery();

  return (
    <main>
      <h1>{t('pages.budgets')}</h1>
      {isLoading && <p role="status">Loading budgets…</p>}
      {isError && <p role="alert">Failed to load budgets.</p>}
      {!isLoading && !isError && <BudgetsList />}
    </main>
  );
}
