-- Complete League Standings Setup with correct data from Screenshots
-- This replaces all previous league standings data

-- First clear existing standings
DELETE FROM league_standings WHERE season IN ('2024/25', '2025/26');

-- Kreisliga Tauberbischofsheim (First Team) - 16 teams
INSERT INTO league_standings (team_id, position, played, won, drawn, lost, goals_for, goals_against, points, season)
VALUES
  ((SELECT id FROM teams WHERE name = 'SV Schönfeld' AND league = 'bfv-Kreisliga Tauberbischofsheim'), 1, 4, 3, 1, 0, 13, 5, 10, '2025/26'),
  ((SELECT id FROM teams WHERE name = 'TSV Assamstadt' AND league = 'bfv-Kreisliga Tauberbischofsheim'), 2, 4, 3, 1, 0, 11, 4, 10, '2025/26'),
  ((SELECT id FROM teams WHERE name = 'TuS Großrinderfeld' AND league = 'bfv-Kreisliga Tauberbischofsheim'), 3, 4, 3, 1, 0, 8, 3, 10, '2025/26'),
  ((SELECT id FROM teams WHERE name = '1.FC Umpfertal' AND league = 'bfv-Kreisliga Tauberbischofsheim'), 4, 4, 2, 1, 1, 13, 5, 7, '2025/26'),
  ((SELECT id FROM teams WHERE name = 'SG RaMBo' AND league = 'bfv-Kreisliga Tauberbischofsheim'), 5, 4, 2, 1, 1, 6, 4, 7, '2025/26'),
  ((SELECT id FROM teams WHERE name = 'SV Pülfringen' AND league = 'bfv-Kreisliga Tauberbischofsheim'), 6, 4, 2, 0, 2, 14, 11, 6, '2025/26'),
  ((SELECT id FROM teams WHERE name = 'Türkgücü Wertheim' AND league = 'bfv-Kreisliga Tauberbischofsheim'), 7, 3, 2, 0, 1, 7, 4, 6, '2025/26'),
  ((SELECT id FROM teams WHERE name = 'VfR Gerlachsheim' AND league = 'bfv-Kreisliga Tauberbischofsheim'), 8, 4, 2, 0, 2, 10, 8, 6, '2025/26'),
  ((SELECT id FROM teams WHERE name = 'FV Brehmbachtal' AND league = 'bfv-Kreisliga Tauberbischofsheim'), 9, 3, 1, 2, 0, 4, 3, 5, '2025/26'),
  ((SELECT id FROM teams WHERE name = 'FC Hundheim-Steinbach' AND league = 'bfv-Kreisliga Tauberbischofsheim'), 10, 4, 1, 2, 1, 5, 6, 5, '2025/26'),
  ((SELECT id FROM teams WHERE name = 'SV Viktoria Wertheim' AND league = 'bfv-Kreisliga Tauberbischofsheim'), 11, 4, 1, 1, 2, 8, 9, 4, '2025/26'),
  ((SELECT id FROM teams WHERE name = 'TSV Kreuzwertheim' AND league = 'bfv-Kreisliga Tauberbischofsheim'), 12, 4, 1, 1, 2, 6, 7, 4, '2025/26'),
  ((SELECT id FROM teams WHERE name = 'SpG Schwabhausen/Windischbuch' AND league = 'bfv-Kreisliga Tauberbischofsheim'), 13, 4, 1, 1, 2, 5, 8, 4, '2025/26'),
  ((SELECT id FROM teams WHERE name = 'Kickers DHK Wertheim' AND league = 'bfv-Kreisliga Tauberbischofsheim'), 14, 3, 0, 0, 3, 4, 11, 0, '2025/26'),
  ((SELECT id FROM teams WHERE name = 'SpG Impfingen/Tauberbischofsheim 2' AND league = 'bfv-Kreisliga Tauberbischofsheim'), 15, 4, 0, 0, 4, 5, 13, 0, '2025/26'),
  ((SELECT id FROM teams WHERE name = 'VfB Reicholzheim' AND league = 'bfv-Kreisliga Tauberbischofsheim'), 16, 3, 0, 0, 3, 4, 22, 0, '2025/26');

