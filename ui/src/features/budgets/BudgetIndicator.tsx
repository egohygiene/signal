import { type JSX } from 'react';

export type BudgetIndicatorProps = {
  percentageUsed: number;
  isOverBudget: boolean;
};

const overBudgetClass = 'text-red-600 font-bold';
const underBudgetClass = 'text-green-600 font-bold';

export function BudgetIndicator({ percentageUsed, isOverBudget }: BudgetIndicatorProps): JSX.Element {
  const label = isOverBudget ? 'over budget' : 'under budget';
  const className = isOverBudget ? overBudgetClass : underBudgetClass;

  return (
    <span
      aria-label={`${percentageUsed.toFixed(0)}% used, ${label}`}
      className={className}
      data-status={isOverBudget ? 'over' : 'under'}
    >
      {percentageUsed.toFixed(0)}%{' '}
      <span aria-hidden="true">{isOverBudget ? '🔴' : '🟢'}</span>
    </span>
  );
}
