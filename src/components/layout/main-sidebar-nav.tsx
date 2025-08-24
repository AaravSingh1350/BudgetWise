'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '@/components/icons';

const NavLink = ({ href, icon, name }: { href: string; icon: string; name: string }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-muted'
      }`}
    >
      <Icon name={icon} className="mr-3 h-5 w-5" />
      <span>{name}</span>
    </Link>
  );
};

const MainSidebarNav = () => {
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
        {navItems.map((item) => (
          <NavLink key={item.name} {...item} />
        ))}
      </nav>
      <div className="mt-auto">
        <NavLink href="/settings" icon="Settings" name="Settings" />
      </div>
    </div>
  );
};

export default MainSidebarNav;
