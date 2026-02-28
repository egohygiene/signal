import { useQuery } from '@tanstack/react-query';

import { useDataProvider } from '../providers/useDataProvider';
import { queryKeys } from './queryKeys';

export function useCategoriesQuery() {
  const dataProvider = useDataProvider();
  return useQuery({
    queryKey: queryKeys.categories.all(),
    queryFn: () => dataProvider.getCategories(),
  });
}
