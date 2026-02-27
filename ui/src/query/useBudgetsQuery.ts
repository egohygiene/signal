import { useQuery } from '@tanstack/react-query';

import { useDataProvider } from '../providers/useDataProvider';

export function useBudgetsQuery() {
  const dataProvider = useDataProvider();
  return useQuery({
    queryKey: ['budgets'],
    queryFn: () => dataProvider.getBudgets(),
  });
}
