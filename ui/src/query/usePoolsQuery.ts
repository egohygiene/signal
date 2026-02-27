import { useQuery } from '@tanstack/react-query';

import { useDataProvider } from '../providers/useDataProvider';

export function usePoolsQuery() {
  const dataProvider = useDataProvider();
  return useQuery({
    queryKey: ['pools'],
    queryFn: () => dataProvider.getPools(),
  });
}
