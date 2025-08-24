import type { Category, Expense } from './types';

export const categories: Category[] = [
  { id: 'cat-1', name: 'Groceries', icon: 'ShoppingCart', color: 'text-emerald-500', budget: 400 },
  { id: 'cat-2', name: 'Transportation', icon: 'Bus', color: 'text-blue-500', budget: 150 },
  { id: 'cat-3', name: 'Entertainment', icon: 'Film', color: 'text-purple-500', budget: 200 },
  { id: 'cat-4', name: 'Dining Out', icon: 'Utensils', color: 'text-orange-500', budget: 250 },
  { id: 'cat-5', name: 'Utilities', icon: 'Lightbulb', color: 'text-yellow-500', budget: 180 },
  { id: 'cat-6', name: 'Health', icon: 'HeartPulse', color: 'text-red-500', budget: 100 },
];

export const expenses: Expense[] = [
  { id: 'exp-1', description: 'Weekly groceries', amount: 85.60, categoryId: 'cat-1', date: '2024-07-28' },
  { id: 'exp-2', description: 'Gasoline', amount: 45.00, categoryId: 'cat-2', date: '2024-07-27' },
  { id: 'exp-3', description: 'Movie tickets', amount: 32.50, categoryId: 'cat-3', date: '2024-07-26' },
  { id: 'exp-4', description: 'Dinner with friends', amount: 67.80, categoryId: 'cat-4', date: '2024-07-25' },
  { id: 'exp-5', description: 'Electricity bill', amount: 75.00, categoryId: 'cat-5', date: '2024-07-25' },
  { id: 'exp-6', description: 'Pharmacy', amount: 22.30, categoryId: 'cat-6', date: '2024-07-24' },
  { id: 'exp-7', description: 'More groceries', amount: 55.20, categoryId: 'cat-1', date: '2024-07-22' },
  { id: 'exp-8', description: 'Bus fare', amount: 2.75, categoryId: 'cat-2', date: '2024-07-21' },
  { id: 'exp-9', description: 'Lunch', amount: 15.40, categoryId: 'cat-4', date: '2024-07-20' },
  { id: 'exp-10', description: 'Internet bill', amount: 60.00, categoryId: 'cat-5', date: '2024-07-19' },
];
