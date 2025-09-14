import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createServiceClient } from '@/lib/supabase/server';
import PlayerTable from '@/components/admin/tables/PlayerTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IconUsers, IconTrophy, IconCalendar, IconEdit, IconArrowLeft } from '@tabler/icons-react';

export const metadata: Metadata = {
  title: 'Team-Details | Admin Dashboard',
  description: 'Team-Details und Spielerverwaltung',
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TeamDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createServiceClient();

  // Fetch team details
  const { data: team, error: teamError } = await supabase
    .from('teams')
    .select('*')
    .eq('id', id)
    .single();

  if (teamError || !team) {
    notFound();
  }

  // Fetch players for this team
  const { data: players, error: playersError } = await supabase
    .from('players')
    .select('*')
    .eq('team_id', id)
    .order('number', { ascending: true });

  // Fetch team statistics from matches
  const { data: stats } = await supabase
    .from('matches')
    .select('*')
    .or(`home_team_id.eq.${id},away_team_id.eq.${id}`)
    .eq('status', 'completed');

  // Calculate team stats
  const teamStats = {
    totalMatches: stats?.length || 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
  };

  stats?.forEach((match: any) => {
    const isHome = match.home_team_id === id;
    const teamScore = isHome ? match.home_score : match.away_score;
    const opponentScore = isHome ? match.away_score : match.home_score;

    if (teamScore !== null && opponentScore !== null) {
      teamStats.goalsFor += teamScore;
      teamStats.goalsAgainst += opponentScore;

      if (teamScore > opponentScore) {
        teamStats.wins++;
      } else if (teamScore === opponentScore) {
        teamStats.draws++;
      } else {
        teamStats.losses++;
      }
    }
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{team.name}</h1>
          <p className="text-muted-foreground">
            Team-Details und Spielerverwaltung
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={team.is_own_team ? 'default' : 'secondary'}>
            {team.is_own_team ? 'Eigenes Team' : 'Gegner'}
          </Badge>
          {team.team_type && (
            <Badge variant="outline">
              {team.team_type === 'first' && '1. Mannschaft'}
              {team.team_type === 'second' && '2. Mannschaft'}
              {team.team_type === 'third' && '3. Mannschaft'}
              {team.team_type === 'youth' && 'Jugend'}
            </Badge>
          )}
          <Link href={`/admin/teams/${id}/edit`}>
            <Button size="sm" variant="outline">
              <IconEdit className="h-4 w-4 mr-2" />
              Team bearbeiten
            </Button>
          </Link>
          <Link href="/admin/teams">
            <Button size="sm" variant="ghost">
              <IconArrowLeft className="h-4 w-4 mr-2" />
              Zurück
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      {team.is_own_team && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Spieler</CardTitle>
              <IconUsers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{players?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                im Kader
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Spiele</CardTitle>
              <IconCalendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teamStats.totalMatches}</div>
              <p className="text-xs text-muted-foreground">
                {teamStats.wins}S {teamStats.draws}U {teamStats.losses}N
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tore</CardTitle>
              <IconTrophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {teamStats.goalsFor}:{teamStats.goalsAgainst}
              </div>
              <p className="text-xs text-muted-foreground">
                Torverhältnis
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Liga</CardTitle>
              <IconTrophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-bold truncate">
                {team.league || 'Keine Liga'}
              </div>
              <p className="text-xs text-muted-foreground">
                Saison {team.season || '2025/26'}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Team Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Team-Informationen</CardTitle>
          <CardDescription>
            Grundlegende Informationen über das Team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Liga</p>
              <p className="text-sm">{team.league || 'Keine Liga'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Saison</p>
              <p className="text-sm">{team.season || '2025/26'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Trainer</p>
              <p className="text-sm">{team.coach || 'Kein Trainer'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Kapitän</p>
              <p className="text-sm">{team.captain || 'Kein Kapitän'}</p>
            </div>
            {team.training_schedule && (
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-muted-foreground">Trainingszeiten</p>
                <p className="text-sm whitespace-pre-wrap">{team.training_schedule}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Players Management Card */}
      <Card>
        <CardHeader>
          <CardTitle>Spieler-Kader</CardTitle>
          <CardDescription>
            Verwalten Sie die Spieler dieses Teams
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PlayerTable
            teamId={id}
            players={(players || []).map(p => ({
              ...p,
              is_captain: p.is_captain ?? false,
              is_active: p.is_active ?? true,
            }))}
          />
        </CardContent>
      </Card>
    </div>
  );
}