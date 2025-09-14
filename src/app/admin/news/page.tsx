import { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import NewsDataTable from '@/components/admin/tables/NewsDataTable';

export const metadata: Metadata = {
  title: 'Nachrichten verwalten | Admin Dashboard',
  description: 'Verwalten Sie alle Nachrichten und Artikel',
};

export default async function NewsPage() {
  const supabase = await createClient();

  const { data: news, error } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching news:', error);
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Nachrichten verwalten
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Erstellen, bearbeiten und verwalten Sie alle Nachrichten
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link href="/admin/news/new">
            <Button>
              <IconPlus className="w-4 h-4 mr-2" />
              Neue Nachricht
            </Button>
          </Link>
        </div>
      </div>

      {/* News Table */}
      <NewsDataTable news={news || []} />
    </div>
  );
}