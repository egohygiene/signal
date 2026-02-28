import { useQuery } from '@tanstack/react-query';

import { useDataProvider } from '../providers/useDataProvider';
import { queryKeys } from './queryKeys';

export function useTransactionsQuery() {
  const dataProvider = useDataProvider();
  return useQuery({
    queryKey: queryKeys.transactions.all(),
    queryFn: () => dataProvider.getTransactions(),
  });
}
