'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  IconNews,
  IconTournament,
  IconMail,
  IconUserPlus,
} from '@tabler/icons-react';

const quickActions = [
  {
    title: 'Neue Nachricht',
    href: '/admin/news/new',
    icon: IconNews,
    color: 'blue',
  },
  {
    title: 'Spiel hinzufügen',
    href: '/admin/matches/new',
    icon: IconTournament,
    color: 'green',
  },
  {
    title: 'Newsletter senden',
    href: '/admin/newsletter/compose',
    icon: IconMail,
    color: 'purple',
  },
  {
    title: 'Mitglied hinzufügen',
    href: '/admin/members/new',
    icon: IconUserPlus,
    color: 'orange',
  },
];

export default function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Schnellaktionen</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.href} href={action.href}>
                <Button
                  variant="outline"
                  className="w-full h-auto flex flex-col items-center justify-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <Icon className="w-5 h-5 mb-2" />
                  <span className="text-xs font-medium text-center">
                    {action.title}
                  </span>
                </Button>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}