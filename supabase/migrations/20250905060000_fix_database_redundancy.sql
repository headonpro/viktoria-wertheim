-- Fix database redundancy issues
-- Remove duplicate columns and improve data normalization

-- ============================================
-- STEP 1: Remove redundant columns from league_standings
-- ============================================

-- Drop the redundant team_name column (we have team_id)
ALTER TABLE league_standings DROP COLUMN IF EXISTS team_name;

-- Drop the redundant league column (we get it from teams table)
ALTER TABLE league_standings DROP COLUMN IF EXISTS league;

-- ============================================
-- STEP 2: Remove season from teams table
-- Teams exist across multiple seasons, season belongs in league_standings
-- ============================================

-- First, ensure all teams have a default season if needed for migration
UPDATE teams SET season = '2025/26' WHERE season IS NULL;

-- Remove the season column from teams
ALTER TABLE teams DROP COLUMN IF EXISTS season;

-- ============================================
-- STEP 3: Create a view for easy access with all needed data
-- ============================================

CREATE OR REPLACE VIEW league_standings_view AS
SELECT 
    ls.id,
    ls.team_id,
    t.name as team_name,
    t.short_name,
    t.league,
    t.team_type,
    ls.season,
    ls.position,
    ls.played,
    ls.won,
    ls.drawn,
    ls.lost,
    ls.goals_for,
    ls.goals_against,
    ls.goal_difference,
    ls.points,
    ls.trend,
    ls.updated_at
FROM league_standings ls
JOIN teams t ON ls.team_id = t.id
ORDER BY t.league, ls.position;

-- Grant permissions on the view
GRANT SELECT ON league_standings_view TO anon, authenticated;

-- ============================================
-- STEP 4: Update the trigger function to work with new structure
-- ============================================

CREATE OR REPLACE FUNCTION update_league_standings_from_matches()
RETURNS TRIGGER AS $$
BEGIN
    -- Only proceed if match is completed
    IF NEW.status != 'completed' THEN
        RETURN NEW;
    END IF;

    -- Delete existing standings for this season
    DELETE FROM league_standings WHERE season = NEW.season;

    -- Insert updated standings calculated from all matches
    INSERT INTO league_standings (
        team_id,
        season,
        position,
        played,
        won,
        drawn,
        lost,
        goals_for,
        goals_against,
        points
    )
    WITH match_stats AS (
        -- Get all match statistics for each team
        SELECT 
            team_id,
            season,
            COUNT(*) as played,
            SUM(CASE WHEN goals_for > goals_against THEN 1 ELSE 0 END) as won,
            SUM(CASE WHEN goals_for = goals_against THEN 1 ELSE 0 END) as drawn,
            SUM(CASE WHEN goals_for < goals_against THEN 1 ELSE 0 END) as lost,
            SUM(goals_for) as goals_for,
            SUM(goals_against) as goals_against,
            SUM(
                CASE 
                    WHEN goals_for > goals_against THEN 3
                    WHEN goals_for = goals_against THEN 1
                    ELSE 0
                END
            ) as points
        FROM (
            -- Home matches
            SELECT 
                home_team_id as team_id,
                season,
                home_score as goals_for,
                away_score as goals_against
            FROM matches
            WHERE status = 'completed'
            
            UNION ALL
            
            -- Away matches
            SELECT 
                away_team_id as team_id,
                season,
                away_score as goals_for,
                home_score as goals_against
            FROM matches
            WHERE status = 'completed'
        ) all_matches
        GROUP BY team_id, season
    ),
    ranked_teams AS (
        -- Calculate positions
        SELECT 
            ms.*,
            t.league,
            ROW_NUMBER() OVER (
                PARTITION BY t.league, ms.season 
                ORDER BY ms.points DESC, 
                        (ms.goals_for - ms.goals_against) DESC, 
                        ms.goals_for DESC
            ) as position
        FROM match_stats ms
        JOIN teams t ON ms.team_id = t.id
    )
    SELECT 
        team_id,
        season,
        position,
        played,
        won,
        drawn,
        lost,
        goals_for,
        goals_against,
        points
    FROM ranked_teams
    WHERE season = NEW.season;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- STEP 5: Create helper function to get full team info
-- ============================================

CREATE OR REPLACE FUNCTION get_team_standings(p_season VARCHAR DEFAULT '2025/26')
RETURNS TABLE (
    team_id UUID,
    team_name VARCHAR,
    short_name VARCHAR,
    league VARCHAR,
    team_type VARCHAR,
    position INTEGER,
    played INTEGER,
    won INTEGER,
    drawn INTEGER,
    lost INTEGER,
    goals_for INTEGER,
    goals_against INTEGER,
    goal_difference INTEGER,
    points INTEGER,
    trend VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ls.team_id,
        t.name,
        t.short_name,
        t.league,
        t.team_type,
        ls.position,
        ls.played,
        ls.won,
        ls.drawn,
        ls.lost,
        ls.goals_for,
        ls.goals_against,
        ls.goal_difference,
        ls.points,
        ls.trend
    FROM league_standings ls
    JOIN teams t ON ls.team_id = t.id
    WHERE ls.season = p_season
    ORDER BY t.league, ls.position;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- STEP 6: Update unique constraints
-- ============================================

-- Drop old constraints that include removed columns
ALTER TABLE league_standings DROP CONSTRAINT IF EXISTS league_standings_team_unique;
ALTER TABLE league_standings DROP CONSTRAINT IF EXISTS idx_unique_standings;

-- Add new constraint for team_id and season only
ALTER TABLE league_standings 
ADD CONSTRAINT league_standings_unique 
UNIQUE (team_id, season);

-- ============================================
-- VERIFICATION
-- ============================================

DO $$
BEGIN
    RAISE NOTICE '=== Database Redundancy Fix Complete ===';
    RAISE NOTICE '';
    RAISE NOTICE 'Changes made:';
    RAISE NOTICE '1. Removed team_name from league_standings (use team_id reference)';
    RAISE NOTICE '2. Removed league from league_standings (get from teams table)';
    RAISE NOTICE '3. Removed season from teams (teams exist across seasons)';
    RAISE NOTICE '4. Created league_standings_view for convenient access';
    RAISE NOTICE '5. Updated trigger function for new structure';
    RAISE NOTICE '';
    RAISE NOTICE 'Use league_standings_view or get_team_standings() for full data';
END $$;