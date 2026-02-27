import type { DataProvider } from '@egohygiene/signal/providers/DataProvider';
import { DataProviderProvider } from '@egohygiene/signal/providers/DataProviderContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useTransactionsQuery } from './useTransactionsQuery';

const mockTransactions = [
  {
    id: 'tx-1',
    accountId: 'acc-1',
    categoryId: null,
    poolId: null,
    amount: 10,
    currency: 'USD',
    date: '2024-01-01',
    description: 'Test',
  },
];

const mockProvider: DataProvider = {
  getTransactions: () => Promise.resolve(mockTransactions),
  getCategories: () => Promise.resolve([]),
  getBudgets: () => Promise.resolve([]),
  getPools: () => Promise.resolve([]),
};

function TransactionsConsumer() {
  const { data, isLoading, isError } = useTransactionsQuery();
  if (isLoading) return <span data-testid="loading">loading</span>;
  if (isError) return <span data-testid="error">error</span>;
  return <span data-testid="count">{data?.length ?? 0}</span>;
}

function renderWithProviders(provider: DataProvider) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <DataProviderProvider provider={provider}>
        <TransactionsConsumer />
      </DataProviderProvider>
    </QueryClientProvider>,
  );
}

describe('useTransactionsQuery', () => {
  it('returns transactions data from the data provider', async () => {
    const { getByTestId } = renderWithProviders(mockProvider);
    await waitFor(() => {
      expect(getByTestId('count')).toHaveTextContent('1');
    });
  });

  it('shows loading state while fetching', () => {
    const slowProvider: DataProvider = {
      ...mockProvider,
      getTransactions: () => new Promise(() => {}),
    };
    const { getByTestId } = renderWithProviders(slowProvider);
    expect(getByTestId('loading')).toBeInTheDocument();
  });

  it('shows error state when fetch fails', async () => {
    const errorProvider: DataProvider = {
      ...mockProvider,
      getTransactions: () => Promise.reject(new Error('fetch failed')),
    };
    const { getByTestId } = renderWithProviders(errorProvider);
    await waitFor(() => {
      expect(getByTestId('error')).toBeInTheDocument();
    });
  });

  it('throws when used outside a DataProviderProvider', () => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() =>
      render(
        <QueryClientProvider client={client}>
          <TransactionsConsumer />
        </QueryClientProvider>,
      ),
    ).toThrow('useDataProvider must be used within a DataProviderProvider');
    spy.mockRestore();
  });
});
