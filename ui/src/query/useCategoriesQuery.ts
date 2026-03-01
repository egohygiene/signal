import { useDataProvider } from '@egohygiene/signal/providers/useDataProvider';
import { useQuery } from '@tanstack/react-query';

import { queryKeys } from './queryKeys';

export function useCategoriesQuery() {
  const dataProvider = useDataProvider();
  return useQuery({
    queryKey: queryKeys.categories.all(),
    queryFn: () => dataProvider.getCategories(),
  });
}
