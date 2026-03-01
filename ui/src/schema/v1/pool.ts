import { z } from 'zod';

export const PoolSchema = z.object({
  id: z.string(),
  name: z.string(),
  currency: z.string(),
  targetAmount: z.number().nullable(),
});

export type Pool = z.infer<typeof PoolSchema>;
