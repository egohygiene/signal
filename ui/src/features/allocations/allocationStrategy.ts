import type { AllocationRule } from '../../schema/v1/allocation-rule';

export type AllocationResult = {
  poolId: string;
  amount: number;
};

/**
 * Abstraction for income allocation strategies.
 * Implementations receive a gross income and the configured rules,
 * and return how much should be allocated to each pool.
 */
export type AllocationStrategy = {
  allocate(income: number, rules: AllocationRule[]): AllocationResult[];
};

/**
 * Computes per-pool allocation amounts from a set of allocation rules.
 *
 * Rule precedence:
 *   1. If `fixedAmount` is non-null, it is used directly.
 *   2. Otherwise, if `percentage` is non-null, `income * (percentage / 100)` is used.
 *   3. Rules with neither value contribute 0 to the pool total.
 *
 * Multiple rules that target the same pool are summed together.
 * Negative income or rule amounts are supported but callers should
 * validate inputs before invoking this function.
 */
export function applyAllocationRules(
  income: number,
  rules: AllocationRule[],
): AllocationResult[] {
  const totals = new Map<string, number>();

  for (const rule of rules) {
    const amount =
      rule.fixedAmount !== null
        ? rule.fixedAmount
        : rule.percentage !== null
          ? income * (rule.percentage / 100)
          : 0;

    totals.set(rule.poolId, (totals.get(rule.poolId) ?? 0) + amount);
  }

  return Array.from(totals.entries()).map(([poolId, amount]) => ({ poolId, amount }));
}

/**
 * Default allocation strategy that applies fixed and percentage-based rules
 * to compute how much income is allocated to each pool.
 */
export const DefaultAllocationStrategy: AllocationStrategy = {
  allocate(income: number, rules: AllocationRule[]): AllocationResult[] {
    return applyAllocationRules(income, rules);
  },
};
