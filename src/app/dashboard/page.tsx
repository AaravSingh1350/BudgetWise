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
import ManageBudgetsDialog from '@/components/manage-budgets-dialog';
import {-private_useStore as useStore } from '@/store';

export default function DashboardPage() {
  const { 
    expenses, 
    categories, 
    currency,
    addExpense,
    updateBudgets,
    setCurrency,
  } = useStore();

  const [isAddExpenseOpen, setAddExpenseOpen] = useState(false);
  const [isManageBudgetsOpen, setManageBudgetsOpen] = useState(false);

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
        <Header 
          onAddExpenseClick={() => setAddExpenseOpen(true)}
          onManageBudgetsClick={() => setManageBudgetsOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">
          <OverviewCards totalBudget={totalBudget} totalSpending={totalSpending} currency={currency} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <SpendingChart data={spendingByCategory} currency={currency} />
            </div>
            <div>
              <CategoryPieChart data={spendingByCategory} currency={currency} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <RecentTransactions expenses={expenses} categories={categories} currency={currency} />
             <AiInsights />
          </div>
        </main>
      </div>
      <AddExpenseDialog
        isOpen={isAddExpenseOpen}
        setIsOpen={setAddExpenseOpen}
        categories={categories}
        onAddExpense={addExpense}
        currency={currency}
      />
      <ManageBudgetsDialog
        isOpen={isManageBudgetsOpen}
        setIsOpen={setManageBudgetsOpen}
        categories={categories}
        onUpdateBudgets={updateBudgets}
        currency={currency}
      />
    </div>
  );
}
