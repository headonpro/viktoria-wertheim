// API Types & Schemas
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: unknown
  }
  meta?: {
    page?: number
    limit?: number
    total?: number
    timestamp: string
  }
}

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface ApiError {
  code: string
  message: string
  statusCode: number
  details?: unknown
}

// Team Types
export interface Team {
  id: string
  name: string
  short_name: string
  logo_url?: string
  founded_year?: number
  description?: string
  category: string
  league?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateTeamRequest {
  name: string
  short_name: string
  category: string
  league?: string
  logo_url?: string
  founded_year?: number
  description?: string
}

// Player Types
export interface Player {
  id: string
  team_id: string
  name: string
  number?: number
  position?: string
  age?: number
  is_captain: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreatePlayerRequest {
  team_id: string
  name: string
  number?: number
  position?: string
  age?: number
  is_captain?: boolean
}

// Match Types
export interface Match {
  id: string
  home_team_id: string
  away_team_id: string
  home_team: string
  away_team: string
  match_date: string
  kickoff_time?: string
  league: string
  matchday?: number
  home_score?: number
  away_score?: number
  status: 'scheduled' | 'live' | 'completed' | 'cancelled'
  venue?: string
  referee?: string
  weather?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface CreateMatchRequest {
  home_team_id: string
  away_team_id: string
  match_date: string
  kickoff_time?: string
  league: string
  matchday?: number
  venue?: string
}

export interface UpdateMatchRequest {
  home_score?: number
  away_score?: number
  status?: 'scheduled' | 'live' | 'completed' | 'cancelled'
  referee?: string
  weather?: string
  notes?: string
}

// News Types
export interface NewsArticle {
  id: string
  title: string
  content: string
  summary?: string
  author?: string
  image_url?: string
  published_at?: string
  is_published: boolean
  is_featured: boolean
  category?: string
  tags?: string[]
  views: number
  created_at: string
  updated_at: string
}

export interface CreateNewsRequest {
  title: string
  content: string
  summary?: string
  author?: string
  image_url?: string
  category?: string
  tags?: string[]
  is_featured?: boolean
}

// League Standings Types
export interface LeagueStanding {
  id: string
  team_id: string
  team_name: string
  league: string
  season: string
  position: number
  games_played: number
  wins: number
  draws: number
  losses: number
  goals_for: number
  goals_against: number
  goal_difference: number
  points: number
  form?: string[]
  trend: 'up' | 'down' | 'neutral'
  created_at: string
  updated_at: string
}

export interface UpdateStandingRequest {
  position: number
  games_played: number
  wins: number
  draws: number
  losses: number
  goals_for: number
  goals_against: number
  points: number
  form?: string[]
  trend?: 'up' | 'down' | 'neutral'
}

// Contact Types
export interface ContactSubmission {
  name: string
  email: string
  subject: string
  message: string
}

// Validation
export const VALIDATION = {
  TEAM_NAME_MAX_LENGTH: 100,
  PLAYER_NAME_MAX_LENGTH: 100,
  NEWS_TITLE_MAX_LENGTH: 200,
  NEWS_SUMMARY_MAX_LENGTH: 500,
  CONTACT_SUBJECT_MAX_LENGTH: 200,
  CONTACT_MESSAGE_MAX_LENGTH: 2000,
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const