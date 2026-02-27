import type { Category } from '@egohygiene/signal/schema/v1/category';
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

const mockCategories: Category[] = [
  { id: 'cat-1', name: 'Food & Dining', parentId: null },
  { id: 'cat-2', name: 'Groceries', parentId: null },
];

describe('TransactionsList', () => {
  beforeEach(() => {
    useAppStore.setState({ transactions: { items: [] }, categories: { items: [] } });
  });

  it('renders an empty state message when the store has no transactions', () => {
    render(<TransactionsList />);
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
    expect(screen.getByText('No transactions found.')).toBeInTheDocument();
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

  it('renders the category name for each transaction when categories are in the store', () => {
    useAppStore.setState({ transactions: { items: mockTransactions }, categories: { items: mockCategories } });
    render(<TransactionsList />);
    expect(screen.getByText('Food & Dining')).toBeInTheDocument();
    expect(screen.getByText('Groceries')).toBeInTheDocument();
  });

  it('renders a dash when transaction has no categoryId', () => {
    const txWithoutCategory: Transaction[] = [
      { ...mockTransactions[0]!, categoryId: null },
    ];
    useAppStore.setState({ transactions: { items: txWithoutCategory }, categories: { items: mockCategories } });
    render(<TransactionsList />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('renders categoryId as fallback when category is not found in store', () => {
    useAppStore.setState({ transactions: { items: mockTransactions }, categories: { items: [] } });
    render(<TransactionsList />);
    expect(screen.getByText('cat-1')).toBeInTheDocument();
    expect(screen.getByText('cat-2')).toBeInTheDocument();
  });
});
