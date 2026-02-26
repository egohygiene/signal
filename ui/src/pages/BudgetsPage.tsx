import { type JSX } from 'react';
import { useTranslation } from 'react-i18next';

export function BudgetsPage(): JSX.Element {
  const { t } = useTranslation('common');
  return (
    <main>
      <h1>{t('pages.budgets')}</h1>
    </main>
  );
}
