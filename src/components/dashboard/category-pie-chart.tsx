'use client';

import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useMemo } from 'react';
import { formatCurrency } from '@/lib/utils';

type ChartData = {
  id: string;
  name:string;
  spent: number;
};

type CategoryPieChartProps = {
  data: ChartData[];
  currency: string;
};

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(200, 90%, 70%)'
];

const CategoryPieChart = ({ data, currency }: CategoryPieChartProps) => {
  
  const chartData = useMemo(() => data.filter(item => item.spent > 0), [data]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-card border rounded-md shadow-md">
          <p className="font-semibold">{`${payload[0].name}: ${formatCurrency(payload[0].value, currency)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
        <CardDescription>How your spending is distributed this month.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                cursor={{ fill: 'hsl(var(--muted))' }}
                content={<CustomTooltip />}
              />
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="spent"
                nameKey="name"
                stroke="hsl(var(--background))"
                strokeWidth={2}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend iconSize={10} wrapperStyle={{fontSize: "12px", paddingTop: "20px"}}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryPieChart;
