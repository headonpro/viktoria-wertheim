'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import type {
  LeagueStandingDetailed,
  LeagueStandingFilters,
  TrendType
} from '@/lib/types/league.types';
import { TrendConfig } from '@/lib/types/league.types';
import { IconSearch, IconFilter } from '@tabler/icons-react';

export default function LeagueStandingsTable() {
  const [standings, setStandings] = useState<LeagueStandingDetailed[]>([]);
  const [filteredStandings, setFilteredStandings] = useState<LeagueStandingDetailed[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<LeagueStandingFilters>({
    season: '2025/26'
  });

  // Available filter options
  const [leagueCategories, setLeagueCategories] = useState<string[]>([]);
  const [seasons, setSeasons] = useState<string[]>([]);

  useEffect(() => {
    loadData();
    loadFilterOptions();
  }, []);

  useEffect(() => {
    loadStandings();
  }, [filters]);

  useEffect(() => {
    filterStandings();
  }, [standings, searchTerm]);

  const loadData = async () => {
    setLoading(true);
    await loadStandings();
    setLoading(false);
  };

  const loadStandings = async () => {
    try {
      const supabase = createClient();

      let query = supabase
        .from('league_standings')
        .select(`
          *,
          teams (
            name,
            short_name,
            league,
            team_type,
            is_own_team,
            coach,
            captain
          )
        `);

      // Apply filters
      if (filters.season) {
        query = query.eq('season', filters.season);
      }

      query = query.order('position');

      const { data: standingsData, error } = await query;

      if (error) {
        console.error('Error fetching standings:', error);
        setStandings([]);
        return;
      }

      // Transform to expected format
      const result = (standingsData || []).map(item => ({
        ...item,
        team_name: (item.teams as any)?.name || null,
        team_short_name: (item.teams as any)?.short_name || null,
        league_name: (item.teams as any)?.league || null,
        team_type: (item.teams as any)?.team_type || null,
        is_own_team: (item.teams as any)?.is_own_team || null,
        coach: (item.teams as any)?.coach || null,
        captain: (item.teams as any)?.captain || null,
        league_category: ((item.teams as any)?.league?.includes('Kreisliga') ? 'Kreisliga' :
                        (item.teams as any)?.league?.includes('Kreisklasse A') ? 'Kreisklasse A' :
                        (item.teams as any)?.league?.includes('Kreisklasse B') ? 'Kreisklasse B' : 'Andere Liga') as 'Kreisliga' | 'Kreisklasse A' | 'Kreisklasse B' | 'Andere Liga',
        team_type_display: ((item.teams as any)?.team_type === 'first' ? 'Erste Mannschaft' :
                          (item.teams as any)?.team_type === 'second' ? 'Zweite Mannschaft' :
                          (item.teams as any)?.team_type === 'third' ? 'Dritte Mannschaft' :
                          (item.teams as any)?.team_type === 'youth' ? 'Jugendmannschaft' : 'Unbekannt') as 'Erste Mannschaft' | 'Zweite Mannschaft' | 'Dritte Mannschaft' | 'Jugendmannschaft' | 'Unbekannt'
      })) as LeagueStandingDetailed[];

      // Apply post-query filters
      let filteredResult = result;
      if (filters.league_category) {
        filteredResult = result.filter(item => item.league_category === filters.league_category);
      }
      if (filters.team_type) {
        filteredResult = filteredResult.filter(item => item.team_type === filters.team_type);
      }
      if (filters.is_own_team !== undefined) {
        filteredResult = filteredResult.filter(item => item.is_own_team === filters.is_own_team);
      }

      setStandings(filteredResult);
    } catch (error) {
      console.error('Error loading standings:', error);
      setStandings([]);
    }
  };

  const loadFilterOptions = async () => {
    try {
      const supabase = createClient();

      // Load league categories
      const { data: teamsData } = await supabase
        .from('teams')
        .select('league')
        .not('league', 'is', null);

      const categories = (teamsData || [])
        .map(item => {
          const league = item.league;
          if (league?.includes('Kreisliga')) return 'Kreisliga';
          if (league?.includes('Kreisklasse A')) return 'Kreisklasse A';
          if (league?.includes('Kreisklasse B')) return 'Kreisklasse B';
          return 'Andere Liga';
        })
        .filter((value, index, self) => self.indexOf(value) === index)
        .sort();

      // Load seasons
      const { data: seasonsData } = await supabase
        .from('league_standings')
        .select('season')
        .not('season', 'is', null);

      const availableSeasons = [...new Set((seasonsData || []).map(item => item.season))]
        .filter(Boolean)
        .sort((a, b) => b!.localeCompare(a!)) as string[];

      setLeagueCategories(categories);
      setSeasons(availableSeasons);
    } catch (error) {
      console.error('Error loading filter options:', error);
    }
  };

  const filterStandings = () => {
    let filtered = standings;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        standing =>
          standing.team_name?.toLowerCase().includes(term) ||
          standing.league_name?.toLowerCase().includes(term) ||
          standing.coach?.toLowerCase().includes(term)
      );
    }

    setFilteredStandings(filtered);
  };

  const handleFilterChange = (key: keyof LeagueStandingFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? undefined : value
    }));
  };

  const getTrendDisplay = (trend: string | null) => {
    if (!trend || !(trend in TrendConfig)) return null;

    const config = TrendConfig[trend as TrendType];
    return (
      <span className={`inline-flex items-center gap-1 ${config.color}`}>
        <span>{config.icon}</span>
        <span className="text-xs">{config.label}</span>
      </span>
    );
  };

  const getPositionBadgeColor = (position: number, isOwnTeam: boolean) => {
    if (!isOwnTeam) return 'secondary';

    if (position <= 3) return 'default'; // Top 3
    if (position <= 8) return 'secondary'; // Mid-table
    return 'destructive'; // Bottom
  };

  // Group standings by league category
  const standingsByLeague = filteredStandings.reduce((acc, standing) => {
    const category = standing.league_category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(standing);
    return acc;
  }, {} as Record<string, LeagueStandingDetailed[]>);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tabellenstände</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconFilter className="w-5 h-5" />
            Tabellenstände Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Suche Team, Liga, Trainer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Season Filter */}
            <Select
              value={filters.season || 'all'}
              onValueChange={(value) => handleFilterChange('season', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Saison wählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Saisons</SelectItem>
                {seasons.map(season => (
                  <SelectItem key={season} value={season}>
                    {season}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* League Category Filter */}
            <Select
              value={filters.league_category || 'all'}
              onValueChange={(value) => handleFilterChange('league_category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Liga wählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Ligen</SelectItem>
                {leagueCategories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Team Type Filter */}
            <Select
              value={filters.team_type || 'all'}
              onValueChange={(value) => handleFilterChange('team_type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Mannschaft wählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Mannschaften</SelectItem>
                <SelectItem value="first">Erste Mannschaft</SelectItem>
                <SelectItem value="second">Zweite Mannschaft</SelectItem>
                <SelectItem value="third">Dritte Mannschaft</SelectItem>
                <SelectItem value="youth">Jugendmannschaften</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tables by League */}
      {Object.entries(standingsByLeague).map(([category, categoryStandings]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{category}</span>
              <Badge variant="outline">
                {categoryStandings.length} Teams
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Pos.</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Liga</TableHead>
                    <TableHead className="w-16">Sp</TableHead>
                    <TableHead className="w-16">S</TableHead>
                    <TableHead className="w-16">U</TableHead>
                    <TableHead className="w-16">N</TableHead>
                    <TableHead className="w-20">Tore</TableHead>
                    <TableHead className="w-16">Diff</TableHead>
                    <TableHead className="w-16">Pkt</TableHead>
                    <TableHead className="w-24">Trend</TableHead>
                    <TableHead>Trainer</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categoryStandings.map((standing) => (
                    <TableRow key={standing.id}>
                      <TableCell>
                        <Badge
                          variant={getPositionBadgeColor(standing.position, standing.is_own_team || false)}
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                        >
                          {standing.position}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">
                            {standing.team_name}
                            {standing.is_own_team && (
                              <Badge variant="default" className="ml-2 text-xs">
                                Unsere
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            {standing.team_type_display}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {standing.league_name}
                      </TableCell>
                      <TableCell>{standing.played || 0}</TableCell>
                      <TableCell>{standing.won || 0}</TableCell>
                      <TableCell>{standing.drawn || 0}</TableCell>
                      <TableCell>{standing.lost || 0}</TableCell>
                      <TableCell>
                        {standing.goals_for || 0}:{standing.goals_against || 0}
                      </TableCell>
                      <TableCell className={
                        (standing.goal_difference || 0) > 0 ? 'text-green-600' :
                        (standing.goal_difference || 0) < 0 ? 'text-red-600' : ''
                      }>
                        {(standing.goal_difference || 0) > 0 ? '+' : ''}{standing.goal_difference || 0}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {standing.points || 0}
                      </TableCell>
                      <TableCell>
                        {getTrendDisplay(standing.trend)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {standing.coach || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ))}

      {filteredStandings.length === 0 && (
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-gray-500">
              <p>Keine Tabellenstände gefunden.</p>
              <p className="text-sm mt-1">
                Versuchen Sie andere Filter oder Suchbegriffe.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}