-- Fix issues with league calculation
-- 1. Add season column to matches table
-- 2. Fix position reserved keyword issue
-- 3. Complete the automatic calculation system

-- Add season column to matches table if it doesn't exist
ALTER TABLE matches ADD COLUMN IF NOT EXISTS season VARCHAR(10) DEFAULT '2025/26';

-- Update existing matches to current season
UPDATE matches SET season = '2025/26' WHERE season IS NULL;

-- Drop existing incomplete functions if they exist
DROP FUNCTION IF EXISTS calculate_league_table(character varying);
DROP FUNCTION IF EXISTS update_league_standings_from_matches(character varying);
DROP FUNCTION IF EXISTS recalculate_all_league_standings();

-- Create the complete calculate_league_table function (fixed position issue)
CREATE OR REPLACE FUNCTION calculate_league_table(p_season VARCHAR DEFAULT '2025/26')
RETURNS TABLE (
    team_id UUID,
    team_name VARCHAR(255),
    league VARCHAR(255),
    played INTEGER,
    won INTEGER,
    drawn INTEGER,
    lost INTEGER,
    goals_for INTEGER,
    goals_against INTEGER,
    goal_difference INTEGER,
    points INTEGER,
    table_position INTEGER  -- renamed from position to avoid reserved keyword
) AS $$
BEGIN
    RETURN QUERY
    WITH match_results AS (
        -- Get all completed matches for the season
        SELECT 
            m.id as match_id,
            m.home_team_id,
            m.away_team_id,
            ht.name as home_team_name,
            at.name as away_team_name,
            ht.league as home_league,
            at.league as away_league,
            m.home_score,
            m.away_score,
            CASE 
                WHEN m.home_score > m.away_score THEN 'home_win'
                WHEN m.home_score < m.away_score THEN 'away_win'
                ELSE 'draw'
            END as result
        FROM matches m
        JOIN teams ht ON m.home_team_id = ht.id
        JOIN teams at ON m.away_team_id = at.id
        WHERE m.season = p_season
          AND m.status = 'completed'
          AND m.home_score IS NOT NULL
          AND m.away_score IS NOT NULL
    ),
    home_stats AS (
        -- Calculate statistics for home games
        SELECT 
            home_team_id as tid,
            home_team_name as tname,
            home_league as tleague,
            COUNT(*) as games_played,
            SUM(CASE WHEN result = 'home_win' THEN 1 ELSE 0 END) as wins,
            SUM(CASE WHEN result = 'draw' THEN 1 ELSE 0 END) as draws,
            SUM(CASE WHEN result = 'away_win' THEN 1 ELSE 0 END) as losses,
            SUM(home_score) as goals_for,
            SUM(away_score) as goals_against
        FROM match_results
        GROUP BY home_team_id, home_team_name, home_league
    ),
    away_stats AS (
        -- Calculate statistics for away games
        SELECT 
            away_team_id as tid,
            away_team_name as tname,
            away_league as tleague,
            COUNT(*) as games_played,
            SUM(CASE WHEN result = 'away_win' THEN 1 ELSE 0 END) as wins,
            SUM(CASE WHEN result = 'draw' THEN 1 ELSE 0 END) as draws,
            SUM(CASE WHEN result = 'home_win' THEN 1 ELSE 0 END) as losses,
            SUM(away_score) as goals_for,
            SUM(home_score) as goals_against
        FROM match_results
        GROUP BY away_team_id, away_team_name, away_league
    ),
    combined_stats AS (
        -- Combine home and away statistics for each team
        SELECT 
            COALESCE(h.tid, a.tid, t.id) as team_id,
            COALESCE(h.tname, a.tname, t.name) as team_name,
            COALESCE(h.tleague, a.tleague, t.league) as league,
            COALESCE(h.games_played, 0) + COALESCE(a.games_played, 0) as played,
            COALESCE(h.wins, 0) + COALESCE(a.wins, 0) as won,
            COALESCE(h.draws, 0) + COALESCE(a.draws, 0) as drawn,
            COALESCE(h.losses, 0) + COALESCE(a.losses, 0) as lost,
            COALESCE(h.goals_for, 0) + COALESCE(a.goals_for, 0) as goals_for,
            COALESCE(h.goals_against, 0) + COALESCE(a.goals_against, 0) as goals_against
        FROM teams t
        LEFT JOIN home_stats h ON t.id = h.tid
        LEFT JOIN away_stats a ON t.id = a.tid
        WHERE t.season = p_season
    ),
    calculated_table AS (
        SELECT 
            team_id,
            team_name,
            league,
            played,
            won,
            drawn,
            lost,
            goals_for,
            goals_against,
            (goals_for - goals_against) as goal_difference,
            (won * 3 + drawn * 1) as points
        FROM combined_stats
    )
    -- Add position based on points and goal difference
    SELECT 
        ct.team_id,
        ct.team_name,
        ct.league,
        ct.played,
        ct.won,
        ct.drawn,
        ct.lost,
        ct.goals_for,
        ct.goals_against,
        ct.goal_difference,
        ct.points,
        ROW_NUMBER() OVER (
            PARTITION BY ct.league 
            ORDER BY 
                ct.points DESC, 
                ct.goal_difference DESC, 
                ct.goals_for DESC,
                ct.team_name ASC
        )::INTEGER as table_position
    FROM calculated_table ct
    ORDER BY ct.league, table_position;
END;
$$ LANGUAGE plpgsql;

-- Create function to update league standings from calculated table
CREATE OR REPLACE FUNCTION update_league_standings_from_matches(p_season VARCHAR DEFAULT '2025/26')
RETURNS void AS $$
DECLARE
    v_team_record RECORD;
