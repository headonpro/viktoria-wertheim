'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface MatchStatisticsChartProps {
  data?: {
    wins: number;
    draws: number;
    losses: number;
  };
}

export default function MatchStatisticsChart({ data }: MatchStatisticsChartProps) {
  const chartData = [
    { name: 'Siege', value: data?.wins || 0, color: '#10b981' },
    { name: 'Unentschieden', value: data?.draws || 0, color: '#f59e0b' },
    { name: 'Niederlagen', value: data?.losses || 0, color: '#ef4444' },
  ];

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spielstatistik</CardTitle>
        <CardDescription>
          Verteilung der Spielergebnisse
        </CardDescription>
      </CardHeader>
      <CardContent>
        {total > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(props: any) => {
                  const { name, value, percent } = props;
                  return `${name}: ${value} (${(percent * 100).toFixed(0)}%)`;
                }}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            Keine Daten verfügbar
          </div>
        )}
      </CardContent>
    </Card>
  );
}