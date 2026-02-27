import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BudgetIndicator } from './BudgetIndicator';

describe('BudgetIndicator', () => {
  it('renders percentage used', () => {
    render(<BudgetIndicator percentageUsed={75} isOverBudget={false} />);
    expect(screen.getByText(/75%/)).toBeInTheDocument();
  });

  it('has accessible label with percentage and status when under budget', () => {
    render(<BudgetIndicator percentageUsed={75} isOverBudget={false} />);
    expect(screen.getByLabelText('75% used, under budget')).toBeInTheDocument();
  });

  it('has accessible label with percentage and status when over budget', () => {
    render(<BudgetIndicator percentageUsed={120} isOverBudget={true} />);
    expect(screen.getByLabelText('120% used, over budget')).toBeInTheDocument();
  });

  it('sets data-status="over" when over budget', () => {
    render(<BudgetIndicator percentageUsed={120} isOverBudget={true} />);
    const indicator = document.querySelector('[data-status="over"]');
    expect(indicator).toBeInTheDocument();
  });

  it('sets data-status="under" when under budget', () => {
    render(<BudgetIndicator percentageUsed={75} isOverBudget={false} />);
    const indicator = document.querySelector('[data-status="under"]');
    expect(indicator).toBeInTheDocument();
  });

  it('rounds percentage to nearest integer in label', () => {
    render(<BudgetIndicator percentageUsed={33.33} isOverBudget={false} />);
    expect(screen.getByLabelText(/33% used/)).toBeInTheDocument();
  });
});
