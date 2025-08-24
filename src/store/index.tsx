'use client';

import { createContext, useContext, useMemo } from 'react';
import { createStore, useStore as useZustandStore } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Category, Expense } from '@/lib/types';
import {
  categories as initialCategories,
  expenses as initialExpenses,
} from '@/lib/data';

interface StoreState {
  expenses: Expense[];
  categories: Category[];
  currency: string;
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
  expenses: initialExpenses,
  categories: initialCategories,
  currency: 'USD',
});

type Store = ReturnType<typeof initializeStore>;

const storeContext = createContext<Store | null>(null);

const initializeStore = (
  preloadedState: Partial<StoreState> = {}
) => {
  return createStore<StoreState>()(
    persist(
      (set, get) => ({
        ...getDefaultInitialState(),
        ...preloadedState,
        addExpense: (expense) => {
          const newExpense = { ...expense, id: `exp-${new Date().getTime()}` };
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
          const newCategory = { ...category, id: `cat-${new Date().getTime()}` };
          set((state) => ({
            categories: [...state.categories, newCategory],
          }));
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
          set(getDefaultInitialState());
        },
      }),
      {
        name: 'budget-wise-storage',
        storage: createJSONStorage(() => localStorage),
      }
    )
  );
};


export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const store = useMemo(() => initializeStore(), []);
  return <storeContext.Provider value={store}>{children}</storeContext.Provider>;
};

export const useStore = () => {
  const store = useContext(storeContext);
  if (!store) throw new Error('Missing StoreProvider');
  return useZustandStore(store);
}
