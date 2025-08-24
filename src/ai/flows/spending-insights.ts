'use server';

/**
 * @fileOverview Provides personalized spending insights and budget adjustment suggestions.
 *
 * - getSpendingInsights - Analyzes spending data and provides personalized insights.
 * - SpendingInsightsInput - The input type for the getSpendingInsights function.
 * - SpendingInsightsOutput - The return type for the getSpendingInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SpendingInsightsInputSchema = z.object({
  spendingData: z.string().describe('JSON string of user spending data, including categories, amounts, and dates.'),
  currentBudget: z.string().describe('JSON string of the current monthly budget goals for each spending category.'),
});
export type SpendingInsightsInput = z.infer<typeof SpendingInsightsInputSchema>;

const SpendingInsightsOutputSchema = z.object({
  spendingTrends: z.string().describe('A summary of identified spending trends, including unexpected charges and areas of overspending.'),
  budgetSuggestions: z.string().describe('Personalized budget adjustment suggestions based on spending trends and current budget goals.'),
});
export type SpendingInsightsOutput = z.infer<typeof SpendingInsightsOutputSchema>;

export async function getSpendingInsights(input: SpendingInsightsInput): Promise<SpendingInsightsOutput> {
  return spendingInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'spendingInsightsPrompt',
  input: {schema: SpendingInsightsInputSchema},
  output: {schema: SpendingInsightsOutputSchema},
  prompt: `You are a personal finance advisor. Analyze the user's spending data and provide personalized insights and budget adjustment suggestions.

Spending Data: {{{spendingData}}}
Current Budget: {{{currentBudget}}}

Identify spending trends, including any unexpected charges or areas where the user is overspending. Suggest realistic budget adjustments based on these trends and the user's current budget goals.

Format your repsonse for the user to easily understand.
`,
});

const spendingInsightsFlow = ai.defineFlow(
  {
    name: 'spendingInsightsFlow',
    inputSchema: SpendingInsightsInputSchema,
    outputSchema: SpendingInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
