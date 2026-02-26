import { type JSX } from 'react';
import { useTranslation } from 'react-i18next';

export function TransactionsPage(): JSX.Element {
  const { t } = useTranslation('common');
  return (
    <main>
      <h1>{t('pages.transactions')}</h1>
    </main>
  );
}
