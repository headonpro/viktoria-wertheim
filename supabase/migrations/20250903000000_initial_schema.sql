-- Initial Schema Migration for Viktoria Wertheim
-- This migration sets up the complete database structure

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    short_name VARCHAR(20),
    league VARCHAR(100),
    coach VARCHAR(100),
    captain VARCHAR(100),
    training_schedule TEXT,
    table_position INTEGER DEFAULT 0,
    points INTEGER DEFAULT 0,
    season VARCHAR(20) DEFAULT '2025/26',
    team_type VARCHAR(20) DEFAULT 'first',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    games_played INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0,
    draws INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    goals_for INTEGER DEFAULT 0,
    goals_against INTEGER DEFAULT 0,
    CONSTRAINT teams_name_unique UNIQUE (name, season, team_type)
);

-- Players table
CREATE TABLE IF NOT EXISTS players (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    number INTEGER,
    position VARCHAR(50),
    age INTEGER,
    is_captain BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Matches table
CREATE TABLE IF NOT EXISTS matches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    home_team VARCHAR(100),
    away_team VARCHAR(100),
    home_team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    away_team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    home_score INTEGER,
    away_score INTEGER,
    match_date DATE NOT NULL,
    match_time TIME,
    location VARCHAR(200),
    match_type VARCHAR(50) DEFAULT 'league',
    status VARCHAR(20) DEFAULT 'scheduled',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT matches_unique UNIQUE (match_date, home_team, away_team, match_type)
);

-- News table  
CREATE TABLE IF NOT EXISTS news (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    excerpt TEXT,
    content TEXT,
    image_url TEXT,
    views INTEGER DEFAULT 0,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    category VARCHAR(50) DEFAULT 'general',
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sponsors table
CREATE TABLE IF NOT EXISTS sponsors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    logo_url TEXT,
    website TEXT,
    category VARCHAR(50) DEFAULT 'sponsor',
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Contacts table
CREATE TABLE IF NOT EXISTS contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    role VARCHAR(100),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(30),
    order_position INTEGER DEFAULT 999,
    department VARCHAR(50) DEFAULT 'Vorstand',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT contacts_name_unique UNIQUE (name, department)
);

-- Newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT true,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMP WITH TIME ZONE
);

-- Youth teams table
CREATE TABLE IF NOT EXISTS youth_teams (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    league VARCHAR(100),
    coach VARCHAR(100),
    player_count INTEGER DEFAULT 0,
    age_group VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Scorers table
CREATE TABLE IF NOT EXISTS scorers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    player_name VARCHAR(100),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    team_name VARCHAR(100),
    goals INTEGER DEFAULT 0,
    assists INTEGER DEFAULT 0,
    season VARCHAR(20) DEFAULT '2025/26',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- League standings table
CREATE TABLE IF NOT EXISTS league_standings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    team_name VARCHAR(100) NOT NULL,
    position INTEGER NOT NULL,
    played INTEGER DEFAULT 0,
    won INTEGER DEFAULT 0,
    drawn INTEGER DEFAULT 0,
    lost INTEGER DEFAULT 0,
    goals_for INTEGER DEFAULT 0,
    goals_against INTEGER DEFAULT 0,
    goal_difference INTEGER GENERATED ALWAYS AS (goals_for - goals_against) STORED,
    points INTEGER DEFAULT 0,
    trend VARCHAR(10),
    league VARCHAR(100),
    season VARCHAR(20) DEFAULT '2025/26',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT league_standings_team_unique UNIQUE (team_id, season, league)
);

-- Create views
CREATE OR REPLACE VIEW recent_matches AS
SELECT * FROM matches
WHERE match_date <= CURRENT_DATE AND status = 'completed'
ORDER BY match_date DESC, match_time DESC;

CREATE OR REPLACE VIEW upcoming_matches AS
SELECT * FROM matches
WHERE match_date >= CURRENT_DATE AND status != 'completed'
ORDER BY match_date ASC, match_time ASC;

CREATE OR REPLACE VIEW top_scorers_view AS
SELECT 
    s.*,
    p.number as player_number,
    p.position as player_position,
    t.name as team_full_name
FROM scorers s
LEFT JOIN players p ON s.player_id = p.id
LEFT JOIN teams t ON s.team_id = t.id
WHERE s.goals > 0 OR s.assists > 0
ORDER BY s.goals DESC, s.assists DESC;

-- Create triggers for updated_at
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sponsors_updated_at BEFORE UPDATE ON sponsors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_youth_teams_updated_at BEFORE UPDATE ON youth_teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scorers_updated_at BEFORE UPDATE ON scorers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_league_standings_updated_at BEFORE UPDATE ON league_standings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();