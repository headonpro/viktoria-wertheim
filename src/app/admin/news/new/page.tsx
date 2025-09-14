import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { IconArrowLeft } from '@tabler/icons-react';
import NewsForm from '@/components/admin/forms/NewsForm';

export const metadata: Metadata = {
  title: 'Neue Nachricht erstellen | Admin Dashboard',
  description: 'Erstellen Sie eine neue Nachricht oder einen Artikel',
};

export default function NewNewsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center space-x-4">
        <Link href="/admin/news">
          <Button variant="ghost" size="icon">
            <IconArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Neue Nachricht erstellen
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Verfassen Sie eine neue Nachricht oder einen Artikel
          </p>
        </div>
      </div>

      {/* News Form */}
      <NewsForm />
    </div>
  );
}