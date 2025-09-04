-- Fix missing primary keys on all tables
-- This migration adds primary key constraints that were lost during data import

-- Function to safely add primary key
DO $
BEGIN
    -- Add primary keys only if they don't exist
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid = 'contacts'::regclass AND contype = 'p') THEN
        ALTER TABLE contacts ADD PRIMARY KEY (id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid = 'news'::regclass AND contype = 'p') THEN
        ALTER TABLE news ADD PRIMARY KEY (id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid = 'matches'::regclass AND contype = 'p') THEN
        ALTER TABLE matches ADD PRIMARY KEY (id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid = 'league_standings'::regclass AND contype = 'p') THEN
        ALTER TABLE league_standings ADD PRIMARY KEY (id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid = 'newsletter_subscribers'::regclass AND contype = 'p') THEN
        ALTER TABLE newsletter_subscribers ADD PRIMARY KEY (id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid = 'players'::regclass AND contype = 'p') THEN
        ALTER TABLE players ADD PRIMARY KEY (id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid = 'teams'::regclass AND contype = 'p') THEN
        ALTER TABLE teams ADD PRIMARY KEY (id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid = 'scorers'::regclass AND contype = 'p') THEN
        ALTER TABLE scorers ADD PRIMARY KEY (id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid = 'youth_teams'::regclass AND contype = 'p') THEN
        ALTER TABLE youth_teams ADD PRIMARY KEY (id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid = 'sponsors'::regclass AND contype = 'p') THEN
        ALTER TABLE sponsors ADD PRIMARY KEY (id);
    END IF;
    
    -- Add unique constraints only if they don't exist
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid = 'newsletter_subscribers'::regclass AND conname = 'newsletter_subscribers_email_unique') THEN
        ALTER TABLE newsletter_subscribers ADD CONSTRAINT newsletter_subscribers_email_unique UNIQUE (email);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid = 'teams'::regclass AND conname = 'teams_name_unique') THEN
        ALTER TABLE teams ADD CONSTRAINT teams_name_unique UNIQUE (name);
    END IF;
END
$;

-- Add comment explaining the issue
COMMENT ON TABLE news IS 'News articles table with primary key restored after data-sync issue';