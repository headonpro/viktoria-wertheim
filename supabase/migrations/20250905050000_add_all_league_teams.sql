-- Add all missing teams for complete league tables
-- Based on official BFV league standings

-- ============================================
-- KREISLIGA TAUBERBISCHOFSHEIM (1. Mannschaft)
-- ============================================
-- Add missing teams (SV Schönfeld already exists)
INSERT INTO teams (id, name, short_name, league, season, team_type, created_at) VALUES
  (gen_random_uuid(), 'TSV Assamstadt', 'TSV Assam.', 'bfv-Kreisliga Tauberbischofsheim', '2025/26', 'first', NOW()),
  (gen_random_uuid(), 'TuS Großrinderfeld', 'TuS Großr.', 'bfv-Kreisliga Tauberbischofsheim', '2025/26', 'first', NOW()),
  (gen_random_uuid(), '1.FC Umpfertal', '1.FC Umpf.', 'bfv-Kreisliga Tauberbischofsheim', '2025/26', 'first', NOW()),
  (gen_random_uuid(), 'SG RaMBo', 'SG RaMBo', 'bfv-Kreisliga Tauberbischofsheim', '2025/26', 'first', NOW()),
  (gen_random_uuid(), 'SV Dülfringen', 'SV Dülfr.', 'bfv-Kreisliga Tauberbischofsheim', '2025/26', 'first', NOW()),
  -- Türkgücü Wertheim already exists
  (gen_random_uuid(), 'VfR Gerlachsheim', 'VfR Gerl.', 'bfv-Kreisliga Tauberbischofsheim', '2025/26', 'first', NOW()),
  (gen_random_uuid(), 'FV Brehmbachtal', 'FV Brehm.', 'bfv-Kreisliga Tauberbischofsheim', '2025/26', 'first', NOW()),
  (gen_random_uuid(), 'FC Hundheim-Steinbach', 'FC H-S', 'bfv-Kreisliga Tauberbischofsheim', '2025/26', 'first', NOW()),
  -- TSV Kreuzwertheim already exists
  (gen_random_uuid(), 'SpG Schwabhausen/Windischbuch', 'SpG S/W', 'bfv-Kreisliga Tauberbischofsheim', '2025/26', 'first', NOW()),
  (gen_random_uuid(), 'Kickers DHK Wertheim', 'Kickers DHK', 'bfv-Kreisliga Tauberbischofsheim', '2025/26', 'first', NOW()),
  (gen_random_uuid(), 'SpG Impfingen/Tauberbischofsheim 2', 'SpG I/T 2', 'bfv-Kreisliga Tauberbischofsheim', '2025/26', 'first', NOW()),
  (gen_random_uuid(), 'VfB Reicholzheim', 'VfB Reich.', 'bfv-Kreisliga Tauberbischofsheim', '2025/26', 'first', NOW())
ON CONFLICT (name, season, team_type) DO NOTHING;

