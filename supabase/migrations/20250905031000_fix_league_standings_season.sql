-- Fix league_standings to have entries for current season (2025/26)

-- First, create league_standings entries for 2025/26 season if they don't exist
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
)
SELECT 
    t.id as team_id,
    t.name as team_name,
    COALESCE(t.table_position, 999) as position,
    COALESCE(t.games_played, 0) as played,
    COALESCE(t.wins, 0) as won,
    COALESCE(t.draws, 0) as drawn,
    COALESCE(t.losses, 0) as lost,
    COALESCE(t.goals_for, 0) as goals_for,
    COALESCE(t.goals_against, 0) as goals_against,
    COALESCE(t.points, 0) as points,
    t.league,
    t.season
FROM teams t
WHERE NOT EXISTS (
    SELECT 1 FROM league_standings ls 
    WHERE ls.team_id = t.id AND ls.season = t.season
);

-- Update positions to be sequential within each league
WITH ranked_teams AS (
    SELECT 
        id,
        ROW_NUMBER() OVER (PARTITION BY league, season ORDER BY points DESC, goal_difference DESC, goals_for DESC) as new_position
    FROM league_standings
    WHERE season = '2025/26'
)
UPDATE league_standings ls
SET position = rt.new_position
FROM ranked_teams rt
WHERE ls.id = rt.id;

-- Verify the fix
DO $$
DECLARE
    v_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_count
    FROM teams t
    LEFT JOIN league_standings ls ON t.id = ls.team_id AND t.season = ls.season
    WHERE ls.id IS NULL;
    
    IF v_count > 0 THEN
        RAISE WARNING 'Still have % teams without league_standings entries', v_count;
    ELSE
        RAISE NOTICE 'All teams now have league_standings entries for their season';
    END IF;
    
    SELECT COUNT(*) INTO v_count
    FROM current_league_table;
    
    RAISE NOTICE 'current_league_table now has % entries', v_count;
END $$;