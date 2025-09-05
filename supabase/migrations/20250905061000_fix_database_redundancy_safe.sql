-- Fix database redundancy issues safely
-- Handle dependent views and constraints properly

-- ============================================
-- STEP 1: Drop dependent views first
-- ============================================
DROP VIEW IF EXISTS current_league_table CASCADE;
DROP VIEW IF EXISTS team_statistics_view CASCADE;

-- ============================================
-- STEP 2: Remove redundant columns from league_standings
-- ============================================

-- Drop the redundant team_name column (we have team_id)
ALTER TABLE league_standings DROP COLUMN IF EXISTS team_name CASCADE;

-- Drop the redundant league column (we get it from teams table)
ALTER TABLE league_standings DROP COLUMN IF EXISTS league CASCADE;

-- ============================================
-- STEP 3: Create new optimized view for league standings
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
    ls.updated_at,
    -- Additional computed fields
    CASE 
        WHEN ls.position <= 2 THEN 'promotion'
        WHEN ls.position >= 14 THEN 'relegation'
        ELSE 'mid_table'
    END as table_zone,
    ROUND((ls.won::numeric / NULLIF(ls.played, 0) * 100)::numeric, 1) as win_percentage,
    ROUND((ls.goals_for::numeric / NULLIF(ls.played, 0))::numeric, 2) as avg_goals_per_game
FROM league_standings ls
JOIN teams t ON ls.team_id = t.id
ORDER BY t.league, ls.position;

-- Grant permissions on the view
GRANT SELECT ON league_standings_view TO anon, authenticated;

-- ============================================
-- STEP 4: Recreate current_league_table view using new structure
-- ============================================

CREATE OR REPLACE VIEW current_league_table AS
SELECT 
    ls.id,
    ls.team_id,
    t.name as team_name,
    t.short_name,
    t.league,
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
    -- Add form string (last 5 games)
    (
        SELECT STRING_AGG(
            CASE 
                WHEN (m.home_team_id = ls.team_id AND m.home_score > m.away_score) 
                  OR (m.away_team_id = ls.team_id AND m.away_score > m.home_score) THEN 'W'
                WHEN m.home_score = m.away_score THEN 'D'
                ELSE 'L'
            END, '' ORDER BY m.match_date DESC
        )
        FROM (
            SELECT * FROM matches 
            WHERE status = 'completed' 
            AND season = ls.season
            AND (home_team_id = ls.team_id OR away_team_id = ls.team_id)
            ORDER BY match_date DESC 
            LIMIT 5
        ) m
    ) as form_string,
    -- Points from last 5 games
    (
        SELECT SUM(
            CASE 
                WHEN (m.home_team_id = ls.team_id AND m.home_score > m.away_score) 
                  OR (m.away_team_id = ls.team_id AND m.away_score > m.home_score) THEN 3
                WHEN m.home_score = m.away_score THEN 1
                ELSE 0
            END
        )
        FROM (
            SELECT * FROM matches 
            WHERE status = 'completed' 
            AND season = ls.season
            AND (home_team_id = ls.team_id OR away_team_id = ls.team_id)
            ORDER BY match_date DESC 
            LIMIT 5
        ) m
    ) as form_points_last_5,
    -- Table zone
    CASE 
        WHEN ls.position <= 2 THEN 'promotion'
        WHEN ls.position >= 14 THEN 'relegation'
        ELSE 'mid_table'
    END as table_zone,
    ls.updated_at
FROM league_standings ls
JOIN teams t ON ls.team_id = t.id
WHERE ls.season = '2025/26'
ORDER BY t.league, ls.position;

GRANT SELECT ON current_league_table TO anon, authenticated;

-- ============================================
-- STEP 5: Recreate team_statistics_view
-- ============================================