-- ============================================
-- KREISKLASSE A TAUBERBISCHOFSHEIM (2. Mannschaft)
-- ============================================
INSERT INTO teams (id, name, short_name, league, season, team_type, created_at) VALUES
  (gen_random_uuid(), 'SV Eintracht Nassig 2', 'SV Nassig 2', 'bfv-Kreisklasse A Tauberbischofsheim', '2025/26', 'second', NOW()),
  (gen_random_uuid(), 'FSV Tauberhöhe 2', 'FSV Taub.2', 'bfv-Kreisklasse A Tauberbischofsheim', '2025/26', 'second', NOW()),
  (gen_random_uuid(), 'SpG Grünsfeld 2/Zimmern', 'SpG G/Z 2', 'bfv-Kreisklasse A Tauberbischofsheim', '2025/26', 'second', NOW()),
  (gen_random_uuid(), 'SpG Dittwar/Heckfeld', 'SpG D/H', 'bfv-Kreisklasse A Tauberbischofsheim', '2025/26', 'second', NOW()),
  (gen_random_uuid(), 'SpG Balbachtal', 'SpG Balb.', 'bfv-Kreisklasse A Tauberbischofsheim', '2025/26', 'second', NOW()),
  (gen_random_uuid(), 'FC Wertheim-Eichel', 'FC W-Eichel', 'bfv-Kreisklasse A Tauberbischofsheim', '2025/26', 'second', NOW()),
  (gen_random_uuid(), 'SpG Welzbachtal', 'SpG Welzb.', 'bfv-Kreisklasse A Tauberbischofsheim', '2025/26', 'second', NOW()),
  (gen_random_uuid(), 'SpG Unterschüpf/Kupprichhausen', 'SpG U/K', 'bfv-Kreisklasse A Tauberbischofsheim', '2025/26', 'second', NOW()),
  (gen_random_uuid(), 'TSV Gerchsheim', 'TSV Gerch.', 'bfv-Kreisklasse A Tauberbischofsheim', '2025/26', 'second', NOW()),
  (gen_random_uuid(), 'SpG FV Oberlauda/VfR Gerlachsheim 2', 'SpG O/G 2', 'bfv-Kreisklasse A Tauberbischofsheim', '2025/26', 'second', NOW()),
  (gen_random_uuid(), 'SpG Beckstein/Königshofen 2', 'SpG B/K 2', 'bfv-Kreisklasse A Tauberbischofsheim', '2025/26', 'second', NOW()),
  (gen_random_uuid(), 'TSV Assamstadt 2', 'TSV Ass. 2', 'bfv-Kreisklasse A Tauberbischofsheim', '2025/26', 'second', NOW()),
  (gen_random_uuid(), 'SpG Distelhausen/Lauda 2', 'SpG D/L 2', 'bfv-Kreisklasse A Tauberbischofsheim', '2025/26', 'second', NOW())
ON CONFLICT (name, season, team_type) DO NOTHING;

-- ============================================
-- KREISKLASSE B TAUBERBISCHOFSHEIM (3. Mannschaft)
-- ============================================
INSERT INTO teams (id, name, short_name, league, season, team_type, created_at) VALUES
  (gen_random_uuid(), 'SpG Kickers DHK Wertheim 2/Urphar', 'DHK 2/U', 'bfv-Kreisklasse B Tauberbischofsheim', '2025/26', 'third', NOW()),
  (gen_random_uuid(), 'SV Eintracht Nassig 3', 'SV Nassig 3', 'bfv-Kreisklasse B Tauberbischofsheim', '2025/26', 'third', NOW()),
  (gen_random_uuid(), 'TSV Kreuzwertheim 2', 'TSV Kr. 2', 'bfv-Kreisklasse B Tauberbischofsheim', '2025/26', 'third', NOW()),
  (gen_random_uuid(), 'VfB Reicholzheim 2', 'VfB R. 2', 'bfv-Kreisklasse B Tauberbischofsheim', '2025/26', 'third', NOW()),
  (gen_random_uuid(), 'Türkgücü Wertheim 2', 'Türkgücü 2', 'bfv-Kreisklasse B Tauberbischofsheim', '2025/26', 'third', NOW()),
  (gen_random_uuid(), 'FC Wertheim-Eichel 2', 'FC W-Eichel 2', 'bfv-Kreisklasse B Tauberbischofsheim', '2025/26', 'third', NOW()),
  (gen_random_uuid(), 'SG RaMBo 2', 'SG RaMBo 2', 'bfv-Kreisklasse B Tauberbischofsheim', '2025/26', 'third', NOW()),
  (gen_random_uuid(), 'FC Hundheim-Steinbach 2', 'FC H-S 2', 'bfv-Kreisklasse B Tauberbischofsheim', '2025/26', 'third', NOW())
ON CONFLICT (name, season, team_type) DO NOTHING;

-- ============================================
-- Initialize League Standings with correct data
-- ============================================

-- Clear existing standings to start fresh
DELETE FROM league_standings WHERE season = '2025/26';

