'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import RichTextEditor from '@/components/admin/editors/RichTextEditor';
import {
  IconSend,
  IconEye,
  IconTemplate,
  IconTestPipe,
  IconUsers,
  IconMail,
} from '@tabler/icons-react';
import { toast } from 'sonner';

interface NewsletterTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
}

const templates: NewsletterTemplate[] = [
  {
    id: 'match-report',
    name: 'Spielbericht',
    subject: 'Spielbericht: {home_team} vs {away_team}',
    content: `<h2>Spielbericht</h2>
<p>Liebe Fans und Mitglieder,</p>
<p>hier ist der aktuelle Spielbericht vom Spiel gegen [Gegner].</p>
<h3>Spielverlauf</h3>
<p>[Beschreiben Sie hier den Spielverlauf]</p>
<h3>Torschützen</h3>
<ul>
<li>[Spieler 1] - [Minute]</li>
<li>[Spieler 2] - [Minute]</li>
</ul>
<h3>Fazit</h3>
<p>[Ihr Fazit zum Spiel]</p>
<p>Mit sportlichen Grüßen,<br>Euer SV Viktoria Wertheim Team</p>`,
  },
  {
    id: 'monthly',
    name: 'Monats-Newsletter',
    subject: 'SV Viktoria Wertheim - Newsletter {month} {year}',
    content: `<h2>Newsletter {month} {year}</h2>
<p>Liebe Vereinsmitglieder und Fans,</p>
<p>hier sind die wichtigsten Neuigkeiten aus unserem Verein:</p>
<h3>Sportliche Erfolge</h3>
<p>[Berichte über Spiele und Erfolge]</p>
<h3>Vereinsnachrichten</h3>
<p>[Wichtige Vereinsinformationen]</p>
<h3>Termine</h3>
<ul>
<li>[Datum] - [Veranstaltung]</li>
<li>[Datum] - [Veranstaltung]</li>
</ul>
<h3>Jugendbereich</h3>
<p>[Neuigkeiten aus der Jugendabteilung]</p>
<p>Sportliche Grüße,<br>Euer Vorstand</p>`,
  },
  {
    id: 'event',
    name: 'Veranstaltung',
    subject: 'Einladung: {event_name}',
    content: `<h2>Einladung zur Veranstaltung</h2>
<p>Liebe Mitglieder und Freunde des SV Viktoria Wertheim,</p>
<p>wir laden Euch herzlich ein zu:</p>
<h3>[Veranstaltungsname]</h3>
<p><strong>Datum:</strong> [Datum]<br>
<strong>Uhrzeit:</strong> [Uhrzeit]<br>
<strong>Ort:</strong> [Veranstaltungsort]</p>
<h3>Programm</h3>
<p>[Beschreibung des Programms]</p>
<h3>Anmeldung</h3>
<p>[Anmeldeinformationen]</p>
<p>Wir freuen uns auf Eure Teilnahme!</p>
<p>Mit freundlichen Grüßen,<br>Das Organisationsteam</p>`,
  },
];

