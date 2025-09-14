'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RichTextEditor from '@/components/admin/editors/RichTextEditor';
import ImageUpload from '@/components/admin/upload/ImageUpload';
import { IconSend, IconDeviceFloppy, IconEye } from '@tabler/icons-react';
import { toast } from 'sonner';

const newsFormSchema = z.object({
  title: z.string().min(1, 'Titel ist erforderlich').max(200),
  slug: z.string().min(1, 'Slug ist erforderlich').regex(/^[a-z0-9-]+$/, 'Slug darf nur Kleinbuchstaben, Zahlen und Bindestriche enthalten'),
  excerpt: z.string().min(1, 'Zusammenfassung ist erforderlich').max(500),
  content: z.string().min(1, 'Inhalt ist erforderlich'),
  image_url: z.string().optional(),
  category: z.string().min(1, 'Kategorie ist erforderlich'),
  tags: z.string().optional(),
  status: z.enum(['draft', 'published']),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
});

type NewsFormValues = z.infer<typeof newsFormSchema>;

interface NewsFormProps {
  initialData?: Partial<NewsFormValues>;
  newsId?: string;
}

export default function NewsForm({ initialData, newsId }: NewsFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const form = useForm<NewsFormValues>({
    resolver: zodResolver(newsFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      excerpt: initialData?.excerpt || '',
      content: initialData?.content || '',
      image_url: initialData?.image_url || '',
      category: initialData?.category || 'news',
      tags: initialData?.tags || '',
      status: initialData?.status || 'draft',
      seo_title: initialData?.seo_title || '',
      seo_description: initialData?.seo_description || '',
    },
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/ü/g, 'ue')
      .replace(/ß/g, 'ss')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  async function onSubmit(values: NewsFormValues) {
    setIsSubmitting(true);
    const supabase = createClient();

    try {
      const newsData = {
        ...values,
        tags: values.tags ? values.tags.split(',').map(tag => tag.trim()) : [],
        updated_at: new Date().toISOString(),
      };

      if (newsId) {
        // Update existing news
        const { error } = await supabase
          .from('news')
          .update(newsData)
          .eq('id', newsId);

        if (error) throw error;
        toast.success('Nachricht erfolgreich aktualisiert');
      } else {
        // Create new news
        const { data: { user } } = await supabase.auth.getUser();
        const { error } = await supabase
          .from('news')
          .insert({
            ...newsData,
            author_id: user?.id,
          });

        if (error) throw error;
        toast.success('Nachricht erfolgreich erstellt');
      }

      router.push('/admin/news');
      router.refresh();
    } catch (error) {
      console.error('Error saving news:', error);
      toast.error('Fehler beim Speichern der Nachricht');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Inhalt</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Titel</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nachrichtentitel eingeben..."
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            if (!form.getValues('slug')) {
                              form.setValue('slug', generateSlug(e.target.value));
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL-Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="url-slug" {...field} />
                      </FormControl>
                      <FormDescription>
                        Wird in der URL angezeigt: /news/{field.value}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zusammenfassung</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Kurze Zusammenfassung der Nachricht..."
                          className="resize-none"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Wird in der Übersicht und als Vorschau angezeigt
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Inhalt</FormLabel>
                      <FormControl>
                        <Tabs defaultValue="editor" className="w-full">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="editor">Editor</TabsTrigger>
                            <TabsTrigger value="preview">Vorschau</TabsTrigger>
                          </TabsList>
                          <TabsContent value="editor">
                            <RichTextEditor
                              content={field.value}
                              onChange={field.onChange}
                            />
                          </TabsContent>
                          <TabsContent value="preview">
                            <div className="min-h-[400px] p-4 border rounded-md bg-white dark:bg-gray-900">
                              <div
                                className="prose dark:prose-invert max-w-none"
                                dangerouslySetInnerHTML={{ __html: field.value }}
                              />
                            </div>
                          </TabsContent>
                        </Tabs>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* SEO Settings */}
            <Card>
              <CardHeader>
                <CardTitle>SEO-Einstellungen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="seo_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SEO-Titel</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="SEO-optimierter Titel..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Leer lassen, um den Haupttitel zu verwenden
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="seo_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SEO-Beschreibung</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="SEO-optimierte Beschreibung..."
                          className="resize-none"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Leer lassen, um die Zusammenfassung zu verwenden
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publishing Options */}
            <Card>
              <CardHeader>
                <CardTitle>Veröffentlichung</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Status wählen" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Entwurf</SelectItem>
                          <SelectItem value="published">Veröffentlicht</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategorie</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Kategorie wählen" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="news">Nachrichten</SelectItem>
                          <SelectItem value="match-report">Spielbericht</SelectItem>
                          <SelectItem value="announcement">Ankündigung</SelectItem>
                          <SelectItem value="event">Veranstaltung</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Tag1, Tag2, Tag3..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Kommagetrennte Liste von Tags
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Featured Image */}
            <Card>
              <CardHeader>
                <CardTitle>Beitragsbild</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ImageUpload
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {form.watch('status') === 'published' ? (
                      <>
                        <IconSend className="w-4 h-4 mr-2" />
                        Veröffentlichen
                      </>
                    ) : (
                      <>
                        <IconDeviceFloppy className="w-4 h-4 mr-2" />
                        Als Entwurf speichern
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => setPreviewMode(!previewMode)}
                  >
                    <IconEye className="w-4 h-4 mr-2" />
                    Vorschau
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}