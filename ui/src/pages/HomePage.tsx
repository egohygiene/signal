import { type JSX } from 'react';
import { useTranslation } from 'react-i18next';

export function HomePage(): JSX.Element {
  const { t } = useTranslation('common');
  return (
    <main>
      <h1>{t('pages.home')}</h1>
    </main>
  );
}
