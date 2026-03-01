import { useDataProvider } from '@egohygiene/signal/providers/useDataProvider';
import { useQuery } from '@tanstack/react-query';

import { queryKeys } from './queryKeys';

export function usePoolsQuery() {
  const dataProvider = useDataProvider();
  return useQuery({
    queryKey: queryKeys.pools.all(),
    queryFn: () => dataProvider.getPools(),
  });
}
