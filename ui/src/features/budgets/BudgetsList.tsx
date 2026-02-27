import { type JSX } from 'react';

import { BudgetIndicator } from './BudgetIndicator';
import { useBudgetSummary } from './useBudgetSummary';

export function BudgetsList(): JSX.Element {
  const comparisons = useBudgetSummary();

  if (comparisons.length === 0) {
    return <p>No budgets configured.</p>;
  }

  return (
    <ul>
      {comparisons.map(({ budget, spent, remaining, isOverBudget, percentageUsed }) => (
        <li key={budget.id} data-over-budget={isOverBudget}>
          <span data-field="name">{budget.name}</span>
          {' — '}
          <span data-field="budget">{budget.currency} {budget.amount.toFixed(2)}</span>
          {' — '}
          <span data-field="spent">{budget.currency} {spent.toFixed(2)}</span>
          {' — '}
          <span data-field="remaining">{budget.currency} {remaining.toFixed(2)}</span>
          {' — '}
          <BudgetIndicator percentageUsed={percentageUsed} isOverBudget={isOverBudget} />
        </li>
      ))}
    </ul>
  );
}

