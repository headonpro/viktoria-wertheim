import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createServiceClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { IconArrowLeft } from '@tabler/icons-react';
import MatchForm from '@/components/admin/forms/MatchForm';

export const metadata: Metadata = {
  title: 'Spiel bearbeiten | Admin Dashboard',
  description: 'Bearbeiten Sie ein bestehendes Spiel',
};

interface EditMatchPageProps {
  params: {
    id: string;
  };
}

export default async function EditMatchPage({ params }: EditMatchPageProps) {
  const supabase = createServiceClient();

  const { data: match, error } = await supabase
    .from('matches')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !match) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center space-x-4">
        <Link href="/admin/matches">
          <Button variant="ghost" size="icon">
            <IconArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Spiel bearbeiten
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {match.home_team} vs. {match.away_team}
          </p>
        </div>
      </div>

      {/* Match Form */}
      <MatchForm
        initialData={{
          ...match,
          home_team_id: match.home_team_id || undefined,
          away_team_id: match.away_team_id || undefined,
          home_score: match.home_score || undefined,
          away_score: match.away_score || undefined,
          match_time: match.match_time || undefined,
          location: match.location || undefined,
          match_type: match.match_type || undefined,
          status: match.status || undefined,
          season: match.season || undefined,
        }}
        matchId={params.id}
      />
    </div>
  );
}