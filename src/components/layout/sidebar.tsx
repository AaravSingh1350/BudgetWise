'use client';

import Link from 'next/link';
import { BrainCircuit } from 'lucide-react';
import MainSidebarNav from './main-sidebar-nav';

const Sidebar = () => {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-card border-r">
      <div className="h-16 flex items-center px-6 border-b">
        <Link href="/dashboard" className="flex items-center">
          <BrainCircuit className="h-8 w-8 text-primary" />
          <h1 className="ml-3 text-xl font-bold">BudgetWise</h1>
        </Link>
      </div>
      <div className="flex-1 px-4 py-6">
        <MainSidebarNav />
      </div>
      <div className="px-4 pb-6">
        <ins className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-3703887186622638"
          data-ad-slot="sidebar-ad"
          data-ad-format="auto"
          data-full-width-responsive="true"></ins>
        <script>{`(adsbygoogle = window.adsbygoogle || []).push({});`}</script>
      </div>
    </aside>
  );
};

export default Sidebar;
