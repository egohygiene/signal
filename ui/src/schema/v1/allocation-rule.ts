import { z } from 'zod';

export const AllocationRuleSchema = z.object({
  id: z.string(),
  name: z.string(),
  poolId: z.string(),
  categoryId: z.string().nullable(),
  percentage: z.number().nullable(),
  fixedAmount: z.number().nullable(),
  currency: z.string().nullable(),
});

export type AllocationRule = z.infer<typeof AllocationRuleSchema>;
