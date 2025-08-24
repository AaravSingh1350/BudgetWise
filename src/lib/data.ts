import type { Category, Expense } from './types';

export const categories: Category[] = [
  { id: 'cat-1', name: 'Groceries', icon: 'ShoppingCart', color: 'text-emerald-500', budget: 400 },
  { id: 'cat-2', name: 'Transportation', icon: 'Bus', color: 'text-blue-500', budget: 150 },
  { id: 'cat-3', name: 'Entertainment', icon: 'Film', color: 'text-purple-500', budget: 200 },
  { id: 'cat-4', name: 'Dining Out', icon: 'Utensils', color: 'text-orange-500', budget: 250 },
  { id: 'cat-5', name: 'Utilities', icon: 'Lightbulb', color: 'text-yellow-500', budget: 180 },
  { id: 'cat-6', name: 'Health', icon: 'HeartPulse', color: 'text-red-500', budget: 100 },
];

export const expenses: Expense[] = [];
