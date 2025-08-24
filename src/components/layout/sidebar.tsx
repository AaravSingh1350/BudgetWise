import Icon from '@/components/icons';
import { PiggyBank, LayoutDashboard, Wallet, Settings } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', icon: 'LayoutDashboard', href: '#', active: true },
    { name: 'Transactions', icon: 'Wallet', href: '#', active: false },
    { name: 'Budgets', icon: 'Target', href: '#', active: false },
    { name: 'Categories', icon: 'GanttChartSquare', href: '#', active: false },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-card border-r">
      <div className="h-16 flex items-center px-6 border-b">
        <PiggyBank className="h-8 w-8 text-primary" />
        <h1 className="ml-3 text-xl font-bold">BudgetWise</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              item.active
                ? 'bg-primary/20 text-primary-foreground-dark font-semibold'
                : 'text-muted-foreground hover:bg-muted/50'
            }`}
          >
            <Icon name={item.icon} className="mr-3 h-5 w-5" />
            <span>{item.name}</span>
          </a>
        ))}
      </nav>
      <div className="px-4 py-6 border-t">
        <a
          href="#"
          className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted/50"
        >
          <Settings className="mr-3 h-5 w-5" />
          <span>Settings</span>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
