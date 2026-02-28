import { logger } from '@egohygiene/signal/logging';
import { useBudgetsQuery } from '@egohygiene/signal/query/useBudgetsQuery';
import { useCategoriesQuery } from '@egohygiene/signal/query/useCategoriesQuery';
import { usePoolsQuery } from '@egohygiene/signal/query/usePoolsQuery';
import { useTransactionsQuery } from '@egohygiene/signal/query/useTransactionsQuery';
import { selectSetBudgets, selectSetCategories, selectSetPools, selectSetTransactions, useAppStore } from '@egohygiene/signal/store';
import { createContext, useContext, type JSX, type ReactNode, useEffect, useMemo } from 'react';

export type DataSyncState = {
  /** True while any query is still fetching for the first time. */
  isLoading: boolean;
  /** One entry per query that has failed; empty when all queries succeed. */
  errors: Error[];
};

const DataSyncContext = createContext<DataSyncState>({ isLoading: false, errors: [] });

/**
 * Returns the current loading and error state of the DataSyncProvider queries.
 * Must be used inside a DataSyncProvider tree.
 */
export function useDataSyncState(): DataSyncState {
  return useContext(DataSyncContext);
}

type DataSyncProviderProps = {
  children: ReactNode;
};

/**
 * DataSyncProvider is a one-way bridge that synchronizes server data from
 * TanStack Query into the Zustand store for consumption by client-side
 * computed hooks (e.g. useBudgetSummary, usePoolSummary).
 *
 * **Single source of truth**: TanStack Query owns all server data. This
 * provider propagates that data into Zustand as a read-only mirror so that
 * derived computations can access it without coupling every hook to the
 * query layer. Server data must never be written into Zustand outside of
 * this provider.
 *
 * Loading and error states from all queries are exposed via DataSyncContext
 * and can be accessed with the useDataSyncState hook.
 */
export function DataSyncProvider({ children }: DataSyncProviderProps): JSX.Element {
  const setTransactions = useAppStore(selectSetTransactions);
  const setCategories = useAppStore(selectSetCategories);
  const setBudgets = useAppStore(selectSetBudgets);
  const setPools = useAppStore(selectSetPools);

  const { data: transactions, isLoading: txLoading, error: txError } = useTransactionsQuery();
  const { data: categories, isLoading: catLoading, error: catError } = useCategoriesQuery();
  const { data: budgets, isLoading: budLoading, error: budError } = useBudgetsQuery();
  const { data: pools, isLoading: poolLoading, error: poolError } = usePoolsQuery();

  useEffect(() => {
    const queryErrors: [string, Error | null][] = [
      ['transactions', txError],
      ['categories', catError],
      ['budgets', budError],
      ['pools', poolError],
    ];
    for (const [name, err] of queryErrors) {
      if (err) logger.error({ err }, `DataSyncProvider: ${name} query failed`);
    }
  }, [txError, catError, budError, poolError]);

  useEffect(() => {
    if (transactions) setTransactions({ items: transactions });
  }, [transactions, setTransactions]);

  useEffect(() => {
    if (categories) setCategories({ items: categories });
  }, [categories, setCategories]);

  useEffect(() => {
    if (budgets) setBudgets({ items: budgets });
  }, [budgets, setBudgets]);

  useEffect(() => {
    if (pools) setPools({ items: pools });
  }, [pools, setPools]);

  const isLoading = txLoading || catLoading || budLoading || poolLoading;
  const errors = useMemo(
    () => [txError, catError, budError, poolError].filter((e): e is Error => e !== null),
    [txError, catError, budError, poolError],
  );

  return (
    <DataSyncContext.Provider value={{ isLoading, errors }}>
      {children}
    </DataSyncContext.Provider>
  );
}
