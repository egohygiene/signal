import { z } from 'zod';

export const BudgetPeriodSchema = z.enum(['weekly', 'monthly', 'yearly', 'custom']);

export const BudgetSchema = z.object({
  id: z.string(),
  name: z.string(),
  categoryId: z.string(),
  amount: z.number(),
  currency: z.string(),
  period: BudgetPeriodSchema,
  startDate: z.string(),
  endDate: z.string().nullable(),
});

export type BudgetPeriod = z.infer<typeof BudgetPeriodSchema>;

export type Budget = z.infer<typeof BudgetSchema>;
