-- Seed data for SV Viktoria Wertheim
-- Generated from Frontend Mock Data

-- Clear existing data
TRUNCATE TABLE scorers CASCADE;
TRUNCATE TABLE league_standings CASCADE;
TRUNCATE TABLE matches CASCADE;
TRUNCATE TABLE players CASCADE;
TRUNCATE TABLE youth_teams CASCADE;
TRUNCATE TABLE teams CASCADE;
TRUNCATE TABLE news CASCADE;
TRUNCATE TABLE sponsors CASCADE;
TRUNCATE TABLE newsletter_subscribers CASCADE;

-- Insert Teams
INSERT INTO teams (id, name, short_name, league, coach, captain, training_schedule, table_position, points, season, team_type) VALUES
('a1111111-1111-1111-1111-111111111111', 'SV Viktoria Wertheim', 'SVW', 'Kreisliga A', 'Thomas Müller', 'Max Schmidt', 'Di & Do, 19:00 Uhr', 3, 28, '2023/24', 'first'),
('a2222222-2222-2222-2222-222222222222', 'SV Viktoria Wertheim II', 'SVW II', 'Kreisklasse B', 'Andreas Schmidt', 'Peter Wagner', 'Mo & Mi, 19:00 Uhr', 5, 22, '2023/24', 'second'),
('a3333333-3333-3333-3333-333333333333', 'SV Viktoria Wertheim III', 'SVW III', 'Kreisklasse C', 'Jugendtrainer-Team', 'Verschiedene', 'Nach Vereinbarung', 8, 15, '2023/24', 'third');

-- Insert Players
INSERT INTO players (team_id, name, number, position, age, is_captain) VALUES
-- First Team
('a1111111-1111-1111-1111-111111111111', 'Jan Neuer', 1, 'Torwart', 28, false),
('a1111111-1111-1111-1111-111111111111', 'Felix Weber', 4, 'Abwehr', 25, false),
('a1111111-1111-1111-1111-111111111111', 'Markus Berg', 5, 'Abwehr', 27, false),
('a1111111-1111-1111-1111-111111111111', 'Stefan Klein', 6, 'Abwehr', 24, false),
('a1111111-1111-1111-1111-111111111111', 'Michael Bauer', 8, 'Mittelfeld', 26, false),
('a1111111-1111-1111-1111-111111111111', 'Max Schmidt', 10, 'Mittelfeld', 29, true),
('a1111111-1111-1111-1111-111111111111', 'Thomas Wagner', 11, 'Mittelfeld', 23, false),
('a1111111-1111-1111-1111-111111111111', 'David Fischer', 7, 'Sturm', 22, false),
('a1111111-1111-1111-1111-111111111111', 'Robert Mayer', 9, 'Sturm', 25, false),
('a1111111-1111-1111-1111-111111111111', 'Christian Wolf', 14, 'Sturm', 21, false),
-- Second Team
('a2222222-2222-2222-2222-222222222222', 'Marco Hoffmann', 1, 'Torwart', 24, false),
('a2222222-2222-2222-2222-222222222222', 'Simon Braun', 2, 'Abwehr', 22, false),
('a2222222-2222-2222-2222-222222222222', 'Jonas Meyer', 3, 'Abwehr', 26, false),
('a2222222-2222-2222-2222-222222222222', 'Lukas Schulz', 4, 'Abwehr', 23, false),
('a2222222-2222-2222-2222-222222222222', 'Daniel Koch', 5, 'Mittelfeld', 25, false),
('a2222222-2222-2222-2222-222222222222', 'Peter Wagner', 6, 'Mittelfeld', 27, true),
('a2222222-2222-2222-2222-222222222222', 'Tobias Richter', 7, 'Mittelfeld', 21, false),
('a2222222-2222-2222-2222-222222222222', 'Niklas Frank', 8, 'Sturm', 20, false),
('a2222222-2222-2222-2222-222222222222', 'Kevin Becker', 9, 'Sturm', 24, false),
('a2222222-2222-2222-2222-222222222222', 'Tim Zimmermann', 10, 'Sturm', 22, false);

