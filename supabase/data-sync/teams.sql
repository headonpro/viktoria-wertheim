-- Sync data for teams
TRUNCATE TABLE teams CASCADE;
--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 15.8

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: teams; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.teams (id, name, short_name, league, coach, captain, training_schedule, table_position, points, season, team_type, created_at, updated_at, games_played, wins, draws, losses, goals_for, goals_against) VALUES ('a2222222-2222-2222-2222-222222222222', 'SV Viktoria Wertheim II', 'SVW II', 'bfv-Kreisklasse A Tauberbischofsheim', 'Marcel Eckhardt', 'Tobias Eckhardt', 'Mi 19:00 + Fr 18:30 Uhr', 13, 0, '2025/26', 'second', '2025-08-30 13:51:25.480125+00', '2025-09-03 16:20:44.908563+00', 3, 0, 0, 3, 2, 12);
INSERT INTO public.teams (id, name, short_name, league, coach, captain, training_schedule, table_position, points, season, team_type, created_at, updated_at, games_played, wins, draws, losses, goals_for, goals_against) VALUES ('a3333333-3333-3333-3333-333333333333', 'SpG Vikt. Wertheim 3/Grünenwört', 'SpG VW3/GW', 'bfv-Kreisklasse B Tauberbischofsheim', 'Florian Helfenstein', 'Alexander Trippel', 'Mi 19:00 + Fr 18:30 Uhr', 9, 0, '2025/26', 'third', '2025-08-30 13:51:25.480125+00', '2025-09-03 18:10:47.865315+00', 3, 0, 0, 3, 3, 14);
INSERT INTO public.teams (id, name, short_name, league, coach, captain, training_schedule, table_position, points, season, team_type, created_at, updated_at, games_played, wins, draws, losses, goals_for, goals_against) VALUES ('a1111111-1111-1111-1111-111111111111', 'SV Viktoria Wertheim', 'SVW', 'bfv-Kreisliga Tauberbischofsheim', 'Alexander Helfenstein', 'Eduard Helfenstein', 'Mi 19:00 + Fr 18:30 Uhr', 11, 4, '2025/26', 'first', '2025-08-30 13:51:25.480125+00', '2025-09-04 22:29:06.798873+00', 4, 1, 1, 2, 8, 9);


--
-- PostgreSQL database dump complete
--

