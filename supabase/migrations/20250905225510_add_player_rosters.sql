-- Add player rosters for all three teams

-- First, get the team IDs
DO $$
DECLARE
  first_team_id UUID;
  second_team_id UUID;
  third_team_id UUID;
BEGIN
  -- Get team IDs
  SELECT id INTO first_team_id FROM teams WHERE name = 'SV Viktoria Wertheim' AND team_type = 'first';
  SELECT id INTO second_team_id FROM teams WHERE name = 'SV Viktoria Wertheim 2' AND team_type = 'second';
  SELECT id INTO third_team_id FROM teams WHERE name = 'SpG Viktoria Wertheim 3/Grünenwört' AND team_type = 'third';

  -- Clear existing players for these teams (if any)
  DELETE FROM players WHERE team_id IN (first_team_id, second_team_id, third_team_id);

  -- Insert First Team Players (Trainer: Alexander Helfenstein)
  -- Starting XI
  INSERT INTO players (team_id, name, number, is_captain, is_active) VALUES
  (first_team_id, 'Niklas Spat', 21, false, true),
  (first_team_id, 'Nico Scheurich', 23, false, true),
  (first_team_id, 'Kevin Niedens', 7, false, true),
  (first_team_id, 'Stefan Sachnjuk', 10, false, true),
  (first_team_id, 'Eduard Helfenstein', 15, false, true),
  (first_team_id, 'Pascal Greulich', 19, false, true),
  (first_team_id, 'Richard Bender', 20, false, true),
  (first_team_id, 'Umut Baytekin', 28, false, true),
  (first_team_id, 'Silas Jacob', 43, false, true),
  (first_team_id, 'Manuel Stang', 75, false, true),
  (first_team_id, 'Erik Böspflug', 95, false, true),
  -- Bench
  (first_team_id, 'Alexander Helfenstein', 9, false, true),
  (first_team_id, 'Okan Cirakoglu', 11, false, true),
  (first_team_id, 'Vitalis Lerke', 33, false, true),
  (first_team_id, 'Willi Stumpf', 37, false, true),
  (first_team_id, 'Raffael Herberich', 96, false, true),
  (first_team_id, 'Arthur Schmidt', 97, false, true);

  -- Update coach for first team
  UPDATE teams SET coach = 'Alexander Helfenstein' WHERE id = first_team_id;

  -- Insert Second Team Players (Trainer: Marcel Eckhardt)
  -- Starting XI
  INSERT INTO players (team_id, name, number, is_captain, is_active) VALUES
  (second_team_id, 'Arthur Devjatkin', 1, false, true),
  (second_team_id, 'Kevin Leneschmidt', 3, false, true),
  (second_team_id, 'Ergenc Genc', 4, false, true),
  (second_team_id, 'Tobias Eckhardt', 6, false, true),
  (second_team_id, 'Nik Bogdan', 7, false, true),
  (second_team_id, 'Johannes Dey', 8, false, true),
  (second_team_id, 'Patrick Schork', 9, false, true),
  (second_team_id, 'Sergej Melcher', 10, false, true),
  (second_team_id, 'Dennis Schomber', 14, false, true),
  (second_team_id, 'Abdul Magas', 15, false, true),
  (second_team_id, 'Dennis Zimbelmann', 17, false, true),
  -- Bench
  (second_team_id, 'Max Mayer', 5, false, true),
  (second_team_id, 'Brandon Jamerson', 18, false, true),
  (second_team_id, 'Richard Schulz', 19, false, true);

  -- Update coach for second team
  UPDATE teams SET coach = 'Marcel Eckhardt' WHERE id = second_team_id;

  -- Insert Third Team Players (Trainer: Florian Helfenstein)
  -- Starting XI
  INSERT INTO players (team_id, name, number, is_captain, is_active) VALUES
  (third_team_id, 'Josef El Saleh', 1, false, true),
  (third_team_id, 'Alexander Niedens', 2, false, true),
  (third_team_id, 'Charalampos Papanikolaou', 3, false, true),
  (third_team_id, 'Thomas Bruderer', 4, false, true),
  (third_team_id, 'Mikhail Kotov', 6, false, true),
  (third_team_id, 'Erdal Bülbül', 7, false, true),
  (third_team_id, 'Valdez Fenny Cabreja', 9, false, true),
  (third_team_id, 'Tchiago Souza Eisenlohr', 15, false, true),
  (third_team_id, 'Alexander Trippel', 16, false, true),
  (third_team_id, 'Viktor Pflugfelder', 17, false, true),
  (third_team_id, 'Andrej Jörg', 18, false, true),
  -- Bench
  (third_team_id, 'Tobias Mittag', 5, false, true),
  (third_team_id, 'Florian Helfenstein', 8, false, true),
  (third_team_id, 'Christian Neubig', 10, false, true),
  (third_team_id, 'Avent Toska', 11, false, true),
  (third_team_id, 'Elwin Niedens', 13, false, true);

  -- Update coach for third team
  UPDATE teams SET coach = 'Florian Helfenstein' WHERE id = third_team_id;

END $$;