-- Insert Matches
INSERT INTO matches (home_team, away_team, home_team_id, away_team_id, home_score, away_score, match_date, match_time, location, match_type, status) VALUES
-- Completed matches
('SV Viktoria Wertheim', 'FC Mondfeld', 'a1111111-1111-1111-1111-111111111111', NULL, 3, 1, '2024-01-21', '15:00', 'Sportplatz Wertheim', 'league', 'completed'),
('SV Viktoria Wertheim II', 'SG Dertingen', 'a2222222-2222-2222-2222-222222222222', NULL, 2, 2, '2024-01-21', '13:00', 'Sportplatz Wertheim', 'league', 'completed'),
('FC Grünenwört', 'SV Viktoria Wertheim III', NULL, 'a3333333-3333-3333-3333-333333333333', 1, 4, '2024-01-21', '11:00', 'Sportplatz Grünenwört', 'league', 'completed'),
-- Upcoming matches
('TSV Kreuzwertheim', 'SV Viktoria Wertheim', NULL, 'a1111111-1111-1111-1111-111111111111', NULL, NULL, '2024-01-28', '14:30', 'Sportplatz Kreuzwertheim', 'league', 'scheduled'),
('SV Viktoria Wertheim II', 'FC Eichel', 'a2222222-2222-2222-2222-222222222222', NULL, NULL, NULL, '2024-01-28', '12:30', 'Sportplatz Wertheim', 'league', 'scheduled'),
('SV Viktoria Wertheim III', 'SV Nassig', 'a3333333-3333-3333-3333-333333333333', NULL, NULL, NULL, '2024-01-28', '10:30', 'Sportplatz Wertheim', 'league', 'scheduled'),
-- More historical matches
('SV Viktoria Wertheim', 'TSV Kreuzwertheim', 'a1111111-1111-1111-1111-111111111111', NULL, 2, 2, '2024-01-14', '15:00', 'Sportplatz Wertheim', 'league', 'completed'),
('SG Dertingen', 'SV Viktoria Wertheim', NULL, 'a1111111-1111-1111-1111-111111111111', 0, 4, '2024-01-07', '14:30', 'Sportplatz Dertingen', 'league', 'completed');

-- Insert News
INSERT INTO news (title, excerpt, content, published_at, image_url, views, category) VALUES
('Großartiger Sieg gegen FC Mondfeld', 
 'Mit einer starken Mannschaftsleistung gewinnt unsere erste Mannschaft verdient mit 3:1 gegen den Tabellendritten.',
 'Die erste Mannschaft des SV Viktoria Wertheim hat am Sonntag einen beeindruckenden 3:1-Sieg gegen den FC Mondfeld eingefahren. Vor heimischer Kulisse zeigten die Spieler eine geschlossene Mannschaftsleistung und dominierten das Spiel über weite Strecken. Bereits in der ersten Halbzeit gingen die Hausherren durch einen Doppelschlag in Führung. Nach der Pause verwaltete das Team den Vorsprung souverän und erhöhte in der Schlussphase sogar noch auf 3:0, bevor der Gegner den Ehrentreffer erzielen konnte.',
 '2024-01-21 18:00:00', '/images/news/sieg-mondfeld.jpg', 234, 'match_report'),

('Neue Verstärkungen für die Rückrunde',
 'Der SV Viktoria Wertheim freut sich, drei neue Spieler für die zweite Mannschaft präsentieren zu dürfen.',
 'Zur Rückrunde kann der SV Viktoria Wertheim drei Neuzugänge präsentieren. Die Spieler verstärken die zweite Mannschaft und sollen helfen, die ambitionierten Ziele für die Restsaison zu erreichen. Alle drei Spieler bringen Erfahrung aus höheren Ligen mit und werden das Team sowohl spielerisch als auch charakterlich verstärken.',
 '2024-01-20 16:00:00', '/images/news/neue-spieler.jpg', 189, 'transfers'),

('Jugend siegt im Pokalspiel',
 'Unsere U19 zieht nach einem spannenden Elfmeterschießen in die nächste Runde des Kreispokals ein.',
 'Drama pur im Kreispokal! Die U19 des SV Viktoria Wertheim hat sich in einem packenden Pokalspiel durchgesetzt. Nach 90 Minuten stand es 2:2, sodass die Entscheidung im Elfmeterschießen fallen musste. Hier behielten unsere Jungs die Nerven und verwandelten alle fünf Elfmeter, während der Gegner einmal verschoss.',
 '2024-01-19 20:00:00', '/images/news/jugend-pokal.jpg', 156, 'youth'),

('Trainingsauftakt für die Rückrunde',
 'Nach der Winterpause startet die Mannschaft mit vollem Einsatz in die Vorbereitung auf die zweite Saisonhälfte.',
 'Am Montag startete die erste Mannschaft in die Vorbereitung auf die Rückrunde. Trainer Thomas Müller konnte dabei fast auf den kompletten Kader zurückgreifen. In den kommenden Wochen stehen intensive Trainingseinheiten und mehrere Testspiele auf dem Programm, um optimal auf die zweite Saisonhälfte vorbereitet zu sein.',
 '2024-01-18 17:00:00', '/images/news/training-start.jpg', 142, 'training');

