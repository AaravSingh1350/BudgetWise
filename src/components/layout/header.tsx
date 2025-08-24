'use client';

import { Button } from '@/components/ui/button';
import { PlusCircle, Menu, Settings2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {-private_useStore as useStore } from '@/store';

type HeaderProps = {
  onAddExpenseClick: () => void;
  onManageBudgetsClick: () => void;
};

const Header = ({ onAddExpenseClick, onManageBudgetsClick }: HeaderProps) => {
  const { currency, setCurrency } = useStore();

  return (
    <>
      <header className="flex-shrink-0 h-16 bg-card border-b flex items-center justify-between px-4 sm:px-6 md:px-8">
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
            </Button>
            <h1 className="text-xl font-semibold">Dashboard</h1>
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
          <Button variant="outline" onClick={onManageBudgetsClick}>
            <Settings2 className="mr-2 h-4 w-4" />
            Manage Budgets
          </Button>
          <Button onClick={onAddExpenseClick}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
          <Avatar className="h-9 w-9">
             <AvatarImage src="https://placehold.co/100x100.png" alt="User" data-ai-hint="person avatar" />
             <AvatarFallback>BW</AvatarFallback>
          </Avatar>
        </div>
      </header>
    </>
  );
};

export default Header;
