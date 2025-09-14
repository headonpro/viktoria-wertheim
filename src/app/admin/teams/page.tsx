import { Metadata } from 'next';
import { createServiceClient } from '@/lib/supabase/server';
import TeamDataTable from '@/components/admin/tables/TeamDataTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IconUsers } from '@tabler/icons-react';

export const metadata: Metadata = {
  title: 'Teams verwalten | Admin Dashboard',
  description: 'Verwalten Sie alle Teams und Spieler',
};

export default async function TeamsPage() {
  const supabase = await createServiceClient();

  // Fetch all teams with player count
  const { data: teams, error } = await supabase
    .from('teams')
    .select(`
      *,
      players:players(count)
    `)
    .order('is_own_team', { ascending: false })
    .order('team_type', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching teams:', error);
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Fehler beim Laden der Teams</CardTitle>
            <CardDescription>
              Die Teams konnten nicht geladen werden. Bitte versuchen Sie es später erneut.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Transform the data to include player_count
  const teamsWithCount = teams?.map((team: any) => ({
    ...team,
    player_count: team.players?.[0]?.count || 0,
    players: undefined, // Remove the raw count data
  })) || [];

  // Calculate statistics
  const stats = {
    total: teamsWithCount.length,
    own: teamsWithCount.filter((t: any) => t.is_own_team).length,
    opponents: teamsWithCount.filter((t: any) => !t.is_own_team).length,
    totalPlayers: teamsWithCount.reduce((sum: number, team: any) => sum + (team.player_count || 0), 0),
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Teams verwalten</h1>
        <p className="text-muted-foreground">
          Verwalten Sie alle Teams, Spieler und Mannschaftsaufstellungen
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gesamt Teams</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Teams in der Datenbank
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eigene Teams</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.own}</div>
            <p className="text-xs text-muted-foreground">
              SV Viktoria Wertheim
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gegner Teams</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.opponents}</div>
            <p className="text-xs text-muted-foreground">
              Andere Vereine
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Spieler Gesamt</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPlayers}</div>
            <p className="text-xs text-muted-foreground">
              Registrierte Spieler
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Teams Table */}
      <Card>
        <CardHeader>
          <CardTitle>Alle Teams</CardTitle>
          <CardDescription>
            Übersicht aller Teams mit Spieleranzahl und Verwaltungsoptionen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TeamDataTable teams={teamsWithCount} />
        </CardContent>
      </Card>
    </div>
  );
}