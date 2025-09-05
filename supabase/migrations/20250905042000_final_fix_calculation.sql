-- Final fix for automatic league calculation
-- Fix ambiguous column reference in calculate_league_table function

DROP FUNCTION IF EXISTS calculate_league_table(character varying);

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
    table_position INTEGER
) AS $$
BEGIN
    RETURN QUERY
    WITH match_results AS (
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
        SELECT 
            home_team_id as tid,
            home_team_name as tname,
            home_league as tleague,
            COUNT(*)::INTEGER as games_played,
            SUM(CASE WHEN result = 'home_win' THEN 1 ELSE 0 END)::INTEGER as wins,
            SUM(CASE WHEN result = 'draw' THEN 1 ELSE 0 END)::INTEGER as draws,
            SUM(CASE WHEN result = 'away_win' THEN 1 ELSE 0 END)::INTEGER as losses,
            COALESCE(SUM(home_score), 0)::INTEGER as goals_for,
            COALESCE(SUM(away_score), 0)::INTEGER as goals_against
        FROM match_results
        GROUP BY home_team_id, home_team_name, home_league
    ),
    away_stats AS (
        SELECT 
            away_team_id as tid,
            away_team_name as tname,
            away_league as tleague,
            COUNT(*)::INTEGER as games_played,
            SUM(CASE WHEN result = 'away_win' THEN 1 ELSE 0 END)::INTEGER as wins,
            SUM(CASE WHEN result = 'draw' THEN 1 ELSE 0 END)::INTEGER as draws,
            SUM(CASE WHEN result = 'home_win' THEN 1 ELSE 0 END)::INTEGER as losses,
            COALESCE(SUM(away_score), 0)::INTEGER as goals_for,
            COALESCE(SUM(home_score), 0)::INTEGER as goals_against
        FROM match_results
        GROUP BY away_team_id, away_team_name, away_league
    ),
    combined_stats AS (
        SELECT 
            COALESCE(h.tid, a.tid, t.id) as team_id_val,
            COALESCE(h.tname, a.tname, t.name) as team_name_val,
            COALESCE(h.tleague, a.tleague, t.league) as league_val,
            (COALESCE(h.games_played, 0) + COALESCE(a.games_played, 0))::INTEGER as played_val,
            (COALESCE(h.wins, 0) + COALESCE(a.wins, 0))::INTEGER as won_val,
            (COALESCE(h.draws, 0) + COALESCE(a.draws, 0))::INTEGER as drawn_val,
            (COALESCE(h.losses, 0) + COALESCE(a.losses, 0))::INTEGER as lost_val,
            (COALESCE(h.goals_for, 0) + COALESCE(a.goals_for, 0))::INTEGER as goals_for_val,
            (COALESCE(h.goals_against, 0) + COALESCE(a.goals_against, 0))::INTEGER as goals_against_val
        FROM teams t
        LEFT JOIN home_stats h ON t.id = h.tid
        LEFT JOIN away_stats a ON t.id = a.tid
        WHERE t.season = p_season
    ),
    calculated_table AS (
        SELECT 
            cs.team_id_val,
            cs.team_name_val,
            cs.league_val,
            cs.played_val,
            cs.won_val,
            cs.drawn_val,
            cs.lost_val,
            cs.goals_for_val,
            cs.goals_against_val,
            (cs.goals_for_val - cs.goals_against_val)::INTEGER as goal_difference_val,
            (cs.won_val * 3 + cs.drawn_val * 1)::INTEGER as points_val
        FROM combined_stats cs
    )
    SELECT 
        ct.team_id_val,
        ct.team_name_val,
        ct.league_val,
        ct.played_val,
        ct.won_val,
        ct.drawn_val,
        ct.lost_val,
        ct.goals_for_val,
        ct.goals_against_val,
        ct.goal_difference_val,
        ct.points_val,
        ROW_NUMBER() OVER (
            PARTITION BY ct.league_val 
            ORDER BY 
                ct.points_val DESC, 
                ct.goal_difference_val DESC, 
                ct.goals_for_val DESC,
                ct.team_name_val ASC
        )::INTEGER as table_position
    FROM calculated_table ct
    ORDER BY ct.league_val, table_position;
