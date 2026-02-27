import { Layout } from '@egohygiene/signal/app/layout/Layout';
import { BudgetsPage } from '@egohygiene/signal/pages/BudgetsPage';
import { HomePage } from '@egohygiene/signal/pages/HomePage';
import { PoolsPage } from '@egohygiene/signal/pages/PoolsPage';
import { SettingsPage } from '@egohygiene/signal/pages/SettingsPage';
import { TransactionsPage } from '@egohygiene/signal/pages/TransactionsPage';
import { DataProviderProvider } from '@egohygiene/signal/providers/DataProviderContext';
import { createFakeDataProvider } from '@egohygiene/signal/providers/FakeDataProvider';
import { QueryProvider } from '@egohygiene/signal/query/QueryProvider';
import { type JSX, useMemo } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

export function App(): JSX.Element {
  const dataProvider = useMemo(() => createFakeDataProvider(), []);
  return (
    <QueryProvider>
      <DataProviderProvider provider={dataProvider}>
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
      </DataProviderProvider>
    </QueryProvider>
  );
}
