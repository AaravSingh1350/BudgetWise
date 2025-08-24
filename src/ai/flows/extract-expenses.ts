'use server';
/**
 * @fileOverview Extracts expense data from a JSON representation of a spreadsheet.
 *
 * - extractExpenses - An AI flow that parses expense data.
 * - ExtractExpensesInput - The input type for the extractExpenses function.
 * - ExtractExpensesOutput - The return type for the extractExpenses function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { format } from 'date-fns';

const ExtractExpensesInputSchema = z.object({
  fileContent: z.string().describe('JSON string representation of the spreadsheet data, typically an array of arrays.'),
  categories: z.string().describe('JSON string of available categories with their IDs and names, e.g., [{"id":"cat-1","name":"Groceries"}].'),
  currency: z.string().describe('The currency code for the amounts, e.g., "USD".'),
});
export type ExtractExpensesInput = z.infer<typeof ExtractExpensesInputSchema>;

const ExpenseSchema = z.object({
    description: z.string().describe('The description of the expense.'),
    amount: z.number().describe('The numerical amount of the expense.'),
    categoryId: z.string().describe("The ID of the category that best matches this expense. Must be one of the provided category IDs."),
    date: z.string().describe("The date of the expense in 'yyyy-MM-dd' format."),
});

const ExtractExpensesOutputSchema = z.object({
  expenses: z.array(ExpenseSchema).describe('An array of extracted expense objects.'),
});
export type ExtractExpensesOutput = z.infer<typeof ExtractExpensesOutputSchema>;

export async function extractExpenses(input: ExtractExpensesInput): Promise<ExtractExpensesOutput> {
  return extractExpensesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractExpensesPrompt',
  input: { schema: ExtractExpensesInputSchema },
  output: { schema: ExtractExpensesOutputSchema },
  prompt: `You are an expert at parsing and categorizing financial data from spreadsheets. Your task is to extract transaction details from the provided JSON data and format them according to the specified schema.

Today's date is ${format(new Date(), 'yyyy-MM-dd')}. Use this for interpreting relative dates like "yesterday" or "today".

Here are the available spending categories:
{{{categories}}}

Analyze the following spreadsheet data:
{{{fileContent}}}

Please perform the following actions:
1.  Identify the header row to determine the columns for date, description, amount, and category. These might not be in a consistent order.
2.  Iterate through each data row to extract the relevant information.
3.  For each transaction, intelligently map the provided category text to the most appropriate category ID from the list above. If a direct match isn't found, use your best judgment. For example, "Coffee shop" should map to "Dining Out". If no reasonable category can be determined, assign it to a sensible default like Groceries.
4.  Clean up the data:
    - Amounts may have currency symbols (e.g., "$", "₹") or be strings; convert them to a numeric format.
    - Dates can be in various formats (e.g., "MM/DD/YYYY", "DD-Mon-YY", "today"); standardize them to 'yyyy-MM-dd'.
5.  Return an array of expense objects, ensuring each object strictly follows the output schema.`,
});

const extractExpensesFlow = ai.defineFlow(
  {
    name: 'extractExpensesFlow',
    inputSchema: ExtractExpensesInputSchema,
    outputSchema: ExtractExpensesOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  },
);
