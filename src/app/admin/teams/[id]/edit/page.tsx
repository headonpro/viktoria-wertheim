import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createServiceClient } from '@/lib/supabase/server';
import TeamForm from '@/components/admin/forms/TeamForm';

export const metadata: Metadata = {
  title: 'Team bearbeiten | Admin Dashboard',
  description: 'Team-Details bearbeiten',
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditTeamPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createServiceClient();

  // Fetch team details
  const { data: team, error } = await supabase
    .from('teams')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !team) {
    notFound();
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Team bearbeiten</h1>
        <p className="text-muted-foreground">
          Bearbeiten Sie die Informationen für {team.name}
        </p>
      </div>

      <TeamForm
        initialData={{
          name: team.name,
          short_name: team.short_name || '',
          league: team.league || '',
          team_type: team.team_type as 'first' | 'second' | 'third' | 'youth',
          is_own_team: team.is_own_team ?? false,
          coach: team.coach || '',
          captain: team.captain || '',
          training_schedule: team.training_schedule || '',
          season: team.season || '2025/26',
        }}
        teamId={id}
      />
    </div>
  );
}