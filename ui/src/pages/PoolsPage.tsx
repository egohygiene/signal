import { type JSX } from 'react';
import { useTranslation } from 'react-i18next';

export function PoolsPage(): JSX.Element {
  const { t } = useTranslation('common');
  return (
    <main>
      <h1>{t('pages.pools')}</h1>
    </main>
  );
}
