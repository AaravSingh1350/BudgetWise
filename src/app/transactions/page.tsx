'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/icons';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import {-private_useStore as useStore } from '@/store';
import AddExpenseDialog from '@/components/add-expense-dialog';
import type { Expense } from '@/lib/types';
import { Edit, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


export default function TransactionsPage() {
  const { expenses, categories, currency, addExpense, editExpense, deleteExpense } = useStore();
  const [isAddExpenseOpen, setAddExpenseOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>(undefined);
  const categoryMap = new Map(categories.map((cat) => [cat.id, cat]));

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setAddExpenseOpen(true);
  }
  
  const handleAddOrEditExpense = (expenseData: Omit<Expense, 'id'>, id?: string) => {
    if (id) {
      editExpense({ ...expenseData, id });
    } else {
      addExpense(expenseData);
    }
    setEditingExpense(undefined);
  };
  
  const handleDialogClose = () => {
    setEditingExpense(undefined);
    setAddExpenseOpen(false);
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header 
          onAddExpenseClick={() => setAddExpenseOpen(true)}
          onManageBudgetsClick={() => {}}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Transactions</CardTitle>
                <CardDescription>View and manage your transactions.</CardDescription>
              </div>
              <Button onClick={() => setAddExpenseOpen(true)}>Add Transaction</Button>
            </CardHeader>
            <CardContent>
               <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="hidden sm:table-cell">Category</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.map((expense) => {
                    const category = categoryMap.get(expense.categoryId);
                    return (
                      <TableRow key={expense.id}>
                        <TableCell>
                          <div className="font-medium">{expense.description}</div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {category && (
                            <Badge variant="outline" className="flex items-center w-fit">
                              <Icon name={category.icon} className={`mr-1 h-3 w-3 ${category.color}`} />
                              {category.name}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{format(new Date(expense.date), 'MMM d, yyyy')}</TableCell>
                        <TableCell className="text-right">{formatCurrency(expense.amount, currency)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(expense)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete this transaction.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteExpense(expense.id)}>Continue</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
      <AddExpenseDialog
        isOpen={isAddExpenseOpen}
        setIsOpen={handleDialogClose}
        categories={categories}
        onAddExpense={(expense) => handleAddOrEditExpense(expense, editingExpense?.id)}
        currency={currency}
        expenseToEdit={editingExpense}
      />
    </div>
  );
}
