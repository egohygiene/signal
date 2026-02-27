import { describe, expect, it } from 'vitest';

import type { AllocationRule } from '../../schema/v1/allocation-rule';
import {
  applyAllocationRules,
  DefaultAllocationStrategy,
} from './allocationStrategy';

const makeRule = (overrides: Partial<AllocationRule> = {}): AllocationRule => ({
  id: 'rule-1',
  name: 'Test Rule',
  poolId: 'pool-1',
  categoryId: null,
  percentage: null,
  fixedAmount: null,
  currency: null,
  ...overrides,
});

describe('applyAllocationRules', () => {
  it('returns an empty array when there are no rules', () => {
    expect(applyAllocationRules(1000, [])).toHaveLength(0);
  });

  it('allocates a fixed amount from a single rule', () => {
    const rules = [makeRule({ fixedAmount: 200 })];
    const result = applyAllocationRules(1000, rules);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ poolId: 'pool-1', amount: 200 });
  });

  it('allocates a percentage of income from a single rule', () => {
    const rules = [makeRule({ percentage: 20 })];
    const result = applyAllocationRules(1000, rules);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ poolId: 'pool-1', amount: 200 });
  });

  it('prefers fixedAmount over percentage when both are set', () => {
    const rules = [makeRule({ fixedAmount: 300, percentage: 10 })];
    const result = applyAllocationRules(1000, rules);
    expect(result[0]?.amount).toBe(300);
  });

  it('contributes 0 when neither fixedAmount nor percentage is set', () => {
    const rules = [makeRule()];
    const result = applyAllocationRules(1000, rules);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ poolId: 'pool-1', amount: 0 });
  });

  it('sums multiple rules targeting the same pool', () => {
    const rules = [
      makeRule({ id: 'rule-1', fixedAmount: 100 }),
      makeRule({ id: 'rule-2', fixedAmount: 150 }),
    ];
    const result = applyAllocationRules(1000, rules);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ poolId: 'pool-1', amount: 250 });
  });

  it('produces separate results for different pools', () => {
    const rules = [
      makeRule({ id: 'rule-1', poolId: 'pool-1', percentage: 20 }),
      makeRule({ id: 'rule-2', poolId: 'pool-2', fixedAmount: 100 }),
    ];
    const result = applyAllocationRules(1000, rules);
    expect(result).toHaveLength(2);
    const pool1 = result.find((r) => r.poolId === 'pool-1');
    const pool2 = result.find((r) => r.poolId === 'pool-2');
    expect(pool1?.amount).toBe(200);
    expect(pool2?.amount).toBe(100);
  });

  it('handles zero income with percentage-based rules', () => {
    const rules = [makeRule({ percentage: 50 })];
    const result = applyAllocationRules(0, rules);
    expect(result[0]?.amount).toBe(0);
  });

  it('handles fractional percentages correctly', () => {
    const rules = [makeRule({ percentage: 33.5 })];
    const result = applyAllocationRules(1000, rules);
    expect(result[0]?.amount).toBeCloseTo(335);
  });
});

describe('DefaultAllocationStrategy', () => {
  it('delegates to applyAllocationRules', () => {
    const rules = [
      makeRule({ id: 'rule-1', poolId: 'pool-1', fixedAmount: 500 }),
      makeRule({ id: 'rule-2', poolId: 'pool-2', percentage: 10 }),
    ];
    const result = DefaultAllocationStrategy.allocate(2000, rules);
    const pool1 = result.find((r) => r.poolId === 'pool-1');
    const pool2 = result.find((r) => r.poolId === 'pool-2');
    expect(pool1?.amount).toBe(500);
    expect(pool2?.amount).toBe(200);
  });

  it('returns an empty array for no rules', () => {
    expect(DefaultAllocationStrategy.allocate(5000, [])).toHaveLength(0);
  });
});
