'use client';

import { Button } from '@/components/ui/button';
import { PlusCircle, Menu, Settings2, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useStore } from '@/store';
import { useAuth } from '@/hooks/use-auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from 'next/link';


type HeaderProps = {
  onAddExpenseClick?: () => void;
  onManageBudgetsClick?: () => void;
};

const Header = ({ onAddExpenseClick, onManageBudgetsClick }: HeaderProps) => {
  const { currency, setCurrency } = useStore();
  const { user, signOut } = useAuth();

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
          {onManageBudgetsClick && (
            <Button variant="outline" onClick={onManageBudgetsClick}>
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-9 w-9 cursor-pointer">
                 <AvatarImage src={user?.photoURL || "https://placehold.co/100x100.png"} alt={user?.displayName || "User"} data-ai-hint="person avatar" />
                 <AvatarFallback>{user?.displayName?.[0] || 'U'}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/settings">
                <DropdownMenuItem>
                  <Settings2 className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </>
  );
};

export default Header;
