import { Metadata } from 'next';
import { createServiceClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SettingsForm from '@/components/admin/forms/SettingsForm';
import { IconGlobe, IconDatabase } from '@tabler/icons-react';

export const metadata: Metadata = {
  title: 'Einstellungen | Admin Dashboard',
  description: 'Systemeinstellungen verwalten',
};

export default async function SettingsPage() {
  const supabase = await createServiceClient();

  // Get system stats
  const [
    { count: usersCount },
    { count: teamsCount },
    { count: matchesCount },
    { count: newsCount }
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('teams').select('*', { count: 'exact', head: true }),
    supabase.from('matches').select('*', { count: 'exact', head: true }),
    supabase.from('news').select('*', { count: 'exact', head: true })
  ]);

  const stats = {
    users: usersCount || 0,
    teams: teamsCount || 0,
    matches: matchesCount || 0,
    news: newsCount || 0,
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Einstellungen</h1>
        <p className="text-muted-foreground">
          Verwalten Sie die Systemeinstellungen und Konfiguration
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">Allgemein</TabsTrigger>
          <TabsTrigger value="email">E-Mail</TabsTrigger>
          <TabsTrigger value="security">Sicherheit</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vereinsinformationen</CardTitle>
              <CardDescription>
                Grundlegende Informationen über den Verein
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SettingsForm type="general" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Website-Einstellungen</CardTitle>
              <CardDescription>
                Konfiguration der öffentlichen Website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <label className="text-sm font-medium">Website-URL</label>
                  <p className="text-sm text-muted-foreground">https://viktoria.headon.pro</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Kontakt-Email</label>
                  <p className="text-sm text-muted-foreground">info@sv-viktoria-wertheim.de</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Soziale Medien</label>
                  <p className="text-sm text-muted-foreground">Facebook, Instagram, Twitter</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>E-Mail-Konfiguration</CardTitle>
              <CardDescription>
                SMTP-Einstellungen für den E-Mail-Versand
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SettingsForm type="email" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sicherheitseinstellungen</CardTitle>
              <CardDescription>
                Zugriffsrechte und Sicherheitskonfiguration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Admin-Benutzer</h3>
                  <p className="text-sm text-muted-foreground">
                    {stats.users} registrierte Administratoren
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Zwei-Faktor-Authentifizierung</h3>
                  <p className="text-sm text-muted-foreground">
                    Für alle Admin-Konten empfohlen
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Letzte Sicherheitsprüfung</h3>
                  <p className="text-sm text-muted-foreground">
                    Vor 7 Tagen durchgeführt
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System-Informationen</CardTitle>
              <CardDescription>
                Technische Details und Statistiken
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <IconDatabase className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Datenbank</span>
                  </div>
                  <div className="pl-6 space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Teams: {stats.teams} Einträge
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Spiele: {stats.matches} Einträge
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Nachrichten: {stats.news} Einträge
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <IconGlobe className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">System</span>
                  </div>
                  <div className="pl-6 space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Version: 2.0.0
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Framework: Next.js 15.5.2
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Datenbank: Supabase (PostgreSQL)
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Wartung</CardTitle>
              <CardDescription>
                Systemwartung und Backup
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Automatische Backups</h3>
                  <p className="text-sm text-muted-foreground">
                    Täglich um 03:00 Uhr
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Letztes Backup</h3>
                  <p className="text-sm text-muted-foreground">
                    Heute, 03:00 Uhr - Erfolgreich
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Speicherplatz</h3>
                  <p className="text-sm text-muted-foreground">
                    2.3 GB von 10 GB verwendet
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}