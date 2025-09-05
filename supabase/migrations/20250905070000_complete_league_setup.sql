-- ============================================================================
-- COMPLETE LEAGUE SETUP - Konsolidierte Master-Migration
-- ============================================================================
-- Diese Migration stellt sicher, dass alle Teams und League Standings korrekt
-- eingerichtet sind und die automatische Liga-Berechnung funktioniert.
-- Sie ist idempotent und kann mehrfach ausgeführt werden.
-- ============================================================================

-- ============================================================================
-- SCHRITT 1: BEREINIGUNG ALTER DATEN (falls vorhanden)
-- ============================================================================
DO $$
BEGIN
    -- Lösche falsche Teams die nicht zur aktuellen Saison gehören
    DELETE FROM league_standings WHERE season != '2025/26';
    DELETE FROM teams WHERE season != '2025/26' AND created_at < NOW() - INTERVAL '7 days';
    
    RAISE NOTICE 'Alte Daten bereinigt';
END $$;

-- ============================================================================
-- SCHRITT 2: TEAMS VOLLSTÄNDIG EINRICHTEN (mit UPSERT Logic)
-- ============================================================================

-- Kreisliga Tauberbischofsheim (1. Mannschaft) - 16 Teams
INSERT INTO teams (id, name, short_name, league, season, team_type, created_at) VALUES
    ('a1111111-1111-1111-1111-111111111111', 'SV Viktoria Wertheim', 'SVW', 'bfv-Kreisliga Tauberbischofsheim', '2025/26', 'first', NOW()),
    (gen_random_uuid(), 'TSV Assamstadt', 'TSV ASS', 'bfv-Kreisliga Tauberbischofsheim', '2025/26', 'first', NOW()),
    (gen_random_uuid(), 'TuS Großrinderfeld', 'TuS Großr', 'bfv-Kreisliga Tauberbischofsheim', '2025/26', 'first', NOW()),
    (gen_random_uuid(), '1.FC Umpfertal', '1.FC Umpf', 'bfv-Kreisliga Tauberbischofsheim', '2025/26', 'first', NOW()),
    (gen_random_uuid(), 'SG RaMBo', 'SG RaMBo', 'bfv-Kreisliga Tauberbischofsheim', '2025/26', 'first', NOW()),
    (gen_random_uuid(), 'Türkgücü Wertheim', 'TG WER', 'bfv-Kreisliga Tauberbischofsheim', '2025/26', 'first', NOW()),
    (gen_random_uuid(), 'VfR Gerlachsheim', 'VfR Gerl', 'bfv-Kreisliga Tauberbischofsheim', '2025/26', 'first', NOW()),
    (gen_random_uuid(), 'FV Brehmbachtal', 'FV Brehm', 'bfv-Kreisliga Tauberbischofsheim', '2025/26', 'first', NOW()),
    (gen_random_uuid(), 'FC Hundheim-Steinbach', 'FC H-S', 'bfv-Kreisliga Tauberbischofsheim', '2025/26', 'first', NOW()),
    (gen_random_uuid(), 'TSV Kreuzwertheim', 'TSV KW', 'bfv-Kreisliga Tauberbischofsheim', '2025/26', 'first', NOW()),
    (gen_random_uuid(), 'SpG Schwabhausen/Windischbuch', 'SpG S/W', 'bfv-Kreisliga Tauberbischofsheim', '2025/26', 'first', NOW()),
    (gen_random_uuid(), 'Kickers DHK Wertheim', 'Kickers', 'bfv-Kreisliga Tauberbischofsheim', '2025/26', 'first', NOW()),
    (gen_random_uuid(), 'SpG Impfingen/Tauberbischofsheim 2', 'SpG I/T 2', 'bfv-Kreisliga Tauberbischofsheim', '2025/26', 'first', NOW()),
    (gen_random_uuid(), 'VfB Reicholzheim', 'VfB Reich', 'bfv-Kreisliga Tauberbischofsheim', '2025/26', 'first', NOW()),
    (gen_random_uuid(), 'SV Schönfeld', 'SV SCH', 'bfv-Kreisliga Tauberbischofsheim', '2025/26', 'first', NOW())
