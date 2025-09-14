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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IconDeviceFloppy, IconArrowLeft } from '@tabler/icons-react';
import { toast } from 'sonner';

interface TeamFormValues {
  name: string;
  short_name: string;
  league: string;
  team_type: 'first' | 'second' | 'third' | 'youth';
  is_own_team: boolean;
  coach: string;
  captain: string;
  training_schedule: string;
  season: string;
}

interface TeamFormProps {
  initialData?: Partial<TeamFormValues>;
  teamId?: string;
}

export default function TeamForm({ initialData, teamId }: TeamFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TeamFormValues>({
    defaultValues: {
      name: initialData?.name || '',
      short_name: initialData?.short_name || '',
      league: initialData?.league || '',
      team_type: initialData?.team_type || 'first',
      is_own_team: initialData?.is_own_team ?? false,
      coach: initialData?.coach || '',
      captain: initialData?.captain || '',
      training_schedule: initialData?.training_schedule || '',
      season: initialData?.season || '2025/26',
    },
  });

  async function onSubmit(values: TeamFormValues) {
    setIsSubmitting(true);
    const supabase = createClient();

    try {
      const teamData = {
        ...values,
        updated_at: new Date().toISOString(),
      };

      if (teamId) {
        // Update existing team
        const { error } = await supabase
          .from('teams')
          .update(teamData)
          .eq('id', teamId);

        if (error) throw error;

        toast.success('Team aktualisiert', {
          description: 'Das Team wurde erfolgreich aktualisiert.',
        });
      } else {
        // Create new team
        const { data, error } = await supabase
          .from('teams')
          .insert([teamData])
          .select()
          .single();

        if (error) throw error;

        toast.success('Team erstellt', {
          description: 'Das neue Team wurde erfolgreich erstellt.',
        });

        // Redirect to edit page with player management
        router.push(`/admin/teams/${data.id}`);
        return;
      }

      router.push('/admin/teams');
      router.refresh();
    } catch (error: any) {
      console.error('Error saving team:', error);

      if (error.code === '23505') {
        toast.error('Team existiert bereits', {
          description: 'Ein Team mit diesem Namen existiert bereits.',
        });
      } else {
        toast.error('Fehler beim Speichern', {
          description: error.message || 'Das Team konnte nicht gespeichert werden.',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">Allgemeine Informationen</TabsTrigger>
            <TabsTrigger value="details">Details & Training</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Team-Informationen</CardTitle>
                <CardDescription>
                  Grundlegende Informationen über das Team
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Team Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="z.B. SV Viktoria Wertheim" {...field} />
                        </FormControl>
                        <FormDescription>
                          Der vollständige Name des Teams
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="short_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kurzname</FormLabel>
                        <FormControl>
                          <Input placeholder="z.B. SVW" {...field} />
                        </FormControl>
                        <FormDescription>
                          Abkürzung für Tabellen und Listen
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="team_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Team-Typ *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Wählen Sie einen Typ" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="first">1. Mannschaft</SelectItem>
                            <SelectItem value="second">2. Mannschaft</SelectItem>
                            <SelectItem value="third">3. Mannschaft</SelectItem>
                            <SelectItem value="youth">Jugendmannschaft</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Kategorie des Teams
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="league"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Liga</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="z.B. Kreisliga Tauberbischofsheim"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Aktuelle Liga oder Spielklasse
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="season"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Saison</FormLabel>
                      <FormControl>
                        <Input placeholder="z.B. 2025/26" {...field} />
                      </FormControl>
                      <FormDescription>
                        Aktuelle Spielsaison
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_own_team"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Eigenes Team
                        </FormLabel>
                        <FormDescription>
                          Ist dies ein Team von SV Viktoria Wertheim?
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
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Team-Details</CardTitle>
                <CardDescription>
                  Trainer, Kapitän und Trainingszeiten
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="coach"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trainer</FormLabel>
                        <FormControl>
                          <Input placeholder="Name des Trainers" {...field} />
                        </FormControl>
                        <FormDescription>
                          Verantwortlicher Trainer
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="captain"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kapitän</FormLabel>
                        <FormControl>
                          <Input placeholder="Name des Kapitäns" {...field} />
                        </FormControl>
                        <FormDescription>
                          Mannschaftskapitän
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="training_schedule"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trainingszeiten</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="z.B. Dienstag und Donnerstag, 19:00 - 21:00 Uhr"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Regelmäßige Trainingszeiten und -orte
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
            onClick={() => router.push('/admin/teams')}
          >
            <IconArrowLeft className="mr-2 h-4 w-4" />
            Zurück
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            <IconDeviceFloppy className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Wird gespeichert...' : teamId ? 'Aktualisieren' : 'Team erstellen'}
          </Button>
        </div>
      </form>
    </Form>
  );
}