'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { Category } from '@/lib/types';
import { useEffect } from 'react';
import { icons } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Icon from './icons';

const iconNames = Object.keys(icons);
const colors = [
  'text-emerald-500',
  'text-blue-500',
  'text-purple-500',
  'text-orange-500',
  'text-yellow-500',
  'text-red-500',
  'text-pink-500',
  'text-indigo-500',
];

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  icon: z.string().min(1, 'Please select an icon.'),
  color: z.string().min(1, 'Please select a color.'),
  budget: z.coerce.number().min(0, 'Budget must be a positive number.'),
});

type ManageCategoryDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSave: (category: Omit<Category, 'id'>, id?: string) => void;
  categoryToEdit?: Category;
};

const ManageCategoryDialog = ({
  isOpen,
  setIsOpen,
  onSave,
  categoryToEdit,
}: ManageCategoryDialogProps) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      icon: 'ShoppingCart',
      color: 'text-emerald-500',
      budget: 0,
    },
  });

  useEffect(() => {
    if (categoryToEdit) {
      form.reset(categoryToEdit);
    } else {
      form.reset({
        name: '',
        icon: 'ShoppingCart',
        color: 'text-emerald-500',
        budget: 0,
      });
    }
  }, [categoryToEdit, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    onSave(values, categoryToEdit?.id);
    toast({
      title: categoryToEdit ? 'Category Updated' : 'Category Added',
      description: `Successfully ${categoryToEdit ? 'updated' : 'added'} ${values.name}.`,
    });
    setIsOpen(false);
    form.reset();
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{categoryToEdit ? 'Edit Category' : 'Add New Category'}</DialogTitle>
          <DialogDescription>
            {categoryToEdit ? 'Update the details of your category.' : 'Create a new category for your expenses.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Groceries" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Budget</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                   <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an icon" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {iconNames.map((iconName) => (
                        <SelectItem key={iconName} value={iconName}>
                          <div className="flex items-center">
                            <Icon name={iconName} className="mr-2 h-4 w-4" />
                            {iconName}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                   <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a color" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {colors.map((color) => (
                        <SelectItem key={color} value={color}>
                          <div className="flex items-center">
                            <div className={`w-4 h-4 rounded-full ${color.replace('text-', 'bg-')} mr-2`}></div>
                            {color.split('-')[1]}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{categoryToEdit ? 'Save Changes' : 'Add Category'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ManageCategoryDialog;
