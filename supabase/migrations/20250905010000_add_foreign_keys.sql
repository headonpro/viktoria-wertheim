-- Add Foreign Key Constraints for Data Integrity
-- Created: 2025-09-05

-- 1. Players -> Teams relationship
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conrelid = 'players'::regclass 
        AND contype = 'f' 
        AND confrelid = 'teams'::regclass
    ) THEN
        ALTER TABLE players 
        ADD CONSTRAINT fk_players_team 
        FOREIGN KEY (team_id) 
        REFERENCES teams(id) 
        ON DELETE CASCADE;
    END IF;
END $$;

-- 2. Matches -> Teams relationships
DO $$
BEGIN
    -- Home team foreign key
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conrelid = 'matches'::regclass 
        AND contype = 'f' 
        AND conname = 'fk_matches_home_team'
    ) THEN
        ALTER TABLE matches 
        ADD CONSTRAINT fk_matches_home_team 
        FOREIGN KEY (home_team_id) 
        REFERENCES teams(id) 
        ON DELETE CASCADE;
    END IF;
    
    -- Away team foreign key
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conrelid = 'matches'::regclass 
        AND contype = 'f' 
        AND conname = 'fk_matches_away_team'
    ) THEN
        ALTER TABLE matches 
        ADD CONSTRAINT fk_matches_away_team 
        FOREIGN KEY (away_team_id) 
        REFERENCES teams(id) 
        ON DELETE CASCADE;
    END IF;
END $$;

-- 3. League Standings -> Teams relationship
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conrelid = 'league_standings'::regclass 
        AND contype = 'f' 
        AND confrelid = 'teams'::regclass
    ) THEN
        ALTER TABLE league_standings 
        ADD CONSTRAINT fk_league_standings_team 
        FOREIGN KEY (team_id) 
        REFERENCES teams(id) 
        ON DELETE CASCADE;
    END IF;
END $$;

-- 4. Scorers -> Teams relationship (if exists)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'scorers' 
        AND column_name = 'team_id'
    ) THEN
        IF NOT EXISTS (
            SELECT 1 FROM pg_constraint 
            WHERE conrelid = 'scorers'::regclass 
            AND contype = 'f' 
            AND confrelid = 'teams'::regclass
        ) THEN
            ALTER TABLE scorers 
            ADD CONSTRAINT fk_scorers_team 
            FOREIGN KEY (team_id) 
            REFERENCES teams(id) 
            ON DELETE CASCADE;
        END IF;
    END IF;
END $$;

-- 5. Youth Teams -> Teams relationship (if parent_team_id exists)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'youth_teams' 
        AND column_name = 'parent_team_id'
    ) THEN
        IF NOT EXISTS (
            SELECT 1 FROM pg_constraint 
            WHERE conrelid = 'youth_teams'::regclass 
            AND contype = 'f' 
            AND confrelid = 'teams'::regclass
        ) THEN
            ALTER TABLE youth_teams 
            ADD CONSTRAINT fk_youth_teams_parent 
            FOREIGN KEY (parent_team_id) 
            REFERENCES teams(id) 
            ON DELETE SET NULL;
        END IF;
    END IF;
END $$;