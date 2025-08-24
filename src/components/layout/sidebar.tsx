'use client';

import Link from 'next/link';
import { PiggyBank } from 'lucide-react';
import SidebarNav from './sidebar-nav';

const Sidebar = () => {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-card border-r">
      <div className="h-16 flex items-center px-6 border-b">
        <Link href="/dashboard" className="flex items-center">
          <PiggyBank className="h-8 w-8 text-primary" />
          <h1 className="ml-3 text-xl font-bold">BudgetWise</h1>
        </Link>
      </div>
      <div className="flex-1 px-4 py-6">
        <SidebarNav />
      </div>
    </aside>
  );
};

export default Sidebar;
