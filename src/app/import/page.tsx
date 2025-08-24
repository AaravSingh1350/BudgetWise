'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';
import Sidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStore } from '@/store';
import { useToast } from '@/hooks/use-toast';
import { extractExpenses } from '@/ai/flows/extract-expenses';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import Icon from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import type { Expense } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

function ImportPage() {
  const { addExpense, categories, currency } = useStore();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedExpenses, setExtractedExpenses] = useState<Omit<Expense, 'id'>[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const processFile = async () => {
    if (!file) {
      toast({
        title: 'No file selected',
        description: 'Please select an Excel file to process.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    setExtractedExpenses([]);
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const result = await extractExpenses({
          fileContent: JSON.stringify(jsonData),
          categories: JSON.stringify(categories.map(c => ({ id: c.id, name: c.name }))),
          currency,
        });
        
        if (result && result.expenses) {
          setExtractedExpenses(result.expenses);
        } else {
           toast({
            title: 'Extraction Failed',
            description: 'Could not extract expenses from the file. Please check the file format.',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Error processing file:', error);
        toast({
          title: 'Error',
          description: 'An unexpected error occurred while processing the file.',
          variant: 'destructive',
        });
      } finally {
        setIsProcessing(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };
  
  const handleImport = () => {
    extractedExpenses.forEach(expense => addExpense(expense));
    toast({
      title: 'Import Successful',
      description: `${extractedExpenses.length} expenses have been added to your transactions.`,
    });
    setExtractedExpenses([]);
    setFile(null);
  };

  const categoryMap = new Map(categories.map((cat) => [cat.id, cat]));

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Import Expenses" />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Import from Excel</CardTitle>
              <CardDescription>
                Upload an Excel file (.xlsx) with your transactions. The AI will attempt to extract the description, amount, date, and category.
                <br />
                Ensure your file has columns like 'Date', 'Description', 'Amount', and 'Category'.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Input type="file" accept=".xlsx" onChange={handleFileChange} className="max-w-xs" />
                <Button onClick={processFile} disabled={!file || isProcessing}>
                  {isProcessing ? 'Processing...' : 'Process File'}
                </Button>
              </div>

              {isProcessing && (
                 <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                 </div>
              )}

              {extractedExpenses.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Extracted Transactions (Preview)</h3>
                  <p className="text-sm text-muted-foreground mb-4">Review the extracted expenses before importing them.</p>
                  <Card>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Description</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {extractedExpenses.map((expense, index) => {
                             const category = categoryMap.get(expense.categoryId);
                             return (
                              <TableRow key={index}>
                                <TableCell>{expense.description}</TableCell>
                                <TableCell>
                                   {category && (
                                    <Badge variant="outline" className="flex items-center w-fit">
                                      <Icon name={category.icon} className={`mr-1 h-3 w-3 ${category.color}`} />
                                      {category.name}
                                    </Badge>
                                  )}
                                </TableCell>
                                <TableCell>{format(new Date(expense.date), 'MMM d, yyyy')}</TableCell>
                                <TableCell className="text-right">{formatCurrency(expense.amount, currency)}</TableCell>
                              </TableRow>
                             )
                          })}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                   <div className="mt-4 flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setExtractedExpenses([])}>Cancel</Button>
                      <Button onClick={handleImport}>Import {extractedExpenses.length} Expenses</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

export default function ImportExpensesPage() {
    return <ImportPage />
}
