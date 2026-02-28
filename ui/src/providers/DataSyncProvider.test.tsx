import type { DataProvider } from '@egohygiene/signal/providers/DataProvider';
import { DataProviderProvider } from '@egohygiene/signal/providers/DataProviderContext';
import { useAppStore } from '@egohygiene/signal/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { DataSyncProvider, useDataSyncState } from './DataSyncProvider';

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

const mockCategories = [{ id: 'cat-1', name: 'Food', parentId: null }];

const mockBudgets = [
  {
    id: 'bud-1',
    name: 'Food Budget',
    categoryId: 'cat-1',
    amount: 100,
    currency: 'USD',
    period: 'monthly' as const,
    startDate: '2024-01-01',
    endDate: null,
  },
];

const mockPools = [{ id: 'pool-1', name: 'Emergency Fund', currency: 'USD', targetAmount: null }];

const mockProvider: DataProvider = {
  getTransactions: () => Promise.resolve(mockTransactions),
  getCategories: () => Promise.resolve(mockCategories),
  getBudgets: () => Promise.resolve(mockBudgets),
  getPools: () => Promise.resolve(mockPools),
};

function renderWithProviders(provider: DataProvider) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <DataProviderProvider provider={provider}>
        <DataSyncProvider>
          <div data-testid="child" />
        </DataSyncProvider>
      </DataProviderProvider>
    </QueryClientProvider>,
  );
}

/** Helper that renders a consumer of useDataSyncState and captures its value. */
function renderWithStateCapture(provider: DataProvider) {
  let capturedState = { isLoading: false, errors: [] as Error[] };
  function Consumer() {
    capturedState = useDataSyncState();
    return null;
  }
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={client}>
      <DataProviderProvider provider={provider}>
        <DataSyncProvider>
          <Consumer />
        </DataSyncProvider>
      </DataProviderProvider>
    </QueryClientProvider>,
  );
  return { getState: () => capturedState };
}

describe('DataSyncProvider', () => {
  beforeEach(() => {
    useAppStore.setState({
      transactions: { items: [] },
      categories: { items: [] },
      budgets: { items: [] },
      pools: { items: [] },
    });
  });

  it('renders its children', () => {
    const { getByTestId } = renderWithProviders(mockProvider);
    expect(getByTestId('child')).toBeInTheDocument();
  });

  it('syncs transactions to the store', async () => {
    renderWithProviders(mockProvider);
    await waitFor(() => {
      expect(useAppStore.getState().transactions.items).toHaveLength(1);
      expect(useAppStore.getState().transactions.items[0]?.id).toBe('tx-1');
    });
  });

  it('syncs categories to the store', async () => {
    renderWithProviders(mockProvider);
    await waitFor(() => {
      expect(useAppStore.getState().categories.items).toHaveLength(1);
      expect(useAppStore.getState().categories.items[0]?.id).toBe('cat-1');
    });
  });

  it('syncs budgets to the store', async () => {
    renderWithProviders(mockProvider);
    await waitFor(() => {
      expect(useAppStore.getState().budgets.items).toHaveLength(1);
      expect(useAppStore.getState().budgets.items[0]?.id).toBe('bud-1');
    });
  });

  it('syncs pools to the store', async () => {
    renderWithProviders(mockProvider);
    await waitFor(() => {
      expect(useAppStore.getState().pools.items).toHaveLength(1);
      expect(useAppStore.getState().pools.items[0]?.id).toBe('pool-1');
    });
  });

  it('leaves the store empty when a query fails', async () => {
    const errorProvider: DataProvider = {
      ...mockProvider,
      getTransactions: () => Promise.reject(new Error('fetch failed')),
    };
    renderWithProviders(errorProvider);
    await waitFor(() => {
      expect(useAppStore.getState().categories.items).toHaveLength(1);
    });
    expect(useAppStore.getState().transactions.items).toHaveLength(0);
  });

  it('leaves the store empty while a query is still loading', () => {
    const slowProvider: DataProvider = {
      ...mockProvider,
      getTransactions: () => new Promise(() => {}),
    };
    renderWithProviders(slowProvider);
    expect(useAppStore.getState().transactions.items).toHaveLength(0);
  });

  it('exposes isLoading true while queries are pending', () => {
    const slowProvider: DataProvider = {
      ...mockProvider,
      getTransactions: () => new Promise(() => {}),
    };
    const { getState } = renderWithStateCapture(slowProvider);
    expect(getState().isLoading).toBe(true);
  });

  it('exposes query errors via context when a query fails', async () => {
    const errorProvider: DataProvider = {
      ...mockProvider,
      getTransactions: () => Promise.reject(new Error('fetch failed')),
    };
    const { getState } = renderWithStateCapture(errorProvider);
    await waitFor(() => {
      expect(getState().errors).toHaveLength(1);
    });
    expect(getState().errors[0]?.message).toBe('fetch failed');
  });

  it('exposes an empty errors array when all queries succeed', async () => {
    const { getState } = renderWithStateCapture(mockProvider);
    await waitFor(() => {
      expect(getState().isLoading).toBe(false);
    });
    expect(getState().errors).toHaveLength(0);
  });
});
