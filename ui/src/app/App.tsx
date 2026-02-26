import { Layout } from '@egohygiene/signal/app/layout/Layout';
import { BudgetsPage } from '@egohygiene/signal/pages/BudgetsPage';
import { HomePage } from '@egohygiene/signal/pages/HomePage';
import { PoolsPage } from '@egohygiene/signal/pages/PoolsPage';
import { SettingsPage } from '@egohygiene/signal/pages/SettingsPage';
import { TransactionsPage } from '@egohygiene/signal/pages/TransactionsPage';
import { type JSX } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

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
