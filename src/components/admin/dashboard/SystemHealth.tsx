import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  IconDatabase,
  IconServer,
  IconWifi,
  IconShieldCheck,
} from '@tabler/icons-react';
import { createServiceClient } from '@/lib/supabase/server';

interface SystemMetric {
  name: string;
  status: string;
  value: number;
  icon: typeof IconDatabase;
  info: string;
}

export default async function SystemHealth() {
  const supabase = createServiceClient();

  // Fetch database statistics
  const [
    { count: newsCount },
    { count: matchesCount },
    { count: teamsCount },
    { count: playersCount },
    { count: subscribersCount },
    { count: sponsorsCount }
  ] = await Promise.all([
    supabase.from('news').select('*', { count: 'exact', head: true }),
    supabase.from('matches').select('*', { count: 'exact', head: true }),
    supabase.from('teams').select('*', { count: 'exact', head: true }),
    supabase.from('players').select('*', { count: 'exact', head: true }),
    supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true }),
    supabase.from('sponsors').select('*', { count: 'exact', head: true })
  ]);

  const totalRecords = (newsCount || 0) + (matchesCount || 0) + (teamsCount || 0) +
                       (playersCount || 0) + (subscribersCount || 0) + (sponsorsCount || 0);

  // Check recent activity
  const { data: recentNews } = await supabase
    .from('news')
    .select('created_at')
    .order('created_at', { ascending: false })
    .limit(1);

  const lastActivity = recentNews?.[0]?.created_at
    ? new Date(recentNews[0].created_at)
    : null;

  const hoursSinceLastActivity = lastActivity
    ? Math.floor((Date.now() - lastActivity.getTime()) / (1000 * 60 * 60))
    : 999;

  // Calculate approximate storage usage (rough estimate)
  const estimatedStorageMB = Math.round(totalRecords * 0.01); // Rough estimate: 10KB per record
  const storagePercentage = Math.min(100, Math.round((estimatedStorageMB / 500) * 100)); // Assume 500MB limit

  const systemMetrics: SystemMetric[] = [
    {
      name: 'Datenbank',
      status: 'online',
      value: Math.min(95, Math.round((totalRecords / 1000) * 100)), // Capacity estimate
      icon: IconDatabase,
      info: `${totalRecords} Datensätze`,
    },
    {
      name: 'Speicher',
      status: storagePercentage > 80 ? 'warning' : 'optimal',
      value: storagePercentage,
      icon: IconServer,
      info: `~${estimatedStorageMB} MB genutzt`,
    },
    {
      name: 'API Status',
      status: 'online',
      value: 100,
      icon: IconWifi,
      info: 'Supabase Cloud',
    },
    {
      name: 'Aktivität',
      status: hoursSinceLastActivity < 24 ? 'aktiv' : 'inaktiv',
      value: hoursSinceLastActivity < 24 ? 100 : 50,
      icon: IconShieldCheck,
      info: hoursSinceLastActivity < 24
        ? `Vor ${hoursSinceLastActivity}h aktiv`
        : 'Keine kürzliche Aktivität',
    },
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'online':
      case 'optimal':
      case 'aktiv':
        return 'default';
      case 'warning':
      case 'inaktiv':
        return 'secondary';
      case 'offline':
      case 'error':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getProgressColor = (value: number, status: string) => {
    if (status === 'warning') return 'bg-yellow-500';
    if (status === 'error' || status === 'offline') return 'bg-red-500';
    if (value >= 80) return 'bg-orange-500';
    if (value >= 60) return 'bg-blue-500';
    return 'bg-green-500';
  };

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
                    variant={getStatusVariant(metric.status)}
                    className="text-xs"
                  >
                    {metric.status}
                  </Badge>
                </div>
                <div className="relative">
                  <Progress
                    value={metric.value}
                    className="h-2"
                  />
                  <div
                    className={`absolute inset-0 h-2 rounded-full ${getProgressColor(metric.value, metric.status)} opacity-20`}
                    style={{ width: `${metric.value}%` }}
                  />
                </div>
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