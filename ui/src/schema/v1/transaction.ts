import { z } from 'zod';

export const TransactionSchema = z.object({
  id: z.string(),
  accountId: z.string(),
  categoryId: z.string().nullable(),
  poolId: z.string().nullable(),
  amount: z.number(),
  currency: z.string(),
  date: z.string(),
  description: z.string(),
});

export type Transaction = z.infer<typeof TransactionSchema>;
