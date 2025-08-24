import Sidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function CategoriesPage() {
  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* @ts-ignore */}
        <Header />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
              <CardDescription>View and manage your spending categories.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Categories functionality will be implemented here.</p>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
