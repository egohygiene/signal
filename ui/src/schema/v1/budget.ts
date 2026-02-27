export type BudgetPeriod = 'weekly' | 'monthly' | 'yearly' | 'custom';

export type Budget = {
  id: string;
  name: string;
  categoryId: string;
  amount: number;
  currency: string;
  period: BudgetPeriod;
  startDate: string;
  endDate: string | null;
};
