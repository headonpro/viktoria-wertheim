-- Migration: Füge fehlende Teams hinzu und korrigiere Team-IDs in matches Tabelle

-- Schritt 1: Füge alle fehlenden Teams zur teams Tabelle hinzu
-- Diese Teams spielen gegen unsere 2. und 3. Mannschaft
INSERT INTO teams (id, name, short_name, league, team_type, season, created_at, updated_at)
VALUES
  -- Teams aus Kreisklasse A (gegen 2. Mannschaft)
  (gen_random_uuid(), 'FSV Tauberhöhe 2', 'Tauberhöhe 2', 'Kreisklasse A', 'opponent', '2025/26', NOW(), NOW()),
  (gen_random_uuid(), 'SpG Unterschüpf/Kupprichhausen', 'Unterschüpf/K.', 'Kreisklasse A', 'opponent', '2025/26', NOW(), NOW()),
  (gen_random_uuid(), 'SpG Balbachtal', 'Balbachtal', 'Kreisklasse A', 'opponent', '2025/26', NOW(), NOW()),
  
  -- Teams aus Kreisklasse B (gegen 3. Mannschaft)
  (gen_random_uuid(), 'TSV Kreuzwertheim 2', 'Kreuzwertheim 2', 'Kreisklasse B', 'opponent', '2025/26', NOW(), NOW()),
  (gen_random_uuid(), 'SpG Kickers DHK Wertheim 2/Urphar', 'DHK 2/Urphar', 'Kreisklasse B', 'opponent', '2025/26', NOW(), NOW()),
  (gen_random_uuid(), 'VfB Reicholzheim 2', 'Reicholzheim 2', 'Kreisklasse B', 'opponent', '2025/26', NOW(), NOW()),
  (gen_random_uuid(), 'FC Hundheim-Steinbach 2', 'Hundheim 2', 'Kreisklasse B', 'opponent', '2025/26', NOW(), NOW()),
  (gen_random_uuid(), 'FC Wertheim-Eichel 2', 'Eichel 2', 'Kreisklasse B', 'opponent', '2025/26', NOW(), NOW()),
  (gen_random_uuid(), 'SG RaMBo 2', 'RaMBo 2', 'Kreisklasse B', 'opponent', '2025/26', NOW(), NOW()),
  (gen_random_uuid(), 'Türkgücü Wertheim 2', 'Türkgücü 2', 'Kreisklasse B', 'opponent', '2025/26', NOW(), NOW()),
  (gen_random_uuid(), 'SV Eintracht Nassig 3', 'Nassig 3', 'Kreisklasse B', 'opponent', '2025/26', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Schritt 2: Aktualisiere die home_team_id und away_team_id in der matches Tabelle
-- für alle Teams, die bisher NULL waren

-- Update home_team_id
UPDATE matches m
SET home_team_id = t.id
FROM teams t
WHERE m.home_team = t.name
  AND m.home_team_id IS NULL;

-- Update away_team_id  
UPDATE matches m
SET away_team_id = t.id
FROM teams t
WHERE m.away_team = t.name
  AND m.away_team_id IS NULL;

-- Schritt 3: Füge die neuen Teams auch zur league_standings Tabelle hinzu
-- damit die Tabellenstände vollständig sind
INSERT INTO league_standings (id, team_id, team_name, league, season, position, played, won, drawn, lost, goals_for, goals_against, goal_difference, points, updated_at)
SELECT 
  gen_random_uuid(),
  t.id,
  t.name,
  t.league,
  '2025/26',
  ROW_NUMBER() OVER (PARTITION BY t.league ORDER BY t.name) + 
    CASE 
      WHEN t.league = 'Kreisklasse A' THEN 13  -- Start nach bestehenden Teams
      WHEN t.league = 'Kreisklasse B' THEN 8   -- Start nach bestehenden Teams
    END,
  0, 0, 0, 0, 0, 0, 0, 0,
  NOW()
FROM teams t
WHERE t.team_type = 'opponent'
  AND t.season = '2025/26'
  AND NOT EXISTS (
    SELECT 1 FROM league_standings ls 
    WHERE ls.team_id = t.id 
    AND ls.season = '2025/26'
  );

-- Verifizierung: Zeige ob noch NULL-Werte existieren
DO $$
DECLARE
  null_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO null_count
  FROM matches
  WHERE (home_team_id IS NULL AND home_team IS NOT NULL)
     OR (away_team_id IS NULL AND away_team IS NOT NULL);
  
  IF null_count > 0 THEN
    RAISE NOTICE 'WARNUNG: Es gibt noch % Matches mit fehlenden Team-IDs', null_count;
  ELSE
    RAISE NOTICE 'SUCCESS: Alle Team-IDs wurden erfolgreich gesetzt!';
  END IF;
END $$;