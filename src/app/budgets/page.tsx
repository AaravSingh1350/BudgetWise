'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/lib/utils';
import Icon from '@/components/icons';
import { useStore } from '@/store';
import ManageBudgetsDialog from '@/components/manage-budgets-dialog';

function Budgets() {
  const { expenses, categories, currency, updateBudgets } = useStore();
  const [isManageBudgetsOpen, setManageBudgetsOpen] = useState(false);

  const spendingByCategory = categories.map((category) => {
    const categoryExpenses = expenses.filter(
      (expense) => expense.categoryId === category.id
    );
    const spent = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    return {
      ...category,
      spent,
      remaining: category.budget - spent,
      percentage: category.budget > 0 ? (spent / category.budget) * 100 : 0,
    };
  });

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header 
          onAddExpenseClick={() => {}}
          onManageBudgetsClick={() => setManageBudgetsOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Budgets</CardTitle>
                <CardDescription>View and manage your monthly budgets.</CardDescription>
              </div>
               <Button onClick={() => setManageBudgetsOpen(true)}>Manage Budgets</Button>
            </CardHeader>
            <CardContent className="grid gap-6">
              {spendingByCategory.map((category) => (
                <div key={category.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <Icon name={category.icon} className={`h-5 w-5 ${category.color}`} />
                      <span className="font-semibold">{category.name}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">{formatCurrency(category.spent, currency)}</span>
                      <span className="text-muted-foreground"> / {formatCurrency(category.budget, currency)}</span>
                    </div>
                  </div>
                  <Progress value={category.percentage} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2 text-right">
                    {formatCurrency(category.remaining, currency)} remaining
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </main>
      </div>
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

export default function BudgetsPage() {
  return <Budgets />;
}
