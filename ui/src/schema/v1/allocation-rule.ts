export type AllocationRule = {
  id: string;
  name: string;
  poolId: string;
  categoryId: string | null;
  percentage: number | null;
  fixedAmount: number | null;
  currency: string | null;
};
