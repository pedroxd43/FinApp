import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Category, Transaction } from './types';
import { DEFAULT_CATEGORIES } from './constants';
import { generateId } from './format';

const TRANSACTIONS_KEY = '@finapp:transactions';
const CATEGORIES_KEY = '@finapp:categories';
const INIT_KEY = '@finapp:initialized';

interface DataContextValue {
  transactions: Transaction[];
  categories: Category[];
  loading: boolean;
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, t: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (c: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, c: Omit<Category, 'id'>) => void;
  deleteCategory: (id: string) => void;
  getCategory: (id: string) => Category | undefined;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const initialized = await AsyncStorage.getItem(INIT_KEY);
        if (!initialized) {
          await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(DEFAULT_CATEGORIES));
          await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify([]));
          await AsyncStorage.setItem(INIT_KEY, 'true');
          setCategories(DEFAULT_CATEGORIES);
          setTransactions([]);
        } else {
          const cats = await AsyncStorage.getItem(CATEGORIES_KEY);
          const trans = await AsyncStorage.getItem(TRANSACTIONS_KEY);
          setCategories(cats ? JSON.parse(cats) : DEFAULT_CATEGORIES);
          setTransactions(trans ? JSON.parse(trans) : []);
        }
      } catch (e) {
        setCategories(DEFAULT_CATEGORIES);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persistTransactions = useCallback(async (next: Transaction[]) => {
    setTransactions(next);
    await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(next));
  }, []);

  const persistCategories = useCallback(async (next: Category[]) => {
    setCategories(next);
    await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(next));
  }, []);

  const addTransaction = useCallback((t: Omit<Transaction, 'id'>) => {
    const newT: Transaction = { ...t, id: generateId() };
    setTransactions((prev) => {
      const next = [newT, ...prev];
      AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const updateTransaction = useCallback((id: string, t: Omit<Transaction, 'id'>) => {
    setTransactions((prev) => {
      const next = prev.map((x) => (x.id === id ? { ...t, id } : x));
      AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => {
      const next = prev.filter((x) => x.id !== id);
      AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const addCategory = useCallback((c: Omit<Category, 'id'>) => {
    const newC: Category = { ...c, id: generateId(), isCustom: true };
    setCategories((prev) => {
      const next = [...prev, newC];
      AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const updateCategory = useCallback((id: string, c: Omit<Category, 'id'>) => {
    setCategories((prev) => {
      const next = prev.map((x) => (x.id === id ? { ...c, id, isCustom: x.isCustom } : x));
      AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => {
      const next = prev.filter((x) => x.id !== id);
      AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const getCategory = useCallback(
    (id: string) => categories.find((c) => c.id === id),
    [categories],
  );

  return (
    <DataContext.Provider
      value={{
        transactions,
        categories,
        loading,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addCategory,
        updateCategory,
        deleteCategory,
        getCategory,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
