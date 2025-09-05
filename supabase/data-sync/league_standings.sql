-- Sync data for league_standings
TRUNCATE TABLE league_standings CASCADE;
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
-- Data for Name: league_standings; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('30c4813b-3085-407d-95c7-85cbe787f8ee', '4cb0373a-86a1-44de-a19f-7afb6d8cdebd', 1, 4, 3, 1, 0, 13, 5, 10, NULL, '2025/26', '2025-09-05 21:29:21.797601+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('96b8d444-cb92-484f-af6a-3c3f35f2a99b', '973aa8c2-4901-47b1-9b51-6aae5168d2fc', 2, 4, 3, 1, 0, 11, 4, 10, NULL, '2025/26', '2025-09-05 21:29:21.797601+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('03f17300-be53-416b-abbe-565c1536206d', 'd78d0ef6-9385-4d6c-b318-fdba356aadfc', 3, 4, 3, 1, 0, 8, 3, 10, NULL, '2025/26', '2025-09-05 21:29:21.797601+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('bdd430d3-0368-4a6b-a786-7170eecbb854', 'b7719b48-7f84-4e9e-a8b1-f54d59d886ab', 4, 4, 2, 1, 1, 13, 5, 7, NULL, '2025/26', '2025-09-05 21:29:21.797601+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('f6a5fbf6-ddc5-46cd-a523-ef695334844e', '6afef842-87b5-4609-a033-04b665539dac', 5, 4, 2, 1, 1, 6, 4, 7, NULL, '2025/26', '2025-09-05 21:29:21.797601+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('55044d03-debe-4f15-ae79-27591cdad297', '124a11ec-bcd1-4173-954f-35e25c375de4', 6, 4, 2, 0, 2, 14, 11, 6, NULL, '2025/26', '2025-09-05 21:29:21.797601+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('29e7f0ec-4ab6-4b7d-85ca-a65c370b8208', 'cc4cee49-d32b-4864-b7e9-37dada8c3185', 7, 3, 2, 0, 1, 7, 4, 6, NULL, '2025/26', '2025-09-05 21:29:21.797601+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('9339772c-e45e-415b-b890-c606aee1a5d9', 'd5162c49-76b0-4cb8-afdd-dee5b1b5478d', 8, 4, 2, 0, 2, 10, 8, 6, NULL, '2025/26', '2025-09-05 21:29:21.797601+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('511bc244-4bb3-445a-93bc-b9d4db5de03d', '00c6158e-ff2e-4913-b6b2-1e624ef9004b', 9, 3, 1, 2, 0, 4, 3, 5, NULL, '2025/26', '2025-09-05 21:29:21.797601+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('393176cb-e29c-4269-9334-dd40d6aef82d', 'ea1b5c7e-aaaa-416a-8898-9a982f1cb76c', 10, 4, 1, 2, 1, 5, 6, 5, NULL, '2025/26', '2025-09-05 21:29:21.797601+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('a69dd10e-b937-4a22-a5f7-a780a91945fd', '229cb117-471a-4bcc-b60e-d73772738943', 11, 4, 1, 1, 2, 8, 9, 4, NULL, '2025/26', '2025-09-05 21:29:21.797601+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('a0cbc546-9f8c-4e14-8703-9abd2a112ebb', 'bd6dea97-0257-49fd-89d9-317db8770b5d', 12, 4, 1, 1, 2, 6, 7, 4, NULL, '2025/26', '2025-09-05 21:29:21.797601+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('773abdb4-e87a-4a79-a7c6-2ef387a93def', 'e5d8b585-f0db-4412-b206-f18bca7d3cfa', 13, 4, 1, 1, 2, 5, 8, 4, NULL, '2025/26', '2025-09-05 21:29:21.797601+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('654f33a8-ce99-4ab7-bfcc-88edf94724fc', '1f14dfef-d703-443f-8fb6-449837eef586', 14, 3, 0, 0, 3, 4, 11, 0, NULL, '2025/26', '2025-09-05 21:29:21.797601+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('be4a17fb-a9a7-48ce-b811-bf1cae18ecb1', 'bcb16996-e039-48a8-9a67-f74ccb6e532f', 15, 4, 0, 0, 4, 5, 13, 0, NULL, '2025/26', '2025-09-05 21:29:21.797601+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('14ed4721-b426-49e2-aaf9-6b9ac2d20361', '6879c62c-954d-4013-92af-50576e000d36', 16, 3, 0, 0, 3, 4, 22, 0, NULL, '2025/26', '2025-09-05 21:29:21.797601+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('5de5b896-ce22-428c-b9d1-253ad811b9fd', '8774bda3-7e00-4fb4-aa55-3307e374646a', 1, 3, 3, 0, 0, 9, 1, 9, NULL, '2025/26', '2025-09-05 21:29:21.80168+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('04e6623f-1fe6-46f7-8473-f7e83559ce72', '7a79fc39-65a3-4c15-aa0e-b3d360cd6189', 2, 3, 2, 1, 0, 7, 4, 7, NULL, '2025/26', '2025-09-05 21:29:21.80168+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('e36f11c7-2087-465b-95c3-5efe0083091a', '445f4dbd-eeb3-4eeb-87fb-ecee77d3bac3', 3, 3, 2, 0, 1, 5, 2, 6, NULL, '2025/26', '2025-09-05 21:29:21.80168+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('ad3f2734-7244-4603-9a48-26cf627980ed', 'b221c27a-d23c-4556-9ee0-5ad88b3c09b8', 4, 3, 2, 0, 1, 8, 6, 6, NULL, '2025/26', '2025-09-05 21:29:21.80168+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('3ed4f17d-de64-4bb5-89bc-5ea95d76269e', 'c2d1eaba-0689-450c-b9d0-ccd4de88a2e3', 5, 3, 1, 2, 0, 7, 1, 5, NULL, '2025/26', '2025-09-05 21:29:21.80168+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('ae48c883-cc48-4d21-8f99-466edb0ae7d6', 'e84bcd0f-5f0d-43d5-811a-3eb56e1301da', 6, 3, 1, 2, 0, 6, 1, 5, NULL, '2025/26', '2025-09-05 21:29:21.80168+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('899100c8-c350-4252-8c87-6e2f3ecb97f0', 'bfc00294-f28c-4de9-8f17-1e3b4284ca5c', 7, 3, 1, 1, 1, 6, 3, 4, NULL, '2025/26', '2025-09-05 21:29:21.80168+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('3be5e95d-fc2a-43fe-bf0c-67e2bd7ecc52', 'dcfe8ff6-49a5-4c0e-ad31-72971d7e94c9', 8, 3, 1, 1, 1, 4, 2, 4, NULL, '2025/26', '2025-09-05 21:29:21.80168+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('dc2ba9cc-dd62-40b4-8478-20d473832034', '917cecc0-002e-4d86-9ab1-a73cf5583f41', 9, 3, 1, 1, 1, 8, 9, 4, NULL, '2025/26', '2025-09-05 21:29:21.80168+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('846bd8e9-c9ef-4e03-96cc-47aac45683e9', '9c919d3d-0d86-49d9-90b4-821eb0f60aa5', 10, 3, 1, 0, 2, 9, 10, 3, NULL, '2025/26', '2025-09-05 21:29:21.80168+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('f3e0bad1-bbe5-4edf-b6af-57620f861ca6', '50abe950-0e11-46ad-9326-e59f7c561c94', 11, 3, 1, 0, 2, 6, 10, 3, NULL, '2025/26', '2025-09-05 21:29:21.80168+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('4091fb6e-8d4d-4a6c-a3aa-fc031bf6d8ca', '11d06eb2-1be4-43e6-8153-764b52086bb5', 12, 3, 0, 2, 1, 2, 7, 2, NULL, '2025/26', '2025-09-05 21:29:21.80168+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('ef667b55-6d4e-494f-8acd-00257f1e90af', '568e99ad-d9e1-4f2d-a517-88d3a725755b', 13, 3, 0, 0, 3, 2, 12, 0, NULL, '2025/26', '2025-09-05 21:29:21.80168+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('2582e63a-3c02-491b-a5af-111997aa9696', 'c81ba53f-59ca-4861-b9fa-42784ddc732b', 14, 3, 0, 0, 3, 1, 12, 0, NULL, '2025/26', '2025-09-05 21:29:21.80168+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('75588888-5acc-4045-8d99-70c37a8bab94', '80ac3bd4-4a57-48a1-98ec-0cd3ec657533', 1, 3, 3, 0, 0, 10, 2, 9, NULL, '2025/26', '2025-09-05 21:29:21.803988+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('69e602c1-c29c-4ea4-8864-668ba504775d', '9a0d2e89-613d-4dfd-975b-0ce590a2fb2a', 2, 2, 2, 0, 0, 15, 1, 6, NULL, '2025/26', '2025-09-05 21:29:21.803988+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('d1971454-1d62-4a07-9f5f-f4771bb5ca75', '4d71e1ef-3a25-4b1a-9897-71a3b0fafafd', 3, 3, 2, 0, 1, 11, 2, 6, NULL, '2025/26', '2025-09-05 21:29:21.803988+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('708c0e1a-e080-4a80-9b43-dc9c5ededf94', '9bf9c72d-ce0a-4cf3-a0cc-6a36f484113f', 4, 3, 2, 0, 1, 5, 12, 6, NULL, '2025/26', '2025-09-05 21:29:21.803988+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('83b4dec0-08ef-40d2-af80-d97b44b8c6cd', '579f2d2b-039f-41d3-b391-61da28a1e02f', 5, 1, 1, 0, 0, 4, 3, 3, NULL, '2025/26', '2025-09-05 21:29:21.803988+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('9fc24cc0-1bf5-48d2-b544-1ba3cf1fcecb', 'e0e7afaa-449b-4299-b6d6-d20b7c58c63d', 6, 3, 0, 1, 2, 3, 5, 1, NULL, '2025/26', '2025-09-05 21:29:21.803988+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('e7e2f1b7-96e7-42b9-975b-b92788118578', '01600050-5e40-460d-a1a1-40d2ee9bcbc2', 7, 2, 0, 1, 1, 0, 3, 1, NULL, '2025/26', '2025-09-05 21:29:21.803988+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('03ef5d2d-7ad3-4dbf-ab98-55fa02c3c2fb', 'f52ad52f-bb65-4531-8cb4-bf76e131f686', 8, 2, 0, 0, 2, 1, 10, 0, NULL, '2025/26', '2025-09-05 21:29:21.803988+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('6cc5c5bc-b920-473c-b262-ee34f1b7a60f', 'b86367ef-883f-4b73-9c98-77e7a0daf8b8', 9, 3, 0, 0, 3, 3, 14, 0, NULL, '2025/26', '2025-09-05 21:29:21.803988+00');


--
-- PostgreSQL database dump complete
--