-- Insert League Standings
INSERT INTO league_standings (team_id, team_name, position, played, won, drawn, lost, goals_for, goals_against, points, trend, league) VALUES
-- Kreisliga A
('a1111111-1111-1111-1111-111111111111', 'SV Viktoria Wertheim', 3, 12, 9, 1, 2, 25, 12, 28, 'neutral', 'Kreisliga A'),
(NULL, 'FC Külsheim', 1, 12, 10, 1, 1, 32, 8, 31, 'up', 'Kreisliga A'),
(NULL, 'TSV Kreuzwertheim', 2, 12, 9, 2, 1, 28, 11, 29, 'up', 'Kreisliga A'),
(NULL, 'FC Mondfeld', 4, 12, 7, 3, 2, 22, 15, 24, 'down', 'Kreisliga A'),
(NULL, 'SG Dertingen', 5, 12, 6, 2, 4, 20, 18, 20, 'up', 'Kreisliga A'),
-- Kreisklasse B
('a2222222-2222-2222-2222-222222222222', 'SV Viktoria Wertheim II', 5, 12, 7, 1, 4, 22, 18, 22, 'down', 'Kreisklasse B'),
(NULL, 'FC Eichel II', 3, 12, 8, 2, 2, 26, 14, 26, 'up', 'Kreisklasse B'),
(NULL, 'SV Nassig II', 4, 12, 7, 2, 3, 24, 16, 23, 'neutral', 'Kreisklasse B'),
(NULL, 'SG Dertingen II', 6, 12, 6, 1, 5, 20, 20, 19, 'down', 'Kreisklasse B'),
(NULL, 'TSV Urphar', 7, 12, 5, 2, 5, 18, 22, 17, 'neutral', 'Kreisklasse B'),
-- Kreisklasse C
('a3333333-3333-3333-3333-333333333333', 'SV Viktoria Wertheim III', 8, 12, 4, 3, 5, 16, 19, 15, 'up', 'Kreisklasse C'),
(NULL, 'FC Grünenwört', 6, 12, 5, 3, 4, 19, 17, 18, 'up', 'Kreisklasse C'),
(NULL, 'SV Stadtprozelten', 7, 12, 5, 2, 5, 18, 20, 17, 'neutral', 'Kreisklasse C'),
(NULL, 'FC Bettingen', 9, 12, 3, 3, 6, 14, 22, 12, 'down', 'Kreisklasse C'),
(NULL, 'SV Kembach', 10, 12, 2, 2, 8, 10, 28, 8, 'down', 'Kreisklasse C');

-- Insert Top Scorers (we need to get player IDs first, so using subqueries)
INSERT INTO scorers (player_id, player_name, team_id, team_name, goals, assists, season) VALUES
((SELECT id FROM players WHERE name = 'Max Schmidt' LIMIT 1), 'Max Schmidt', 'a1111111-1111-1111-1111-111111111111', '1. Mannschaft', 18, 7, '2023/24'),
((SELECT id FROM players WHERE name = 'Thomas Wagner' LIMIT 1), 'Thomas Wagner', 'a1111111-1111-1111-1111-111111111111', '1. Mannschaft', 14, 5, '2023/24'),
((SELECT id FROM players WHERE name = 'Peter Wagner' LIMIT 1), 'Peter Wagner', 'a2222222-2222-2222-2222-222222222222', '2. Mannschaft', 12, 9, '2023/24'),
((SELECT id FROM players WHERE name = 'Felix Weber' LIMIT 1), 'Felix Wagner', 'a1111111-1111-1111-1111-111111111111', '1. Mannschaft', 10, 3, '2023/24'),
(NULL, 'Lukas Becker', 'a3333333-3333-3333-3333-333333333333', '3. Mannschaft', 8, 4, '2023/24');

-- Insert Youth Teams
INSERT INTO youth_teams (name, league, coach, player_count, age_group) VALUES
('A-Jugend (U19)', 'Kreisliga', 'Martin Schneider', 18, 'U19'),
('B-Jugend (U17)', 'Kreisklasse', 'Oliver Lang', 16, 'U17'),
('C-Jugend (U15)', 'Kreisklasse', 'Christian Beck', 20, 'U15'),
('D-Jugend (U13)', 'Kreisklasse', 'Sebastian Kraus', 22, 'U13'),
('E-Jugend (U11)', 'Fairplay-Liga', 'Michael Horn', 15, 'U11'),
('F-Jugend (U9)', 'Fairplay-Liga', 'Thomas Vogel', 12, 'U9'),
('Bambini (U7)', 'Spieltage', 'Stefan Roth', 10, 'U7');

-- Insert Sponsors
INSERT INTO sponsors (name, logo_url, website, category, description) VALUES
('Sparkasse Tauberfranken', '/images/sponsors/sparkasse.png', 'https://www.sparkasse-tauberfranken.de', 'Hauptsponsor', 'Unser Hauptsponsor seit über 10 Jahren'),
('Auto Müller GmbH', '/images/sponsors/auto-mueller.png', 'https://www.auto-mueller.de', 'Premium Partner', 'Ihr Autohaus in Wertheim'),
('Bäckerei Schmidt', '/images/sponsors/baeckerei-schmidt.png', NULL, 'Partner', 'Frische Backwaren für unsere Veranstaltungen'),
('Getränke Weber', '/images/sponsors/getraenke-weber.png', 'https://www.getraenke-weber.de', 'Partner', 'Getränkelieferant für alle Vereinsfeste'),
('Sport Klein', '/images/sponsors/sport-klein.png', NULL, 'Förderer', 'Sportausstattung und Vereinsbedarf');

-- Add some sample newsletter subscribers
INSERT INTO newsletter_subscribers (email) VALUES
('fan1@example.com'),
('mitglied@viktoria-wertheim.de'),
('supporter@gmail.com');