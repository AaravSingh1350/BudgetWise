'use client';

import { useState } from 'react';
import { Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getAIInsightsAction } from '@/app/actions';
import type { SpendingInsightsOutput } from '@/ai/flows/spending-insights';
import { Skeleton } from '@/components/ui/skeleton';

const AiInsights = () => {
  const [insights, setInsights] = useState<SpendingInsightsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetInsights = async () => {
    setIsLoading(true);
    setError(null);
    setInsights(null);
    try {
      const result = await getAIInsightsAction();
      if (result.success && result.data) {
        setInsights(result.data);
      } else {
        setError(result.error || 'An unknown error occurred.');
      }
    } catch (e) {
      setError('Failed to fetch insights.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="text-accent h-6 w-6" />
          AI-Powered Insights
        </CardTitle>
        <CardDescription>
          Get personalized insights and budget suggestions based on your spending habits.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!insights && !isLoading && (
          <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground mb-4">Click the button to generate your financial insights.</p>
            <Button onClick={handleGetInsights} disabled={isLoading}>
              {isLoading ? 'Generating...' : 'Generate Insights'}
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-6 w-1/4 mt-4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        )}

        {error && <p className="text-destructive">{error}</p>}

        {insights && (
          <div className="space-y-6 text-sm">
            <div>
              <h3 className="font-semibold mb-2">Spending Trends</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{insights.spendingTrends}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Budget Suggestions</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{insights.budgetSuggestions}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AiInsights;
