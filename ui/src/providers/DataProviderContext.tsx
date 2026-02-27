import { type JSX, type ReactNode } from 'react';

import type { DataProvider } from './DataProvider';
import { DataProviderContext } from './useDataProvider';

interface DataProviderProviderProps {
  provider: DataProvider;
  children: ReactNode;
}

export function DataProviderProvider({ provider, children }: DataProviderProviderProps): JSX.Element {
  return <DataProviderContext.Provider value={provider}>{children}</DataProviderContext.Provider>;
}