export default function NewsletterComposer() {
  const router = useRouter();
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [recipientType, setRecipientType] = useState<'all' | 'active' | 'test'>('active');
  const [testEmail, setTestEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Load template
  const loadTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSubject(template.subject);
      setContent(template.content);
      toast.success('Vorlage geladen', {
        description: `"${template.name}" wurde geladen. Passen Sie den Inhalt an.`,
      });
    }
  };

  // Get recipient count
  const getRecipientInfo = async () => {
    const supabase = createClient();

    if (recipientType === 'test') {
      return { count: 1, emails: [testEmail] };
    }

    const query = supabase
      .from('newsletter_subscribers')
      .select('email', { count: 'exact' });

    if (recipientType === 'active') {
      query.eq('is_active', true);
    }

    const { data, count } = await query;
    return { count: count || 0, emails: data?.map(s => s.email) || [] };
  };

  // Send newsletter
  const handleSend = async () => {
    if (!subject || !content) {
      toast.error('Fehlende Informationen', {
        description: 'Bitte geben Sie einen Betreff und Inhalt ein.',
      });
      return;
    }

    if (recipientType === 'test' && !testEmail) {
      toast.error('Test-Email fehlt', {
        description: 'Bitte geben Sie eine Test-Email-Adresse ein.',
      });
      return;
    }

    setIsSending(true);

    try {
      const recipientInfo = await getRecipientInfo();

      if (recipientInfo.count === 0) {
        toast.error('Keine Empfänger', {
          description: 'Es wurden keine Empfänger für den Newsletter gefunden.',
        });
        setIsSending(false);
        return;
      }

      // Send via API route
      const response = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject,
          content,
          recipients: recipientInfo.emails,
          recipientType,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Fehler beim Versenden');
      }

      // Save to history if not a test
      if (recipientType !== 'test') {
        const supabase = createClient();
        await supabase
          .from('newsletter_history')
          .insert({
            subject,
            content,
            recipient_count: recipientInfo.count,
            sent_by: 'admin@viktoria-wertheim.de', // Should get from auth
          });
      }

      toast.success('Newsletter versendet!', {
        description: `Der Newsletter wurde an ${recipientInfo.count} Empfänger versendet.`,
      });

      router.push('/admin/newsletter');
    } catch (error: any) {
      console.error('Error sending newsletter:', error);
      toast.error('Fehler beim Versenden', {
        description: error.message || 'Der Newsletter konnte nicht versendet werden.',
      });
    } finally {
      setIsSending(false);
    }
  };

  // Send test email
  const handleTestSend = async () => {
    if (!testEmail) {
      toast.error('Bitte geben Sie eine Test-Email-Adresse ein');
      return;
    }

    const prevRecipientType = recipientType;
    setRecipientType('test');
    await handleSend();
    setRecipientType(prevRecipientType);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="compose" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="compose">
            <IconMail className="h-4 w-4 mr-2" />
            Verfassen
          </TabsTrigger>
          <TabsTrigger value="recipients">
            <IconUsers className="h-4 w-4 mr-2" />
            Empfänger
          </TabsTrigger>
          <TabsTrigger value="preview" onClick={() => setPreviewMode(true)}>
            <IconEye className="h-4 w-4 mr-2" />
            Vorschau
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Newsletter verfassen</CardTitle>
              <CardDescription>
                Verwenden Sie eine Vorlage oder erstellen Sie einen eigenen Newsletter
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="template">Vorlage verwenden (optional)</Label>
                <Select value={selectedTemplate} onValueChange={(value) => {
                  setSelectedTemplate(value);
                  loadTemplate(value);
                }}>
                  <SelectTrigger id="template">
                    <SelectValue placeholder="Wählen Sie eine Vorlage">
                      <div className="flex items-center gap-2">
                        <IconTemplate className="h-4 w-4" />
                        <span>Vorlage wählen</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Betreff *</Label>
                <Input
                  id="subject"
                  placeholder="z.B. Newsletter März 2025 - SV Viktoria Wertheim"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Inhalt *</Label>
                <div className="min-h-[400px] border rounded-lg">
                  <RichTextEditor
                    content={content}
                    onChange={setContent}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recipients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Empfänger auswählen</CardTitle>
              <CardDescription>
                Wählen Sie, wer den Newsletter erhalten soll
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="active"
                    name="recipients"
                    value="active"
                    checked={recipientType === 'active'}
                    onChange={(e) => setRecipientType('active')}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="active" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span>Alle aktiven Abonnenten</span>
                      <Badge variant="default">Empfohlen</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Sendet an alle Abonnenten, die Newsletter empfangen möchten
                    </p>
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="all"
                    name="recipients"
                    value="all"
                    checked={recipientType === 'all'}
                    onChange={(e) => setRecipientType('all')}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="all" className="flex-1 cursor-pointer">
                    <div>Alle Abonnenten</div>
                    <p className="text-sm text-muted-foreground">
                      Sendet an alle Abonnenten (auch inaktive)
                    </p>
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="test"
                    name="recipients"
                    value="test"
                    checked={recipientType === 'test'}
                    onChange={(e) => setRecipientType('test')}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="test" className="flex-1 cursor-pointer">
                    <div>Test-Email</div>
                    <p className="text-sm text-muted-foreground">
                      Sendet nur an eine Test-Email-Adresse
                    </p>
                  </Label>
                </div>
              </div>

              {recipientType === 'test' && (
                <div className="space-y-2">
                  <Label htmlFor="testEmail">Test-Email-Adresse</Label>
                  <Input
                    id="testEmail"
                    type="email"
                    placeholder="test@example.com"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                  />
                </div>
              )}

              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm">
                  <strong>Hinweis:</strong> Testen Sie den Newsletter immer zuerst mit einer Test-Email,
                  bevor Sie ihn an alle Abonnenten versenden.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Newsletter-Vorschau</CardTitle>
              <CardDescription>
                So wird der Newsletter bei den Empfängern angezeigt
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-gray-50">
                  <p className="text-sm text-muted-foreground mb-1">Betreff:</p>
                  <p className="font-semibold">{subject || 'Kein Betreff eingegeben'}</p>
                </div>

                <div className="p-4 border rounded-lg bg-white">
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: content || '<p>Kein Inhalt eingegeben</p>' }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => router.push('/admin/newsletter')}
        >
          Abbrechen
        </Button>
        <div className="flex gap-2">
          {recipientType !== 'test' && (
            <Button
              variant="outline"
              onClick={handleTestSend}
              disabled={isSending || !subject || !content}
            >
              <IconTestPipe className="h-4 w-4 mr-2" />
              Test senden
            </Button>
          )}
          <Button
            onClick={handleSend}
            disabled={isSending || !subject || !content}
          >
            <IconSend className="h-4 w-4 mr-2" />
            {isSending ? 'Wird versendet...' : 'Newsletter versenden'}
          </Button>
        </div>
      </div>
    </div>
  );
}