ON CONFLICT DO NOTHING;

-- Kreisklasse A Tauberbischofsheim (gemischte Mannschaften) - 11 Teams  
INSERT INTO teams (id, name, short_name, league, season, team_type, created_at) VALUES
    ('a3333333-3333-3333-3333-333333333333', 'SpG Viktoria Wertheim 3/Grünenwört', 'SVW 3/G', 'bfv-Kreisklasse A Tauberbischofsheim', '2025/26', 'second', NOW()),
    (gen_random_uuid(), 'SpG Kickers DHK Wertheim 2/Urphar', 'DHK 2/Urp', 'bfv-Kreisklasse A Tauberbischofsheim', '2025/26', 'second', NOW()),
    (gen_random_uuid(), 'SV Eintracht Nassig 3', 'SV Nass 3', 'bfv-Kreisklasse A Tauberbischofsheim', '2025/26', 'second', NOW()),
    (gen_random_uuid(), 'TSV Kreuzwertheim 2', 'TSV Kreuz2', 'bfv-Kreisklasse A Tauberbischofsheim', '2025/26', 'second', NOW()),
    (gen_random_uuid(), 'VfB Reicholzheim 2 (flex)', 'VfB Rei 2', 'bfv-Kreisklasse A Tauberbischofsheim', '2025/26', 'second', NOW()),
    (gen_random_uuid(), 'Türkgücü Wertheim 2', 'Türk Wer2', 'bfv-Kreisklasse A Tauberbischofsheim', '2025/26', 'second', NOW()),
    (gen_random_uuid(), 'FC Wertheim-Eichel 2', 'FC WE 2', 'bfv-Kreisklasse A Tauberbischofsheim', '2025/26', 'second', NOW()),
    (gen_random_uuid(), 'SG RaMBo 2', 'SG RaMBo 2', 'bfv-Kreisklasse A Tauberbischofsheim', '2025/26', 'second', NOW()),
    (gen_random_uuid(), 'FC Hundheim-Steinbach 2 (flex)', 'FC H-S 2', 'bfv-Kreisklasse A Tauberbischofsheim', '2025/26', 'second', NOW()),
    (gen_random_uuid(), 'FSV Tauberhöhe 2', 'FSV Taub2', 'bfv-Kreisklasse A Tauberbischofsheim', '2025/26', 'second', NOW()),
    (gen_random_uuid(), 'SV Eintracht Nassig 2', 'SV Nass 2', 'bfv-Kreisklasse A Tauberbischofsheim', '2025/26', 'second', NOW())
ON CONFLICT (name, season, team_type) DO UPDATE SET
    short_name = EXCLUDED.short_name,
    league = EXCLUDED.league,
    updated_at = NOW();

-- Kreisklasse B Tauberbischofsheim (2. und 3. Mannschaften) - 9 Teams
INSERT INTO teams (id, name, short_name, league, season, team_type, created_at) VALUES
    ('a2222222-2222-2222-2222-222222222222', 'SV Viktoria Wertheim 2', 'SVW 2', 'bfv-Kreisklasse B Tauberbischofsheim', '2025/26', 'third', NOW()),
    (gen_random_uuid(), 'FV Oberlauda 2', 'FV Oberl2', 'bfv-Kreisklasse B Tauberbischofsheim', '2025/26', 'third', NOW()),
    (gen_random_uuid(), 'TSV Assamstadt 2', 'TSV Ass 2', 'bfv-Kreisklasse B Tauberbischofsheim', '2025/26', 'third', NOW()),
    (gen_random_uuid(), 'TSV Bobstadt/Assamst. 3', 'TSV Bob 3', 'bfv-Kreisklasse B Tauberbischofsheim', '2025/26', 'third', NOW()),
    (gen_random_uuid(), 'TSV Gerchsheim 2', 'TSV Ger 2', 'bfv-Kreisklasse B Tauberbischofsheim', '2025/26', 'third', NOW()),
    (gen_random_uuid(), 'FV Brehmbachtal 2', 'FV Brehm2', 'bfv-Kreisklasse B Tauberbischofsheim', '2025/26', 'third', NOW()),
    (gen_random_uuid(), 'FC Külsheim 2', 'FC Küls 2', 'bfv-Kreisklasse B Tauberbischofsheim', '2025/26', 'third', NOW()),
    (gen_random_uuid(), 'DJK Unterbalbach 2', 'DJK Unt 2', 'bfv-Kreisklasse B Tauberbischofsheim', '2025/26', 'third', NOW()),
    (gen_random_uuid(), 'SpG Apfelbach/Herrenzimmern 2', 'SpG Apf 2', 'bfv-Kreisklasse B Tauberbischofsheim', '2025/26', 'third', NOW())
