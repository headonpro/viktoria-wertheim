-- Migration: Fehlende Spiele, Spielzeiten und Spielorte für die 2. Mannschaft Saison 2025/26

-- Erst das falsche Datum korrigieren
UPDATE matches SET 
  match_date = '2025-09-07'
WHERE home_team = 'SV Viktoria Wertheim 2' 
  AND away_team = 'SpG FV Oberlauda/VfR Gerlachsheim 2' 
  AND match_date = '2025-09-06';

-- Fehlende Spiele der Rückrunde hinzufügen
INSERT INTO matches (id, home_team, away_team, home_team_id, away_team_id, match_date, status, match_type)
VALUES 
  (gen_random_uuid(), 'SV Viktoria Wertheim 2', 'SpG Balbachtal', '568e99ad-d9e1-4f2d-a517-88d3a725755b', NULL, '2026-03-22', 'scheduled', 'league'),
  (gen_random_uuid(), 'SV Viktoria Wertheim 2', 'FSV Tauberhöhe 2', '568e99ad-d9e1-4f2d-a517-88d3a725755b', NULL, '2026-05-25', 'scheduled', 'league'),
  (gen_random_uuid(), 'SpG Unterschüpf/Kupprichhausen', 'SV Viktoria Wertheim 2', NULL, '568e99ad-d9e1-4f2d-a517-88d3a725755b', '2026-05-31', 'scheduled', 'league')
ON CONFLICT DO NOTHING;

-- Jetzt alle Spielzeiten und Orte für die 2. Mannschaft setzen

-- August 2025
UPDATE matches SET 
  match_time = '15:00:00',
  location = 'FSV Tauberhöhe'
WHERE home_team = 'FSV Tauberhöhe 2' 
  AND away_team = 'SV Viktoria Wertheim 2' 
  AND match_date = '2025-08-17';

UPDATE matches SET 
  match_time = '15:00:00',
  location = 'Stadion Bestenheid'
WHERE home_team = 'SV Viktoria Wertheim 2' 
  AND away_team = 'SpG Unterschüpf/Kupprichhausen' 
  AND match_date = '2025-08-24';

UPDATE matches SET 
  match_time = '15:00:00',
  location = 'SpG Balbachtal'
WHERE home_team = 'SpG Balbachtal' 
  AND away_team = 'SV Viktoria Wertheim 2' 
  AND match_date = '2025-08-31';

-- September 2025
UPDATE matches SET 
  match_time = '13:30:00',
  location = 'Stadion Bestenheid'
WHERE home_team = 'SV Viktoria Wertheim 2' 
  AND away_team = 'SpG FV Oberlauda/VfR Gerlachsheim 2' 
  AND match_date = '2025-09-07';

UPDATE matches SET 
  match_time = '15:00:00',
  location = 'Stadion Bestenheid'
WHERE home_team = 'SV Viktoria Wertheim 2' 
  AND away_team = 'SpG Welzbachtal' 
  AND match_date = '2025-09-14';

UPDATE matches SET 
  match_time = '13:00:00',
  location = 'Stadion Bestenheid'
WHERE home_team = 'SV Viktoria Wertheim 2' 
  AND away_team = 'SpG Distelhausen/Lauda 2' 
  AND match_date = '2025-09-21';

UPDATE matches SET 
  match_time = '13:00:00',
  location = 'SpG Grünsfeld/Zimmern'
WHERE home_team = 'SpG Grünsfeld 2/Zimmern' 
  AND away_team = 'SV Viktoria Wertheim 2' 
  AND match_date = '2025-09-28';

-- Oktober 2025
UPDATE matches SET 
  match_time = '13:00:00',
  location = 'Stadion Bestenheid'
WHERE home_team = 'SV Viktoria Wertheim 2' 
  AND away_team = 'SpG Dittwar/Heckfeld' 
  AND match_date = '2025-10-05';

UPDATE matches SET 
  match_time = '15:00:00',
  location = 'SpG Beckstein/Königshofen'
WHERE home_team = 'SpG Beckstein/Königshofen 2' 
  AND away_team = 'SV Viktoria Wertheim 2' 
  AND match_date = '2025-10-12';

UPDATE matches SET 
  match_time = '13:00:00',
  location = 'Stadion Bestenheid'
WHERE home_team = 'SV Viktoria Wertheim 2' 
  AND away_team = 'SV Eintracht Nassig 2' 
  AND match_date = '2025-10-19';

UPDATE matches SET 
  match_time = '14:30:00',
  location = 'TSV Gerchsheim'
