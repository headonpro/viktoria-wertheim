/**
 * Extended types for league standings with team details
 * Provides better readability and usability for UI components
 */

export interface LeagueStandingDetailed {
  // Base league standing fields
  id: string;
  team_id: string | null;
  position: number;
  played: number | null;
  won: number | null;
  drawn: number | null;
  lost: number | null;
  goals_for: number | null;
  goals_against: number | null;
  goal_difference: number | null;
  points: number | null;
  trend: 'up' | 'down' | 'neutral' | null;
  season: string | null;
  updated_at: string | null;

  // Extended team details
  team_name: string | null;
  team_short_name: string | null;
  league_name: string | null;
  team_type: 'first' | 'second' | 'third' | 'youth' | null;
  is_own_team: boolean | null;
  coach: string | null;
  captain: string | null;

  // Computed fields for better UX
  league_category: 'Kreisliga' | 'Kreisklasse A' | 'Kreisklasse B' | 'Andere Liga';
  team_type_display: 'Erste Mannschaft' | 'Zweite Mannschaft' | 'Dritte Mannschaft' | 'Jugendmannschaft' | 'Unbekannt';
}

export interface LeagueStandingFilters {
  league_category?: string;
  team_type?: string;
  season?: string;
  is_own_team?: boolean;
}

export interface LeagueTableSection {
  title: string;
  teams: LeagueStandingDetailed[];
  league_category: string;
}

// Trend helpers
export const TrendConfig = {
  up: {
    icon: '⬆️',
    label: 'Aufwärtstrend',
    color: 'text-green-600'
  },
  down: {
    icon: '⬇️',
    label: 'Abwärtstrend',
    color: 'text-red-600'
  },
  neutral: {
    icon: '➡️',
    label: 'Stabil',
    color: 'text-gray-600'
  }
} as const;

export type TrendType = keyof typeof TrendConfig;