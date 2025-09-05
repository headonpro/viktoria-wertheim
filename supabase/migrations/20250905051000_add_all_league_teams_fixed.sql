-- Add all missing teams for complete league tables
-- Based on official BFV league standings (with corrected short_name field lengths)

-- First clean up any partial data
DELETE FROM league_standings WHERE team_id NOT IN (SELECT id FROM teams);
DELETE FROM teams WHERE created_at > NOW() - INTERVAL '1 hour' AND name != 'SV Viktoria Wertheim' AND name != 'SV Viktoria Wertheim 2' AND name != 'SpG Viktoria Wertheim 3/Grünenwört';

-- ============================================
-- KREISLIGA TAUBERBISCHOFSHEIM (1. Mannschaft)
-- ============================================
-- Add missing teams
INSERT INTO teams (id, name, short_name, league, season, team_type, created_at) VALUES
  (gen_random_uuid(), 'TSV Assamstadt', 'TSV Assam', 'bfv-Kreisliga Tauberbischofsheim', '2025/26', 'first', NOW()),
  (gen_random_uuid(), 'TuS Großrinderfeld', 'TuS Großr', 'bfv-Kreisliga Tauberbischofsheim', '2025/26', 'first', NOW()),
  (gen_random_uuid(), '1.FC Umpfertal', '1.FC Umpf', 'bfv-Kreisliga Tauberbischofsheim', '2025/26', 'first', NOW()),
  (gen_random_uuid(), 'SG RaMBo', 'SG RaMBo', 'bfv-Kreisliga Tauberbischofsheim', '2025/26', 'first', NOW()),
  (gen_random_uuid(), 'SV Dülfringen', 'SV Dülfr', 'bfv-Kreisliga Tauberbischofsheim', '2025/26', 'first', NOW()),
  (gen_random_uuid(), 'VfR Gerlachsheim', 'VfR Gerl', 'bfv-Kreisliga Tauberbischofsheim', '2025/26', 'first', NOW()),
  (gen_random_uuid(), 'FV Brehmbachtal', 'FV Brehm', 'bfv-Kreisliga Tauberbischofsheim', '2025/26', 'first', NOW()),
  (gen_random_uuid(), 'FC Hundheim-Steinbach', 'FC H-S', 'bfv-Kreisliga Tauberbischofsheim', '2025/26', 'first', NOW()),
  (gen_random_uuid(), 'SpG Schwabhausen/Windischbuch', 'SpG S/W', 'bfv-Kreisliga Tauberbischofsheim', '2025/26', 'first', NOW()),
  (gen_random_uuid(), 'Kickers DHK Wertheim', 'Kickers', 'bfv-Kreisliga Tauberbischofsheim', '2025/26', 'first', NOW()),
  (gen_random_uuid(), 'SpG Impfingen/Tauberbischofsheim 2', 'SpG I/T 2', 'bfv-Kreisliga Tauberbischofsheim', '2025/26', 'first', NOW()),
  (gen_random_uuid(), 'VfB Reicholzheim', 'VfB Reich', 'bfv-Kreisliga Tauberbischofsheim', '2025/26', 'first', NOW())
ON CONFLICT (name, season, team_type) DO NOTHING;

