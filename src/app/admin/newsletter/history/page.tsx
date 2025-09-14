import { Metadata } from 'next';
import Link from 'next/link';
import { createServiceClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { IconEye, IconSend, IconArrowLeft, IconUsers, IconCalendar } from '@tabler/icons-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

export const metadata: Metadata = {
  title: 'Newsletter-Verlauf | Admin Dashboard',
  description: 'Übersicht über versendete Newsletter',
};

export default async function NewsletterHistoryPage() {
  const supabase = await createServiceClient();

  // Fetch newsletter history
  const { data: history, error } = await supabase
    .from('newsletter_history')
    .select('*')
    .order('sent_at', { ascending: false });

  if (error) {
    console.error('Error fetching newsletter history:', error);
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Fehler beim Laden des Verlaufs</CardTitle>
            <CardDescription>
              Der Newsletter-Verlauf konnte nicht geladen werden.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const totalSent = history?.reduce((sum, item) => sum + (item.recipient_count || 0), 0) || 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Newsletter-Verlauf</h1>
          <p className="text-muted-foreground">
            Übersicht über alle versendeten Newsletter
          </p>
        </div>
        <Link href="/admin/newsletter">
          <Button variant="outline">
            <IconArrowLeft className="h-4 w-4 mr-2" />
            Zurück zur Übersicht
          </Button>
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Versendete Newsletter</CardTitle>
            <IconSend className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{history?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Gesamt versendet
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Erreichte Empfänger</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSent}</div>
            <p className="text-xs text-muted-foreground">
              Emails gesamt versendet
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Letzter Newsletter</CardTitle>
            <IconCalendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">
              {history && history.length > 0
                ? format(new Date((history[0] as any).sent_at || (history[0] as any).created_at), 'dd.MM.yyyy', { locale: de })
                : 'Noch keiner'}
            </div>
            <p className="text-xs text-muted-foreground">
              {history && history.length > 0
                ? format(new Date((history[0] as any).sent_at || (history[0] as any).created_at), 'HH:mm', { locale: de }) + ' Uhr'
                : 'versendet'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Versendete Newsletter</CardTitle>
          <CardDescription>
            Alle Newsletter die bisher versendet wurden
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Betreff</TableHead>
                  <TableHead>Empfänger</TableHead>
                  <TableHead>Versendet von</TableHead>
                  <TableHead>Datum</TableHead>
                  <TableHead className="w-[100px]">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!history || history.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Noch keine Newsletter versendet.
                    </TableCell>
                  </TableRow>
                ) : (
                  history.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.subject}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          <IconUsers className="h-3 w-3 mr-1" />
                          {item.recipient_count || 0}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {item.sent_by || 'System'}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{format(new Date((item as any).sent_at || (item as any).created_at), 'dd.MM.yyyy', { locale: de })}</div>
                          <div className="text-xs text-muted-foreground">
                            {format(new Date((item as any).sent_at || (item as any).created_at), 'HH:mm', { locale: de })} Uhr
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <IconEye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>{item.subject}</DialogTitle>
                              <DialogDescription>
                                Versendet am {format(new Date((item as any).sent_at || (item as any).created_at), 'dd.MM.yyyy HH:mm', { locale: de })} Uhr
                                an {item.recipient_count} Empfänger
                              </DialogDescription>
                            </DialogHeader>
                            <div className="mt-4">
                              <div
                                className="prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{ __html: item.content }}
                              />
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}