BEGIN
    -- Calculate the current league table
    FOR v_team_record IN SELECT * FROM calculate_league_table(p_season)
    LOOP
        -- Update or insert league standings for each team
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
            goal_difference,
            points,
            league,
            season,
            updated_at
        ) VALUES (
            v_team_record.team_id,
            v_team_record.team_name,
            v_team_record.table_position,
            v_team_record.played,
            v_team_record.won,
            v_team_record.drawn,
            v_team_record.lost,
            v_team_record.goals_for,
            v_team_record.goals_against,
            v_team_record.goal_difference,
            v_team_record.points,
            v_team_record.league,
            p_season,
            NOW()
        )
        ON CONFLICT (team_id, season, league) 
        DO UPDATE SET
            team_name = EXCLUDED.team_name,
            position = EXCLUDED.position,
            played = EXCLUDED.played,
            won = EXCLUDED.won,
            drawn = EXCLUDED.drawn,
            lost = EXCLUDED.lost,
            goals_for = EXCLUDED.goals_for,
            goals_against = EXCLUDED.goals_against,
            goal_difference = EXCLUDED.goal_difference,
            points = EXCLUDED.points,
            updated_at = NOW();
    END LOOP;
    
    RAISE NOTICE 'League standings updated for season %', p_season;
END;
$$ LANGUAGE plpgsql;

-- Update the trigger function to use the new calculation
CREATE OR REPLACE FUNCTION update_league_standings()
RETURNS TRIGGER AS $$
BEGIN
    -- Only process completed matches with scores
    IF NEW.status = 'completed' AND NEW.home_score IS NOT NULL AND NEW.away_score IS NOT NULL THEN
        -- Update league standings for the match's season
        PERFORM update_league_standings_from_matches(NEW.season);
        
        -- Update team form for both teams
        PERFORM update_team_form(NEW.home_team_id);
        PERFORM update_team_form(NEW.away_team_id);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
DROP TRIGGER IF EXISTS match_completed_trigger ON matches;
CREATE TRIGGER match_completed_trigger
    AFTER INSERT OR UPDATE ON matches
    FOR EACH ROW
    EXECUTE FUNCTION update_league_standings();

-- Function to recalculate all league standings
CREATE OR REPLACE FUNCTION recalculate_all_league_standings()
RETURNS void AS $$
DECLARE
    v_season VARCHAR;
BEGIN
    -- Get all unique seasons
    FOR v_season IN SELECT DISTINCT season FROM matches ORDER BY season DESC
    LOOP
        PERFORM update_league_standings_from_matches(v_season);
    END LOOP;
    
    RAISE NOTICE 'All league standings recalculated';
END;
$$ LANGUAGE plpgsql;

-- Now let's add some match results to test the automatic calculation
-- These are completed matches with scores that should trigger the calculation
INSERT INTO matches (home_team_id, away_team_id, home_team, away_team, home_score, away_score, match_date, status, season)
VALUES 
    -- SV Viktoria Wertheim matches (1 win, 1 draw, 1 loss = 4 points)
    ('a1111111-1111-1111-1111-111111111111', 
     (SELECT id FROM teams WHERE name = 'TSV Kreuzwertheim' AND season = '2025/26' LIMIT 1),
     'SV Viktoria Wertheim', 'TSV Kreuzwertheim', 
     2, 1, '2025-08-10', 'completed', '2025/26'),  -- Win
     
    ('a1111111-1111-1111-1111-111111111111', 
     (SELECT id FROM teams WHERE name = 'FC Mondfeld' AND season = '2025/26' LIMIT 1),
     'SV Viktoria Wertheim', 'FC Mondfeld', 
     1, 1, '2025-08-17', 'completed', '2025/26'),  -- Draw
     
    ((SELECT id FROM teams WHERE name = 'SG Dertingen' AND season = '2025/26' LIMIT 1),
     'a1111111-1111-1111-1111-111111111111', 
     'SG Dertingen', 'SV Viktoria Wertheim', 
     3, 1, '2025-08-24', 'completed', '2025/26'),  -- Loss
     
    -- Add some other matches to make the table realistic
    ((SELECT id FROM teams WHERE name = 'TSV Kreuzwertheim' AND season = '2025/26' LIMIT 1),
     (SELECT id FROM teams WHERE name = 'FC Mondfeld' AND season = '2025/26' LIMIT 1),
     'TSV Kreuzwertheim', 'FC Mondfeld', 
     3, 0, '2025-08-10', 'completed', '2025/26'),
     
    ((SELECT id FROM teams WHERE name = 'TSV Kreuzwertheim' AND season = '2025/26' LIMIT 1),
     (SELECT id FROM teams WHERE name = 'SG Dertingen' AND season = '2025/26' LIMIT 1),
     'TSV Kreuzwertheim', 'SG Dertingen', 
     2, 2, '2025-08-17', 'completed', '2025/26')
ON CONFLICT DO NOTHING;

-- Now recalculate the standings based on the actual matches
SELECT recalculate_all_league_standings();

-- Verify the results
SELECT 
    position as "Platz",
    team_name as "Team",
    played as "Sp",
    won as "S",
    drawn as "U",
    lost as "N",
    goals_for || ':' || goals_against as "Tore",
    goal_difference as "Diff",
    points as "Punkte"
FROM league_standings
WHERE season = '2025/26' 
  AND league = 'bfv-Kreisliga Tauberbischofsheim'
ORDER BY position
LIMIT 15;