-- Migration: Spielzeiten und Spielorte für die 1. Mannschaft Saison 2025/26 hinzufügen

-- August 2025
UPDATE matches SET 
  match_time = '15:30:00',
  location = 'Türkgücü Wertheim'
WHERE home_team = 'Türkgücü Wertheim' 
  AND away_team = 'SV Viktoria Wertheim' 
  AND match_date = '2025-08-16';

UPDATE matches SET 
  match_time = '15:30:00',
  location = 'Stadion Bestenheid'
WHERE home_team = 'SV Viktoria Wertheim' 
  AND away_team = 'Kickers DHK Wertheim' 
  AND match_date = '2025-08-23';

UPDATE matches SET 
  match_time = '19:00:00',
  location = 'Stadion Bestenheid'  
WHERE home_team = 'SV Viktoria Wertheim' 
  AND away_team = 'TSV Assamstadt' 
  AND match_date = '2025-08-28';

UPDATE matches SET 
  match_time = '15:00:00',
  location = 'FV Brehmbachtal'
WHERE home_team = 'FV Brehmbachtal' 
  AND away_team = 'SV Viktoria Wertheim' 
  AND match_date = '2025-08-31';

-- September 2025
UPDATE matches SET 
  match_time = '19:00:00',
  location = 'Stadion Bestenheid'
WHERE home_team = 'SV Viktoria Wertheim' 
  AND away_team = 'VfR Gerlachsheim' 
  AND match_date = '2025-09-05';

-- Korrektur: Das war ein Fehler, es gibt kein Spiel am 06.09, sondern das Spiel gegen Gerlachsheim war am 05.09
-- Das nächste Spiel ist am 14.09

UPDATE matches SET 
  match_time = '15:00:00',
  location = 'TSV Kreuzwertheim'
WHERE home_team = 'TSV Kreuzwertheim' 
  AND away_team = 'SV Viktoria Wertheim' 
  AND match_date = '2025-09-14';

UPDATE matches SET 
  match_time = '15:00:00',
  location = 'Stadion Bestenheid'
WHERE home_team = 'SV Viktoria Wertheim' 
  AND away_team = 'TuS Großrinderfeld' 
  AND match_date = '2025-09-21';

UPDATE matches SET 
  match_time = '19:00:00',
  location = 'SV Pülfringen'
WHERE home_team = 'SV Pülfringen' 
  AND away_team = 'SV Viktoria Wertheim' 
  AND match_date = '2025-09-26';

-- Oktober 2025
UPDATE matches SET 
  match_time = '15:00:00',
  location = 'Stadion Bestenheid'
WHERE home_team = 'SV Viktoria Wertheim' 
  AND away_team = '1.FC Umpfertal' 
  AND match_date = '2025-10-05';

UPDATE matches SET 
  match_time = '19:00:00',
  location = 'VfB Reicholzheim'
WHERE home_team = 'VfB Reicholzheim' 
  AND away_team = 'SV Viktoria Wertheim' 
  AND match_date = '2025-10-10';

UPDATE matches SET 
  match_time = '15:00:00',
  location = 'Stadion Bestenheid'
WHERE home_team = 'SV Viktoria Wertheim' 
  AND away_team = 'SV Schönfeld' 
  AND match_date = '2025-10-19';

UPDATE matches SET 
  match_time = '15:00:00',
  location = 'FC Hundheim-Steinbach'
WHERE home_team = 'FC Hundheim-Steinbach' 
  AND away_team = 'SV Viktoria Wertheim' 
  AND match_date = '2025-10-26';

UPDATE matches SET 
  match_time = '19:00:00',
  location = 'Stadion Bestenheid'
WHERE home_team = 'SV Viktoria Wertheim' 
  AND away_team = 'SpG Impfingen/Tauberbischofsheim 2' 
  AND match_date = '2025-10-31';

-- November 2025
UPDATE matches SET 
  match_time = '14:30:00',
  location = 'SpG Schwabhausen/Windischbuch'
WHERE home_team = 'SpG Schwabhausen/Windischbuch' 
  AND away_team = 'SV Viktoria Wertheim' 
  AND match_date = '2025-11-09';

UPDATE matches SET 
  match_time = '14:30:00',
  location = 'Stadion Bestenheid'
