'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

type ChartData = {
  name: string;
  budget: number;
  spent: number;
};

type SpendingChartProps = {
  data: ChartData[];
  currency: string;
};

const SpendingChart = ({ data, currency }: SpendingChartProps) => {
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-card border rounded-md shadow-md">
          <p className="font-semibold">{label}</p>
          <p style={{ color: 'hsl(var(--primary))' }}>{`Spent: ${formatCurrency(payload[1].value, currency)}`}</p>
          <p style={{ color: 'hsl(var(--secondary-foreground))' }}>{`Budget: ${formatCurrency(payload[0].value, currency)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending vs. Budget</CardTitle>
        <CardDescription>A look at your spending in each category compared to your budget.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(value) => formatCurrency(value, currency).replace(/\.00$/, '')} />
              <Tooltip
                cursor={{ fill: 'hsl(var(--muted))' }}
                content={<CustomTooltip />}
              />
              <Legend iconSize={10} wrapperStyle={{fontSize: "12px", paddingTop: "20px"}}/>
              <Bar dataKey="budget" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} name="Budget" />
              <Bar dataKey="spent" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Spent" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpendingChart;
