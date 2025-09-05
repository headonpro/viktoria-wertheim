-- Migration: Alle Spiele, Spielzeiten und Spielorte für die 3. Mannschaft (SpG Vikt. Wertheim 3/Grünenwört) Saison 2025/26

-- Alle Spiele der 3. Mannschaft hinzufügen (18 Spiele, ohne die 2 "SPIELFREI" Termine)
INSERT INTO matches (id, home_team, away_team, home_team_id, away_team_id, match_date, match_time, location, status, match_type)
VALUES 
  -- Hinrunde
  (gen_random_uuid(), 'TSV Kreuzwertheim 2', 'SpG Vikt. Wertheim 3/Grünenwört', NULL, 'b86367ef-883f-4b73-9c98-77e7a0daf8b8', '2025-08-17', '13:00:00', 'TSV Kreuzwertheim', 'scheduled', 'league'),
  (gen_random_uuid(), 'SpG Vikt. Wertheim 3/Grünenwört', 'SpG Kickers DHK Wertheim 2/Urphar', 'b86367ef-883f-4b73-9c98-77e7a0daf8b8', NULL, '2025-08-24', '13:00:00', 'Stadion Bestenheid', 'scheduled', 'league'),
  (gen_random_uuid(), 'SpG Vikt. Wertheim 3/Grünenwört', 'VfB Reicholzheim 2 (flex)', 'b86367ef-883f-4b73-9c98-77e7a0daf8b8', NULL, '2025-08-31', '13:00:00', 'Stadion Bestenheid', 'scheduled', 'league'),
  (gen_random_uuid(), 'FC Hundheim-Steinbach 2(flex)', 'SpG Vikt. Wertheim 3/Grünenwört', NULL, 'b86367ef-883f-4b73-9c98-77e7a0daf8b8', '2025-09-07', '13:00:00', 'FC Hundheim-Steinbach', 'scheduled', 'league'),
  -- 14.09. ist SPIELFREI, nicht einfügen
  (gen_random_uuid(), 'FC Wertheim-Eichel 2', 'SpG Vikt. Wertheim 3/Grünenwört', NULL, 'b86367ef-883f-4b73-9c98-77e7a0daf8b8', '2025-09-21', '13:00:00', 'FC Wertheim-Eichel', 'scheduled', 'league'),
  (gen_random_uuid(), 'SpG Vikt. Wertheim 3/Grünenwört', 'SG RaMBo 2', 'b86367ef-883f-4b73-9c98-77e7a0daf8b8', NULL, '2025-09-28', '13:00:00', 'Stadion Bestenheid', 'scheduled', 'league'),
  (gen_random_uuid(), 'Türkgücü Wertheim 2', 'SpG Vikt. Wertheim 3/Grünenwört', NULL, 'b86367ef-883f-4b73-9c98-77e7a0daf8b8', '2025-10-05', '13:00:00', 'Türkgücü Wertheim', 'scheduled', 'league'),
  (gen_random_uuid(), 'SpG Vikt. Wertheim 3/Grünenwört', 'SV Eintracht Nassig 3', 'b86367ef-883f-4b73-9c98-77e7a0daf8b8', NULL, '2025-10-12', '13:00:00', 'Stadion Bestenheid', 'scheduled', 'league'),
  (gen_random_uuid(), 'FC Hundheim-Steinbach 2(flex)', 'SpG Vikt. Wertheim 3/Grünenwört', NULL, 'b86367ef-883f-4b73-9c98-77e7a0daf8b8', '2025-10-26', '13:00:00', 'FC Hundheim-Steinbach', 'scheduled', 'league'),
  
  -- Rückrunde
  (gen_random_uuid(), 'SpG Vikt. Wertheim 3/Grünenwört', 'FC Wertheim-Eichel 2', 'b86367ef-883f-4b73-9c98-77e7a0daf8b8', NULL, '2026-04-06', '13:00:00', 'Stadion Bestenheid', 'scheduled', 'league'),
  (gen_random_uuid(), 'SG RaMBo 2', 'SpG Vikt. Wertheim 3/Grünenwört', NULL, 'b86367ef-883f-4b73-9c98-77e7a0daf8b8', '2026-04-12', '13:00:00', 'SG RaMBo', 'scheduled', 'league'),
  (gen_random_uuid(), 'SpG Vikt. Wertheim 3/Grünenwört', 'Türkgücü Wertheim 2', 'b86367ef-883f-4b73-9c98-77e7a0daf8b8', NULL, '2026-04-19', '13:00:00', 'Stadion Bestenheid', 'scheduled', 'league'),
  (gen_random_uuid(), 'SV Eintracht Nassig 3', 'SpG Vikt. Wertheim 3/Grünenwört', NULL, 'b86367ef-883f-4b73-9c98-77e7a0daf8b8', '2026-04-26', '13:00:00', 'SV Eintracht Nassig', 'scheduled', 'league'),
  (gen_random_uuid(), 'SpG Vikt. Wertheim 3/Grünenwört', 'TSV Kreuzwertheim 2', 'b86367ef-883f-4b73-9c98-77e7a0daf8b8', NULL, '2026-05-03', '13:00:00', 'Stadion Bestenheid', 'scheduled', 'league'),
  (gen_random_uuid(), 'SpG Kickers DHK Wertheim 2/Urphar', 'SpG Vikt. Wertheim 3/Grünenwört', NULL, 'b86367ef-883f-4b73-9c98-77e7a0daf8b8', '2026-05-10', '13:00:00', 'Kickers DHK Wertheim', 'scheduled', 'league'),
  (gen_random_uuid(), 'VfB Reicholzheim 2 (flex)', 'SpG Vikt. Wertheim 3/Grünenwört', NULL, 'b86367ef-883f-4b73-9c98-77e7a0daf8b8', '2026-05-17', '13:00:00', 'VfB Reicholzheim', 'scheduled', 'league'),
  (gen_random_uuid(), 'SpG Vikt. Wertheim 3/Grünenwört', 'FC Hundheim-Steinbach 2(flex)', 'b86367ef-883f-4b73-9c98-77e7a0daf8b8', NULL, '2026-05-25', '13:00:00', 'Stadion Bestenheid', 'scheduled', 'league')
  -- 31.05. ist SPIELFREI, nicht einfügen
ON CONFLICT DO NOTHING;