CREATE OR REPLACE VIEW team_statistics_view AS
WITH team_stats AS (
    SELECT 
        t.id,
        t.name,
        t.short_name,
        t.league,
        t.team_type,
        -- Get latest standings
        ls.position as current_position,
        ls.points as current_points,
        ls.played as matches_played,
        ls.won as matches_won,
        ls.drawn as matches_drawn,
        ls.lost as matches_lost,
        ls.goals_for,
        ls.goals_against,
        ls.goal_difference,
        -- Calculate percentages
        ROUND((ls.won::numeric / NULLIF(ls.played, 0) * 100)::numeric, 1) as win_percentage,
        ROUND((ls.drawn::numeric / NULLIF(ls.played, 0) * 100)::numeric, 1) as draw_percentage,
        ROUND((ls.lost::numeric / NULLIF(ls.played, 0) * 100)::numeric, 1) as loss_percentage,
        -- Calculate averages
        ROUND((ls.goals_for::numeric / NULLIF(ls.played, 0))::numeric, 2) as avg_goals_per_game,
        ROUND((ls.goals_against::numeric / NULLIF(ls.played, 0))::numeric, 2) as avg_goals_conceded
    FROM teams t
    LEFT JOIN league_standings ls ON t.id = ls.team_id AND ls.season = '2025/26'
)
SELECT * FROM team_stats
ORDER BY current_position;

GRANT SELECT ON team_statistics_view TO anon, authenticated;

-- ============================================
-- STEP 6: Update trigger function to work with new structure
-- ============================================

CREATE OR REPLACE FUNCTION update_league_standings_from_matches()
RETURNS TRIGGER AS $$
BEGIN
    -- Only proceed if match is completed
    IF NEW.status != 'completed' THEN
        RETURN NEW;
    END IF;

    -- Delete existing standings for this season and league
    DELETE FROM league_standings ls
    USING teams t
    WHERE ls.team_id = t.id 
    AND ls.season = NEW.season
    AND t.league = (SELECT league FROM teams WHERE id = NEW.home_team_id);

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
        -- Calculate positions per league
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
    WHERE season = NEW.season
    AND league = (SELECT league FROM teams WHERE id = NEW.home_team_id);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- STEP 7: Update unique constraints
-- ============================================

-- Drop old constraints that include removed columns
ALTER TABLE league_standings DROP CONSTRAINT IF EXISTS league_standings_team_unique;
ALTER TABLE league_standings DROP CONSTRAINT IF EXISTS idx_unique_standings;

-- Add new constraint for team_id and season only
ALTER TABLE league_standings 
ADD CONSTRAINT league_standings_unique 
UNIQUE (team_id, season);

-- ============================================
-- STEP 8: Helper function to get team standings with full info
-- ============================================

CREATE OR REPLACE FUNCTION get_team_standings(
    p_season VARCHAR DEFAULT '2025/26',
    p_league VARCHAR DEFAULT NULL
)
RETURNS TABLE (
    team_id UUID,
    team_name VARCHAR,
    short_name VARCHAR,
    league VARCHAR,
    team_type VARCHAR,
    "position" INTEGER,
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
        t.name::VARCHAR,
        t.short_name::VARCHAR,
        t.league::VARCHAR,
        t.team_type::VARCHAR,
        ls.position,
        ls.played,
        ls.won,
        ls.drawn,
        ls.lost,
        ls.goals_for,
        ls.goals_against,
        ls.goal_difference,
        ls.points,
        ls.trend::VARCHAR
    FROM league_standings ls
    JOIN teams t ON ls.team_id = t.id
    WHERE ls.season = p_season
    AND (p_league IS NULL OR t.league = p_league)
    ORDER BY t.league, ls.position;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- VERIFICATION
-- ============================================

DO $$
BEGIN
    RAISE NOTICE '=== Database Redundancy Fix Complete ===';
    RAISE NOTICE '';
    RAISE NOTICE 'Removed redundant columns:';
    RAISE NOTICE '- team_name from league_standings (use JOIN with teams)';
    RAISE NOTICE '- league from league_standings (use JOIN with teams)';
    RAISE NOTICE '';
    RAISE NOTICE 'Created/Updated views:';
    RAISE NOTICE '- league_standings_view (main view with all data)';
    RAISE NOTICE '- current_league_table (with form and zones)';
    RAISE NOTICE '- team_statistics_view (with percentages)';
    RAISE NOTICE '';
    RAISE NOTICE 'Use league_standings_view for most queries';
END $$;