-- Kreisliga Tauberbischofsheim standings
WITH kreisliga_data AS (
  SELECT * FROM (VALUES
    ('SV Schönfeld', 1, 4, 3, 1, 0, 13, 5, 10),
    ('TSV Assamstadt', 2, 4, 3, 1, 0, 11, 4, 10),
    ('TuS Großrinderfeld', 3, 4, 3, 1, 0, 8, 3, 10),
    ('1.FC Umpfertal', 4, 4, 2, 1, 1, 13, 5, 7),
    ('SG RaMBo', 5, 4, 2, 1, 1, 6, 4, 7),
    ('SV Dülfringen', 6, 4, 2, 0, 2, 14, 11, 6),
    ('Türkgücü Wertheim', 7, 3, 2, 0, 1, 7, 4, 6),
    ('VfR Gerlachsheim', 8, 4, 2, 0, 2, 10, 8, 6),
    ('FV Brehmbachtal', 9, 3, 1, 2, 0, 4, 3, 5),
    ('FC Hundheim-Steinbach', 10, 4, 1, 2, 1, 5, 6, 5),
    ('SV Viktoria Wertheim', 11, 4, 1, 1, 2, 8, 9, 4),
    ('TSV Kreuzwertheim', 12, 4, 1, 1, 2, 6, 7, 4),
    ('SpG Schwabhausen/Windischbuch', 13, 4, 1, 1, 2, 5, 8, 4),
    ('Kickers DHK Wertheim', 14, 3, 0, 0, 3, 4, 11, 0),
    ('SpG Impfingen/Tauberbischofsheim 2', 15, 4, 0, 0, 4, 5, 13, 0),
    ('VfB Reicholzheim', 16, 3, 0, 0, 3, 4, 22, 0)
  ) AS t(team_name, position, played, won, drawn, lost, goals_for, goals_against, points)
)
INSERT INTO league_standings (team_id, team_name, position, played, won, drawn, lost, goals_for, goals_against, points, league, season)
SELECT 
  t.id,
  kd.team_name,
  kd.position,
  kd.played,
  kd.won,
  kd.drawn,
  kd.lost,
  kd.goals_for,
  kd.goals_against,
  kd.points,
  'bfv-Kreisliga Tauberbischofsheim',
  '2025/26'
FROM kreisliga_data kd
JOIN teams t ON t.name = kd.team_name AND t.season = '2025/26' AND t.league = 'bfv-Kreisliga Tauberbischofsheim';

-- Kreisklasse A Tauberbischofsheim standings
WITH kreisklasse_a_data AS (
  SELECT * FROM (VALUES
    ('SV Eintracht Nassig 2', 1, 3, 3, 0, 0, 9, 1, 9),
    ('FSV Tauberhöhe 2', 2, 3, 2, 1, 0, 7, 4, 7),
    ('SpG Grünsfeld 2/Zimmern', 3, 3, 2, 0, 1, 5, 2, 6),
    ('SpG Dittwar/Heckfeld', 4, 3, 2, 0, 1, 8, 6, 6),
    ('SpG Balbachtal', 5, 3, 1, 2, 0, 7, 1, 5),
    ('FC Wertheim-Eichel', 6, 3, 1, 2, 0, 6, 1, 5),
    ('SpG Welzbachtal', 7, 3, 1, 1, 1, 6, 3, 4),
    ('SpG Unterschüpf/Kupprichhausen', 8, 3, 1, 1, 1, 4, 2, 4),
    ('TSV Gerchsheim', 9, 3, 1, 1, 1, 8, 9, 4),
    ('SpG FV Oberlauda/VfR Gerlachsheim 2', 10, 3, 1, 0, 2, 9, 10, 3),
    ('SpG Beckstein/Königshofen 2', 11, 3, 1, 0, 2, 6, 10, 3),
    ('TSV Assamstadt 2', 12, 3, 0, 2, 1, 2, 7, 2),
    ('SV Viktoria Wertheim II', 13, 3, 0, 0, 3, 2, 12, 0),
    ('SpG Distelhausen/Lauda 2', 14, 3, 0, 0, 3, 1, 12, 0)
  ) AS t(team_name, position, played, won, drawn, lost, goals_for, goals_against, points)
)
INSERT INTO league_standings (team_id, team_name, position, played, won, drawn, lost, goals_for, goals_against, points, league, season)
SELECT 
  t.id,
  kad.team_name,
  kad.position,
  kad.played,
  kad.won,
  kad.drawn,
  kad.lost,
  kad.goals_for,
  kad.goals_against,
  kad.points,
  'bfv-Kreisklasse A Tauberbischofsheim',
  '2025/26'
