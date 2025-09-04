-- Performance Indexes for Database Optimization
-- Created: 2025-09-05

-- 1. Indexes on Foreign Keys (crucial for JOIN performance)
CREATE INDEX IF NOT EXISTS idx_players_team_id ON players(team_id);
CREATE INDEX IF NOT EXISTS idx_matches_home_team_id ON matches(home_team_id);
CREATE INDEX IF NOT EXISTS idx_matches_away_team_id ON matches(away_team_id);
CREATE INDEX IF NOT EXISTS idx_league_standings_team_id ON league_standings(team_id);

-- 2. Date-based indexes for time queries
CREATE INDEX IF NOT EXISTS idx_matches_date ON matches(match_date DESC);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON news(created_at DESC);

-- 3. Status and filtering indexes
CREATE INDEX IF NOT EXISTS idx_players_active ON players(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_sponsors_is_active ON sponsors(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);

-- 4. Text search optimization (for news and player search)
CREATE INDEX IF NOT EXISTS idx_news_title_search ON news USING gin(to_tsvector('german', title));
CREATE INDEX IF NOT EXISTS idx_news_content_search ON news USING gin(to_tsvector('german', content));
CREATE INDEX IF NOT EXISTS idx_players_name ON players(LOWER(name));
CREATE INDEX IF NOT EXISTS idx_teams_name ON teams(LOWER(name));

-- 5. Composite indexes for common query patterns
-- Matches by team and date
CREATE INDEX IF NOT EXISTS idx_matches_home_team_date ON matches(home_team_id, match_date DESC);
CREATE INDEX IF NOT EXISTS idx_matches_away_team_date ON matches(away_team_id, match_date DESC);

-- Players by team and position
CREATE INDEX IF NOT EXISTS idx_players_team_position ON players(team_id, position) WHERE is_active = true;

-- League standings by league and position
CREATE INDEX IF NOT EXISTS idx_standings_league_position ON league_standings(league, position);

-- 6. Unique constraints to prevent duplicates
-- Prevent duplicate players in same team
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_player_team ON players(LOWER(name), team_id) 
WHERE team_id IS NOT NULL;

-- Prevent duplicate matches
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_match ON matches(home_team_id, away_team_id, match_date);

-- Prevent duplicate standings entries
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_standings ON league_standings(team_id, league, season)
WHERE season IS NOT NULL;

-- 7. Partial indexes for common filters
-- Only upcoming matches
CREATE INDEX IF NOT EXISTS idx_matches_upcoming ON matches(match_date) 
WHERE match_date >= CURRENT_DATE AND status != 'completed'::varchar;

-- Only published news
CREATE INDEX IF NOT EXISTS idx_news_published ON news(published_at DESC) 
WHERE published_at IS NOT NULL;

-- 8. Update table statistics for query planner
ANALYZE teams;
ANALYZE players;
ANALYZE matches;
ANALYZE news;
ANALYZE sponsors;
ANALYZE league_standings;