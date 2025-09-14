import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { IconArrowLeft } from '@tabler/icons-react';
import MatchForm from '@/components/admin/forms/MatchForm';

export const metadata: Metadata = {
  title: 'Neues Spiel erstellen | Admin Dashboard',
  description: 'Erstellen Sie ein neues Spiel',
};

export default function NewMatchPage() {
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
            Neues Spiel erstellen
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Planen Sie ein neues Spiel oder tragen Sie ein Ergebnis ein
          </p>
        </div>
      </div>

      {/* Match Form */}
      <MatchForm />
    </div>
  );
}