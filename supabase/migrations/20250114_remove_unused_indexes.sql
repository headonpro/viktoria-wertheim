-- Remove unused indexes identified by Supabase performance advisor
-- These indexes have never been used and can be safely removed to improve write performance
-- Applied on: 2025-01-14

-- Newsletter History indexes
DROP INDEX IF EXISTS public.idx_newsletter_history_sent_at;
DROP INDEX IF EXISTS public.idx_newsletter_history_sent_by;

-- Matches indexes (keeping unique constraints and frequently used ones)
DROP INDEX IF EXISTS public.idx_matches_away_team_date;
DROP INDEX IF EXISTS public.idx_matches_away_team_id;
DROP INDEX IF EXISTS public.idx_matches_home_team_date;
DROP INDEX IF EXISTS public.idx_matches_home_team_id;

-- Players indexes (keeping unique constraint)
DROP INDEX IF EXISTS public.idx_players_active;
DROP INDEX IF EXISTS public.idx_players_name;
DROP INDEX IF EXISTS public.idx_players_team_id;
DROP INDEX IF EXISTS public.idx_players_team_position;

-- Scorers indexes
DROP INDEX IF EXISTS public.idx_scorers_team_id;

-- League Standings indexes (keeping unique constraint)
DROP INDEX IF EXISTS public.idx_league_standings_team_id;

-- Teams indexes (keeping unique constraint)
DROP INDEX IF EXISTS public.idx_teams_is_own_team;
DROP INDEX IF EXISTS public.idx_teams_name;
DROP INDEX IF EXISTS public.idx_teams_season_type;

-- Match Events indexes
DROP INDEX IF EXISTS public.idx_match_events_match_id;
DROP INDEX IF EXISTS public.idx_match_events_player_id;
DROP INDEX IF EXISTS public.idx_match_events_team_id;

-- News indexes (full-text search and temporal indexes)
DROP INDEX IF EXISTS public.idx_news_content_search;
DROP INDEX IF EXISTS public.idx_news_created_at;
DROP INDEX IF EXISTS public.idx_news_published;
DROP INDEX IF EXISTS public.idx_news_published_at;
DROP INDEX IF EXISTS public.idx_news_title_search;

-- Sponsors indexes
DROP INDEX IF EXISTS public.idx_sponsors_is_active;

-- Add comment to track this optimization
COMMENT ON TABLE public.matches IS 'Optimized indexes on 2025-01-14 - removed unused indexes based on Supabase advisor recommendations';

-- Summary of optimization:
-- Removed 25 unused indexes that were identified by Supabase performance advisor
-- Kept only essential indexes for:
--   - Unique constraints (data integrity)
--   - Foreign key relationships
--   - Frequently used query patterns (date, status)
-- Expected improvements:
--   - Faster INSERT/UPDATE operations
--   - Reduced storage usage
--   - Better VACUUM and ANALYZE performance