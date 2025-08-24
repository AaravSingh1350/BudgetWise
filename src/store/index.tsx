'use client';

import { createContext, useContext, useEffect, useMemo } from 'react';
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
  _fetchData: () => void;
}

const getDefaultInitialState = () => ({
  expenses: [],
  categories: initialCategories,
  currency: 'USD',
  isLoading: true,
});

type Store = ReturnType<typeof initializeStore>;

const storeContext = createContext<Store | null>(null);

// Helper to generate unique IDs
const generateId = () => `id_${Math.random().toString(36).substr(2, 9)}`;

export const initializeStore = () => {
  return createStore<StoreState>((set, get) => ({
    ...getDefaultInitialState(),
    _fetchData: () => {
      set({ isLoading: true });
      // Simulate loading data from a local source
      try {
        const storedData = localStorage.getItem('budgetwise-data');
        if (storedData) {
          const { expenses, categories, currency } = JSON.parse(storedData);
          set({ expenses, categories, currency });
        } else {
          // No stored data, use initial defaults
          set({
            expenses: [],
            categories: initialCategories,
            currency: 'USD',
          });
        }
      } catch (error) {
        console.error("Error fetching local data:", error);
        set(getDefaultInitialState());
      } finally {
        set({ isLoading: false });
      }
    },
    addExpense: (expense) => {
      const newExpense = { ...expense, id: generateId() };
      set((state) => {
        const newState = { ...state, expenses: [newExpense, ...state.expenses] };
        localStorage.setItem('budgetwise-data', JSON.stringify({
          expenses: newState.expenses,
          categories: newState.categories,
          currency: newState.currency,
        }));
        return { expenses: newState.expenses };
      });
    },
    editExpense: (updatedExpense) => {
      set((state) => {
        const expenses = state.expenses.map((expense) =>
          expense.id === updatedExpense.id ? updatedExpense : expense
        );
        localStorage.setItem('budgetwise-data', JSON.stringify({
          expenses,
          categories: state.categories,
          currency: state.currency,
        }));
        return { expenses };
      });
    },
    deleteExpense: (id) => {
      set((state) => {
        const expenses = state.expenses.filter((expense) => expense.id !== id);
        localStorage.setItem('budgetwise-data', JSON.stringify({
          expenses,
          categories: state.categories,
          currency: state.currency,
        }));
        return { expenses };
      });
    },
    addCategory: (category) => {
      const newCategory = { ...category, id: generateId() };
       set((state) => {
        const categories = [...state.categories, newCategory];
         localStorage.setItem('budgetwise-data', JSON.stringify({
          expenses: state.expenses,
          categories,
          currency: state.currency,
        }));
        return { categories };
       });
    },
    editCategory: (updatedCategory) => {
      set((state) => {
        const categories = state.categories.map((category) =>
          category.id === updatedCategory.id ? updatedCategory : category
        );
         localStorage.setItem('budgetwise-data', JSON.stringify({
          expenses: state.expenses,
          categories,
          currency: state.currency,
        }));
        return { categories };
      });
    },
    deleteCategory: (id) => {
       set((state) => {
         const categories = state.categories.filter((category) => category.id !== id);
         const expenses = state.expenses.filter((expense) => expense.categoryId !== id);
         localStorage.setItem('budgetwise-data', JSON.stringify({
          expenses,
          categories,
          currency: state.currency,
        }));
        return { categories, expenses };
       });
    },
    updateBudgets: (updatedCategories) => {
      set((state) => {
        localStorage.setItem('budgetwise-data', JSON.stringify({
          expenses: state.expenses,
          categories: updatedCategories,
          currency: state.currency,
        }));
        return { categories: updatedCategories };
      });
    },
    setCurrency: (currency) => {
      set((state) => {
        localStorage.setItem('budgetwise-data', JSON.stringify({
          expenses: state.expenses,
          categories: state.categories,
          currency,
        }));
        return { currency };
      });
    },
    resetData: () => {
      localStorage.removeItem('budgetwise-data');
      set(getDefaultInitialState());
      get()._fetchData();
    },
  }));
};

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const store = useMemo(() => initializeStore(), []);

  useEffect(() => {
    store.getState()._fetchData();
  }, [store]);

  return <storeContext.Provider value={store}>{children}</storeContext.Provider>;
};

export const useStore = () => {
  const store = useContext(storeContext);
  if (!store) throw new Error('Missing StoreProvider');
  return useZustandStore(store);
}