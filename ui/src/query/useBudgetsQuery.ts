import { useQuery } from '@tanstack/react-query';

import { useDataProvider } from '../providers/useDataProvider';
import { queryKeys } from './queryKeys';

export function useBudgetsQuery() {
  const dataProvider = useDataProvider();
  return useQuery({
    queryKey: queryKeys.budgets.all(),
    queryFn: () => dataProvider.getBudgets(),
  });
}
