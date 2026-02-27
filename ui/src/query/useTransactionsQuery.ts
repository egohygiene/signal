import { useQuery } from '@tanstack/react-query';

import { useDataProvider } from '../providers/useDataProvider';

export function useTransactionsQuery() {
  const dataProvider = useDataProvider();
  return useQuery({
    queryKey: ['transactions'],
    queryFn: () => dataProvider.getTransactions(),
  });
}
