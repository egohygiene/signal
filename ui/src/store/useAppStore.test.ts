import { beforeEach, describe, expect, it } from 'vitest';

import { useAppStore } from './useAppStore';

describe('useAppStore', () => {
  beforeEach(() => {
    useAppStore.setState({
      transactions: { items: [] },
      categories: { items: [] },
      budgets: { items: [] },
      pools: { items: [] },
      settings: { currency: 'USD', locale: 'en-US' },
    });
  });

  it('initializes with empty transaction items', () => {
    const state = useAppStore.getState();
    expect(state.transactions.items).toHaveLength(0);
  });

  it('initializes with empty category items', () => {
    const state = useAppStore.getState();
    expect(state.categories.items).toHaveLength(0);
  });

  it('initializes with empty budget items', () => {
    const state = useAppStore.getState();
    expect(state.budgets.items).toHaveLength(0);
  });

  it('initializes with empty pool items', () => {
    const state = useAppStore.getState();
    expect(state.pools.items).toHaveLength(0);
  });

  it('initializes with default settings', () => {
    const state = useAppStore.getState();
    expect(state.settings.currency).toBe('USD');
    expect(state.settings.locale).toBe('en-US');
  });

  it('setTransactions updates transaction state', () => {
    useAppStore.getState().setTransactions({ items: [{ id: 'tx-1' }] });
    expect(useAppStore.getState().transactions.items).toHaveLength(1);
    expect(useAppStore.getState().transactions.items[0]?.id).toBe('tx-1');
  });

  it('setCategories updates category state', () => {
    useAppStore.getState().setCategories({ items: [{ id: 'cat-1' }] });
    expect(useAppStore.getState().categories.items).toHaveLength(1);
    expect(useAppStore.getState().categories.items[0]?.id).toBe('cat-1');
  });

  it('setBudgets updates budget state', () => {
    useAppStore.getState().setBudgets({ items: [{ id: 'bud-1' }] });
    expect(useAppStore.getState().budgets.items).toHaveLength(1);
    expect(useAppStore.getState().budgets.items[0]?.id).toBe('bud-1');
  });

  it('setPools updates pool state', () => {
    useAppStore.getState().setPools({ items: [{ id: 'pool-1' }] });
    expect(useAppStore.getState().pools.items).toHaveLength(1);
    expect(useAppStore.getState().pools.items[0]?.id).toBe('pool-1');
  });

  it('setSettings updates settings state', () => {
    useAppStore.getState().setSettings({ currency: 'EUR', locale: 'de-DE' });
    expect(useAppStore.getState().settings.currency).toBe('EUR');
    expect(useAppStore.getState().settings.locale).toBe('de-DE');
  });
});
