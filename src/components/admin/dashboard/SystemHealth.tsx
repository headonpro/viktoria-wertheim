'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  IconDatabase,
  IconServer,
  IconWifi,
  IconShieldCheck,
} from '@tabler/icons-react';

const systemMetrics = [
  {
    name: 'Datenbank',
    status: 'online',
    value: 92,
    icon: IconDatabase,
    info: 'PostgreSQL',
  },
  {
    name: 'Server',
    status: 'online',
    value: 78,
    icon: IconServer,
    info: 'CPU: 78%',
  },
  {
    name: 'API',
    status: 'online',
    value: 100,
    icon: IconWifi,
    info: 'Latenz: 45ms',
  },
  {
    name: 'Sicherheit',
    status: 'secured',
    value: 100,
    icon: IconShieldCheck,
    info: 'SSL aktiv',
  },
];

export default function SystemHealth() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Systemstatus</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {systemMetrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {metric.name}
                    </span>
                  </div>
                  <Badge
                    variant={metric.status === 'online' || metric.status === 'secured' ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    {metric.status}
                  </Badge>
                </div>
                <Progress value={metric.value} className="h-2" />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {metric.info}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}