FROM kreisklasse_a_data kad
JOIN teams t ON t.name = kad.team_name AND t.season = '2025/26' AND t.league = 'bfv-Kreisklasse A Tauberbischofsheim';

-- Kreisklasse B Tauberbischofsheim standings  
WITH kreisklasse_b_data AS (
  SELECT * FROM (VALUES
    ('SpG Kickers DHK Wertheim 2/Urphar', 1, 3, 3, 0, 0, 10, 2, 9),
    ('SV Eintracht Nassig 3', 2, 2, 2, 0, 0, 15, 1, 6),
    ('TSV Kreuzwertheim 2', 3, 3, 2, 0, 1, 11, 2, 6),
    ('VfB Reicholzheim 2', 4, 3, 2, 0, 1, 5, 12, 6),
    ('Türkgücü Wertheim 2', 5, 1, 1, 0, 0, 4, 3, 3),
    ('FC Wertheim-Eichel 2', 6, 3, 0, 1, 2, 3, 5, 1),
    ('SG RaMBo 2', 7, 2, 0, 1, 1, 0, 3, 1),
    ('FC Hundheim-Steinbach 2', 8, 2, 0, 0, 2, 1, 10, 0),
    ('SpG Vikt. Wertheim 3/Grünenwört', 9, 3, 0, 0, 3, 3, 14, 0)
  ) AS t(team_name, position, played, won, drawn, lost, goals_for, goals_against, points)
)
INSERT INTO league_standings (team_id, team_name, position, played, won, drawn, lost, goals_for, goals_against, points, league, season)
SELECT 
  t.id,
  kbd.team_name,
  kbd.position,
  kbd.played,
  kbd.won,
  kbd.drawn,
  kbd.lost,
  kbd.goals_for,
  kbd.goals_against,
  kbd.points,
  'bfv-Kreisklasse B Tauberbischofsheim',
  '2025/26'
FROM kreisklasse_b_data kbd
JOIN teams t ON t.name = kbd.team_name AND t.season = '2025/26' AND t.league = 'bfv-Kreisklasse B Tauberbischofsheim';

-- Verify the results
DO $$
BEGIN
  RAISE NOTICE '=== League Tables Summary ===';
  RAISE NOTICE 'Kreisliga: % teams', (SELECT COUNT(*) FROM league_standings WHERE league = 'bfv-Kreisliga Tauberbischofsheim' AND season = '2025/26');
  RAISE NOTICE 'Kreisklasse A: % teams', (SELECT COUNT(*) FROM league_standings WHERE league = 'bfv-Kreisklasse A Tauberbischofsheim' AND season = '2025/26');
  RAISE NOTICE 'Kreisklasse B: % teams', (SELECT COUNT(*) FROM league_standings WHERE league = 'bfv-Kreisklasse B Tauberbischofsheim' AND season = '2025/26');
  
  RAISE NOTICE '';
  RAISE NOTICE 'SV Viktoria Teams positions:';
  RAISE NOTICE '1. Mannschaft: Position % with % points', 
    (SELECT position FROM league_standings WHERE team_name = 'SV Viktoria Wertheim' AND season = '2025/26'),
    (SELECT points FROM league_standings WHERE team_name = 'SV Viktoria Wertheim' AND season = '2025/26');
  RAISE NOTICE '2. Mannschaft: Position % with % points',
    (SELECT position FROM league_standings WHERE team_name = 'SV Viktoria Wertheim II' AND season = '2025/26'),
    (SELECT points FROM league_standings WHERE team_name = 'SV Viktoria Wertheim II' AND season = '2025/26');
  RAISE NOTICE '3. Mannschaft: Position % with % points',
    (SELECT position FROM league_standings WHERE team_name = 'SpG Vikt. Wertheim 3/Grünenwört' AND season = '2025/26'),
    (SELECT points FROM league_standings WHERE team_name = 'SpG Vikt. Wertheim 3/Grünenwört' AND season = '2025/26');
END $$;