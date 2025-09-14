'use client';

import { useState, useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IconCalendar, IconClock, IconMapPin, IconTrophy } from '@tabler/icons-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface MatchFormValues {
  home_team: string;
  away_team: string;
  home_team_id?: string;
  away_team_id?: string;
  home_score?: number;
  away_score?: number;
  match_date: string;
  match_time?: string;
  location?: string;
  match_type: string;
  status: string;
  season: string;
}

interface MatchFormProps {
  initialData?: Partial<MatchFormValues>;
  matchId?: string;
}

interface Team {
  id: string;
  name: string;
  is_own_team: boolean;
}

export default function MatchForm({ initialData, matchId }: MatchFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(true);

  const form = useForm<MatchFormValues>({
    defaultValues: {
      home_team: initialData?.home_team || '',
      away_team: initialData?.away_team || '',
      home_team_id: initialData?.home_team_id || '',
      away_team_id: initialData?.away_team_id || '',
      home_score: initialData?.home_score,
      away_score: initialData?.away_score,
      match_date: initialData?.match_date || format(new Date(), 'yyyy-MM-dd'),
      match_time: initialData?.match_time || '',
      location: initialData?.location || '',
      match_type: initialData?.match_type || 'league',
      status: initialData?.status || 'scheduled',
      season: initialData?.season || '2025/26',
    },
    mode: 'onBlur',
  });

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('teams')
      .select('id, name, is_own_team')
      .order('name');

    if (error) {
      console.error('Error loading teams:', error);
      toast.error('Fehler beim Laden der Teams');
    } else {
      setTeams(data || []);
    }
    setLoadingTeams(false);
  };

  const handleTeamSelect = (teamId: string, isHome: boolean) => {
    const team = teams.find(t => t.id === teamId);
    if (team) {
      if (isHome) {
        form.setValue('home_team_id', teamId);
        form.setValue('home_team', team.name);
      } else {
        form.setValue('away_team_id', teamId);
        form.setValue('away_team', team.name);
      }
    }
  };

  async function onSubmit(values: MatchFormValues) {
    setIsSubmitting(true);
    const supabase = createClient();

    try {
      const matchData = {
        ...values,
        home_score: values.status === 'completed' ? values.home_score : null,
        away_score: values.status === 'completed' ? values.away_score : null,
        updated_at: new Date().toISOString(),
      };

      if (matchId) {
        // Update existing match
        const { error } = await supabase
          .from('matches')
          .update(matchData)
          .eq('id', matchId);

        if (error) throw error;
        toast.success('Spiel erfolgreich aktualisiert');
      } else {
        // Create new match
        const { error } = await supabase
          .from('matches')
          .insert(matchData);

        if (error) throw error;
        toast.success('Spiel erfolgreich erstellt');
      }

      router.push('/admin/matches');
      router.refresh();
    } catch (error) {
      console.error('Error saving match:', error);
      toast.error('Fehler beim Speichern des Spiels');
    } finally {
      setIsSubmitting(false);
    }
  }

  const watchStatus = form.watch('status');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Teams */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconTrophy className="w-5 h-5" />
                  Mannschaften
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="home_team_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Heimmannschaft</FormLabel>
                        <Select
                          onValueChange={(value) => handleTeamSelect(value, true)}
                          defaultValue={field.value}
                          disabled={loadingTeams}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Team wählen..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">Manuell eingeben</SelectItem>
                            {teams.map((team) => (
                              <SelectItem key={team.id} value={team.id}>
                                {team.name} {team.is_own_team && '(Eigenes Team)'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="away_team_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gastmannschaft</FormLabel>
                        <Select
                          onValueChange={(value) => handleTeamSelect(value, false)}
                          defaultValue={field.value}
                          disabled={loadingTeams}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Team wählen..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">Manuell eingeben</SelectItem>
                            {teams.map((team) => (
                              <SelectItem key={team.id} value={team.id}>
                                {team.name} {team.is_own_team && '(Eigenes Team)'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Manual team name inputs if no team selected */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {!form.watch('home_team_id') && (
                    <FormField
                      control={form.control}
                      name="home_team"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Heimmannschaft (Manuell)</FormLabel>
                          <FormControl>
                            <Input placeholder="Teamname eingeben..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {!form.watch('away_team_id') && (
                    <FormField
                      control={form.control}
                      name="away_team"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gastmannschaft (Manuell)</FormLabel>
                          <FormControl>
                            <Input placeholder="Teamname eingeben..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                {/* Score (only for completed matches) */}
                {watchStatus === 'completed' && (
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="home_score"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Heimtore</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              placeholder="0"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="away_score"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gasttore</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              placeholder="0"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Match Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconCalendar className="w-5 h-5" />
                  Spieldetails
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="match_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Datum</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="match_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Uhrzeit</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <IconClock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <Input
                              type="time"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Spielort</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <IconMapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <Input
                            placeholder="z.B. Sportplatz Wertheim"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Stadion oder Sportplatz
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
            {/* Match Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Einstellungen</CardTitle>
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
                          <SelectItem value="scheduled">Geplant</SelectItem>
                          <SelectItem value="live">Live</SelectItem>
                          <SelectItem value="completed">Beendet</SelectItem>
                          <SelectItem value="cancelled">Abgesagt</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="match_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Spieltyp</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Typ wählen" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="league">Liga</SelectItem>
                          <SelectItem value="cup">Pokal</SelectItem>
                          <SelectItem value="friendly">Freundschaftsspiel</SelectItem>
                          <SelectItem value="tournament">Turnier</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="season"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Saison</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Saison wählen" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="2025/26">2025/26</SelectItem>
                          <SelectItem value="2024/25">2024/25</SelectItem>
                          <SelectItem value="2023/24">2023/24</SelectItem>
                        </SelectContent>
                      </Select>
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
                    {isSubmitting
                      ? 'Speichern...'
                      : matchId
                      ? 'Änderungen speichern'
                      : 'Spiel erstellen'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push('/admin/matches')}
                  >
                    Abbrechen
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