'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart } from '@tremor/react';

const chartData = [
  {
    name: 'Mitgliedsbeiträge',
    'Einnahmen': 12500,
  },
  {
    name: 'Sponsoring',
    'Einnahmen': 8900,
  },
  {
    name: 'Eintrittsgelder',
    'Einnahmen': 4200,
  },
  {
    name: 'Veranstaltungen',
    'Einnahmen': 6800,
  },
  {
    name: 'Kantine',
    'Einnahmen': 3400,
  },
  {
    name: 'Sonstige',
    'Einnahmen': 1800,
  },
];

const dataFormatter = (number: number) => {
  return `€ ${Intl.NumberFormat('de').format(number).toString()}`;
};

export default function RevenueChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Einnahmen nach Kategorie</CardTitle>
      </CardHeader>
      <CardContent>
        <BarChart
          className="h-72 mt-4"
          data={chartData}
          index="name"
          categories={['Einnahmen']}
          colors={['blue']}
          valueFormatter={dataFormatter}
          yAxisWidth={80}
          onValueChange={() => {}}
        />
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Gesamt</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">€ 37.600</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Monatsziel</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">€ 35.000</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Zielerreichung</p>
            <p className="text-lg font-semibold text-green-600 dark:text-green-400">107%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}