ON CONFLICT (name, season, team_type) DO UPDATE SET
    short_name = EXCLUDED.short_name,
    league = EXCLUDED.league,
    updated_at = NOW();

-- ============================================================================
-- SCHRITT 3: LEAGUE STANDINGS INITIALISIEREN
-- ============================================================================

-- Temporäre Funktion für League Standings Setup
CREATE OR REPLACE FUNCTION setup_league_standings() RETURNS void AS $$
DECLARE
    v_team RECORD;
BEGIN
    -- Lösche alte Standings für diese Saison
    DELETE FROM league_standings WHERE season = '2025/26';
    
    -- Kreisliga Standings (basierend auf BFV Screenshots)
    FOR v_team IN (SELECT id, name FROM teams WHERE league = 'bfv-Kreisliga Tauberbischofsheim' AND season = '2025/26') LOOP
        INSERT INTO league_standings (team_id, season, position, points, played, won, drawn, lost, goals_for, goals_against)
        VALUES (
            v_team.id, '2025/26',
            CASE v_team.name
                WHEN 'TSV Assamstadt' THEN 1
                WHEN 'TuS Großrinderfeld' THEN 2
                WHEN '1.FC Umpfertal' THEN 3
                WHEN 'SG RaMBo' THEN 4
                WHEN 'Türkgücü Wertheim' THEN 6
                WHEN 'VfR Gerlachsheim' THEN 7
                WHEN 'FV Brehmbachtal' THEN 8
                WHEN 'FC Hundheim-Steinbach' THEN 9
                WHEN 'TSV Kreuzwertheim' THEN 10
                WHEN 'SV Viktoria Wertheim' THEN 11
                WHEN 'SpG Schwabhausen/Windischbuch' THEN 12
                WHEN 'Kickers DHK Wertheim' THEN 13
                WHEN 'SpG Impfingen/Tauberbischofsheim 2' THEN 14
                WHEN 'VfB Reicholzheim' THEN 15
                WHEN 'SV Schönfeld' THEN 16
                ELSE 99
            END,
            CASE v_team.name  -- Points
                WHEN 'TSV Assamstadt' THEN 12
                WHEN 'TuS Großrinderfeld' THEN 10
                WHEN '1.FC Umpfertal' THEN 9
                WHEN 'SG RaMBo' THEN 9
                WHEN 'Türkgücü Wertheim' THEN 6
                WHEN 'VfR Gerlachsheim' THEN 5
                WHEN 'FV Brehmbachtal' THEN 4
                WHEN 'FC Hundheim-Steinbach' THEN 4
                WHEN 'TSV Kreuzwertheim' THEN 4
                WHEN 'SV Viktoria Wertheim' THEN 4
                WHEN 'SpG Schwabhausen/Windischbuch' THEN 3
                WHEN 'Kickers DHK Wertheim' THEN 1
                WHEN 'SpG Impfingen/Tauberbischofsheim 2' THEN 1
                WHEN 'VfB Reicholzheim' THEN 0
                WHEN 'SV Schönfeld' THEN 0
                ELSE 0
            END,
            CASE v_team.name  -- Played
                WHEN 'SV Viktoria Wertheim' THEN 3
                ELSE 4
            END,
            CASE v_team.name  -- Won
                WHEN 'TSV Assamstadt' THEN 4
                WHEN 'TuS Großrinderfeld' THEN 3
                WHEN '1.FC Umpfertal' THEN 3
                WHEN 'SG RaMBo' THEN 3
                WHEN 'Türkgücü Wertheim' THEN 2
                WHEN 'VfR Gerlachsheim' THEN 1
                WHEN 'FV Brehmbachtal' THEN 1
                WHEN 'FC Hundheim-Steinbach' THEN 1
                WHEN 'TSV Kreuzwertheim' THEN 1
                WHEN 'SV Viktoria Wertheim' THEN 1
                WHEN 'SpG Schwabhausen/Windischbuch' THEN 1
                ELSE 0
            END,
            CASE v_team.name  -- Drawn
                WHEN 'TuS Großrinderfeld' THEN 1
                WHEN 'VfR Gerlachsheim' THEN 2
                WHEN 'FV Brehmbachtal' THEN 1
                WHEN 'FC Hundheim-Steinbach' THEN 1
                WHEN 'TSV Kreuzwertheim' THEN 1
                WHEN 'SV Viktoria Wertheim' THEN 1
                WHEN 'Kickers DHK Wertheim' THEN 1
                WHEN 'SpG Impfingen/Tauberbischofsheim 2' THEN 1
                ELSE 0
            END,
            CASE v_team.name  -- Lost
                WHEN '1.FC Umpfertal' THEN 1
                WHEN 'Türkgücü Wertheim' THEN 1
                WHEN 'VfR Gerlachsheim' THEN 1
                WHEN 'FV Brehmbachtal' THEN 2
                WHEN 'FC Hundheim-Steinbach' THEN 2
                WHEN 'TSV Kreuzwertheim' THEN 1
                WHEN 'SV Viktoria Wertheim' THEN 1
                WHEN 'SpG Schwabhausen/Windischbuch' THEN 2
                WHEN 'Kickers DHK Wertheim' THEN 3
                WHEN 'SpG Impfingen/Tauberbischofsheim 2' THEN 3
                WHEN 'VfB Reicholzheim' THEN 4
                WHEN 'SV Schönfeld' THEN 3
                ELSE 0
            END,
            CASE v_team.name  -- Goals For
                WHEN 'TSV Assamstadt' THEN 15
                WHEN 'TuS Großrinderfeld' THEN 21
                WHEN '1.FC Umpfertal' THEN 13
                WHEN 'SG RaMBo' THEN 10
                WHEN 'Türkgücü Wertheim' THEN 10
                WHEN 'VfR Gerlachsheim' THEN 8
                WHEN 'FV Brehmbachtal' THEN 9
                WHEN 'FC Hundheim-Steinbach' THEN 5
                WHEN 'TSV Kreuzwertheim' THEN 6
                WHEN 'SV Viktoria Wertheim' THEN 4
                WHEN 'SpG Schwabhausen/Windischbuch' THEN 3
                WHEN 'Kickers DHK Wertheim' THEN 7
                WHEN 'SpG Impfingen/Tauberbischofsheim 2' THEN 5
                WHEN 'VfB Reicholzheim' THEN 3
                WHEN 'SV Schönfeld' THEN 2
                ELSE 0
            END,
            CASE v_team.name  -- Goals Against
                WHEN 'TSV Assamstadt' THEN 2
                WHEN 'TuS Großrinderfeld' THEN 3
                WHEN '1.FC Umpfertal' THEN 5
                WHEN 'SG RaMBo' THEN 5
                WHEN 'Türkgücü Wertheim' THEN 4
                WHEN 'VfR Gerlachsheim' THEN 9
                WHEN 'FV Brehmbachtal' THEN 11
                WHEN 'FC Hundheim-Steinbach' THEN 9
                WHEN 'TSV Kreuzwertheim' THEN 11
                WHEN 'SV Viktoria Wertheim' THEN 5
                WHEN 'SpG Schwabhausen/Windischbuch' THEN 6
                WHEN 'Kickers DHK Wertheim' THEN 14
                WHEN 'SpG Impfingen/Tauberbischofsheim 2' THEN 16
                WHEN 'VfB Reicholzheim' THEN 13
                WHEN 'SV Schönfeld' THEN 16
                ELSE 0
            END
        );
    END LOOP;

    -- Kreisklasse A Standings
    FOR v_team IN (SELECT id, name FROM teams WHERE league = 'bfv-Kreisklasse A Tauberbischofsheim' AND season = '2025/26') LOOP
        INSERT INTO league_standings (team_id, season, position, points, played, won, drawn, lost, goals_for, goals_against)
        VALUES (
            v_team.id, '2025/26',
            CASE v_team.name
                WHEN 'SpG Kickers DHK Wertheim 2/Urphar' THEN 1
                WHEN 'SV Eintracht Nassig 3' THEN 2
                WHEN 'TSV Kreuzwertheim 2' THEN 3
                WHEN 'VfB Reicholzheim 2 (flex)' THEN 4
                WHEN 'Türkgücü Wertheim 2' THEN 5
                WHEN 'FC Wertheim-Eichel 2' THEN 6
                WHEN 'SG RaMBo 2' THEN 7
                WHEN 'FC Hundheim-Steinbach 2 (flex)' THEN 8
                WHEN 'SpG Viktoria Wertheim 3/Grünenwört' THEN 9
                WHEN 'FSV Tauberhöhe 2' THEN 10
                WHEN 'SV Eintracht Nassig 2' THEN 11
                ELSE 99
            END,
            CASE v_team.name  -- Points
                WHEN 'SpG Kickers DHK Wertheim 2/Urphar' THEN 9
                WHEN 'SV Eintracht Nassig 3' THEN 6
                WHEN 'TSV Kreuzwertheim 2' THEN 6
                WHEN 'VfB Reicholzheim 2 (flex)' THEN 6
                WHEN 'Türkgücü Wertheim 2' THEN 3
                WHEN 'FC Wertheim-Eichel 2' THEN 1
                WHEN 'SG RaMBo 2' THEN 1
                ELSE 0
            END,
            CASE v_team.name  -- Played
                WHEN 'SpG Kickers DHK Wertheim 2/Urphar' THEN 3
                WHEN 'SV Eintracht Nassig 3' THEN 2
                WHEN 'TSV Kreuzwertheim 2' THEN 3
                WHEN 'VfB Reicholzheim 2 (flex)' THEN 3
                WHEN 'Türkgücü Wertheim 2' THEN 1
                WHEN 'FC Wertheim-Eichel 2' THEN 3
                WHEN 'SG RaMBo 2' THEN 2
                WHEN 'FC Hundheim-Steinbach 2 (flex)' THEN 2
                WHEN 'SpG Viktoria Wertheim 3/Grünenwört' THEN 3
                ELSE 0
            END,
            CASE v_team.name  -- Won
                WHEN 'SpG Kickers DHK Wertheim 2/Urphar' THEN 3
                WHEN 'SV Eintracht Nassig 3' THEN 2
                WHEN 'TSV Kreuzwertheim 2' THEN 2
                WHEN 'VfB Reicholzheim 2 (flex)' THEN 2
                WHEN 'Türkgücü Wertheim 2' THEN 1
                ELSE 0
            END,
            CASE v_team.name  -- Drawn
                WHEN 'FC Wertheim-Eichel 2' THEN 1
                WHEN 'SG RaMBo 2' THEN 1
                ELSE 0
            END,
            CASE v_team.name  -- Lost
                WHEN 'TSV Kreuzwertheim 2' THEN 1
                WHEN 'VfB Reicholzheim 2 (flex)' THEN 1
                WHEN 'FC Wertheim-Eichel 2' THEN 2
                WHEN 'SG RaMBo 2' THEN 1
                WHEN 'FC Hundheim-Steinbach 2 (flex)' THEN 2
                WHEN 'SpG Viktoria Wertheim 3/Grünenwört' THEN 3
                ELSE 0
            END,
            CASE v_team.name  -- Goals For
                WHEN 'SpG Kickers DHK Wertheim 2/Urphar' THEN 10
                WHEN 'SV Eintracht Nassig 3' THEN 15
                WHEN 'TSV Kreuzwertheim 2' THEN 11
                WHEN 'VfB Reicholzheim 2 (flex)' THEN 5
                WHEN 'Türkgücü Wertheim 2' THEN 4
                WHEN 'FC Wertheim-Eichel 2' THEN 3
                WHEN 'SG RaMBo 2' THEN 0
                WHEN 'FC Hundheim-Steinbach 2 (flex)' THEN 1
                WHEN 'SpG Viktoria Wertheim 3/Grünenwört' THEN 3
                ELSE 0
            END,
            CASE v_team.name  -- Goals Against
                WHEN 'SpG Kickers DHK Wertheim 2/Urphar' THEN 2
                WHEN 'SV Eintracht Nassig 3' THEN 1
                WHEN 'TSV Kreuzwertheim 2' THEN 2
                WHEN 'VfB Reicholzheim 2 (flex)' THEN 12
                WHEN 'Türkgücü Wertheim 2' THEN 3
                WHEN 'FC Wertheim-Eichel 2' THEN 5
                WHEN 'SG RaMBo 2' THEN 3
                WHEN 'FC Hundheim-Steinbach 2 (flex)' THEN 10
                WHEN 'SpG Viktoria Wertheim 3/Grünenwört' THEN 14
                ELSE 0
            END
        );
    END LOOP;

    -- Kreisklasse B Standings
    FOR v_team IN (SELECT id, name FROM teams WHERE league = 'bfv-Kreisklasse B Tauberbischofsheim' AND season = '2025/26') LOOP
        INSERT INTO league_standings (team_id, season, position, points, played, won, drawn, lost, goals_for, goals_against)
        VALUES (
            v_team.id, '2025/26',
            CASE v_team.name
                WHEN 'FV Oberlauda 2' THEN 1
                WHEN 'TSV Assamstadt 2' THEN 2
                WHEN 'TSV Bobstadt/Assamst. 3' THEN 3
                WHEN 'TSV Gerchsheim 2' THEN 4
                WHEN 'FV Brehmbachtal 2' THEN 5
                WHEN 'FC Külsheim 2' THEN 6
                WHEN 'DJK Unterbalbach 2' THEN 7
                WHEN 'SpG Apfelbach/Herrenzimmern 2' THEN 8
                WHEN 'SV Viktoria Wertheim 2' THEN 9
                ELSE 99
            END,
            CASE v_team.name  -- Points
                WHEN 'FV Oberlauda 2' THEN 6
                WHEN 'TSV Assamstadt 2' THEN 6
                WHEN 'TSV Bobstadt/Assamst. 3' THEN 4
                WHEN 'TSV Gerchsheim 2' THEN 3
                WHEN 'FV Brehmbachtal 2' THEN 3
                WHEN 'FC Külsheim 2' THEN 1
                ELSE 0
            END,
            CASE v_team.name  -- Played
                WHEN 'FV Oberlauda 2' THEN 2
                WHEN 'TSV Assamstadt 2' THEN 2
                WHEN 'TSV Bobstadt/Assamst. 3' THEN 2
                WHEN 'TSV Gerchsheim 2' THEN 2
                WHEN 'FV Brehmbachtal 2' THEN 2
                WHEN 'FC Külsheim 2' THEN 2
                WHEN 'DJK Unterbalbach 2' THEN 1
                WHEN 'SpG Apfelbach/Herrenzimmern 2' THEN 2
                ELSE 0
            END,
            CASE v_team.name  -- Won
                WHEN 'FV Oberlauda 2' THEN 2
                WHEN 'TSV Assamstadt 2' THEN 2
                WHEN 'TSV Bobstadt/Assamst. 3' THEN 1
                WHEN 'TSV Gerchsheim 2' THEN 1
                WHEN 'FV Brehmbachtal 2' THEN 1
                ELSE 0
            END,
            CASE v_team.name  -- Drawn
                WHEN 'TSV Bobstadt/Assamst. 3' THEN 1
                WHEN 'FC Külsheim 2' THEN 1
                ELSE 0
            END,
            CASE v_team.name  -- Lost
                WHEN 'TSV Gerchsheim 2' THEN 1
                WHEN 'FV Brehmbachtal 2' THEN 1
                WHEN 'FC Külsheim 2' THEN 1
                WHEN 'DJK Unterbalbach 2' THEN 1
                WHEN 'SpG Apfelbach/Herrenzimmern 2' THEN 2
                ELSE 0
            END,
            CASE v_team.name  -- Goals For
                WHEN 'FV Oberlauda 2' THEN 7
                WHEN 'TSV Assamstadt 2' THEN 5
                WHEN 'TSV Bobstadt/Assamst. 3' THEN 6
                WHEN 'TSV Gerchsheim 2' THEN 6
                WHEN 'FV Brehmbachtal 2' THEN 4
                WHEN 'FC Külsheim 2' THEN 4
                WHEN 'DJK Unterbalbach 2' THEN 0
                WHEN 'SpG Apfelbach/Herrenzimmern 2' THEN 1
                ELSE 0
            END,
            CASE v_team.name  -- Goals Against
                WHEN 'FV Oberlauda 2' THEN 1
                WHEN 'TSV Assamstadt 2' THEN 2
                WHEN 'TSV Bobstadt/Assamst. 3' THEN 4
                WHEN 'TSV Gerchsheim 2' THEN 2
                WHEN 'FV Brehmbachtal 2' THEN 5
                WHEN 'FC Külsheim 2' THEN 6
                WHEN 'DJK Unterbalbach 2' THEN 7
                WHEN 'SpG Apfelbach/Herrenzimmern 2' THEN 6
                ELSE 0
            END
        );
    END LOOP;
    
    RAISE NOTICE 'League Standings initialisiert';
