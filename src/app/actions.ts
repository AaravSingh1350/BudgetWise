'use server';

import { getSpendingInsights } from '@/ai/flows/spending-insights';
import { categories, expenses } from '@/lib/data';

export async function getAIInsightsAction() {
  try {
    const spendingData = JSON.stringify(expenses);
    const currentBudget = JSON.stringify(
      categories.map((c) => ({ category: c.name, budget: c.budget }))
    );

    if (!spendingData || !currentBudget) {
      throw new Error('Missing spending data or budget information.');
    }

    const insights = await getSpendingInsights({ spendingData, currentBudget });
    return { success: true, data: insights };
  } catch (error) {
    console.error('Error fetching AI insights:', error);
    return {
      success: false,
      error: 'Failed to generate insights. Please try again later.',
    };
  }
}
