import type { DataProvider } from '@egohygiene/signal/providers/DataProvider';
import { DataProviderProvider } from '@egohygiene/signal/providers/DataProviderContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TransactionsList } from './TransactionsList';

function renderWithProviders(provider: DataProvider) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <DataProviderProvider provider={provider}>
        <TransactionsList />
      </DataProviderProvider>
    </QueryClientProvider>,
  );
}

const mockTransactions = [
  {
    id: 'tx-1',
    accountId: 'acc-1',
    categoryId: 'cat-1',
    poolId: null,
    amount: 42.5,
    currency: 'USD',
    date: '2024-03-15',
    description: 'Coffee Shop',
  },
  {
    id: 'tx-2',
    accountId: 'acc-2',
    categoryId: 'cat-2',
    poolId: null,
    amount: 100.0,
    currency: 'USD',
    date: '2024-04-01',
    description: 'Grocery Store',
  },
];

const mockProvider: DataProvider = {
  getTransactions: () => Promise.resolve(mockTransactions),
  getCategories: () => Promise.resolve([]),
  getBudgets: () => Promise.resolve([]),
  getPools: () => Promise.resolve([]),
};

describe('TransactionsList', () => {
  it('renders a list of transactions from the data provider', async () => {
    renderWithProviders(mockProvider);
    await waitFor(() => {
      expect(screen.getAllByRole('listitem')).toHaveLength(2);
    });
  });

  it('renders the date for each transaction', async () => {
    renderWithProviders(mockProvider);
    await waitFor(() => {
      expect(screen.getByText('2024-03-15')).toBeInTheDocument();
      expect(screen.getByText('2024-04-01')).toBeInTheDocument();
    });
  });

  it('renders the merchant name for each transaction', async () => {
    renderWithProviders(mockProvider);
    await waitFor(() => {
      expect(screen.getByText('Coffee Shop')).toBeInTheDocument();
      expect(screen.getByText('Grocery Store')).toBeInTheDocument();
    });
  });

  it('renders the formatted amount for each transaction', async () => {
    renderWithProviders(mockProvider);
    await waitFor(() => {
      expect(screen.getByText('USD 42.50')).toBeInTheDocument();
      expect(screen.getByText('USD 100.00')).toBeInTheDocument();
    });
  });

  it('renders the account name for each transaction', async () => {
    renderWithProviders(mockProvider);
    await waitFor(() => {
      expect(screen.getByText('acc-1')).toBeInTheDocument();
      expect(screen.getByText('acc-2')).toBeInTheDocument();
    });
  });

  it('shows loading state while fetching', async () => {
    const slowProvider: DataProvider = {
      ...mockProvider,
      getTransactions: () => new Promise(() => {}),
    };
    renderWithProviders(slowProvider);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows error state when fetching fails', async () => {
    const errorProvider: DataProvider = {
      ...mockProvider,
      getTransactions: () => Promise.reject(new Error('fetch failed')),
    };
    renderWithProviders(errorProvider);
    await waitFor(() => {
      expect(screen.getByText('Failed to load transactions.')).toBeInTheDocument();
    });
  });
});
