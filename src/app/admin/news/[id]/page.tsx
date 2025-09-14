import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createServiceClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { IconArrowLeft } from '@tabler/icons-react';
import NewsForm from '@/components/admin/forms/NewsForm';

export const metadata: Metadata = {
  title: 'Nachricht bearbeiten | Admin Dashboard',
  description: 'Bearbeiten Sie eine bestehende Nachricht',
};

interface EditNewsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditNewsPage({ params }: EditNewsPageProps) {
  // Use service client for admin operations to bypass RLS
  const supabase = createServiceClient();
  const resolvedParams = await params;

  const { data: news, error } = await supabase
    .from('news')
    .select('*')
    .eq('id', resolvedParams.id)
    .single();

  if (error || !news) {
    notFound();
  }

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
            Nachricht bearbeiten
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {news.title}
          </p>
        </div>
      </div>

      {/* News Form */}
      <NewsForm
        initialData={{
          title: news.title,
          slug: undefined,
          excerpt: news.excerpt || undefined,
          content: news.content || undefined,
          image_url: news.image_url || undefined,
          category: news.category || undefined,
          tags: undefined,
          status: 'draft' as 'draft' | 'published',
          seo_title: undefined,
          seo_description: undefined,
        }}
        newsId={resolvedParams.id}
      />
    </div>
  );
}