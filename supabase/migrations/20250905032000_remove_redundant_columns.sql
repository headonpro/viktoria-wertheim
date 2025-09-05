-- Migration: Remove redundant columns from teams table
-- Purpose: Clean up redundant statistical fields that are now managed in league_standings
-- This completes the migration to a single source of truth for team statistics

-- First, verify that all teams have league_standings entries
DO $$
DECLARE
    v_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_count
    FROM teams t
    LEFT JOIN league_standings ls ON t.id = ls.team_id AND t.season = ls.season
    WHERE ls.id IS NULL;
    
    IF v_count > 0 THEN
        RAISE EXCEPTION 'Cannot remove columns: % teams still without league_standings entries', v_count;
    END IF;
END $$;

-- Drop redundant columns from teams table
-- These statistics are now maintained in league_standings table
ALTER TABLE teams 
    DROP COLUMN IF EXISTS table_position,
    DROP COLUMN IF EXISTS points,
    DROP COLUMN IF EXISTS games_played,
    DROP COLUMN IF EXISTS wins,
    DROP COLUMN IF EXISTS draws,
    DROP COLUMN IF EXISTS losses,
    DROP COLUMN IF EXISTS goals_for,
    DROP COLUMN IF EXISTS goals_against;

-- Add comments to document the new structure
COMMENT ON TABLE teams IS 'Team metadata only. Statistics are maintained in league_standings table.';
COMMENT ON TABLE league_standings IS 'Single source of truth for all team statistics, positions, and league-related data.';

-- Clean up any duplicate league_standings entries (keep the most recent)
WITH duplicates AS (
    SELECT 
        id,
        ROW_NUMBER() OVER (
            PARTITION BY team_id, season, league 
            ORDER BY updated_at DESC
        ) as rn
    FROM league_standings
)
DELETE FROM league_standings
WHERE id IN (
    SELECT id FROM duplicates WHERE rn > 1
);

-- Ensure unique constraint on league_standings
ALTER TABLE league_standings 
    DROP CONSTRAINT IF EXISTS league_standings_team_unique;

ALTER TABLE league_standings
    ADD CONSTRAINT league_standings_team_unique 
    UNIQUE (team_id, season, league);

-- Create a function to get team statistics (for backwards compatibility)
CREATE OR REPLACE FUNCTION get_team_statistics(p_team_id UUID)
RETURNS TABLE (
    position INTEGER,
    points INTEGER,
    games_played INTEGER,
    wins INTEGER,
    draws INTEGER,
    losses INTEGER,
    goals_for INTEGER,
    goals_against INTEGER,
    goal_difference INTEGER,
    form_string VARCHAR(5)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ls.position,
        ls.points,
        ls.played as games_played,
        ls.won as wins,
        ls.drawn as draws,
        ls.lost as losses,
        ls.goals_for,
        ls.goals_against,
        ls.goal_difference,
        COALESCE(tf.form_string, ''::VARCHAR(5)) as form_string
    FROM league_standings ls
    LEFT JOIN team_form tf ON ls.team_id = tf.team_id
    WHERE ls.team_id = p_team_id
    ORDER BY ls.updated_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Update the teams table to have better constraints
ALTER TABLE teams
    ALTER COLUMN name SET NOT NULL,
    ALTER COLUMN season SET NOT NULL,
    ALTER COLUMN team_type SET NOT NULL;

-- Add index for better performance on common queries
CREATE INDEX IF NOT EXISTS idx_teams_season_type 
    ON teams(season, team_type);

-- Log the migration completion
DO $$
BEGIN
    RAISE NOTICE 'Successfully removed redundant columns from teams table';
    RAISE NOTICE 'All team statistics are now maintained in league_standings table';
    RAISE NOTICE 'Use team_statistics_view or get_team_statistics() function to access team stats';
END $$;