import { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import MatchDataTable from '@/components/admin/tables/MatchDataTable';

export const metadata: Metadata = {
  title: 'Spiele verwalten | Admin Dashboard',
  description: 'Verwalten Sie alle Spiele und Ergebnisse',
};

export default async function MatchesPage() {
  const supabase = await createClient();


  const { data: matches, error } = await supabase
    .from('matches')
    .select('*')
    .order('match_date', { ascending: false });


  if (error) {
    console.error('Error fetching matches:', error);
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Spiele verwalten
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Erstellen, bearbeiten und verwalten Sie alle Spiele
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link href="/admin/matches/new">
            <Button>
              <IconPlus className="w-4 h-4 mr-2" />
              Neues Spiel
            </Button>
          </Link>
        </div>
      </div>

      {/* Matches Table */}
      <MatchDataTable matches={matches || []} />
    </div>
  );
}