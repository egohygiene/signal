import { z } from 'zod';

export const AccountTypeSchema = z.enum(['checking', 'savings', 'credit', 'investment', 'other']);

export const AccountSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: AccountTypeSchema,
  currency: z.string(),
  balance: z.number().nullable(),
});

export type AccountType = z.infer<typeof AccountTypeSchema>;

export type Account = z.infer<typeof AccountSchema>;
