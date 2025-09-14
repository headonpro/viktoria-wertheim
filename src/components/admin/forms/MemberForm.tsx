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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IconDeviceFloppy, IconArrowLeft } from '@tabler/icons-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface MemberFormValues {
  member_number: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  joined_date: string;
  membership_type: 'active' | 'passive' | 'youth' | 'honorary' | 'suspended';
  membership_status: 'active' | 'inactive' | 'pending';
  street: string;
  house_number: string;
  postal_code: string;
  city: string;
  country: string;
  notes: string;
}

interface MemberFormProps {
  initialData?: Partial<MemberFormValues>;
  memberId?: string;
}

export default function MemberForm({ initialData, memberId }: MemberFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<MemberFormValues>({
    defaultValues: {
      member_number: initialData?.member_number || '',
      first_name: initialData?.first_name || '',
      last_name: initialData?.last_name || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      date_of_birth: initialData?.date_of_birth || '',
      joined_date: initialData?.joined_date || format(new Date(), 'yyyy-MM-dd'),
      membership_type: initialData?.membership_type || 'active',
      membership_status: initialData?.membership_status || 'active',
      street: initialData?.street || '',
      house_number: initialData?.house_number || '',
      postal_code: initialData?.postal_code || '',
      city: initialData?.city || 'Wertheim',
      country: initialData?.country || 'Deutschland',
      notes: initialData?.notes || '',
    },
  });

  // Generate member number
  const generateMemberNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `SVW-${year}-${random}`;
  };

  async function onSubmit(values: MemberFormValues) {
    setIsSubmitting(true);
    const supabase = createClient();

    try {
      // Generate member number if not provided
      if (!values.member_number && !memberId) {
        values.member_number = generateMemberNumber();
      }

      const memberData = {
        ...values,
        updated_at: new Date().toISOString(),
      };

      if (memberId) {
        // Update existing member
        const { error } = await supabase
          .from('members')
          .update(memberData)
          .eq('id', memberId);

        if (error) throw error;

        toast.success('Mitglied aktualisiert', {
          description: 'Die Mitgliedsdaten wurden erfolgreich aktualisiert.',
        });
      } else {
        // Create new member
        const { data, error } = await supabase
          .from('members')
          .insert([memberData])
          .select()
          .single();

        if (error) throw error;

        toast.success('Mitglied erstellt', {
          description: `${values.first_name} ${values.last_name} wurde als Mitglied registriert.`,
        });

        router.push(`/admin/members/${data.id}`);
        return;
      }

      router.push('/admin/members');
      router.refresh();
    } catch (error: any) {
      console.error('Error saving member:', error);

      if (error.code === '23505') {
        if (error.message.includes('member_number')) {
          toast.error('Mitgliedsnummer existiert bereits', {
            description: 'Bitte verwenden Sie eine andere Mitgliedsnummer.',
          });
        } else if (error.message.includes('email')) {
          toast.error('E-Mail existiert bereits', {
            description: 'Diese E-Mail-Adresse ist bereits einem anderen Mitglied zugeordnet.',
          });
        }
      } else {
        toast.error('Fehler beim Speichern', {
          description: error.message || 'Das Mitglied konnte nicht gespeichert werden.',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">Persönliche Daten</TabsTrigger>
            <TabsTrigger value="contact">Kontakt & Adresse</TabsTrigger>
            <TabsTrigger value="membership">Mitgliedschaft</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Persönliche Informationen</CardTitle>
                <CardDescription>
                  Grundlegende Informationen über das Mitglied
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="member_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mitgliedsnummer</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input placeholder="z.B. SVW-2024-001" {...field} />
                          {!memberId && (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                const newNumber = generateMemberNumber();
                                form.setValue('member_number', newNumber);
                              }}
                            >
                              Generieren
                            </Button>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>
                        Eindeutige Mitgliedsnummer (wird automatisch generiert wenn leer)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vorname *</FormLabel>
                        <FormControl>
                          <Input placeholder="Max" {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nachname *</FormLabel>
                        <FormControl>
                          <Input placeholder="Mustermann" {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="date_of_birth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Geburtsdatum</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormDescription>
                        Für Altersstatistiken und Jugendmitgliedschaften
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Kontaktdaten</CardTitle>
                <CardDescription>
                  E-Mail, Telefon und Adresse
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-Mail</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="max@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefon</FormLabel>
                        <FormControl>
                          <Input placeholder="0171-1234567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Straße</FormLabel>
                        <FormControl>
                          <Input placeholder="Hauptstraße" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="house_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hausnummer</FormLabel>
                        <FormControl>
                          <Input placeholder="42" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="postal_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PLZ</FormLabel>
                        <FormControl>
                          <Input placeholder="97877" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stadt</FormLabel>
                        <FormControl>
                          <Input placeholder="Wertheim" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Land</FormLabel>
                        <FormControl>
                          <Input placeholder="Deutschland" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="membership" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mitgliedschaftsdetails</CardTitle>
                <CardDescription>
                  Status und Art der Mitgliedschaft
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="membership_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mitgliedsart</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Wählen Sie eine Art" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Aktiv</SelectItem>
                            <SelectItem value="passive">Passiv</SelectItem>
                            <SelectItem value="youth">Jugend</SelectItem>
                            <SelectItem value="honorary">Ehrenmitglied</SelectItem>
                            <SelectItem value="suspended">Gesperrt</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Art der Mitgliedschaft
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="membership_status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Wählen Sie einen Status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Aktiv</SelectItem>
                            <SelectItem value="inactive">Inaktiv</SelectItem>
                            <SelectItem value="pending">Ausstehend</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Aktueller Mitgliedschaftsstatus
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="joined_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mitglied seit</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormDescription>
                        Datum des Vereinsbeitritts
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notizen</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Zusätzliche Informationen..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Interne Notizen zum Mitglied
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/members')}
          >
            <IconArrowLeft className="mr-2 h-4 w-4" />
            Zurück
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            <IconDeviceFloppy className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Wird gespeichert...' : memberId ? 'Aktualisieren' : 'Mitglied erstellen'}
          </Button>
        </div>
      </form>
    </Form>
  );
}