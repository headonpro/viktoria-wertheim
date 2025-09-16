/**
 * League Service - Enhanced data access for league standings with team details
 * Provides better readability and filtering capabilities
 */

import { createClient } from '@/lib/supabase/server';
import { createClient as createClientClient } from '@/lib/supabase/client';
import type {
  LeagueStandingDetailed,
  LeagueStandingFilters,
  LeagueTableSection
} from '@/lib/types/league.types';

export class LeagueService {

  /**
   * Get all league standings with team details (Server-side)
   */
  static async getDetailedStandings(
    filters: LeagueStandingFilters = {}
  ): Promise<LeagueStandingDetailed[]> {
    const supabase = await createClient();

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

    if (filters.team_type) {
      query = query.eq('teams.team_type', filters.team_type);
    }

    if (filters.is_own_team !== undefined) {
      query = query.eq('teams.is_own_team', filters.is_own_team);
    }

    query = query.order('position');

    const { data: standingsData, error } = await query;

    if (error) {
      console.error('Error fetching detailed standings:', error);
      return [];
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

    // Apply post-query filters for league_category
    let filteredResult = result;
    if (filters.league_category) {
      filteredResult = result.filter(item => item.league_category === filters.league_category);
    }

    return filteredResult;
  }

  /**
   * Get league standings grouped by league category
   */
  static async getStandingsByLeague(
    season: string = '2025/26'
  ): Promise<LeagueTableSection[]> {
    const standings = await this.getDetailedStandings({ season });

    // Group by league category
    const grouped = standings.reduce((acc, standing) => {
      const category = standing.league_category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(standing);
      return acc;
    }, {} as Record<string, LeagueStandingDetailed[]>);

    // Convert to sections array
    return Object.entries(grouped).map(([category, teams]) => ({
      title: category,
      teams: teams.sort((a, b) => (a.position || 0) - (b.position || 0)),
      league_category: category
    }));
  }

  /**
   * Get standings for our own teams only
   */
  static async getOwnTeamsStandings(
    season: string = '2025/26'
  ): Promise<LeagueStandingDetailed[]> {
    return this.getDetailedStandings({
      season,
      is_own_team: true
    });
  }

  /**
   * Client-side version for components
   */
  static async getDetailedStandingsClient(
    filters: LeagueStandingFilters = {}
  ): Promise<LeagueStandingDetailed[]> {
    // Use same logic as server version for consistency
    return this.getDetailedStandings(filters);
  }

  /**
   * Get available league categories
   */
  static async getLeagueCategories(): Promise<string[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('teams')
      .select('league')
      .not('league', 'is', null);

    if (error) {
      console.error('Error fetching league categories:', error);
      return [];
    }

    // Transform to categories
    const categories = data
      .map(item => {
        const league = item.league;
        if (league?.includes('Kreisliga')) return 'Kreisliga';
        if (league?.includes('Kreisklasse A')) return 'Kreisklasse A';
        if (league?.includes('Kreisklasse B')) return 'Kreisklasse B';
        return 'Andere Liga';
      })
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort();

    return categories;
  }

  /**
   * Get available seasons
   */
  static async getAvailableSeasons(): Promise<string[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('league_standings')
      .select('season')
      .not('season', 'is', null);

    if (error) {
      console.error('Error fetching seasons:', error);
      return [];
    }

    // Get unique seasons, sorted desc
    const seasons = [...new Set(data.map(item => item.season))]
      .filter(Boolean)
      .sort((a, b) => b!.localeCompare(a!));

    return seasons as string[];
  }
}