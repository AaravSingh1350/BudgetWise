'use client';

import { useState } from 'react';
import { categories as initialCategories, expenses as initialExpenses } from '@/lib/data';
import type { Category, Expense } from '@/lib/types';
import Sidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';
import OverviewCards from '@/components/dashboard/overview-cards';
import SpendingChart from '@/components/dashboard/spending-chart';
import CategoryPieChart from '@/components/dashboard/category-pie-chart';
import RecentTransactions from '@/components/dashboard/recent-transactions';
import AiInsights from '@/components/dashboard/ai-insights';
import AddExpenseDialog from '@/components/add-expense-dialog';

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isAddExpenseOpen, setAddExpenseOpen] = useState(false);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = {
      ...expense,
      id: `exp-${new Date().getTime()}`,
    };
    setExpenses(prevExpenses => [newExpense, ...prevExpenses]);
  };

  const totalBudget = categories.reduce((sum, cat) => sum + cat.budget, 0);
  const totalSpending = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const spendingByCategory = categories.map((category) => {
    const categoryExpenses = expenses.filter(
      (expense) => expense.categoryId === category.id
    );
    const spent = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    return {
      ...category,
      spent,
    };
  });

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header categories={categories} onAddExpenseClick={() => setAddExpenseOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">
          <OverviewCards totalBudget={totalBudget} totalSpending={totalSpending} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <SpendingChart data={spendingByCategory} />
            </div>
            <div>
              <CategoryPieChart data={spendingByCategory} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <RecentTransactions expenses={expenses} categories={categories} />
             <AiInsights />
          </div>
        </main>
      </div>
      <AddExpenseDialog
        isOpen={isAddExpenseOpen}
        setIsOpen={setAddExpenseOpen}
        categories={categories}
        onAddExpense={addExpense}
      />
    </div>
  );
}
