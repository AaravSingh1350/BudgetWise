'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from './ui/skeleton';
import Sidebar from './layout/sidebar';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen bg-background text-foreground overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <header className="flex-shrink-0 h-16 bg-card border-b flex items-center justify-between px-4 sm:px-6 md:px-8">
             <Skeleton className="h-8 w-32" />
             <div className="flex items-center gap-4">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-32" />
                <Skeleton className="h-9 w-9 rounded-full" />
             </div>
          </header>
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">
            <Skeleton className="h-full w-full" />
          </main>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Don't render anything while redirecting
  }

  return <>{children}</>;
};

export default AuthGuard;
