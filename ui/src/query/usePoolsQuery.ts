import { useQuery } from '@tanstack/react-query';

import { useDataProvider } from '../providers/useDataProvider';
import { queryKeys } from './queryKeys';

export function usePoolsQuery() {
  const dataProvider = useDataProvider();
  return useQuery({
    queryKey: queryKeys.pools.all(),
    queryFn: () => dataProvider.getPools(),
  });
}