-- Kreisklasse A Tauberbischofsheim (Second Team) - 14 teams
INSERT INTO league_standings (team_id, position, played, won, drawn, lost, goals_for, goals_against, points, season)
VALUES
  ((SELECT id FROM teams WHERE name = 'SV Eintracht Nassig 2' AND league = 'bfv-Kreisklasse A Tauberbischofsheim'), 1, 3, 3, 0, 0, 9, 1, 9, '2025/26'),
  ((SELECT id FROM teams WHERE name = 'FSV Tauberhöhe 2' AND league = 'bfv-Kreisklasse A Tauberbischofsheim'), 2, 3, 2, 1, 0, 7, 4, 7, '2025/26'),
  ((SELECT id FROM teams WHERE name = 'SpG Grünsfeld 2/Zimmern' AND league = 'bfv-Kreisklasse A Tauberbischofsheim'), 3, 3, 2, 0, 1, 5, 2, 6, '2025/26'),
  ((SELECT id FROM teams WHERE name = 'SpG Dittwar/Heckfeld' AND league = 'bfv-Kreisklasse A Tauberbischofsheim'), 4, 3, 2, 0, 1, 8, 6, 6, '2025/26'),
  ((SELECT id FROM teams WHERE name = 'SpG Balbachtal' AND league = 'bfv-Kreisklasse A Tauberbischofsheim'), 5, 3, 1, 2, 0, 7, 1, 5, '2025/26'),
  ((SELECT id FROM teams WHERE name = 'FC Wertheim-Eichel' AND league = 'bfv-Kreisklasse A Tauberbischofsheim'), 6, 3, 1, 2, 0, 6, 1, 5, '2025/26'),
  ((SELECT id FROM teams WHERE name = 'SpG Welzbachtal' AND league = 'bfv-Kreisklasse A Tauberbischofsheim'), 7, 3, 1, 1, 1, 6, 3, 4, '2025/26'),
  ((SELECT id FROM teams WHERE name = 'SpG Unterschüpf/Kupprichhausen' AND league = 'bfv-Kreisklasse A Tauberbischofsheim'), 8, 3, 1, 1, 1, 4, 2, 4, '2025/26'),
  ((SELECT id FROM teams WHERE name = 'TSV Gerchsheim' AND league = 'bfv-Kreisklasse A Tauberbischofsheim'), 9, 3, 1, 1, 1, 8, 9, 4, '2025/26'),
  ((SELECT id FROM teams WHERE name = 'SpG FV Oberlauda/VfR Gerlachsheim 2' AND league = 'bfv-Kreisklasse A Tauberbischofsheim'), 10, 3, 1, 0, 2, 9, 10, 3, '2025/26'),
  ((SELECT id FROM teams WHERE name = 'SpG Beckstein/Königshofen 2' AND league = 'bfv-Kreisklasse A Tauberbischofsheim'), 11, 3, 1, 0, 2, 6, 10, 3, '2025/26'),
  ((SELECT id FROM teams WHERE name = 'TSV Assamstadt 2' AND league = 'bfv-Kreisklasse A Tauberbischofsheim'), 12, 3, 0, 2, 1, 2, 7, 2, '2025/26'),
  ((SELECT id FROM teams WHERE name = 'SV Viktoria Wertheim 2' AND league = 'bfv-Kreisklasse A Tauberbischofsheim'), 13, 3, 0, 0, 3, 2, 12, 0, '2025/26'),
  ((SELECT id FROM teams WHERE name = 'SpG Distelhausen/Lauda 2' AND league = 'bfv-Kreisklasse A Tauberbischofsheim'), 14, 3, 0, 0, 3, 1, 12, 0, '2025/26');

-- Kreisklasse B Tauberbischofsheim (Third Team) - 9 teams
INSERT INTO league_standings (team_id, position, played, won, drawn, lost, goals_for, goals_against, points, season)
VALUES
  ((SELECT id FROM teams WHERE name = 'SpG Kickers DHK Wertheim 2/Urphar' AND league = 'bfv-Kreisklasse B Tauberbischofsheim'), 1, 3, 3, 0, 0, 10, 2, 9, '2025/26'),
  ((SELECT id FROM teams WHERE name = 'SV Eintracht Nassig 3' AND league = 'bfv-Kreisklasse B Tauberbischofsheim'), 2, 2, 2, 0, 0, 15, 1, 6, '2025/26'),
  ((SELECT id FROM teams WHERE name = 'TSV Kreuzwertheim 2' AND league = 'bfv-Kreisklasse B Tauberbischofsheim'), 3, 3, 2, 0, 1, 11, 2, 6, '2025/26'),
  ((SELECT id FROM teams WHERE name = 'VfB Reicholzheim 2 (flex)' AND league = 'bfv-Kreisklasse B Tauberbischofsheim'), 4, 3, 2, 0, 1, 5, 12, 6, '2025/26'),
  ((SELECT id FROM teams WHERE name = 'Türkgücü Wertheim 2' AND league = 'bfv-Kreisklasse B Tauberbischofsheim'), 5, 1, 1, 0, 0, 4, 3, 3, '2025/26'),
  ((SELECT id FROM teams WHERE name = 'FC Wertheim-Eichel 2' AND league = 'bfv-Kreisklasse B Tauberbischofsheim'), 6, 3, 0, 1, 2, 3, 5, 1, '2025/26'),
  ((SELECT id FROM teams WHERE name = 'SG RaMBo 2' AND league = 'bfv-Kreisklasse B Tauberbischofsheim'), 7, 2, 0, 1, 1, 0, 3, 1, '2025/26'),
  ((SELECT id FROM teams WHERE name = 'FC Hundheim-Steinbach 2 (flex)' AND league = 'bfv-Kreisklasse B Tauberbischofsheim'), 8, 2, 0, 0, 2, 1, 10, 0, '2025/26'),
  ((SELECT id FROM teams WHERE name = 'SpG Viktoria Wertheim 3/Grünenwört' AND league = 'bfv-Kreisklasse B Tauberbischofsheim'), 9, 3, 0, 0, 3, 3, 14, 0, '2025/26');