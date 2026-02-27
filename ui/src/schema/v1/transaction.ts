export type Transaction = {
  id: string;
  accountId: string;
  categoryId: string | null;
  poolId: string | null;
  amount: number;
  currency: string;
  date: string;
  description: string;
};
