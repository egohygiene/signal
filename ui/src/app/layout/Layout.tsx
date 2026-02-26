import { type JSX } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function Layout(): JSX.Element {
  const { t } = useTranslation('common');
  return (
    <>
      <nav>
        <NavLink to="/">{t('nav.home')}</NavLink>
        <NavLink to="/transactions">{t('nav.transactions')}</NavLink>
        <NavLink to="/budgets">{t('nav.budgets')}</NavLink>
        <NavLink to="/pools">{t('nav.pools')}</NavLink>
        <NavLink to="/settings">{t('nav.settings')}</NavLink>
      </nav>
      <Outlet />
    </>
  );
}
