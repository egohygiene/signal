import { type JSX } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { BudgetsPage } from '../pages/BudgetsPage';
import { HomePage } from '../pages/HomePage';
import { PoolsPage } from '../pages/PoolsPage';
import { SettingsPage } from '../pages/SettingsPage';
import { TransactionsPage } from '../pages/TransactionsPage';
import { Layout } from './layout/Layout';

export function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/budgets" element={<BudgetsPage />} />
          <Route path="/pools" element={<PoolsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
