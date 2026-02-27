import type { Budget } from '@egohygiene/signal/schema/v1/budget';
import type { Transaction } from '@egohygiene/signal/schema/v1/transaction';
import { useAppStore } from '@egohygiene/signal/store';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { BudgetsList } from './BudgetsList';

const currentDate = new Date();
const year = currentDate.getUTCFullYear();
const month = currentDate.getUTCMonth() + 1;
const dateInCurrentMonth = `${year}-${String(month).padStart(2, '0')}-15`;

const mockBudgets: Budget[] = [
  {
    id: 'bud-1',
    name: 'Food Budget',
    categoryId: 'cat-1',
    amount: 200,
    currency: 'USD',
    period: 'monthly',
    startDate: '2024-01-01',
    endDate: null,
  },
  {
    id: 'bud-2',
    name: 'Transport Budget',
    categoryId: 'cat-2',
    amount: 100,
    currency: 'USD',
    period: 'monthly',
    startDate: '2024-01-01',
    endDate: null,
  },
];

const mockTransactions: Transaction[] = [
  {
    id: 'tx-1',
    accountId: 'acc-1',
    categoryId: 'cat-1',
    poolId: null,
    amount: 150,
    currency: 'USD',
    date: dateInCurrentMonth,
    description: 'Grocery Store',
  },
  {
    id: 'tx-2',
    accountId: 'acc-1',
    categoryId: 'cat-2',
    poolId: null,
    amount: 120,
    currency: 'USD',
    date: dateInCurrentMonth,
    description: 'Bus Pass',
  },
];

describe('BudgetsList', () => {
  beforeEach(() => {
    useAppStore.setState({ transactions: { items: [] }, budgets: { items: [] } });
  });

  it('renders empty state when no budgets are configured', () => {
    render(<BudgetsList />);
    expect(screen.getByText('No budgets configured.')).toBeInTheDocument();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  it('renders a list item for each budget', () => {
    useAppStore.setState({ budgets: { items: mockBudgets } });
    render(<BudgetsList />);
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('displays budget name for each budget', () => {
    useAppStore.setState({ budgets: { items: mockBudgets } });
    render(<BudgetsList />);
    expect(screen.getByText('Food Budget')).toBeInTheDocument();
    expect(screen.getByText('Transport Budget')).toBeInTheDocument();
  });

  it('displays the budget amount', () => {
    useAppStore.setState({ budgets: { items: mockBudgets } });
    render(<BudgetsList />);
    const budgetSpans = document.querySelectorAll('[data-field="budget"]');
    expect(budgetSpans[0]?.textContent).toContain('200.00');
  });

  it('shows zero spent when there are no matching transactions', () => {
    useAppStore.setState({ budgets: { items: [mockBudgets[0]!] }, transactions: { items: [] } });
    render(<BudgetsList />);
    expect(screen.getByText('USD 0.00')).toBeInTheDocument();
  });

  it('shows actual spending from current month transactions', () => {
    useAppStore.setState({ budgets: { items: [mockBudgets[0]!] }, transactions: { items: mockTransactions } });
    render(<BudgetsList />);
    expect(screen.getByText('USD 150.00')).toBeInTheDocument();
  });

  it('marks over-budget item with data attribute', () => {
    useAppStore.setState({ budgets: { items: [mockBudgets[1]!] }, transactions: { items: mockTransactions } });
    render(<BudgetsList />);
    const items = screen.getAllByRole('listitem');
    expect(items[0]).toHaveAttribute('data-over-budget', 'true');
  });

  it('shows warning text when over budget', () => {
    useAppStore.setState({ budgets: { items: [mockBudgets[1]!] }, transactions: { items: mockTransactions } });
    render(<BudgetsList />);
    expect(screen.getByText(/over budget/)).toBeInTheDocument();
  });

  it('does not show warning text when under budget', () => {
    useAppStore.setState({ budgets: { items: [mockBudgets[0]!] }, transactions: { items: mockTransactions } });
    render(<BudgetsList />);
    expect(screen.queryByText(/over budget/)).not.toBeInTheDocument();
  });
});