WHERE home_team = 'SV Viktoria Wertheim' 
  AND away_team = 'SG RaMBo' 
  AND match_date = '2025-11-16';

UPDATE matches SET 
  match_time = '14:15:00',
  location = 'Stadion Bestenheid'
WHERE home_team = 'SV Viktoria Wertheim' 
  AND away_team = 'Türkgücü Wertheim' 
  AND match_date = '2025-11-23';

-- März 2026 (Rückrunde)
UPDATE matches SET 
  match_time = '15:00:00',
  location = 'Kickers DHK Wertheim'
WHERE home_team = 'Kickers DHK Wertheim' 
  AND away_team = 'SV Viktoria Wertheim' 
  AND match_date = '2026-03-08';

UPDATE matches SET 
  match_time = '15:00:00',
  location = 'TSV Assamstadt'
WHERE home_team = 'TSV Assamstadt' 
  AND away_team = 'SV Viktoria Wertheim' 
  AND match_date = '2026-03-15';

UPDATE matches SET 
  match_time = '15:00:00',
  location = 'Stadion Bestenheid'
WHERE home_team = 'SV Viktoria Wertheim' 
  AND away_team = 'FV Brehmbachtal' 
  AND match_date = '2026-03-22';

UPDATE matches SET 
  match_time = '15:00:00',
  location = 'VfR Gerlachsheim'
WHERE home_team = 'VfR Gerlachsheim' 
  AND away_team = 'SV Viktoria Wertheim' 
  AND match_date = '2026-03-29';

-- April 2026
UPDATE matches SET 
  match_time = '17:45:00',
  location = 'Stadion Bestenheid'
WHERE home_team = 'SV Viktoria Wertheim' 
  AND away_team = 'TSV Kreuzwertheim' 
  AND match_date = '2026-04-02';

UPDATE matches SET 
  match_time = '15:00:00',
  location = 'TuS Großrinderfeld'
WHERE home_team = 'TuS Großrinderfeld' 
  AND away_team = 'SV Viktoria Wertheim' 
  AND match_date = '2026-04-06';

UPDATE matches SET 
  match_time = '19:00:00',
  location = 'Stadion Bestenheid'
WHERE home_team = 'SV Viktoria Wertheim' 
  AND away_team = 'SV Pülfringen' 
  AND match_date = '2026-04-10';

UPDATE matches SET 
  match_time = '15:00:00',
  location = '1.FC Umpfertal'
WHERE home_team = '1.FC Umpfertal' 
  AND away_team = 'SV Viktoria Wertheim' 
  AND match_date = '2026-04-19';

UPDATE matches SET 
  match_time = '15:00:00',
  location = 'Stadion Bestenheid'
WHERE home_team = 'SV Viktoria Wertheim' 
  AND away_team = 'VfB Reicholzheim' 
  AND match_date = '2026-04-26';

-- Mai 2026
UPDATE matches SET 
  match_time = '15:00:00',
  location = 'SV Schönfeld'
WHERE home_team = 'SV Schönfeld' 
  AND away_team = 'SV Viktoria Wertheim' 
  AND match_date = '2026-05-03';

UPDATE matches SET 
  match_time = '15:00:00',
  location = 'Stadion Bestenheid'
WHERE home_team = 'SV Viktoria Wertheim' 
  AND away_team = 'FC Hundheim-Steinbach' 
  AND match_date = '2026-05-10';

UPDATE matches SET 
  match_time = '15:00:00',
  location = 'SpG Impfingen/Tauberbischofsheim'
WHERE home_team = 'SpG Impfingen/Tauberbischofsheim 2' 
  AND away_team = 'SV Viktoria Wertheim' 
  AND match_date = '2026-05-17';

UPDATE matches SET 
  match_time = '17:00:00',
  location = 'Stadion Bestenheid'
WHERE home_team = 'SV Viktoria Wertheim' 
  AND away_team = 'SpG Schwabhausen/Windischbuch' 
  AND match_date = '2026-05-25';

UPDATE matches SET 
  match_time = '17:00:00',
  location = 'SG RaMBo'
WHERE home_team = 'SG RaMBo' 
  AND away_team = 'SV Viktoria Wertheim' 
  AND match_date = '2026-05-31';