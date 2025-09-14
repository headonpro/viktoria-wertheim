'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart } from '@tremor/react';

const chartData = [
  {
    date: 'Jan',
    '1. Mannschaft': 450,
    '2. Mannschaft': 280,
    'Jugend': 320,
  },
  {
    date: 'Feb',
    '1. Mannschaft': 520,
    '2. Mannschaft': 310,
    'Jugend': 340,
  },
  {
    date: 'Mär',
    '1. Mannschaft': 480,
    '2. Mannschaft': 290,
    'Jugend': 360,
  },
  {
    date: 'Apr',
    '1. Mannschaft': 610,
    '2. Mannschaft': 350,
    'Jugend': 380,
  },
  {
    date: 'Mai',
    '1. Mannschaft': 580,
    '2. Mannschaft': 320,
    'Jugend': 400,
  },
  {
    date: 'Jun',
    '1. Mannschaft': 640,
    '2. Mannschaft': 380,
    'Jugend': 420,
  },
];

const dataFormatter = (number: number) => {
  return Intl.NumberFormat('de').format(number).toString();
};

export default function AttendanceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Zuschauerzahlen</CardTitle>
      </CardHeader>
      <CardContent>
        <AreaChart
          className="h-72 mt-4"
          data={chartData}
          index="date"
          categories={['1. Mannschaft', '2. Mannschaft', 'Jugend']}
          colors={['blue', 'cyan', 'indigo']}
          valueFormatter={dataFormatter}
          yAxisWidth={60}
          onValueChange={() => {}}
        />
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Durchschnitt</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">523</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Maximum</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">640</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Trend</p>
            <p className="text-lg font-semibold text-green-600 dark:text-green-400">+18%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}