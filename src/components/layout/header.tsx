'use client';

import { Button } from '@/components/ui/button';
import { PlusCircle, Menu, Settings2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useStore } from '@/store';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import SidebarNav from './sidebar-nav';
import Link from 'next/link';
import { PiggyBank } from 'lucide-react';

type HeaderProps = {
  title: string;
  onAddExpenseClick?: () => void;
  onManageBudgetsClick?: () => void;
};

const Header = ({ title, onAddExpenseClick, onManageBudgetsClick }: HeaderProps) => {
  const { currency, setCurrency } = useStore();

  return (
    <header className="flex-shrink-0 h-16 bg-card border-b flex items-center justify-between px-4 sm:px-6 md:px-8">
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
             <div className="h-16 flex items-center px-6 border-b">
              <Link href="/dashboard" className="flex items-center">
                <PiggyBank className="h-8 w-8 text-primary" />
                <h1 className="ml-3 text-xl font-bold">BudgetWise</h1>
              </Link>
            </div>
            <div className="p-4">
              <SidebarNav />
            </div>
          </SheetContent>
        </Sheet>
        <h1 className="text-xl font-semibold hidden md:block">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <Select value={currency} onValueChange={setCurrency}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USD">USD ($)</SelectItem>
            <SelectItem value="INR">INR (₹)</SelectItem>
          </SelectContent>
        </Select>
        {onManageBudgetsClick && (
          <Button variant="outline" onClick={onManageBudgetsClick} className="hidden sm:inline-flex">
            <Settings2 className="mr-2 h-4 w-4" />
            Manage Budgets
          </Button>
        )}
        {onAddExpenseClick && (
          <Button onClick={onAddExpenseClick}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
