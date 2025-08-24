'use client';

import { createContext, useContext, useEffect, useMemo } from 'react';
import { createStore, useStore as useZustandStore } from 'zustand';
import type { Category, Expense } from '@/lib/types';
import { categories as initialCategories } from '@/lib/data';
import { useAuth } from '@/hooks/use-auth.tsx';
import { db, auth } from '@/lib/firebase';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  writeBatch,
  query,
  getDocs,
  deleteDoc,
  addDoc,
  updateDoc,
} from 'firebase/firestore';


interface StoreState {
  expenses: Expense[];
  categories: Category[];
  currency: string;
  isLoading: boolean;
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  editExpense: (expense: Expense) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  editCategory: (category: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  updateBudgets: (updatedCategories: Category[]) => Promise<void>;
  setCurrency: (currency: string) => void;
  resetData: () => Promise<void>;
  _fetchData: (userId: string) => Promise<void>;
  _resetStore: () => void;
}

const getDefaultInitialState = () => ({
  expenses: [],
  categories: initialCategories,
  currency: 'USD',
  isLoading: true,
});

type Store = ReturnType<typeof initializeStore>;

const storeContext = createContext<Store | null>(null);

export const initializeStore = () => {
  return createStore<StoreState>((set, get) => ({
    ...getDefaultInitialState(),
    _fetchData: async (userId) => {
      set({ isLoading: true });
      try {
        const userDocRef = doc(db, 'users', userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const categoriesQuery = query(collection(db, 'users', userId, 'categories'));
          const expensesQuery = query(collection(db, 'users', userId, 'expenses'));

          const [categoriesSnapshot, expensesSnapshot] = await Promise.all([
            getDocs(categoriesQuery),
            getDocs(expensesQuery),
          ]);
          
          const categories = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Category[];
          const expenses = expensesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Expense[];
          
          set({ 
            categories: categories.length > 0 ? categories : initialCategories,
            expenses, 
            currency: userData.currency || 'USD',
          });

        } else {
          // New user, create initial data
          await setDoc(userDocRef, { currency: 'USD' });
          const batch = writeBatch(db);
          initialCategories.forEach(category => {
            const newCatRef = doc(collection(db, 'users', userId, 'categories'));
            batch.set(newCatRef, {
              name: category.name,
              icon: category.icon,
              color: category.color,
              budget: category.budget,
            });
          });
          await batch.commit();
          await get()._fetchData(userId); // Refetch after creation
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        set({ isLoading: false });
      }
    },
    addExpense: async (expense) => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const newExpenseRef = await addDoc(collection(db, 'users', user.uid, 'expenses'), expense);
        set((state) => ({ expenses: [{ ...expense, id: newExpenseRef.id }, ...state.expenses] }));
      } catch (error) {
        console.error("Error adding expense:", error);
      }
    },
    editExpense: async (updatedExpense) => {
      const user = auth.currentUser;
      if (!user) return;
      const { id, ...expenseData } = updatedExpense;
      try {
        const expenseRef = doc(db, 'users', user.uid, 'expenses', id);
        await updateDoc(expenseRef, expenseData);
        set((state) => ({
          expenses: state.expenses.map((expense) =>
            expense.id === id ? updatedExpense : expense
          ),
        }));
      } catch (error) {
        console.error("Error editing expense:", error);
      }
    },
    deleteExpense: async (id) => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'expenses', id));
        set((state) => ({
          expenses: state.expenses.filter((expense) => expense.id !== id),
        }));
      } catch (error) {
        console.error("Error deleting expense:", error);
      }
    },
    addCategory: async (category) => {
       const user = auth.currentUser;
       if (!user) return;
       try {
        const newCategoryRef = await addDoc(collection(db, 'users', user.uid, 'categories'), category);
        set((state) => ({
          categories: [...state.categories, { ...category, id: newCategoryRef.id }],
        }));
       } catch (error) {
         console.error("Error adding category:", error);
       }
    },
    editCategory: async (updatedCategory) => {
      const user = auth.currentUser;
      if (!user) return;
      const { id, ...categoryData } = updatedCategory;
      try {
        await updateDoc(doc(db, 'users', user.uid, 'categories', id), categoryData);
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id === id ? updatedCategory : category
          ),
        }));
      } catch (error) {
        console.error("Error editing category:", error);
      }
    },
    deleteCategory: async (id) => {
       const user = auth.currentUser;
       if (!user) return;
       try {
        await deleteDoc(doc(db, 'users', user.uid, 'categories', id));
        set((state) => ({
          categories: state.categories.filter((category) => category.id !== id),
          expenses: state.expenses.filter((expense) => expense.categoryId !== id),
        }));
        // Note: This only removes expenses from state. A more robust solution
        // would also delete associated expenses from Firestore.
       } catch (error) {
         console.error("Error deleting category:", error);
       }
    },
    updateBudgets: async (updatedCategories) => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const batch = writeBatch(db);
        updatedCategories.forEach(cat => {
          const { id, ...catData } = cat;
          const catRef = doc(db, 'users', user.uid, 'categories', id);
          batch.update(catRef, { budget: catData.budget });
        });
        await batch.commit();
        set({ categories: updatedCategories });
      } catch (error) {
        console.error("Error updating budgets:", error);
      }
    },
    setCurrency: async (currency) => {
      const user = auth.currentUser;
      if (user) {
        try {
          await setDoc(doc(db, 'users', user.uid), { currency }, { merge: true });
        } catch (error) {
          console.error("Error setting currency:", error);
        }
      }
      set({ currency });
    },
    resetData: async () => {
      const user = auth.currentUser;
      if (!user) return;
      set({ isLoading: true });
      try {
        // Delete all expenses and categories
        const expensesQuery = query(collection(db, 'users', user.uid, 'expenses'));
        const categoriesQuery = query(collection(db, 'users', user.uid, 'categories'));
        const [expensesSnap, categoriesSnap] = await Promise.all([getDocs(expensesQuery), getDocs(categoriesQuery)]);
        const batch = writeBatch(db);
        expensesSnap.docs.forEach(doc => batch.delete(doc.ref));
        categoriesSnap.docs.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
        // Reset to initial state and re-create default categories
        set(getDefaultInitialState());
        await get()._fetchData(user.uid);
      } catch (error) {
        console.error("Error resetting data:", error);
      } finally {
        set({ isLoading: false });
      }
    },
    _resetStore: () => {
      set(getDefaultInitialState());
    }
  }));
};

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const store = useMemo(() => initializeStore(), []);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      store.getState()._fetchData(user.uid);
    } else {
      store.getState()._resetStore();
    }
  }, [user, store]);

  return <storeContext.Provider value={store}>{children}</storeContext.Provider>;
};

export const useStore = () => {
  const store = useContext(storeContext);
  if (!store) throw new Error('Missing StoreProvider');
  return useZustandStore(store);
}
