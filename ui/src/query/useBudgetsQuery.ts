import { useDataProvider } from '@egohygiene/signal/providers/useDataProvider';
import { useQuery } from '@tanstack/react-query';

import { queryKeys } from './queryKeys';

export function useBudgetsQuery() {
  const dataProvider = useDataProvider();
  return useQuery({
    queryKey: queryKeys.budgets.all(),
    queryFn: () => dataProvider.getBudgets(),
  });
}
