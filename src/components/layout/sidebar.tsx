'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '@/components/icons';
import { PiggyBank, Settings } from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', icon: 'LayoutDashboard', href: '/dashboard' },
    { name: 'Transactions', icon: 'Wallet', href: '/transactions' },
    { name: 'Budgets', icon: 'Target', href: '/budgets' },
    { name: 'Categories', icon: 'GanttChartSquare', href: '/categories' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-card border-r">
      <div className="h-16 flex items-center px-6 border-b">
        <Link href="/dashboard" className="flex items-center">
          <PiggyBank className="h-8 w-8 text-primary" />
          <h1 className="ml-3 text-xl font-bold">BudgetWise</h1>
        </Link>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <Icon name={item.icon} className="mr-3 h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="px-4 py-6 border-t">
        <Link
          href="/settings"
          className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            pathname === '/settings'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          <Settings className="mr-3 h-5 w-5" />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
