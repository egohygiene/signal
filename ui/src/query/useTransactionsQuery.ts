import { useDataProvider } from '@egohygiene/signal/providers/useDataProvider';
import { useQuery } from '@tanstack/react-query';

import { queryKeys } from './queryKeys';

export function useTransactionsQuery() {
  const dataProvider = useDataProvider();
  return useQuery({
    queryKey: queryKeys.transactions.all(),
    queryFn: () => dataProvider.getTransactions(),
  });
}
