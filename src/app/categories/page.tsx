'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/icons';
import { Edit, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useStore } from '@/store';
import ManageCategoryDialog from '@/components/manage-category-dialog';
import type { Category } from '@/lib/types';

function Categories() {
  const { categories, deleteCategory, addCategory, editCategory } = useStore();
  const [isManageCategoryOpen, setManageCategoryOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setManageCategoryOpen(true);
  };

  const handleAddOrEditCategory = (categoryData: Omit<Category, 'id'>, id?: string) => {
    if (id) {
      editCategory({ ...categoryData, id });
    } else {
      addCategory(categoryData);
    }
    setEditingCategory(undefined);
  };
  
  const handleDialogClose = () => {
    setEditingCategory(undefined);
    setManageCategoryOpen(false);
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Categories" />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Categories</CardTitle>
                <CardDescription>View and manage your spending categories.</CardDescription>
              </div>
              <Button onClick={() => setManageCategoryOpen(true)}>Add Category</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                         <Badge variant="outline" className="flex items-center w-fit">
                            <Icon name={category.icon} className={`mr-2 h-4 w-4 ${category.color}`} />
                            {category.name}
                          </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(category)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete this category and all associated expenses.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteCategory(category.id)}>Continue</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
      <ManageCategoryDialog 
        isOpen={isManageCategoryOpen}
        setIsOpen={handleDialogClose}
        onSave={handleAddOrEditCategory}
        categoryToEdit={editingCategory}
      />
    </div>
  );
}

export default function CategoriesPage() {
  return <Categories />;
}
