import { type JSX } from 'react';
import { useTranslation } from 'react-i18next';

export function App(): JSX.Element {
  const { t } = useTranslation('common');
  return (
    <main>
      <h1>{t('appTitle')}</h1>
      <p>{t('appInitializing')}</p>
    </main>
  );
}
