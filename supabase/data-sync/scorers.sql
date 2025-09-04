-- Sync data for scorers
TRUNCATE TABLE scorers CASCADE;
--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: scorers; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.scorers (id, player_id, player_name, team_id, team_name, goals, assists, season, created_at, updated_at) VALUES ('14fba149-5054-40bd-8e46-70409713a138', NULL, 'Silas Jacob', NULL, 'SV Viktoria Wertheim', 2, 0, '2024/25', '2025-09-03 10:52:19.489478+00', '2025-09-03 10:52:19.489478+00');
INSERT INTO public.scorers (id, player_id, player_name, team_id, team_name, goals, assists, season, created_at, updated_at) VALUES ('2ae32c9a-a3f1-45b4-9ff7-62fd9e21dfee', NULL, 'Stefan Sachnjuk', NULL, 'SV Viktoria Wertheim', 2, 0, '2024/25', '2025-09-03 10:52:19.489478+00', '2025-09-03 10:52:19.489478+00');
INSERT INTO public.scorers (id, player_id, player_name, team_id, team_name, goals, assists, season, created_at, updated_at) VALUES ('fa70dc90-f7a8-455a-b529-6ecc8c4d20be', NULL, 'Umut Baytekin', NULL, 'SV Viktoria Wertheim', 1, 0, '2024/25', '2025-09-03 10:52:19.489478+00', '2025-09-03 10:52:19.489478+00');
INSERT INTO public.scorers (id, player_id, player_name, team_id, team_name, goals, assists, season, created_at, updated_at) VALUES ('6746a758-c6df-434f-a595-f3acbf08b1e0', NULL, 'Pascal Greulich', NULL, 'SV Viktoria Wertheim', 1, 0, '2024/25', '2025-09-03 10:52:19.489478+00', '2025-09-03 10:52:19.489478+00');
INSERT INTO public.scorers (id, player_id, player_name, team_id, team_name, goals, assists, season, created_at, updated_at) VALUES ('fd0a24c4-e394-405e-9356-543782db5595', NULL, 'Vitalis Lerke', NULL, 'SV Viktoria Wertheim', 1, 0, '2024/25', '2025-09-03 10:52:19.489478+00', '2025-09-03 10:52:19.489478+00');
INSERT INTO public.scorers (id, player_id, player_name, team_id, team_name, goals, assists, season, created_at, updated_at) VALUES ('f8be0bc6-7310-4aff-9d5c-07db74e704d1', NULL, 'Kevin Niedens', NULL, 'SV Viktoria Wertheim', 1, 0, '2024/25', '2025-09-03 10:52:19.489478+00', '2025-09-03 10:52:19.489478+00');
INSERT INTO public.scorers (id, player_id, player_name, team_id, team_name, goals, assists, season, created_at, updated_at) VALUES ('09df4517-4093-4af8-9f51-fa203b3e779d', NULL, 'Christian Devjatkin', 'a2222222-2222-2222-2222-222222222222', 'SV Viktoria Wertheim II', 1, 0, '2024/25', '2025-09-03 15:29:39.021699+00', '2025-09-03 15:33:54.102829+00');
INSERT INTO public.scorers (id, player_id, player_name, team_id, team_name, goals, assists, season, created_at, updated_at) VALUES ('78268dd1-0990-424d-88bf-53a21bdf7b72', NULL, 'Oktay Can Kaleli', 'a2222222-2222-2222-2222-222222222222', 'SV Viktoria Wertheim II', 1, 0, '2024/25', '2025-09-03 15:29:39.021699+00', '2025-09-03 15:33:54.102829+00');
INSERT INTO public.scorers (id, player_id, player_name, team_id, team_name, goals, assists, season, created_at, updated_at) VALUES ('e320dc3b-6302-4a9c-aa4f-c2f10628e257', NULL, 'Dennis Schomber', 'a2222222-2222-2222-2222-222222222222', 'SV Viktoria Wertheim II', 1, 0, '2024/25', '2025-09-03 15:29:39.021699+00', '2025-09-03 15:33:54.102829+00');
INSERT INTO public.scorers (id, player_id, player_name, team_id, team_name, goals, assists, season, created_at, updated_at) VALUES ('5c105f53-998b-4f64-9e62-a32f78822167', NULL, 'Dennis Zimbelmann', 'a2222222-2222-2222-2222-222222222222', 'SV Viktoria Wertheim II', 1, 0, '2024/25', '2025-09-03 15:29:39.021699+00', '2025-09-03 15:33:54.102829+00');
INSERT INTO public.scorers (id, player_id, player_name, team_id, team_name, goals, assists, season, created_at, updated_at) VALUES ('5ff33223-e107-40c4-8f34-399449c7ccaa', NULL, 'Andrej Jörg', 'a3333333-3333-3333-3333-333333333333', 'SpG Vikt. Wertheim 3/Grünenwört', 2, 0, '2025/26', '2025-09-01 10:14:42.804272+00', '2025-09-03 18:14:56.041601+00');
INSERT INTO public.scorers (id, player_id, player_name, team_id, team_name, goals, assists, season, created_at, updated_at) VALUES ('9393a31b-3531-42ec-a1b8-98e9c0ccb72b', NULL, 'Thomas Merlein', 'a3333333-3333-3333-3333-333333333333', 'SpG Vikt. Wertheim 3/Grünenwört', 1, 0, '2025/26', '2025-09-01 10:14:42.804272+00', '2025-09-03 18:14:56.041601+00');


--
-- PostgreSQL database dump complete
--

