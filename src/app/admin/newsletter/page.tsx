import { Metadata } from 'next';
import Link from 'next/link';
import { createServiceClient } from '@/lib/supabase/server';
import SubscriberTable from '@/components/admin/newsletter/SubscriberTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IconMail, IconUsers, IconSend, IconHistory } from '@tabler/icons-react';

export const metadata: Metadata = {
  title: 'Newsletter verwalten | Admin Dashboard',
  description: 'Verwalten Sie Newsletter-Abonnenten und versenden Sie E-Mails',
};

export default async function NewsletterPage() {
  const supabase = await createServiceClient();

  // Fetch all subscribers
  const { data: subscribers, error } = await supabase
    .from('newsletter_subscribers')
    .select('*')
    .order('subscribed_at', { ascending: false });

  if (error) {
    console.error('Error fetching subscribers:', error);
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Fehler beim Laden der Abonnenten</CardTitle>
            <CardDescription>
              Die Newsletter-Abonnenten konnten nicht geladen werden.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Fetch newsletter history count
  const { count: historyCount } = await supabase
    .from('newsletter_history')
    .select('*', { count: 'exact', head: true });

  // Calculate statistics
  const stats = {
    total: subscribers?.length || 0,
    active: subscribers?.filter(s => s.is_active).length || 0,
    inactive: subscribers?.filter(s => !s.is_active).length || 0,
    sentCount: historyCount || 0,
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Newsletter</h1>
          <p className="text-muted-foreground">
            Verwalten Sie Abonnenten und versenden Sie Newsletter
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/newsletter/history">
            <Button variant="outline">
              <IconHistory className="h-4 w-4 mr-2" />
              Verlauf
            </Button>
          </Link>
          <Link href="/admin/newsletter/compose">
            <Button>
              <IconSend className="h-4 w-4 mr-2" />
              Newsletter verfassen
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gesamt Abonnenten</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Alle registrierten Abonnenten
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktive Abonnenten</CardTitle>
            <IconMail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">
              Empfangen Newsletter
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inaktive</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-500">{stats.inactive}</div>
            <p className="text-xs text-muted-foreground">
              Abgemeldet
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Versendete Newsletter</CardTitle>
            <IconSend className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sentCount}</div>
            <p className="text-xs text-muted-foreground">
              Gesamt versendet
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Subscribers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Newsletter-Abonnenten</CardTitle>
          <CardDescription>
            Verwalten Sie alle Newsletter-Abonnenten. Nutzen Sie die Checkboxen für Bulk-Aktionen.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SubscriberTable subscribers={(subscribers || []).map(s => ({
            ...s,
            is_active: s.is_active ?? true,
            subscribed_at: s.subscribed_at || new Date().toISOString(),
          }))} />
        </CardContent>
      </Card>
    </div>
  );
}