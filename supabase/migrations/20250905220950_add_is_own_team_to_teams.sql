-- Add is_own_team column to teams table to distinguish our teams from opponent teams
ALTER TABLE teams 
ADD COLUMN IF NOT EXISTS is_own_team BOOLEAN DEFAULT false;

-- Create index for performance when filtering our teams
CREATE INDEX IF NOT EXISTS idx_teams_is_own_team ON teams(is_own_team) WHERE is_own_team = true;

-- Mark our three teams as own teams
UPDATE teams 
SET is_own_team = true 
WHERE id IN (
  '229cb117-471a-4bcc-b60e-d73772738943', -- SV Viktoria Wertheim (1. Mannschaft)
  '568e99ad-d9e1-4f2d-a517-88d3a725755b', -- SV Viktoria Wertheim 2 (2. Mannschaft)  
  'b86367ef-883f-4b73-9c98-77e7a0daf8b8'  -- SpG Viktoria Wertheim 3/Grünenwört (3. Mannschaft)
);

-- Add comment for documentation
COMMENT ON COLUMN teams.is_own_team IS 'Indicates if this team belongs to our club (true) or is an opponent team (false)';