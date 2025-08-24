'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '@/components/icons';
import { Settings, Upload } from 'lucide-react';

const SidebarNav = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', icon: 'LayoutDashboard', href: '/dashboard' },
    { name: 'Transactions', icon: 'Wallet', href: '/transactions' },
    { name: 'Budgets', icon: 'Target', href: '/budgets' },
    { name: 'Categories', icon: 'GanttChartSquare', href: '/categories' },
    { name: 'Import', icon: 'Upload', href: '/import' },
  ];

  return (
    <div className="flex flex-col h-full">
      <nav className="flex-1 space-y-2">
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
      <div className="mt-auto">
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
    </div>
  );
};

export default SidebarNav;
