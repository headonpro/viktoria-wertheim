-- Migration: Fix redundant data in views
-- Purpose: Update views to use league_standings as single source of truth for statistics
-- This eliminates data sync issues between teams and league_standings tables

-- Drop existing view to recreate it
DROP VIEW IF EXISTS team_statistics_view CASCADE;

-- Recreate team_statistics_view using league_standings as source for statistics
CREATE OR REPLACE VIEW team_statistics_view AS
SELECT 
    t.id,
    t.name,
    t.short_name,
    t.league,
    t.coach,
    t.captain,
    t.training_schedule,
    -- Use data from league_standings for statistics (single source of truth)
    COALESCE(ls.position, 0) as table_position,
    COALESCE(ls.points, 0) as points,
    t.season,
    t.team_type,
    t.created_at,
    t.updated_at,
    COALESCE(ls.played, 0) as games_played,
    COALESCE(ls.won, 0) as wins,
    COALESCE(ls.drawn, 0) as draws,
    COALESCE(ls.lost, 0) as losses,
    COALESCE(ls.goals_for, 0) as goals_for,
    COALESCE(ls.goals_against, 0) as goals_against,
    -- Additional calculated fields
    COALESCE(ls.position, 0) as current_position,
    COALESCE(ls.points, 0) as current_points,
    COALESCE(ls.goal_difference, 0) as goal_difference,
    COALESCE(tf.form_string, '') as form_string,
    COALESCE(tf.form_points, 0) as recent_form_points,
    CASE 
        WHEN COALESCE(ls.played, 0) > 0 
        THEN ROUND((COALESCE(ls.won, 0)::numeric / ls.played::numeric) * 100, 1)
        ELSE 0
    END as win_percentage,
    CASE 
        WHEN COALESCE(ls.played, 0) > 0 
        THEN ROUND(COALESCE(ls.goals_for, 0)::numeric / ls.played::numeric, 1)
        ELSE 0
    END as avg_goals_per_game
FROM teams t
LEFT JOIN league_standings ls ON t.id = ls.team_id AND t.season = ls.season
LEFT JOIN team_form tf ON t.id = tf.team_id;

-- Create helper function to ensure league_standings exists for all teams
CREATE OR REPLACE FUNCTION ensure_league_standings_for_team(p_team_id UUID)
RETURNS void AS $$
DECLARE
    v_team_record RECORD;
BEGIN
    -- Get team information
    SELECT * INTO v_team_record FROM teams WHERE id = p_team_id;
    
    IF v_team_record IS NULL THEN
        RETURN;
    END IF;
    
    -- Check if league_standings entry exists
    IF NOT EXISTS (
        SELECT 1 FROM league_standings 
        WHERE team_id = p_team_id AND season = v_team_record.season
    ) THEN
        -- Create initial league_standings entry
        INSERT INTO league_standings (
            team_id,
            team_name,
            position,
            played,
            won,
            drawn,
            lost,
            goals_for,
            goals_against,
            points,
            league,
            season
        ) VALUES (
            p_team_id,
            v_team_record.name,
            999, -- Will be recalculated
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            v_team_record.league,
            v_team_record.season
        );
        
        -- Trigger recalculation
        PERFORM calculate_league_table(v_team_record.season);
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Ensure all existing teams have league_standings entries
DO $$
DECLARE
    team_record RECORD;
BEGIN
    FOR team_record IN SELECT id FROM teams
    LOOP
        PERFORM ensure_league_standings_for_team(team_record.id);
    END LOOP;
END $$;

-- Update trigger to ensure league_standings entry on team creation
CREATE OR REPLACE FUNCTION on_team_created()
RETURNS TRIGGER AS $$
BEGIN
    -- Ensure league_standings entry exists for new team
    PERFORM ensure_league_standings_for_team(NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger if it doesn't exist
DROP TRIGGER IF EXISTS ensure_league_standings_on_team_create ON teams;
CREATE TRIGGER ensure_league_standings_on_team_create
    AFTER INSERT ON teams
    FOR EACH ROW
    EXECUTE FUNCTION on_team_created();

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_league_standings_team_season 
    ON league_standings(team_id, season);

-- Update function to handle teams without league standings gracefully
CREATE OR REPLACE FUNCTION get_team_stats(p_team_id UUID)
RETURNS TABLE (
    team_id UUID,
    team_name VARCHAR(100),
    position INTEGER,
    points INTEGER,
    played INTEGER,
    won INTEGER,
    drawn INTEGER,
    lost INTEGER,
    goals_for INTEGER,
    goals_against INTEGER,
    goal_difference INTEGER
) AS $$
BEGIN
    -- First ensure league standings exist
    PERFORM ensure_league_standings_for_team(p_team_id);
    
    -- Return the stats
    RETURN QUERY
    SELECT 
        ls.team_id,
        ls.team_name,
        ls.position,
        ls.points,
        ls.played,
        ls.won,
        ls.drawn,
        ls.lost,
        ls.goals_for,
        ls.goals_against,
        ls.goal_difference
    FROM league_standings ls
    WHERE ls.team_id = p_team_id
    ORDER BY ls.season DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Add comment explaining the new structure
COMMENT ON VIEW team_statistics_view IS 'Unified view combining team metadata with league statistics. Statistics are sourced from league_standings table to maintain single source of truth.';

-- Verify the migration
DO $$
DECLARE
    v_count INTEGER;
BEGIN
    -- Check if all teams have corresponding league_standings
    SELECT COUNT(*) INTO v_count
    FROM teams t
    LEFT JOIN league_standings ls ON t.id = ls.team_id AND t.season = ls.season
    WHERE ls.id IS NULL;
    
    IF v_count > 0 THEN
        RAISE WARNING 'Found % teams without league_standings entries', v_count;
    ELSE
        RAISE NOTICE 'All teams have corresponding league_standings entries';
    END IF;
END $$;