-- ============================================
-- KREISKLASSE A TAUBERBISCHOFSHEIM (2. Mannschaft)
-- ============================================
INSERT INTO teams (id, name, short_name, league, season, team_type, created_at) VALUES
  (gen_random_uuid(), 'SV Eintracht Nassig 2', 'SV Nass 2', 'bfv-Kreisklasse A Tauberbischofsheim', '2025/26', 'second', NOW()),
  (gen_random_uuid(), 'FSV Tauberhöhe 2', 'FSV Taub2', 'bfv-Kreisklasse A Tauberbischofsheim', '2025/26', 'second', NOW()),
  (gen_random_uuid(), 'SpG Kickers DHK Wertheim 2/Urphar', 'DHK 2/Urp', 'bfv-Kreisklasse A Tauberbischofsheim', '2025/26', 'second', NOW()),
  (gen_random_uuid(), 'SV Eintracht Nassig 3', 'SV Nass 3', 'bfv-Kreisklasse A Tauberbischofsheim', '2025/26', 'second', NOW()),
  (gen_random_uuid(), 'TSV Kreuzwertheim 2', 'TSV Kreuz2', 'bfv-Kreisklasse A Tauberbischofsheim', '2025/26', 'second', NOW()),
  (gen_random_uuid(), 'VfB Reicholzheim 2 (flex)', 'VfB Rei 2', 'bfv-Kreisklasse A Tauberbischofsheim', '2025/26', 'second', NOW()),
  (gen_random_uuid(), 'Türkgücü Wertheim 2', 'Türk Wer2', 'bfv-Kreisklasse A Tauberbischofsheim', '2025/26', 'second', NOW()),
  (gen_random_uuid(), 'FC Wertheim-Eichel 2', 'FC WE 2', 'bfv-Kreisklasse A Tauberbischofsheim', '2025/26', 'second', NOW()),
  (gen_random_uuid(), 'SG RaMBo 2', 'SG RaMBo 2', 'bfv-Kreisklasse A Tauberbischofsheim', '2025/26', 'second', NOW()),
  (gen_random_uuid(), 'FC Hundheim-Steinbach 2 (flex)', 'FC H-S 2', 'bfv-Kreisklasse A Tauberbischofsheim', '2025/26', 'second', NOW())
ON CONFLICT (name, season, team_type) DO NOTHING;

-- ============================================
-- KREISKLASSE B TAUBERBISCHOFSHEIM (3. Mannschaft)  
-- ============================================
INSERT INTO teams (id, name, short_name, league, season, team_type, created_at) VALUES
  (gen_random_uuid(), 'FV Oberlauda 2', 'FV Oberl2', 'bfv-Kreisklasse B Tauberbischofsheim', '2025/26', 'third', NOW()),
  (gen_random_uuid(), 'TSV Assamstadt 2', 'TSV Ass 2', 'bfv-Kreisklasse B Tauberbischofsheim', '2025/26', 'third', NOW()),
  (gen_random_uuid(), 'TSV Bobstadt/Assamst. 3', 'TSV Bob 3', 'bfv-Kreisklasse B Tauberbischofsheim', '2025/26', 'third', NOW()),
  (gen_random_uuid(), 'TSV Gerchsheim 2', 'TSV Ger 2', 'bfv-Kreisklasse B Tauberbischofsheim', '2025/26', 'third', NOW()),
  (gen_random_uuid(), 'FV Brehmbachtal 2', 'FV Brehm2', 'bfv-Kreisklasse B Tauberbischofsheim', '2025/26', 'third', NOW()),
  (gen_random_uuid(), 'FC Külsheim 2', 'FC Küls 2', 'bfv-Kreisklasse B Tauberbischofsheim', '2025/26', 'third', NOW()),
  (gen_random_uuid(), 'DJK Unterbalbach 2', 'DJK Unt 2', 'bfv-Kreisklasse B Tauberbischofsheim', '2025/26', 'third', NOW()),
  (gen_random_uuid(), 'SpG Apfelbach/Herrenzimmern 2', 'SpG Apf 2', 'bfv-Kreisklasse B Tauberbischofsheim', '2025/26', 'third', NOW())
ON CONFLICT (name, season, team_type) DO NOTHING;

-- ============================================
-- INITIALIZE LEAGUE STANDINGS
-- ============================================
DO $$
DECLARE
  v_team RECORD;
  v_position INTEGER;
  v_points INTEGER;
  v_won INTEGER;
  v_drawn INTEGER;
  v_lost INTEGER;
  v_goals_for INTEGER;
  v_goals_against INTEGER;
