'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { Category } from '@/lib/types';

type ManageBudgetsDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  categories: Category[];
  onUpdateBudgets: (updatedCategories: Category[]) => void;
};

const ManageBudgetsDialog = ({
  isOpen,
  setIsOpen,
  categories,
  onUpdateBudgets,
}: ManageBudgetsDialogProps) => {
  const { toast } = useToast();
  const [localBudgets, setLocalBudgets] = useState<Record<string, number>>({});

  useEffect(() => {
    if (isOpen) {
      const budgetMap = categories.reduce((acc, category) => {
        acc[category.id] = category.budget;
        return acc;
      }, {} as Record<string, number>);
      setLocalBudgets(budgetMap);
    }
  }, [isOpen, categories]);

  const handleBudgetChange = (categoryId: string, value: string) => {
    const amount = Number(value);
    if (!isNaN(amount)) {
      setLocalBudgets(prev => ({ ...prev, [categoryId]: amount }));
    }
  };

  function onSubmit() {
    const updatedCategories = categories.map(category => ({
      ...category,
      budget: localBudgets[category.id] ?? category.budget,
    }));
    onUpdateBudgets(updatedCategories);
    toast({
      title: 'Budgets Updated',
      description: 'Your category budgets have been saved.',
    });
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Budgets</DialogTitle>
          <DialogDescription>
            Update your monthly budget for each category.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {categories.map((category) => (
            <div key={category.id} className="grid grid-cols-2 items-center gap-4">
              <Label htmlFor={`budget-${category.id}`}>{category.name}</Label>
              <Input
                id={`budget-${category.id}`}
                type="number"
                value={localBudgets[category.id] ?? ''}
                onChange={(e) => handleBudgetChange(category.id, e.target.value)}
                placeholder="0.00"
              />
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button type="button" onClick={onSubmit}>Save Budgets</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ManageBudgetsDialog;
