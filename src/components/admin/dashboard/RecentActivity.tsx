import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IconNews, IconTournament, IconUser, IconEdit, IconMail, IconCoin } from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';
import { createServiceClient } from '@/lib/supabase/server';

type ActivityType = 'news' | 'match' | 'newsletter' | 'sponsor' | 'team' | 'contact';

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  user?: string;
  timestamp: Date;
}

const typeConfig = {
  news: {
    icon: IconNews,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  },
  match: {
    icon: IconTournament,
    color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  },
  newsletter: {
    icon: IconMail,
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  },
  sponsor: {
    icon: IconCoin,
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  },
  team: {
    icon: IconUser,
    color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
  },
  contact: {
    icon: IconEdit,
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  },
};

export default async function RecentActivity() {
  const supabase = createServiceClient();
  const activities: Activity[] = [];

  // Fetch recent news
  const { data: news } = await supabase
    .from('news')
    .select('id, title, created_at, updated_at')
    .order('created_at', { ascending: false })
    .limit(3);

  if (news) {
    news.forEach((item) => {
      if (item.created_at) {
        activities.push({
          id: `news-${item.id}`,
          type: 'news',
          title: 'Nachricht veröffentlicht',
          description: item.title,
          timestamp: new Date(item.created_at),
        });
      }
    });
  }

  // Fetch recent matches
  const { data: matches } = await supabase
    .from('matches')
    .select('id, home_team, away_team, created_at, updated_at, status')
    .order('updated_at', { ascending: false })
    .limit(3);

  if (matches) {
    matches.forEach((match) => {
      if (match.updated_at) {
        activities.push({
          id: `match-${match.id}`,
          type: 'match',
          title: match.status === 'completed' ? 'Spielergebnis eingetragen' : 'Spiel geplant',
          description: `${match.home_team} vs. ${match.away_team}`,
          timestamp: new Date(match.updated_at),
        });
      }
    });
  }

  // Fetch recent newsletter subscribers
  const { data: subscribers } = await supabase
    .from('newsletter_subscribers')
    .select('id, email, subscribed_at')
    .order('subscribed_at', { ascending: false })
    .limit(2);

  if (subscribers) {
    subscribers.forEach((sub) => {
      if (sub.subscribed_at) {
        activities.push({
          id: `subscriber-${sub.id}`,
          type: 'newsletter',
          title: 'Newsletter-Anmeldung',
          description: sub.email,
          timestamp: new Date(sub.subscribed_at),
        });
      }
    });
  }

  // Fetch recent sponsors
  const { data: sponsors } = await supabase
    .from('sponsors')
    .select('id, name, created_at')
    .order('created_at', { ascending: false })
    .limit(2);

  if (sponsors) {
    sponsors.forEach((sponsor) => {
      if (sponsor.created_at) {
        activities.push({
          id: `sponsor-${sponsor.id}`,
          type: 'sponsor',
          title: 'Sponsor hinzugefügt',
          description: sponsor.name,
          timestamp: new Date(sponsor.created_at),
        });
      }
    });
  }

  // Sort all activities by timestamp
  activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  // Take only the most recent 10 activities
  const recentActivities = activities.slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Letzte Aktivitäten</CardTitle>
      </CardHeader>
      <CardContent>
        {recentActivities.length > 0 ? (
          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const config = typeConfig[activity.type];
              const Icon = config.icon;
              return (
                <div key={activity.id} className="flex items-start space-x-4">
                  <div className={`p-2 rounded-lg ${config.color}`}>
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
                      {activity.user && (
                        <>
                          <span>{activity.user}</span>
                          <span>•</span>
                        </>
                      )}
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
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
            Noch keine Aktivitäten vorhanden
          </p>
        )}
      </CardContent>
    </Card>
  );
}