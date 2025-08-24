'use client';

import { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import { createStore, useStore as useZustandStore } from 'zustand';
import type { Category, Expense } from '@/lib/types';
import { categories as initialCategories } from '@/lib/data';

interface StoreState {
  expenses: Expense[];
  categories: Category[];
  currency: string;
  isLoading: boolean;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  editExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  editCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  updateBudgets: (updatedCategories: Category[]) => void;
  setCurrency: (currency: string) => void;
  resetData: () => void;
}

const getDefaultInitialState = () => ({
  expenses: [],
  categories: initialCategories,
  currency: 'USD',
  isLoading: true,
});

type Store = ReturnType<typeof initializeStore>;

const storeContext = createContext<Store | null>(null);

const generateId = () => `id_${Math.random().toString(36).substr(2, 9)}`;

const STORAGE_KEY = 'budgetwise-data';

const initializeStore = () => {
  return createStore<StoreState>((set, get) => {
    const a = {
      ...getDefaultInitialState(),

      // This is a private function and should not be used in the UI
      _hydrate: () => {
        try {
          const storedData = localStorage.getItem(STORAGE_KEY);
          if (storedData) {
            const { expenses, categories, currency } = JSON.parse(storedData);
            set({ expenses, categories, currency, isLoading: false });
          } else {
            set({ isLoading: false });
          }
        } catch (e) {
          console.error('Could not hydrate state from localStorage', e);
          set({ isLoading: false });
        }
      },

      addExpense: (expense) => {
        const newExpense = { ...expense, id: generateId() };
        set((state) => ({ expenses: [newExpense, ...state.expenses] }));
      },
      editExpense: (updatedExpense) => {
        set((state) => ({
          expenses: state.expenses.map((expense) =>
            expense.id === updatedExpense.id ? updatedExpense : expense
          ),
        }));
      },
      deleteExpense: (id) => {
        set((state) => ({
          expenses: state.expenses.filter((expense) => expense.id !== id),
        }));
      },
      addCategory: (category) => {
        const newCategory = { ...category, id: generateId() };
        set((state) => ({ categories: [...state.categories, newCategory] }));
      },
      editCategory: (updatedCategory) => {
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id === updatedCategory.id ? updatedCategory : category
          ),
        }));
      },
      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((category) => category.id !== id),
          expenses: state.expenses.filter((expense) => expense.categoryId !== id),
        }));
      },
      updateBudgets: (updatedCategories) => {
        set({ categories: updatedCategories });
      },
      setCurrency: (currency) => {
        set({ currency });
      },
      resetData: () => {
        localStorage.removeItem(STORAGE_KEY);
        set(getDefaultInitialState());
        // Since we are resetting, we are no longer loading
        set({ isLoading: false });
      },
    };
    return a;
  });
};

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const storeRef = useRef<Store>();
  if (!storeRef.current) {
    storeRef.current = initializeStore();
  }

  useEffect(() => {
    const store = storeRef.current!;
    // @ts-ignore private method
    store.getState()._hydrate();

    const unsubscribe = store.subscribe((state) => {
      const { expenses, categories, currency } = state;
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ expenses, categories, currency }));
    });

    return () => unsubscribe();
  }, []);

  return (
    <storeContext.Provider value={storeRef.current}>
      {children}
    </storeContext.Provider>
  );
};

export const useStore = () => {
  const store = useContext(storeContext);
  if (!store) throw new Error('Missing StoreProvider');
  return useZustandStore(store);
};