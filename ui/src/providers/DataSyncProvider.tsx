import { useAppStore } from '@egohygiene/signal/store';
import { useQuery } from '@tanstack/react-query';
import { type JSX, type ReactNode, useEffect } from 'react';

import { useDataProvider } from './useDataProvider';

interface DataSyncProviderProps {
  children: ReactNode;
}

export function DataSyncProvider({ children }: DataSyncProviderProps): JSX.Element {
  const dataProvider = useDataProvider();
  const setTransactions = useAppStore((s) => s.setTransactions);
  const setCategories = useAppStore((s) => s.setCategories);
  const setBudgets = useAppStore((s) => s.setBudgets);
  const setPools = useAppStore((s) => s.setPools);

  const { data: transactions } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => dataProvider.getTransactions(),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => dataProvider.getCategories(),
  });

  const { data: budgets } = useQuery({
    queryKey: ['budgets'],
    queryFn: () => dataProvider.getBudgets(),
  });

  const { data: pools } = useQuery({
    queryKey: ['pools'],
    queryFn: () => dataProvider.getPools(),
  });

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