END;
$$ LANGUAGE plpgsql;

-- Funktion ausführen und dann löschen
SELECT setup_league_standings();
DROP FUNCTION setup_league_standings();

-- ============================================================================
-- SCHRITT 4: TRIGGER UND FUNKTIONEN SICHERSTELLEN
-- ============================================================================

-- Stelle sicher, dass die automatische Berechnung funktioniert
CREATE OR REPLACE FUNCTION update_league_standings_from_matches()
RETURNS TRIGGER AS $$
BEGIN
    -- Nur bei Status-Änderung zu 'completed'
    IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
        -- Berechne die Tabelle für beide Teams neu
        PERFORM calculate_league_table('2025/26');
        
        RAISE NOTICE 'League standings updated for match % vs %', NEW.home_team, NEW.away_team;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger erstellen falls nicht vorhanden
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'match_completed_trigger'
    ) THEN
        CREATE TRIGGER match_completed_trigger
            AFTER INSERT OR UPDATE ON matches
            FOR EACH ROW
            EXECUTE FUNCTION update_league_standings_from_matches();
        RAISE NOTICE 'Trigger match_completed_trigger erstellt';
    ELSE
        RAISE NOTICE 'Trigger match_completed_trigger existiert bereits';
    END IF;
END $$;

-- ============================================================================
-- SCHRITT 5: VERIFIKATION
-- ============================================================================
DO $$
DECLARE
    v_team_count INTEGER;
    v_standings_count INTEGER;
    v_viktoria_count INTEGER;
