-- Sync data for scorers
TRUNCATE TABLE scorers CASCADE;
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
-- Data for Name: scorers; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.scorers (id, player_id, player_name, team_id, team_name, goals, assists, season, created_at, updated_at) VALUES ('14fba149-5054-40bd-8e46-70409713a138', NULL, 'Silas Jacob', NULL, 'SV Viktoria Wertheim', 2, 0, '2024/25', '2025-09-03 10:52:19.489478+00', '2025-09-03 10:52:19.489478+00');
INSERT INTO public.scorers (id, player_id, player_name, team_id, team_name, goals, assists, season, created_at, updated_at) VALUES ('2ae32c9a-a3f1-45b4-9ff7-62fd9e21dfee', NULL, 'Stefan Sachnjuk', NULL, 'SV Viktoria Wertheim', 2, 0, '2024/25', '2025-09-03 10:52:19.489478+00', '2025-09-03 10:52:19.489478+00');
INSERT INTO public.scorers (id, player_id, player_name, team_id, team_name, goals, assists, season, created_at, updated_at) VALUES ('fa70dc90-f7a8-455a-b529-6ecc8c4d20be', NULL, 'Umut Baytekin', NULL, 'SV Viktoria Wertheim', 1, 0, '2024/25', '2025-09-03 10:52:19.489478+00', '2025-09-03 10:52:19.489478+00');
INSERT INTO public.scorers (id, player_id, player_name, team_id, team_name, goals, assists, season, created_at, updated_at) VALUES ('6746a758-c6df-434f-a595-f3acbf08b1e0', NULL, 'Pascal Greulich', NULL, 'SV Viktoria Wertheim', 1, 0, '2024/25', '2025-09-03 10:52:19.489478+00', '2025-09-03 10:52:19.489478+00');
INSERT INTO public.scorers (id, player_id, player_name, team_id, team_name, goals, assists, season, created_at, updated_at) VALUES ('fd0a24c4-e394-405e-9356-543782db5595', NULL, 'Vitalis Lerke', NULL, 'SV Viktoria Wertheim', 1, 0, '2024/25', '2025-09-03 10:52:19.489478+00', '2025-09-03 10:52:19.489478+00');
INSERT INTO public.scorers (id, player_id, player_name, team_id, team_name, goals, assists, season, created_at, updated_at) VALUES ('f8be0bc6-7310-4aff-9d5c-07db74e704d1', NULL, 'Kevin Niedens', NULL, 'SV Viktoria Wertheim', 1, 0, '2024/25', '2025-09-03 10:52:19.489478+00', '2025-09-03 10:52:19.489478+00');
INSERT INTO public.scorers (id, player_id, player_name, team_id, team_name, goals, assists, season, created_at, updated_at) VALUES ('3b312342-c2d8-43de-ae38-1eaeb9a514e2', NULL, 'Christian Devjatkin', NULL, 'SV Viktoria Wertheim 2', 1, 0, '2024/25', '2025-09-05 20:05:54.247458+00', '2025-09-05 20:05:54.247458+00');
INSERT INTO public.scorers (id, player_id, player_name, team_id, team_name, goals, assists, season, created_at, updated_at) VALUES ('2ce12263-ac72-46d3-8698-c04653e8ef23', NULL, 'Oktay Can Kaleli', NULL, 'SV Viktoria Wertheim 2', 1, 0, '2024/25', '2025-09-05 20:05:54.247458+00', '2025-09-05 20:05:54.247458+00');
INSERT INTO public.scorers (id, player_id, player_name, team_id, team_name, goals, assists, season, created_at, updated_at) VALUES ('8373fe0a-e41d-4f8d-a641-7d191ae4f4f2', NULL, 'Dennis Schomber', NULL, 'SV Viktoria Wertheim 2', 1, 0, '2024/25', '2025-09-05 20:05:54.247458+00', '2025-09-05 20:05:54.247458+00');
INSERT INTO public.scorers (id, player_id, player_name, team_id, team_name, goals, assists, season, created_at, updated_at) VALUES ('143335ec-1d7e-4209-9122-e3f91e047d56', NULL, 'Dennis Zimbelmann', NULL, 'SV Viktoria Wertheim 2', 1, 0, '2024/25', '2025-09-05 20:05:54.247458+00', '2025-09-05 20:05:54.247458+00');
INSERT INTO public.scorers (id, player_id, player_name, team_id, team_name, goals, assists, season, created_at, updated_at) VALUES ('a37bf4c3-86c6-4b89-900e-7abdbd565e54', NULL, 'Andrej Jörg', NULL, 'SpG Viktoria Wertheim 3/Grünenwört', 2, 0, '2024/25', '2025-09-05 20:05:54.247458+00', '2025-09-05 20:05:54.247458+00');
INSERT INTO public.scorers (id, player_id, player_name, team_id, team_name, goals, assists, season, created_at, updated_at) VALUES ('6d29355b-d0f2-4aad-991a-22b61b8640a3', NULL, 'Thomas Merlein', NULL, 'SpG Viktoria Wertheim 3/Grünenwört', 1, 0, '2024/25', '2025-09-05 20:05:54.247458+00', '2025-09-05 20:05:54.247458+00');


--
-- PostgreSQL database dump complete
--

