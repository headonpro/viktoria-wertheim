'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
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
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ImageUpload from '@/components/admin/upload/ImageUpload';
import { IconDeviceFloppy, IconArrowLeft } from '@tabler/icons-react';
import { toast } from 'sonner';

interface SponsorFormValues {
  name: string;
  logo_url: string;
  website: string;
  category: 'Hauptsponsor' | 'Premium Partner' | 'Partner' | 'Förderer';
  description: string;
  is_active: boolean;
}

interface SponsorFormProps {
  initialData?: Partial<SponsorFormValues>;
  sponsorId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const categories = [
  { value: 'Hauptsponsor', label: 'Hauptsponsor', description: 'Höchste Sponsoring-Stufe' },
  { value: 'Premium Partner', label: 'Premium Partner', description: 'Premium Unterstützung' },
  { value: 'Partner', label: 'Partner', description: 'Standard Partner' },
  { value: 'Förderer', label: 'Förderer', description: 'Unterstützende Mitglieder' },
];

export default function SponsorForm({
  initialData,
  sponsorId,
  onSuccess,
  onCancel
}: SponsorFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedLogoUrl, setUploadedLogoUrl] = useState(initialData?.logo_url || '');

  const form = useForm<SponsorFormValues>({
    defaultValues: {
      name: initialData?.name || '',
      logo_url: initialData?.logo_url || '',
      website: initialData?.website || '',
      category: initialData?.category || 'Partner',
      description: initialData?.description || '',
      is_active: initialData?.is_active ?? true,
    },
  });

  const handleImageUpload = (url: string) => {
    setUploadedLogoUrl(url);
    form.setValue('logo_url', url);
  };

  async function onSubmit(values: SponsorFormValues) {
    setIsSubmitting(true);
    const supabase = createClient();

    try {
      const sponsorData = {
        ...values,
        logo_url: uploadedLogoUrl || values.logo_url,
        updated_at: new Date().toISOString(),
      };

      if (sponsorId) {
        // Update existing sponsor
        const { error } = await supabase
          .from('sponsors')
          .update(sponsorData)
          .eq('id', sponsorId);

        if (error) throw error;

        toast.success('Sponsor aktualisiert', {
          description: 'Der Sponsor wurde erfolgreich aktualisiert.',
        });
      } else {
        // Create new sponsor
        const { error } = await supabase
          .from('sponsors')
          .insert([sponsorData]);

        if (error) throw error;

        toast.success('Sponsor erstellt', {
          description: 'Der neue Sponsor wurde erfolgreich erstellt.',
        });
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/admin/sponsors');
        router.refresh();
      }
    } catch (error: any) {
      console.error('Error saving sponsor:', error);
      toast.error('Fehler beim Speichern', {
        description: error.message || 'Der Sponsor konnte nicht gespeichert werden.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Sponsor-Informationen</CardTitle>
            <CardDescription>
              Grundlegende Informationen über den Sponsor
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sponsor Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="z.B. Musterfirma GmbH" {...field} />
                  </FormControl>
                  <FormDescription>
                    Der offizielle Name des Sponsors
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategorie *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Wählen Sie eine Kategorie" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                          <div>
                            <div className="font-medium">{cat.label}</div>
                            <div className="text-xs text-muted-foreground">
                              {cat.description}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Die Sponsoring-Stufe bestimmt die Anzeige-Priorität
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://www.beispiel.de"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Die Website des Sponsors (optional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Beschreibung</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Kurze Beschreibung des Sponsors und der Partnerschaft"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Eine kurze Beschreibung der Partnerschaft (optional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Aktiver Sponsor
                    </FormLabel>
                    <FormDescription>
                      Nur aktive Sponsoren werden auf der Website angezeigt
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sponsor Logo</CardTitle>
            <CardDescription>
              Laden Sie das Logo des Sponsors hoch
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ImageUpload
                value={uploadedLogoUrl}
                onChange={handleImageUpload}
                bucket="logos"
              />

              {uploadedLogoUrl && (
                <div className="p-4 border rounded-lg bg-gray-50">
                  <p className="text-sm text-muted-foreground mb-2">Logo-Vorschau:</p>
                  <img
                    src={uploadedLogoUrl}
                    alt="Logo Vorschau"
                    className="max-h-32 object-contain"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel || (() => router.push('/admin/sponsors'))}
          >
            <IconArrowLeft className="mr-2 h-4 w-4" />
            Abbrechen
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            <IconDeviceFloppy className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Wird gespeichert...' : sponsorId ? 'Aktualisieren' : 'Sponsor erstellen'}
          </Button>
        </div>
      </form>
    </Form>
  );
}