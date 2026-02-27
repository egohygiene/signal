import { createContext, useContext } from 'react';

import type { DataProvider } from './DataProvider';

export const DataProviderContext = createContext<DataProvider | null>(null);

export function useDataProvider(): DataProvider {
  const ctx = useContext(DataProviderContext);
  if (!ctx) {
    throw new Error('useDataProvider must be used within a DataProviderProvider');
  }
  return ctx;
}
