import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      // Explicitly set gcTime (formerly cacheTime) to match the staleTime and
      // avoid relying on the implicit 5-minute default from TanStack Query v5.
      gcTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
