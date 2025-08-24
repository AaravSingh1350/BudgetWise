import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/icons';
import type { Expense, Category } from '@/lib/types';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/utils';

type RecentTransactionsProps = {
  expenses: Expense[];
  categories: Category[];
  currency: string;
};

const RecentTransactions = ({ expenses, categories, currency }: RecentTransactionsProps) => {
  const categoryMap = new Map(categories.map((cat) => [cat.id, cat]));
  const recentExpenses = expenses.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Here are your most recent expenses.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead className="hidden sm:table-cell">Category</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentExpenses.map((expense) => {
              const category = categoryMap.get(expense.categoryId);
              return (
                <TableRow key={expense.id}>
                  <TableCell>
                    <div className="font-medium">{expense.description}</div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {category && (
                      <Badge variant="outline" className="flex items-center w-fit">
                        <Icon name={category.icon} className={`mr-1 h-3 w-3 ${category.color}`} />
                        {category.name}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{format(new Date(expense.date), 'MMM d, yyyy')}</TableCell>
                  <TableCell className="text-right">{formatCurrency(expense.amount, currency)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
