import { useQuery } from '@tanstack/react-query';

import { useDataProvider } from '../providers/useDataProvider';

export function useCategoriesQuery() {
  const dataProvider = useDataProvider();
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => dataProvider.getCategories(),
  });
}
