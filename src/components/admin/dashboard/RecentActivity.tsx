'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IconNews, IconTournament, IconUser, IconEdit } from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';

const activities = [
  {
    id: 1,
    type: 'news',
    title: 'Neue Nachricht veröffentlicht',
    description: 'Spielbericht: Viktoria gewinnt 3:1',
    user: 'Admin',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    icon: IconNews,
    color: 'blue',
  },
  {
    id: 2,
    type: 'match',
    title: 'Spielergebnis aktualisiert',
    description: 'SV Viktoria vs. FC Beispiel',
    user: 'Trainer',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    icon: IconTournament,
    color: 'green',
  },
  {
    id: 3,
    type: 'member',
    title: 'Neues Mitglied registriert',
    description: 'Max Mustermann',
    user: 'System',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    icon: IconUser,
    color: 'purple',
  },
  {
    id: 4,
    type: 'edit',
    title: 'Teamdaten aktualisiert',
    description: '1. Mannschaft Kader geändert',
    user: 'Trainer',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
    icon: IconEdit,
    color: 'orange',
  },
];

const typeColors = {
  news: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  match: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  member: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  edit: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
};

export default function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Letzte Aktivitäten</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex items-start space-x-4">
                <div className={`p-2 rounded-lg ${typeColors[activity.type as keyof typeof typeColors]}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.title}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {activity.description}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>{activity.user}</span>
                    <span>•</span>
                    <span>
                      {formatDistanceToNow(activity.timestamp, {
                        addSuffix: true,
                        locale: de,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}