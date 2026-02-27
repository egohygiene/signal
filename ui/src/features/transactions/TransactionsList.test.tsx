import type { Transaction } from '@egohygiene/signal/schema/v1/transaction';
import { useAppStore } from '@egohygiene/signal/store';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { TransactionsList } from './TransactionsList';

const mockTransactions: Transaction[] = [
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

describe('TransactionsList', () => {
  beforeEach(() => {
    useAppStore.setState({ transactions: { items: [] } });
  });

  it('renders an empty list when the store has no transactions', () => {
    render(<TransactionsList />);
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  it('renders a list of transactions from the store', () => {
    useAppStore.setState({ transactions: { items: mockTransactions } });
    render(<TransactionsList />);
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('renders the date for each transaction', () => {
    useAppStore.setState({ transactions: { items: mockTransactions } });
    render(<TransactionsList />);
    expect(screen.getByText('2024-03-15')).toBeInTheDocument();
    expect(screen.getByText('2024-04-01')).toBeInTheDocument();
  });

  it('renders the merchant name for each transaction', () => {
    useAppStore.setState({ transactions: { items: mockTransactions } });
    render(<TransactionsList />);
    expect(screen.getByText('Coffee Shop')).toBeInTheDocument();
    expect(screen.getByText('Grocery Store')).toBeInTheDocument();
  });

  it('renders the formatted amount for each transaction', () => {
    useAppStore.setState({ transactions: { items: mockTransactions } });
    render(<TransactionsList />);
    expect(screen.getByText('USD 42.50')).toBeInTheDocument();
    expect(screen.getByText('USD 100.00')).toBeInTheDocument();
  });

  it('renders the account name for each transaction', () => {
    useAppStore.setState({ transactions: { items: mockTransactions } });
    render(<TransactionsList />);
    expect(screen.getByText('acc-1')).toBeInTheDocument();
    expect(screen.getByText('acc-2')).toBeInTheDocument();
  });
});
