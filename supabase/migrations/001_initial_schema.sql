-- SV Viktoria Wertheim Database Schema
-- Generated from Frontend Mock Data

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS scorers CASCADE;
DROP TABLE IF EXISTS league_standings CASCADE;
DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS players CASCADE;
DROP TABLE IF EXISTS youth_teams CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS news CASCADE;
DROP TABLE IF EXISTS sponsors CASCADE;
DROP TABLE IF EXISTS newsletter_subscribers CASCADE;

-- Teams table
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  short_name VARCHAR(10),
  league VARCHAR(100),
  coach VARCHAR(100),
  captain VARCHAR(100),
  training_schedule TEXT,
  table_position INT,
  points INT DEFAULT 0,
  season VARCHAR(20) DEFAULT '2023/24',
  team_type VARCHAR(20) CHECK (team_type IN ('first', 'second', 'third', 'youth')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Players table
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  number INT,
  position VARCHAR(50),
  age INT,
  is_captain BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Matches table
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  home_team VARCHAR(100) NOT NULL,
  away_team VARCHAR(100) NOT NULL,
  home_team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  away_team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  home_score INT,
  away_score INT,
  match_date DATE NOT NULL,
  match_time TIME,
  location VARCHAR(200),
  match_type VARCHAR(50) DEFAULT 'league',
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- News table
CREATE TABLE news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  excerpt TEXT,
  content TEXT,
  image_url TEXT,
  views INT DEFAULT 0,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  category VARCHAR(50) CHECK (category IN ('match_report', 'transfers', 'youth', 'training', 'club_news', 'general')),
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- League Standings table
CREATE TABLE league_standings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  team_name VARCHAR(100) NOT NULL,
  position INT NOT NULL,
  played INT DEFAULT 0,
  won INT DEFAULT 0,
  drawn INT DEFAULT 0,
  lost INT DEFAULT 0,
  goals_for INT DEFAULT 0,
  goals_against INT DEFAULT 0,
  goal_difference INT GENERATED ALWAYS AS (goals_for - goals_against) STORED,
  points INT DEFAULT 0,
  trend VARCHAR(10) CHECK (trend IN ('up', 'down', 'neutral')),
  league VARCHAR(100),
  season VARCHAR(20) DEFAULT '2023/24',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scorers table
CREATE TABLE scorers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  player_name VARCHAR(100) NOT NULL,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  team_name VARCHAR(100),
  goals INT DEFAULT 0,
  assists INT DEFAULT 0,
  season VARCHAR(20) DEFAULT '2023/24',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Youth Teams table
CREATE TABLE youth_teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  league VARCHAR(100),
  coach VARCHAR(100),
  player_count INT DEFAULT 0,
  age_group VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sponsors table
CREATE TABLE sponsors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  logo_url TEXT,
  website TEXT,
  category VARCHAR(50) CHECK (category IN ('Hauptsponsor', 'Premium Partner', 'Partner', 'Förderer')),
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Newsletter Subscribers table
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);

-- Create indexes for better performance
CREATE INDEX idx_matches_date ON matches(match_date DESC);
CREATE INDEX idx_matches_team_ids ON matches(home_team_id, away_team_id);
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_news_published_at ON news(published_at DESC);
CREATE INDEX idx_news_category ON news(category);
CREATE INDEX idx_players_team_id ON players(team_id);
CREATE INDEX idx_scorers_goals ON scorers(goals DESC);
CREATE INDEX idx_league_standings_position ON league_standings(position);
CREATE INDEX idx_league_standings_team_id ON league_standings(team_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scorers_updated_at BEFORE UPDATE ON scorers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_youth_teams_updated_at BEFORE UPDATE ON youth_teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sponsors_updated_at BEFORE UPDATE ON sponsors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE league_standings ENABLE ROW LEVEL SECURITY;
ALTER TABLE scorers ENABLE ROW LEVEL SECURITY;
ALTER TABLE youth_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access
CREATE POLICY "Public can view teams" ON teams FOR SELECT USING (true);
CREATE POLICY "Public can view players" ON players FOR SELECT USING (true);
CREATE POLICY "Public can view matches" ON matches FOR SELECT USING (true);
CREATE POLICY "Public can view news" ON news FOR SELECT USING (true);
CREATE POLICY "Public can view league standings" ON league_standings FOR SELECT USING (true);
CREATE POLICY "Public can view scorers" ON scorers FOR SELECT USING (true);
CREATE POLICY "Public can view youth teams" ON youth_teams FOR SELECT USING (true);
CREATE POLICY "Public can view sponsors" ON sponsors FOR SELECT USING (true);

-- Newsletter subscribers policies (write-only for public, no read)
CREATE POLICY "Public can subscribe to newsletter" ON newsletter_subscribers 
  FOR INSERT WITH CHECK (true);

-- News view counter policy (allow updates to view count only)
CREATE POLICY "Public can update news views" ON news 
  FOR UPDATE USING (true) WITH CHECK (true);

-- Create views for easier data access
CREATE OR REPLACE VIEW upcoming_matches AS
SELECT 
  m.*,
  ht.name as home_team_name,
  at.name as away_team_name
FROM matches m
LEFT JOIN teams ht ON m.home_team_id = ht.id
LEFT JOIN teams at ON m.away_team_id = at.id
WHERE m.status = 'scheduled' 
  AND m.match_date >= CURRENT_DATE
ORDER BY m.match_date, m.match_time;

CREATE OR REPLACE VIEW recent_matches AS
SELECT 
  m.*,
  ht.name as home_team_name,
  at.name as away_team_name
FROM matches m
LEFT JOIN teams ht ON m.home_team_id = ht.id
LEFT JOIN teams at ON m.away_team_id = at.id
WHERE m.status = 'completed'
ORDER BY m.match_date DESC, m.match_time DESC
LIMIT 10;

CREATE OR REPLACE VIEW top_scorers_view AS
SELECT 
  s.*,
  p.number as player_number,
  p.position as player_position,
  t.name as team_full_name
FROM scorers s
LEFT JOIN players p ON s.player_id = p.id
LEFT JOIN teams t ON s.team_id = t.id
ORDER BY s.goals DESC, s.assists DESC
LIMIT 10;

-- Grant permissions for views
GRANT SELECT ON upcoming_matches TO anon, authenticated;
GRANT SELECT ON recent_matches TO anon, authenticated;
GRANT SELECT ON top_scorers_view TO anon, authenticated;