BEGIN
  -- Clear existing league standings for clean slate
  DELETE FROM league_standings WHERE season = '2025/26';

  -- Kreisliga Standings (from screenshot)
  FOR v_team IN (
    SELECT id, name, short_name FROM teams 
    WHERE league = 'bfv-Kreisliga Tauberbischofsheim' AND season = '2025/26'
    ORDER BY name
  ) LOOP
    -- Set values based on screenshot
    CASE v_team.name
      WHEN 'TSV Assamstadt' THEN
        v_position := 1; v_points := 12; v_won := 4; v_drawn := 0; v_lost := 0; 
        v_goals_for := 15; v_goals_against := 2;
      WHEN 'TuS Großrinderfeld' THEN  
        v_position := 2; v_points := 10; v_won := 3; v_drawn := 1; v_lost := 0;
        v_goals_for := 21; v_goals_against := 3;
      WHEN '1.FC Umpfertal' THEN
        v_position := 3; v_points := 9; v_won := 3; v_drawn := 0; v_lost := 1;
        v_goals_for := 13; v_goals_against := 5;
      WHEN 'SG RaMBo' THEN
        v_position := 4; v_points := 9; v_won := 3; v_drawn := 0; v_lost := 0;
        v_goals_for := 10; v_goals_against := 5;
      WHEN 'SV Dülfringen' THEN
        v_position := 5; v_points := 7; v_won := 2; v_drawn := 1; v_lost := 1;
        v_goals_for := 6; v_goals_against := 7;
      WHEN 'Türkgücü Wertheim' THEN
        v_position := 6; v_points := 6; v_won := 2; v_drawn := 0; v_lost := 1;
        v_goals_for := 10; v_goals_against := 4;
      WHEN 'VfR Gerlachsheim' THEN
        v_position := 7; v_points := 5; v_won := 1; v_drawn := 2; v_lost := 1;
        v_goals_for := 8; v_goals_against := 9;
      WHEN 'FV Brehmbachtal' THEN
        v_position := 8; v_points := 4; v_won := 1; v_drawn := 1; v_lost := 2;
        v_goals_for := 9; v_goals_against := 11;
      WHEN 'FC Hundheim-Steinbach' THEN
        v_position := 9; v_points := 4; v_won := 1; v_drawn := 1; v_lost := 2;
        v_goals_for := 5; v_goals_against := 9;
      WHEN 'TSV Kreuzwertheim' THEN
        v_position := 10; v_points := 4; v_won := 1; v_drawn := 1; v_lost := 1;
        v_goals_for := 6; v_goals_against := 11;
      WHEN 'SV Viktoria Wertheim' THEN
        v_position := 11; v_points := 4; v_won := 1; v_drawn := 1; v_lost := 1;
        v_goals_for := 4; v_goals_against := 5;
      WHEN 'SpG Schwabhausen/Windischbuch' THEN
        v_position := 12; v_points := 3; v_won := 1; v_drawn := 0; v_lost := 2;
        v_goals_for := 3; v_goals_against := 6;
      WHEN 'Kickers DHK Wertheim' THEN
        v_position := 13; v_points := 1; v_won := 0; v_drawn := 1; v_lost := 3;
        v_goals_for := 7; v_goals_against := 14;
      WHEN 'SpG Impfingen/Tauberbischofsheim 2' THEN
        v_position := 14; v_points := 1; v_won := 0; v_drawn := 1; v_lost := 3;
        v_goals_for := 5; v_goals_against := 16;
      WHEN 'VfB Reicholzheim' THEN
        v_position := 15; v_points := 0; v_won := 0; v_drawn := 0; v_lost := 4;
        v_goals_for := 3; v_goals_against := 13;
      WHEN 'SV Schönfeld' THEN
        v_position := 16; v_points := 0; v_won := 0; v_drawn := 0; v_lost := 3;
        v_goals_for := 2; v_goals_against := 16;
      ELSE
        v_position := 99; v_points := 0; v_won := 0; v_drawn := 0; v_lost := 0;
        v_goals_for := 0; v_goals_against := 0;
    END CASE;

    INSERT INTO league_standings (
      team_id, season, position, points, played, won, drawn, lost, 
      goals_for, goals_against, created_at, updated_at
    ) VALUES (
      v_team.id, '2025/26', v_position, v_points, v_won + v_drawn + v_lost, 
      v_won, v_drawn, v_lost, v_goals_for, v_goals_against, NOW(), NOW()
    );
  END LOOP;

  -- Kreisklasse A Standings (from screenshot)
  FOR v_team IN (
    SELECT id, name FROM teams 
    WHERE league = 'bfv-Kreisklasse A Tauberbischofsheim' AND season = '2025/26'
    ORDER BY name
  ) LOOP
    CASE v_team.name
      WHEN 'SpG Kickers DHK Wertheim 2/Urphar' THEN
        v_position := 1; v_points := 9; v_won := 3; v_drawn := 0; v_lost := 0;
        v_goals_for := 10; v_goals_against := 2;
      WHEN 'SV Eintracht Nassig 3' THEN
        v_position := 2; v_points := 6; v_won := 2; v_drawn := 0; v_lost := 0;
        v_goals_for := 15; v_goals_against := 1;
      WHEN 'TSV Kreuzwertheim 2' THEN
        v_position := 3; v_points := 6; v_won := 2; v_drawn := 0; v_lost := 1;
        v_goals_for := 11; v_goals_against := 2;
      WHEN 'VfB Reicholzheim 2 (flex)' THEN
        v_position := 4; v_points := 6; v_won := 2; v_drawn := 0; v_lost := 1;
        v_goals_for := 5; v_goals_against := 12;
      WHEN 'Türkgücü Wertheim 2' THEN
        v_position := 5; v_points := 3; v_won := 1; v_drawn := 0; v_lost := 0;
        v_goals_for := 4; v_goals_against := 3;
      WHEN 'FC Wertheim-Eichel 2' THEN
        v_position := 6; v_points := 1; v_won := 0; v_drawn := 1; v_lost := 2;
        v_goals_for := 3; v_goals_against := 5;
      WHEN 'SG RaMBo 2' THEN
        v_position := 7; v_points := 1; v_won := 0; v_drawn := 1; v_lost := 1;
        v_goals_for := 0; v_goals_against := 3;
      WHEN 'FC Hundheim-Steinbach 2 (flex)' THEN
        v_position := 8; v_points := 0; v_won := 0; v_drawn := 0; v_lost := 2;
        v_goals_for := 1; v_goals_against := 10;
      WHEN 'SpG Viktoria Wertheim 3/Grünenwört' THEN
        v_position := 9; v_points := 0; v_won := 0; v_drawn := 0; v_lost := 3;
        v_goals_for := 3; v_goals_against := 14;
      WHEN 'FSV Tauberhöhe 2' THEN
        v_position := 10; v_points := 0; v_won := 0; v_drawn := 0; v_lost := 0;
        v_goals_for := 0; v_goals_against := 0;
      WHEN 'SV Eintracht Nassig 2' THEN
        v_position := 11; v_points := 0; v_won := 0; v_drawn := 0; v_lost := 0;
        v_goals_for := 0; v_goals_against := 0;
      ELSE
        v_position := 99; v_points := 0; v_won := 0; v_drawn := 0; v_lost := 0;
        v_goals_for := 0; v_goals_against := 0;
    END CASE;

    INSERT INTO league_standings (
      team_id, season, position, points, played, won, drawn, lost,
      goals_for, goals_against, created_at, updated_at
    ) VALUES (
      v_team.id, '2025/26', v_position, v_points, v_won + v_drawn + v_lost,
      v_won, v_drawn, v_lost, v_goals_for, v_goals_against, NOW(), NOW()
    );
  END LOOP;

  -- Kreisklasse B Standings (from screenshot) 
  FOR v_team IN (
    SELECT id, name FROM teams 
    WHERE league = 'bfv-Kreisklasse B Tauberbischofsheim' AND season = '2025/26'
    ORDER BY name  
  ) LOOP
    CASE v_team.name
      WHEN 'FV Oberlauda 2' THEN
        v_position := 1; v_points := 6; v_won := 2; v_drawn := 0; v_lost := 0;
        v_goals_for := 7; v_goals_against := 1;
      WHEN 'TSV Assamstadt 2' THEN
        v_position := 2; v_points := 6; v_won := 2; v_drawn := 0; v_lost := 0;
        v_goals_for := 5; v_goals_against := 2;
      WHEN 'TSV Bobstadt/Assamst. 3' THEN
        v_position := 3; v_points := 4; v_won := 1; v_drawn := 1; v_lost := 0;
        v_goals_for := 6; v_goals_against := 4;
      WHEN 'TSV Gerchsheim 2' THEN
        v_position := 4; v_points := 3; v_won := 1; v_drawn := 0; v_lost := 1;
        v_goals_for := 6; v_goals_against := 2;
      WHEN 'FV Brehmbachtal 2' THEN
        v_position := 5; v_points := 3; v_won := 1; v_drawn := 0; v_lost := 1;
        v_goals_for := 4; v_goals_against := 5;
      WHEN 'FC Külsheim 2' THEN
        v_position := 6; v_points := 1; v_won := 0; v_drawn := 1; v_lost := 1;
        v_goals_for := 4; v_goals_against := 6;
      WHEN 'DJK Unterbalbach 2' THEN
        v_position := 7; v_points := 0; v_won := 0; v_drawn := 0; v_lost := 1;
        v_goals_for := 0; v_goals_against := 7;
      WHEN 'SpG Apfelbach/Herrenzimmern 2' THEN
        v_position := 8; v_points := 0; v_won := 0; v_drawn := 0; v_lost := 2;
        v_goals_for := 1; v_goals_against := 6;
      WHEN 'SV Viktoria Wertheim 2' THEN
        v_position := 9; v_points := 0; v_won := 0; v_drawn := 0; v_lost := 0;
        v_goals_for := 0; v_goals_against := 0;
      ELSE
        v_position := 99; v_points := 0; v_won := 0; v_drawn := 0; v_lost := 0;
        v_goals_for := 0; v_goals_against := 0;
    END CASE;

    INSERT INTO league_standings (
      team_id, season, position, points, played, won, drawn, lost,
      goals_for, goals_against, created_at, updated_at
    ) VALUES (
      v_team.id, '2025/26', v_position, v_points, v_won + v_drawn + v_lost,
      v_won, v_drawn, v_lost, v_goals_for, v_goals_against, NOW(), NOW()
    );
  END LOOP;

  -- Verify results
  RAISE NOTICE '=== League Tables Summary ===';
  RAISE NOTICE 'Kreisliga: % teams', (SELECT COUNT(*) FROM teams WHERE league = 'bfv-Kreisliga Tauberbischofsheim' AND season = '2025/26');
  RAISE NOTICE 'Kreisklasse A: % teams', (SELECT COUNT(*) FROM teams WHERE league = 'bfv-Kreisklasse A Tauberbischofsheim' AND season = '2025/26');
  RAISE NOTICE 'Kreisklasse B: % teams', (SELECT COUNT(*) FROM teams WHERE league = 'bfv-Kreisklasse B Tauberbischofsheim' AND season = '2025/26');
  
  RAISE NOTICE '';
  RAISE NOTICE 'SV Viktoria Teams positions:';
  FOR v_team IN (
    SELECT t.name, t.team_type, ls.position, ls.points 
    FROM teams t 
    JOIN league_standings ls ON t.id = ls.team_id 
    WHERE t.name LIKE '%Viktoria Wertheim%' AND t.season = '2025/26'
    ORDER BY t.team_type
  ) LOOP
    RAISE NOTICE '% Mannschaft: Position % with % points', 
      CASE v_team.team_type 
        WHEN 'first' THEN '1.'
        WHEN 'second' THEN '2.'  
        WHEN 'third' THEN '3.'
      END,
      v_team.position, v_team.points;
  END LOOP;
END $$;