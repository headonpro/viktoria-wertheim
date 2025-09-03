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
-- Data for Name: players; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.players (id, team_id, name, number, "position", age, is_captain, is_active, created_at, updated_at) VALUES ('bce668df-60c1-4eb8-8484-f10bcc5545cf', 'a1111111-1111-1111-1111-111111111111', 'Jan Neuer', 1, 'Torwart', 28, false, true, '2025-08-30 13:51:25.482467+00', '2025-08-30 13:51:25.482467+00');
INSERT INTO public.players (id, team_id, name, number, "position", age, is_captain, is_active, created_at, updated_at) VALUES ('0240129f-eeed-4d11-879c-5c2b2a315906', 'a1111111-1111-1111-1111-111111111111', 'Felix Weber', 4, 'Abwehr', 25, false, true, '2025-08-30 13:51:25.482467+00', '2025-08-30 13:51:25.482467+00');
INSERT INTO public.players (id, team_id, name, number, "position", age, is_captain, is_active, created_at, updated_at) VALUES ('8a29094c-d34c-467a-b7c3-3917f94cb445', 'a1111111-1111-1111-1111-111111111111', 'Markus Berg', 5, 'Abwehr', 27, false, true, '2025-08-30 13:51:25.482467+00', '2025-08-30 13:51:25.482467+00');
INSERT INTO public.players (id, team_id, name, number, "position", age, is_captain, is_active, created_at, updated_at) VALUES ('c1328948-d463-49a3-ae8a-57c85af661b9', 'a1111111-1111-1111-1111-111111111111', 'Stefan Klein', 6, 'Abwehr', 24, false, true, '2025-08-30 13:51:25.482467+00', '2025-08-30 13:51:25.482467+00');
INSERT INTO public.players (id, team_id, name, number, "position", age, is_captain, is_active, created_at, updated_at) VALUES ('dd1ab80d-33e4-471b-bd3f-cb6669b04f07', 'a1111111-1111-1111-1111-111111111111', 'Michael Bauer', 8, 'Mittelfeld', 26, false, true, '2025-08-30 13:51:25.482467+00', '2025-08-30 13:51:25.482467+00');
INSERT INTO public.players (id, team_id, name, number, "position", age, is_captain, is_active, created_at, updated_at) VALUES ('5deffa26-1f2c-48ce-88ff-d032e5368525', 'a1111111-1111-1111-1111-111111111111', 'Max Schmidt', 10, 'Mittelfeld', 29, true, true, '2025-08-30 13:51:25.482467+00', '2025-08-30 13:51:25.482467+00');
INSERT INTO public.players (id, team_id, name, number, "position", age, is_captain, is_active, created_at, updated_at) VALUES ('02e5819b-1a3d-4e52-9f30-1461a89b6f81', 'a1111111-1111-1111-1111-111111111111', 'Thomas Wagner', 11, 'Mittelfeld', 23, false, true, '2025-08-30 13:51:25.482467+00', '2025-08-30 13:51:25.482467+00');
INSERT INTO public.players (id, team_id, name, number, "position", age, is_captain, is_active, created_at, updated_at) VALUES ('8cd41a43-4dce-49be-b50f-d6d8ff531739', 'a1111111-1111-1111-1111-111111111111', 'David Fischer', 7, 'Sturm', 22, false, true, '2025-08-30 13:51:25.482467+00', '2025-08-30 13:51:25.482467+00');
INSERT INTO public.players (id, team_id, name, number, "position", age, is_captain, is_active, created_at, updated_at) VALUES ('b3b36862-b333-4701-9ee3-100fc36baf24', 'a1111111-1111-1111-1111-111111111111', 'Robert Mayer', 9, 'Sturm', 25, false, true, '2025-08-30 13:51:25.482467+00', '2025-08-30 13:51:25.482467+00');
INSERT INTO public.players (id, team_id, name, number, "position", age, is_captain, is_active, created_at, updated_at) VALUES ('c0e58695-c1d9-4c0c-bc3c-7e868f1c2042', 'a1111111-1111-1111-1111-111111111111', 'Christian Wolf', 14, 'Sturm', 21, false, true, '2025-08-30 13:51:25.482467+00', '2025-08-30 13:51:25.482467+00');
INSERT INTO public.players (id, team_id, name, number, "position", age, is_captain, is_active, created_at, updated_at) VALUES ('76cc9d9d-69e3-4131-879f-72f6624eefc2', 'a2222222-2222-2222-2222-222222222222', 'Marco Hoffmann', 1, 'Torwart', 24, false, true, '2025-08-30 13:51:25.482467+00', '2025-08-30 13:51:25.482467+00');
INSERT INTO public.players (id, team_id, name, number, "position", age, is_captain, is_active, created_at, updated_at) VALUES ('7d9eca32-7b0f-421a-b33e-a290bf737704', 'a2222222-2222-2222-2222-222222222222', 'Simon Braun', 2, 'Abwehr', 22, false, true, '2025-08-30 13:51:25.482467+00', '2025-08-30 13:51:25.482467+00');
INSERT INTO public.players (id, team_id, name, number, "position", age, is_captain, is_active, created_at, updated_at) VALUES ('3725c84a-d12e-405e-92c7-fd3b2f4f4731', 'a2222222-2222-2222-2222-222222222222', 'Jonas Meyer', 3, 'Abwehr', 26, false, true, '2025-08-30 13:51:25.482467+00', '2025-08-30 13:51:25.482467+00');
INSERT INTO public.players (id, team_id, name, number, "position", age, is_captain, is_active, created_at, updated_at) VALUES ('d48dc367-4594-4efa-957f-61280fc2ffe3', 'a2222222-2222-2222-2222-222222222222', 'Lukas Schulz', 4, 'Abwehr', 23, false, true, '2025-08-30 13:51:25.482467+00', '2025-08-30 13:51:25.482467+00');
INSERT INTO public.players (id, team_id, name, number, "position", age, is_captain, is_active, created_at, updated_at) VALUES ('ba44e936-31e5-4674-9f46-01669635d707', 'a2222222-2222-2222-2222-222222222222', 'Daniel Koch', 5, 'Mittelfeld', 25, false, true, '2025-08-30 13:51:25.482467+00', '2025-08-30 13:51:25.482467+00');
INSERT INTO public.players (id, team_id, name, number, "position", age, is_captain, is_active, created_at, updated_at) VALUES ('fb011696-0ef9-4c82-9706-862787f7114b', 'a2222222-2222-2222-2222-222222222222', 'Peter Wagner', 6, 'Mittelfeld', 27, true, true, '2025-08-30 13:51:25.482467+00', '2025-08-30 13:51:25.482467+00');
INSERT INTO public.players (id, team_id, name, number, "position", age, is_captain, is_active, created_at, updated_at) VALUES ('f008f948-a089-4cf1-afe0-50061e380bbc', 'a2222222-2222-2222-2222-222222222222', 'Tobias Richter', 7, 'Mittelfeld', 21, false, true, '2025-08-30 13:51:25.482467+00', '2025-08-30 13:51:25.482467+00');
INSERT INTO public.players (id, team_id, name, number, "position", age, is_captain, is_active, created_at, updated_at) VALUES ('576df9df-cab1-4e66-9799-c40e08c8b8f8', 'a2222222-2222-2222-2222-222222222222', 'Niklas Frank', 8, 'Sturm', 20, false, true, '2025-08-30 13:51:25.482467+00', '2025-08-30 13:51:25.482467+00');
INSERT INTO public.players (id, team_id, name, number, "position", age, is_captain, is_active, created_at, updated_at) VALUES ('4bac3f14-4b41-4ab4-8f5b-83fbd6c111a9', 'a2222222-2222-2222-2222-222222222222', 'Kevin Becker', 9, 'Sturm', 24, false, true, '2025-08-30 13:51:25.482467+00', '2025-08-30 13:51:25.482467+00');
INSERT INTO public.players (id, team_id, name, number, "position", age, is_captain, is_active, created_at, updated_at) VALUES ('c241aadd-e633-4da5-b7d7-2a715c30dd5f', 'a2222222-2222-2222-2222-222222222222', 'Tim Zimmermann', 10, 'Sturm', 22, false, true, '2025-08-30 13:51:25.482467+00', '2025-08-30 13:51:25.482467+00');


--
-- PostgreSQL database dump complete
--

