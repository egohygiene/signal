import { type JSX } from 'react';
import { useTranslation } from 'react-i18next';

export function SettingsPage(): JSX.Element {
  const { t } = useTranslation('common');
  return (
    <main>
      <h1>{t('pages.settings')}</h1>
    </main>
  );
}
