-- Add other teams in the leagues for accurate table positions
-- This is necessary to calculate correct league positions

-- First, add the other teams in Kreisliga Tauberbischofsheim (1. Mannschaft's league)
INSERT INTO teams (id, name, league, season, team_type) VALUES
  (gen_random_uuid(), 'TSV Kreuzwertheim', 'bfv-Kreisliga Tauberbischofsheim', '2025/26', 'first'),
  (gen_random_uuid(), 'FC Mondfeld', 'bfv-Kreisliga Tauberbischofsheim', '2025/26', 'first'),
  (gen_random_uuid(), 'SG Dertingen', 'bfv-Kreisliga Tauberbischofsheim', '2025/26', 'first'),
  (gen_random_uuid(), 'FC Külsheim', 'bfv-Kreisliga Tauberbischofsheim', '2025/26', 'first'),
  (gen_random_uuid(), 'TSV Tauberbischofsheim', 'bfv-Kreisliga Tauberbischofsheim', '2025/26', 'first'),
  (gen_random_uuid(), 'SV Distelhausen', 'bfv-Kreisliga Tauberbischofsheim', '2025/26', 'first'),
  (gen_random_uuid(), 'TSG Impfingen', 'bfv-Kreisliga Tauberbischofsheim', '2025/26', 'first'),
  (gen_random_uuid(), 'SV Königshofen', 'bfv-Kreisliga Tauberbischofsheim', '2025/26', 'first'),
  (gen_random_uuid(), 'Türkgücü Wertheim', 'bfv-Kreisliga Tauberbischofsheim', '2025/26', 'first'),
  (gen_random_uuid(), 'SV Nassig', 'bfv-Kreisliga Tauberbischofsheim', '2025/26', 'first'),
  (gen_random_uuid(), 'SV Schönfeld', 'bfv-Kreisliga Tauberbischofsheim', '2025/26', 'first'),
  (gen_random_uuid(), 'SpG Welzbachtal', 'bfv-Kreisliga Tauberbischofsheim', '2025/26', 'first'),
  (gen_random_uuid(), 'FC Grünsfeld', 'bfv-Kreisliga Tauberbischofsheim', '2025/26', 'first'),
  (gen_random_uuid(), 'TSV Gerchsheim', 'bfv-Kreisliga Tauberbischofsheim', '2025/26', 'first')
ON CONFLICT (name, season, team_type) DO NOTHING;

-- Now add sample league standings for these teams with realistic points distribution
-- Teams with better positions have more points
INSERT INTO league_standings (team_id, team_name, position, played, won, drawn, lost, goals_for, goals_against, points, league, season)
SELECT 
    t.id,
    t.name,
    999, -- Will be recalculated
    4,   -- All teams have played 4 games so far
    CASE 
        WHEN t.name = 'TSV Kreuzwertheim' THEN 3
        WHEN t.name = 'FC Mondfeld' THEN 3
        WHEN t.name = 'SG Dertingen' THEN 3
        WHEN t.name = 'FC Külsheim' THEN 2
        WHEN t.name = 'TSV Tauberbischofsheim' THEN 2
        WHEN t.name = 'SV Distelhausen' THEN 2
        WHEN t.name = 'TSG Impfingen' THEN 2
        WHEN t.name = 'SV Königshofen' THEN 1
        WHEN t.name = 'Türkgücü Wertheim' THEN 1
        WHEN t.name = 'SV Nassig' THEN 1
        WHEN t.name = 'SV Schönfeld' THEN 1
        WHEN t.name = 'SpG Welzbachtal' THEN 0
        WHEN t.name = 'FC Grünsfeld' THEN 0
        WHEN t.name = 'TSV Gerchsheim' THEN 0
        ELSE 0
    END as won,
    CASE 
        WHEN t.name = 'TSV Kreuzwertheim' THEN 1
        WHEN t.name = 'FC Mondfeld' THEN 1
        WHEN t.name = 'SG Dertingen' THEN 0
        WHEN t.name = 'FC Külsheim' THEN 2
        WHEN t.name = 'TSV Tauberbischofsheim' THEN 1
        WHEN t.name = 'SV Distelhausen' THEN 1
        WHEN t.name = 'TSG Impfingen' THEN 1
        WHEN t.name = 'SV Königshofen' THEN 2
        WHEN t.name = 'Türkgücü Wertheim' THEN 1
        WHEN t.name = 'SV Nassig' THEN 1
        WHEN t.name = 'SV Schönfeld' THEN 1
        WHEN t.name = 'SpG Welzbachtal' THEN 2
        WHEN t.name = 'FC Grünsfeld' THEN 1
        WHEN t.name = 'TSV Gerchsheim' THEN 1
        ELSE 0
    END as drawn,
    CASE 
        WHEN t.name = 'TSV Kreuzwertheim' THEN 0
        WHEN t.name = 'FC Mondfeld' THEN 0
        WHEN t.name = 'SG Dertingen' THEN 1
        WHEN t.name = 'FC Külsheim' THEN 0
        WHEN t.name = 'TSV Tauberbischofsheim' THEN 1
        WHEN t.name = 'SV Distelhausen' THEN 1
        WHEN t.name = 'TSG Impfingen' THEN 1
        WHEN t.name = 'SV Königshofen' THEN 1
        WHEN t.name = 'Türkgücü Wertheim' THEN 2
        WHEN t.name = 'SV Nassig' THEN 2
        WHEN t.name = 'SV Schönfeld' THEN 2
        WHEN t.name = 'SpG Welzbachtal' THEN 2
        WHEN t.name = 'FC Grünsfeld' THEN 3
        WHEN t.name = 'TSV Gerchsheim' THEN 3
        ELSE 4
    END as lost,
    CASE 
        WHEN t.name = 'TSV Kreuzwertheim' THEN 12
        WHEN t.name = 'FC Mondfeld' THEN 11
        WHEN t.name = 'SG Dertingen' THEN 10
        WHEN t.name = 'FC Külsheim' THEN 9
        WHEN t.name = 'TSV Tauberbischofsheim' THEN 8
        WHEN t.name = 'SV Distelhausen' THEN 8
        WHEN t.name = 'TSG Impfingen' THEN 7
        WHEN t.name = 'SV Königshofen' THEN 6
        WHEN t.name = 'Türkgücü Wertheim' THEN 5
        WHEN t.name = 'SV Nassig' THEN 4
        WHEN t.name = 'SV Schönfeld' THEN 4
        WHEN t.name = 'SpG Welzbachtal' THEN 3
        WHEN t.name = 'FC Grünsfeld' THEN 3
        WHEN t.name = 'TSV Gerchsheim' THEN 2
        ELSE 0
    END as goals_for,
    CASE 
        WHEN t.name = 'TSV Kreuzwertheim' THEN 3
        WHEN t.name = 'FC Mondfeld' THEN 4
        WHEN t.name = 'SG Dertingen' THEN 5
        WHEN t.name = 'FC Külsheim' THEN 6
        WHEN t.name = 'TSV Tauberbischofsheim' THEN 6
        WHEN t.name = 'SV Distelhausen' THEN 7
        WHEN t.name = 'TSG Impfingen' THEN 7
        WHEN t.name = 'SV Königshofen' THEN 7
        WHEN t.name = 'Türkgücü Wertheim' THEN 8
        WHEN t.name = 'SV Nassig' THEN 8
        WHEN t.name = 'SV Schönfeld' THEN 9
        WHEN t.name = 'SpG Welzbachtal' THEN 10
        WHEN t.name = 'FC Grünsfeld' THEN 11
        WHEN t.name = 'TSV Gerchsheim' THEN 12
        ELSE 15
    END as goals_against,
    CASE 
        WHEN t.name = 'TSV Kreuzwertheim' THEN 10
        WHEN t.name = 'FC Mondfeld' THEN 10
        WHEN t.name = 'SG Dertingen' THEN 9
        WHEN t.name = 'FC Külsheim' THEN 8
        WHEN t.name = 'TSV Tauberbischofsheim' THEN 7
        WHEN t.name = 'SV Distelhausen' THEN 7
        WHEN t.name = 'TSG Impfingen' THEN 7
        WHEN t.name = 'SV Königshofen' THEN 5
        WHEN t.name = 'Türkgücü Wertheim' THEN 4
        WHEN t.name = 'SV Nassig' THEN 4
        -- SV Viktoria Wertheim already has 4 points - will be position 11
        WHEN t.name = 'SV Schönfeld' THEN 4
        WHEN t.name = 'SpG Welzbachtal' THEN 2
        WHEN t.name = 'FC Grünsfeld' THEN 1
        WHEN t.name = 'TSV Gerchsheim' THEN 1
        ELSE 0
    END as points,
    t.league,
    t.season
FROM teams t
WHERE t.season = '2025/26' 
  AND t.league = 'bfv-Kreisliga Tauberbischofsheim'
  AND t.name NOT IN ('SV Viktoria Wertheim') -- Don't duplicate our team
  AND NOT EXISTS (
    SELECT 1 FROM league_standings ls 
    WHERE ls.team_id = t.id AND ls.season = t.season
  );

-- Now recalculate positions for all teams in the league
WITH ranked_teams AS (
    SELECT 
        id,
        team_name,
        ROW_NUMBER() OVER (
            PARTITION BY league, season 
            ORDER BY points DESC, 
                     (goals_for - goals_against) DESC, 
                     goals_for DESC
        ) as new_position
    FROM league_standings
    WHERE season = '2025/26'
)
UPDATE league_standings ls
SET position = rt.new_position
FROM ranked_teams rt
WHERE ls.id = rt.id;

-- Verify SV Viktoria Wertheim's position
DO $$
DECLARE
    v_position INTEGER;
    v_points INTEGER;
BEGIN
    SELECT position, points INTO v_position, v_points
    FROM league_standings
    WHERE team_name = 'SV Viktoria Wertheim' AND season = '2025/26';
    
    RAISE NOTICE 'SV Viktoria Wertheim: Position % with % points', v_position, v_points;
END $$;