WHERE home_team = 'TSV Gerchsheim' 
  AND away_team = 'SV Viktoria Wertheim 2' 
  AND match_date = '2025-10-26';

-- November 2025
UPDATE matches SET 
  match_time = '14:30:00',
  location = 'Stadion Bestenheid'
WHERE home_team = 'SV Viktoria Wertheim 2' 
  AND away_team = 'FC Wertheim-Eichel' 
  AND match_date = '2025-11-02';

UPDATE matches SET 
  match_time = '14:30:00',
  location = 'Stadion Bestenheid'
WHERE home_team = 'SV Viktoria Wertheim 2' 
  AND away_team = 'TSV Assamstadt 2' 
  AND match_date = '2025-11-09';

UPDATE matches SET 
  match_time = '14:30:00',
  location = 'SpG Welzbachtal'
WHERE home_team = 'SpG Welzbachtal' 
  AND away_team = 'SV Viktoria Wertheim 2' 
  AND match_date = '2025-11-16';

-- März 2026 (Rückrunde)
UPDATE matches SET 
  match_time = '13:00:00',
  location = 'TSV Assamstadt'
WHERE home_team = 'TSV Assamstadt 2' 
  AND away_team = 'SV Viktoria Wertheim 2' 
  AND match_date = '2026-03-15';

UPDATE matches SET 
  match_time = '13:00:00',
  location = 'Stadion Bestenheid'
WHERE home_team = 'SV Viktoria Wertheim 2' 
  AND away_team = 'SpG Balbachtal' 
  AND match_date = '2026-03-22';

UPDATE matches SET 
  match_time = '13:00:00',
  location = 'SpG FV Oberlauda/VfR Gerlachsheim'
WHERE home_team = 'SpG FV Oberlauda/VfR Gerlachsheim 2' 
  AND away_team = 'SV Viktoria Wertheim 2' 
  AND match_date = '2026-03-29';

-- April 2026
UPDATE matches SET 
  match_time = '15:00:00',
  location = 'SpG Distelhausen/Lauda'
WHERE home_team = 'SpG Distelhausen/Lauda 2' 
  AND away_team = 'SV Viktoria Wertheim 2' 
  AND match_date = '2026-04-06';

UPDATE matches SET 
  match_time = '13:00:00',
  location = 'Stadion Bestenheid'
WHERE home_team = 'SV Viktoria Wertheim 2' 
  AND away_team = 'SpG Grünsfeld 2/Zimmern' 
  AND match_date = '2026-04-12';

UPDATE matches SET 
  match_time = '15:00:00',
  location = 'SpG Dittwar/Heckfeld'
WHERE home_team = 'SpG Dittwar/Heckfeld' 
  AND away_team = 'SV Viktoria Wertheim 2' 
  AND match_date = '2026-04-19';

UPDATE matches SET 
  match_time = '13:00:00',
  location = 'Stadion Bestenheid'
WHERE home_team = 'SV Viktoria Wertheim 2' 
  AND away_team = 'SpG Beckstein/Königshofen 2' 
  AND match_date = '2026-04-26';

-- Mai 2026
UPDATE matches SET 
  match_time = '13:00:00',
  location = 'SV Eintracht Nassig'
WHERE home_team = 'SV Eintracht Nassig 2' 
  AND away_team = 'SV Viktoria Wertheim 2' 
  AND match_date = '2026-05-03';

UPDATE matches SET 
  match_time = '13:00:00',
  location = 'Stadion Bestenheid'
WHERE home_team = 'SV Viktoria Wertheim 2' 
  AND away_team = 'TSV Gerchsheim' 
  AND match_date = '2026-05-10';

UPDATE matches SET 
  match_time = '15:00:00',
  location = 'FC Wertheim-Eichel'
WHERE home_team = 'FC Wertheim-Eichel' 
  AND away_team = 'SV Viktoria Wertheim 2' 
  AND match_date = '2026-05-17';

UPDATE matches SET 
  match_time = '15:00:00',
  location = 'Stadion Bestenheid'
WHERE home_team = 'SV Viktoria Wertheim 2' 
  AND away_team = 'FSV Tauberhöhe 2' 
  AND match_date = '2026-05-25';

UPDATE matches SET 
  match_time = '17:00:00',
  location = 'SpG Unterschüpf/Kupprichhausen'
WHERE home_team = 'SpG Unterschüpf/Kupprichhausen' 
  AND away_team = 'SV Viktoria Wertheim 2' 
  AND match_date = '2026-05-31';