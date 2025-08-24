import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Target, TrendingDown } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

type OverviewCardsProps = {
  totalBudget: number;
  totalSpending: number;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const OverviewCards = ({
  totalBudget,
  totalSpending,
}: OverviewCardsProps) => {
  const remainingBudget = totalBudget - totalSpending;
  const spendingPercentage =
    totalBudget > 0 ? (totalSpending / totalBudget) * 100 : 0;

  const cards = [
    {
      title: 'Total Budget',
      amount: formatCurrency(totalBudget),
      icon: <Target className="h-5 w-5 text-muted-foreground" />,
    },
    {
      title: 'Total Spent',
      amount: formatCurrency(totalSpending),
      icon: <TrendingDown className="h-5 w-5 text-muted-foreground" />,
    },
    {
      title: 'Remaining',
      amount: formatCurrency(remainingBudget),
      icon: <DollarSign className="h-5 w-5 text-muted-foreground" />,
    },
  ];

  return (
    <div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
            <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                {card.icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{card.amount}</div>
            </CardContent>
            </Card>>
        ))}
        </div>
        <Card className="mt-4">
            <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-muted-foreground">Monthly Spending Progress</p>
                    <p className="text-sm font-medium">{spendingPercentage.toFixed(0)}%</p>
                </div>
                <Progress value={spendingPercentage} className="w-full" />
            </CardContent>
        </Card>
    </div>
  );
};

export default OverviewCards;
