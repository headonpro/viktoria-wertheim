import { Metadata } from 'next';
import LeagueStandingsTable from '@/components/admin/tables/LeagueStandingsTable';

export const metadata: Metadata = {
  title: 'Tabellenstände - Admin | SV Viktoria Wertheim',
  description: 'Verwaltung der Tabellenstände aller Mannschaften'
};

export default function StandingsAdminPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Tabellenstände</h1>
        <p className="text-gray-600 mt-2">
          Übersicht aller Tabellenstände mit Team-Details, Trends und Filtermöglichkeiten
        </p>
      </div>

      <LeagueStandingsTable />
    </div>
  );
}