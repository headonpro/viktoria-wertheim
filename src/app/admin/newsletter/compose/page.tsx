import { Metadata } from 'next';
import NewsletterComposer from '@/components/admin/newsletter/NewsletterComposer';

export const metadata: Metadata = {
  title: 'Newsletter verfassen | Admin Dashboard',
  description: 'Erstellen und versenden Sie einen Newsletter',
};

export default function ComposeNewsletterPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Newsletter verfassen</h1>
        <p className="text-muted-foreground">
          Erstellen Sie einen neuen Newsletter und versenden Sie ihn an Ihre Abonnenten
        </p>
      </div>

      <NewsletterComposer />
    </div>
  );
}