'use client';
import { BarChart, Leaf, Trash2, LineChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useRecyclingStore } from '@/hooks/use-recycling-store';
import { useMemo } from 'react';
import { format } from 'date-fns';

const chartConfig = {
  recycled: {
    label: 'Recycled',
    color: 'hsl(var(--chart-1))',
  },
  composted: {
    label: 'Composted',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;


export default function DashboardPage() {
  const { history, itemsSorted, wasteDiverted, feedback } = useRecyclingStore();
  
  const chartData = useMemo(() => {
    const monthlyData: { [key: string]: { recycled: number; composted: number } } = {};

    history.forEach(item => {
      const month = format(new Date(item.timestamp), 'yyyy-MM');
      if (!monthlyData[month]) {
        monthlyData[month] = { recycled: 0, composted: 0 };
      }
      if (item.rule.action === 'Recycle') {
        monthlyData[month].recycled += 1;
      } else if (item.rule.action === 'Compost') {
        monthlyData[month].composted += 1;
      }
    });

    const last6Months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        return {
            month: format(d, 'MMMM'),
            key: format(d, 'yyyy-MM'),
        }
    }).reverse();

    return last6Months.map(m => ({
      month: m.month,
      recycled: monthlyData[m.key]?.recycled || 0,
      composted: monthlyData[m.key]?.composted || 0,
    }));
  }, [history]);

  const landfillItems = useMemo(() => {
    return history.filter(item => item.rule.action === 'Landfill' || item.rule.action === 'Special Drop-off').length;
  }, [history]);
  
  const accuracy = useMemo(() => {
    const totalFeedback = feedback.correct + feedback.incorrect;
    if (totalFeedback === 0) {
      return 100;
    }
    return (feedback.correct / totalFeedback) * 100;
  }, [feedback]);

  return (
    <div className="flex-1 space-y-8 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="font-headline text-3xl font-bold tracking-tight">Impact Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items Scanned</CardTitle>
            <BarChart className="h-4 w-4 text-secondary-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{itemsSorted}</div>
            <p className="text-xs text-secondary-foreground">items processed since you started</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Waste Diverted from Landfill</CardTitle>
            <Leaf className="h-4 w-4 text-secondary-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wasteDiverted} kg</div>
            <p className="text-xs text-secondary-foreground">estimated total diversion</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
            <LineChart className="h-4 w-4 text-secondary-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accuracy.toFixed(1)}%</div>
            <p className="text-xs text-secondary-foreground">based on your feedback</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Landfill Items</CardTitle>
            <Trash2 className="h-4 w-4 text-secondary-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{landfillItems}</div>
            <p className="text-xs text-secondary-foreground">items that were not recyclable</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Diversion Overview</CardTitle>
          <CardDescription>Recycled vs. Composted items over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer>
              <RechartsBarChart data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                <Legend content={<ChartLegendContent />} />
                <Bar dataKey="recycled" fill="var(--color-recycled)" radius={4} />
                <Bar dataKey="composted" fill="var(--color-composted)" radius={4} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