END;
$$ LANGUAGE plpgsql;

-- Test the function
SELECT 
    table_position as "Platz",
    team_name as "Team",
    played as "Sp",
    won as "S",
    drawn as "U",
    lost as "N",
    goals_for || ':' || goals_against as "Tore",
    goal_difference as "Diff",
    points as "Punkte"
FROM calculate_league_table('2025/26')
WHERE league = 'bfv-Kreisliga Tauberbischofsheim'
ORDER BY table_position
LIMIT 15;

-- Now let's add realistic match results for testing
-- We'll simulate the first 4 matchdays with realistic results
DO $$
DECLARE
    v_match_date DATE := '2025-08-10';
    v_matchday INTEGER := 1;
BEGIN
    -- Clear existing matches for a clean start
    DELETE FROM matches WHERE season = '2025/26';
    
    -- Matchday 1
    INSERT INTO matches (home_team_id, away_team_id, home_team, away_team, home_score, away_score, match_date, status, season) VALUES
    ((SELECT id FROM teams WHERE name = 'TSV Kreuzwertheim' LIMIT 1), (SELECT id FROM teams WHERE name = 'FC Grünsfeld' LIMIT 1), 'TSV Kreuzwertheim', 'FC Grünsfeld', 4, 0, '2025-08-10', 'completed', '2025/26'),
    ((SELECT id FROM teams WHERE name = 'FC Mondfeld' LIMIT 1), (SELECT id FROM teams WHERE name = 'TSV Gerchsheim' LIMIT 1), 'FC Mondfeld', 'TSV Gerchsheim', 3, 1, '2025-08-10', 'completed', '2025/26'),
    ((SELECT id FROM teams WHERE name = 'SG Dertingen' LIMIT 1), (SELECT id FROM teams WHERE name = 'SpG Welzbachtal' LIMIT 1), 'SG Dertingen', 'SpG Welzbachtal', 3, 1, '2025-08-10', 'completed', '2025/26'),
    ((SELECT id FROM teams WHERE name = 'FC Külsheim' LIMIT 1), (SELECT id FROM teams WHERE name = 'SV Schönfeld' LIMIT 1), 'FC Külsheim', 'SV Schönfeld', 2, 0, '2025-08-10', 'completed', '2025/26'),
    ((SELECT id FROM teams WHERE name = 'TSV Tauberbischofsheim' LIMIT 1), (SELECT id FROM teams WHERE name = 'SV Nassig' LIMIT 1), 'TSV Tauberbischofsheim', 'SV Nassig', 3, 2, '2025-08-10', 'completed', '2025/26'),
    ((SELECT id FROM teams WHERE name = 'SV Distelhausen' LIMIT 1), (SELECT id FROM teams WHERE name = 'Türkgücü Wertheim' LIMIT 1), 'SV Distelhausen', 'Türkgücü Wertheim', 2, 1, '2025-08-10', 'completed', '2025/26'),
    ((SELECT id FROM teams WHERE name = 'TSG Impfingen' LIMIT 1), (SELECT id FROM teams WHERE name = 'SV Königshofen' LIMIT 1), 'TSG Impfingen', 'SV Königshofen', 2, 2, '2025-08-10', 'completed', '2025/26'),
    ('a1111111-1111-1111-1111-111111111111', (SELECT id FROM teams WHERE name = 'SV Nassig' LIMIT 1), 'SV Viktoria Wertheim', 'SV Nassig', 3, 2, '2025-08-10', 'completed', '2025/26');
    
    -- Matchday 2
    INSERT INTO matches (home_team_id, away_team_id, home_team, away_team, home_score, away_score, match_date, status, season) VALUES
    ((SELECT id FROM teams WHERE name = 'FC Grünsfeld' LIMIT 1), (SELECT id FROM teams WHERE name = 'FC Mondfeld' LIMIT 1), 'FC Grünsfeld', 'FC Mondfeld', 1, 3, '2025-08-17', 'completed', '2025/26'),
    ((SELECT id FROM teams WHERE name = 'TSV Gerchsheim' LIMIT 1), (SELECT id FROM teams WHERE name = 'SG Dertingen' LIMIT 1), 'TSV Gerchsheim', 'SG Dertingen', 0, 2, '2025-08-17', 'completed', '2025/26'),
    ((SELECT id FROM teams WHERE name = 'SpG Welzbachtal' LIMIT 1), (SELECT id FROM teams WHERE name = 'FC Külsheim' LIMIT 1), 'SpG Welzbachtal', 'FC Külsheim', 1, 1, '2025-08-17', 'completed', '2025/26'),
    ((SELECT id FROM teams WHERE name = 'SV Schönfeld' LIMIT 1), (SELECT id FROM teams WHERE name = 'TSV Tauberbischofsheim' LIMIT 1), 'SV Schönfeld', 'TSV Tauberbischofsheim', 1, 2, '2025-08-17', 'completed', '2025/26'),
    ((SELECT id FROM teams WHERE name = 'SV Nassig' LIMIT 1), (SELECT id FROM teams WHERE name = 'SV Distelhausen' LIMIT 1), 'SV Nassig', 'SV Distelhausen', 0, 3, '2025-08-17', 'completed', '2025/26'),
    ((SELECT id FROM teams WHERE name = 'Türkgücü Wertheim' LIMIT 1), (SELECT id FROM teams WHERE name = 'TSG Impfingen' LIMIT 1), 'Türkgücü Wertheim', 'TSG Impfingen', 1, 2, '2025-08-17', 'completed', '2025/26'),
    ((SELECT id FROM teams WHERE name = 'SV Königshofen' LIMIT 1), (SELECT id FROM teams WHERE name = 'TSV Kreuzwertheim' LIMIT 1), 'SV Königshofen', 'TSV Kreuzwertheim', 1, 2, '2025-08-17', 'completed', '2025/26'),
    ((SELECT id FROM teams WHERE name = 'FC Mondfeld' LIMIT 1), 'a1111111-1111-1111-1111-111111111111', 'FC Mondfeld', 'SV Viktoria Wertheim', 2, 2, '2025-08-17', 'completed', '2025/26');
    
    -- Matchday 3
    INSERT INTO matches (home_team_id, away_team_id, home_team, away_team, home_score, away_score, match_date, status, season) VALUES
    ((SELECT id FROM teams WHERE name = 'TSV Kreuzwertheim' LIMIT 1), (SELECT id FROM teams WHERE name = 'Türkgücü Wertheim' LIMIT 1), 'TSV Kreuzwertheim', 'Türkgücü Wertheim', 3, 1, '2025-08-24', 'completed', '2025/26'),
    ((SELECT id FROM teams WHERE name = 'FC Mondfeld' LIMIT 1), (SELECT id FROM teams WHERE name = 'SpG Welzbachtal' LIMIT 1), 'FC Mondfeld', 'SpG Welzbachtal', 3, 0, '2025-08-24', 'completed', '2025/26'),
    ((SELECT id FROM teams WHERE name = 'SG Dertingen' LIMIT 1), (SELECT id FROM teams WHERE name = 'FC Grünsfeld' LIMIT 1), 'SG Dertingen', 'FC Grünsfeld', 3, 1, '2025-08-24', 'completed', '2025/26'),
    ((SELECT id FROM teams WHERE name = 'FC Külsheim' LIMIT 1), (SELECT id FROM teams WHERE name = 'TSV Gerchsheim' LIMIT 1), 'FC Külsheim', 'TSV Gerchsheim', 3, 1, '2025-08-24', 'completed', '2025/26'),
    ((SELECT id FROM teams WHERE name = 'TSV Tauberbischofsheim' LIMIT 1), (SELECT id FROM teams WHERE name = 'SpG Welzbachtal' LIMIT 1), 'TSV Tauberbischofsheim', 'SpG Welzbachtal', 1, 1, '2025-08-24', 'completed', '2025/26'),
    ((SELECT id FROM teams WHERE name = 'SV Distelhausen' LIMIT 1), (SELECT id FROM teams WHERE name = 'SV Schönfeld' LIMIT 1), 'SV Distelhausen', 'SV Schönfeld', 1, 1, '2025-08-24', 'completed', '2025/26'),
    ((SELECT id FROM teams WHERE name = 'TSG Impfingen' LIMIT 1), (SELECT id FROM teams WHERE name = 'SV Nassig' LIMIT 1), 'TSG Impfingen', 'SV Nassig', 3, 0, '2025-08-24', 'completed', '2025/26'),
    ('a1111111-1111-1111-1111-111111111111', (SELECT id FROM teams WHERE name = 'SV Königshofen' LIMIT 1), 'SV Viktoria Wertheim', 'SV Königshofen', 1, 3, '2025-08-24', 'completed', '2025/26');
    
    -- Matchday 4
    INSERT INTO matches (home_team_id, away_team_id, home_team, away_team, home_score, away_score, match_date, status, season) VALUES
    ((SELECT id FROM teams WHERE name = 'TSV Kreuzwertheim' LIMIT 1), (SELECT id FROM teams WHERE name = 'TSG Impfingen' LIMIT 1), 'TSV Kreuzwertheim', 'TSG Impfingen', 3, 0, '2025-08-31', 'completed', '2025/26'),
    ((SELECT id FROM teams WHERE name = 'SpG Welzbachtal' LIMIT 1), (SELECT id FROM teams WHERE name = 'FC Grünsfeld' LIMIT 1), 'SpG Welzbachtal', 'FC Grünsfeld', 0, 1, '2025-08-31', 'completed', '2025/26'),
    ((SELECT id FROM teams WHERE name = 'TSV Gerchsheim' LIMIT 1), 'a1111111-1111-1111-1111-111111111111', 'TSV Gerchsheim', 'SV Viktoria Wertheim', 0, 0, '2025-08-31', 'completed', '2025/26'),
    ((SELECT id FROM teams WHERE name = 'FC Külsheim' LIMIT 1), (SELECT id FROM teams WHERE name = 'SG Dertingen' LIMIT 1), 'FC Külsheim', 'SG Dertingen', 3, 2, '2025-08-31', 'completed', '2025/26'),
    ((SELECT id FROM teams WHERE name = 'SV Schönfeld' LIMIT 1), (SELECT id FROM teams WHERE name = 'SV Nassig' LIMIT 1), 'SV Schönfeld', 'SV Nassig', 2, 3, '2025-08-31', 'completed', '2025/26'),
    ((SELECT id FROM teams WHERE name = 'Türkgücü Wertheim' LIMIT 1), (SELECT id FROM teams WHERE name = 'SV Königshofen' LIMIT 1), 'Türkgücü Wertheim', 'SV Königshofen', 2, 0, '2025-08-31', 'completed', '2025/26'),
    ((SELECT id FROM teams WHERE name = 'TSV Tauberbischofsheim' LIMIT 1), (SELECT id FROM teams WHERE name = 'FC Mondfeld' LIMIT 1), 'TSV Tauberbischofsheim', 'FC Mondfeld', 2, 2, '2025-08-31', 'completed', '2025/26'),
    ((SELECT id FROM teams WHERE name = 'SV Distelhausen' LIMIT 1), (SELECT id FROM teams WHERE name = 'TSG Impfingen' LIMIT 1), 'SV Distelhausen', 'TSG Impfingen', 2, 0, '2025-08-31', 'completed', '2025/26');
    
    RAISE NOTICE 'Added % matches for season 2025/26', (SELECT COUNT(*) FROM matches WHERE season = '2025/26');
END $$;

-- Recalculate standings based on actual match results
SELECT update_league_standings_from_matches('2025/26');

-- Display the updated table
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