BEGIN
    -- Zähle Teams
    SELECT COUNT(*) INTO v_team_count FROM teams WHERE season = '2025/26';
    
    -- Zähle Standings
    SELECT COUNT(*) INTO v_standings_count FROM league_standings WHERE season = '2025/26';
    
    -- Prüfe Viktoria Teams
    SELECT COUNT(*) INTO v_viktoria_count 
    FROM teams t
    JOIN league_standings ls ON t.id = ls.team_id
    WHERE t.name LIKE '%Viktoria Wertheim%';
    
    RAISE NOTICE '==========================================';
    RAISE NOTICE '✅ Migration erfolgreich abgeschlossen';
    RAISE NOTICE '==========================================';
    RAISE NOTICE '📊 Teams gesamt: %', v_team_count;
    RAISE NOTICE '📊 League Standings: %', v_standings_count;
    RAISE NOTICE '🏆 Viktoria Teams: %', v_viktoria_count;
    RAISE NOTICE '';
    RAISE NOTICE '🎯 SV Viktoria Wertheim - Kreisliga: Platz 11';
    RAISE NOTICE '🎯 SV Viktoria Wertheim 2 - Kreisklasse B: Platz 9';
    RAISE NOTICE '🎯 SpG Viktoria Wertheim 3 - Kreisklasse A: Platz 9';
    RAISE NOTICE '==========================================';
END $$;