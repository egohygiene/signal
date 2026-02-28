import { useBudgetsQuery } from '@egohygiene/signal/query/useBudgetsQuery';
import { useCategoriesQuery } from '@egohygiene/signal/query/useCategoriesQuery';
import { usePoolsQuery } from '@egohygiene/signal/query/usePoolsQuery';
import { useTransactionsQuery } from '@egohygiene/signal/query/useTransactionsQuery';
import { useAppStore } from '@egohygiene/signal/store';
import { type JSX, type ReactNode, useEffect } from 'react';

type DataSyncProviderProps = {
  children: ReactNode;
};

export function DataSyncProvider({ children }: DataSyncProviderProps): JSX.Element {
  const setTransactions = useAppStore((s) => s.setTransactions);
  const setCategories = useAppStore((s) => s.setCategories);
  const setBudgets = useAppStore((s) => s.setBudgets);
  const setPools = useAppStore((s) => s.setPools);

  const { data: transactions } = useTransactionsQuery();
  const { data: categories } = useCategoriesQuery();
  const { data: budgets } = useBudgetsQuery();
  const { data: pools } = usePoolsQuery();

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

  return <>{children}</>;
}
