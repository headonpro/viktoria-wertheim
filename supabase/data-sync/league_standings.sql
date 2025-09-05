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

INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('ecc882fd-c23e-4b4a-a781-fb06ab7226c1', '4cb0373a-86a1-44de-a19f-7afb6d8cdebd', 1, 4, 3, 1, 0, 13, 5, 10, NULL, '2025/26', '2025-09-05 18:02:23.000254+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('3bd26ce5-1da2-4259-8228-41241927845b', '973aa8c2-4901-47b1-9b51-6aae5168d2fc', 2, 4, 3, 1, 0, 11, 4, 10, NULL, '2025/26', '2025-09-05 18:02:23.000254+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('ea59cf4c-d671-495e-9c78-1d39c5acf55c', 'd78d0ef6-9385-4d6c-b318-fdba356aadfc', 3, 4, 3, 1, 0, 8, 3, 10, NULL, '2025/26', '2025-09-05 18:02:23.000254+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('c50189b8-a054-4a50-9a6e-882d2aebb3ed', 'b7719b48-7f84-4e9e-a8b1-f54d59d886ab', 4, 4, 2, 1, 1, 13, 5, 7, NULL, '2025/26', '2025-09-05 18:02:23.000254+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('a792b8b0-85d7-4ae0-a3ab-d76d8954542d', '6afef842-87b5-4609-a033-04b665539dac', 5, 4, 2, 1, 1, 6, 4, 7, NULL, '2025/26', '2025-09-05 18:02:23.000254+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('730b73a4-1e6d-42bb-9814-51fcaeb41682', '124a11ec-bcd1-4173-954f-35e25c375de4', 6, 4, 2, 0, 2, 14, 11, 6, NULL, '2025/26', '2025-09-05 18:02:23.000254+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('32bd5703-eb5e-450d-adba-9258f76f052c', 'cc4cee49-d32b-4864-b7e9-37dada8c3185', 7, 3, 2, 0, 1, 7, 4, 6, NULL, '2025/26', '2025-09-05 18:02:23.000254+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('be369851-7ec9-4941-a5d5-fb474edaf966', 'd5162c49-76b0-4cb8-afdd-dee5b1b5478d', 8, 4, 2, 0, 2, 10, 8, 6, NULL, '2025/26', '2025-09-05 18:02:23.000254+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('60f72579-e13a-4013-a5d4-b322932b6ebe', '00c6158e-ff2e-4913-b6b2-1e624ef9004b', 9, 3, 1, 2, 0, 4, 3, 5, NULL, '2025/26', '2025-09-05 18:02:23.000254+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('46dd8eb1-d88b-48ac-ba17-7f71458fc31c', 'ea1b5c7e-aaaa-416a-8898-9a982f1cb76c', 10, 4, 1, 2, 1, 5, 6, 5, NULL, '2025/26', '2025-09-05 18:02:23.000254+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('1c26c7a5-53d2-47ba-a166-dbf89d83d31a', '229cb117-471a-4bcc-b60e-d73772738943', 11, 4, 1, 1, 2, 8, 9, 4, NULL, '2025/26', '2025-09-05 18:02:23.000254+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('8ded3855-73ab-4e42-ad8d-959c1a08b3c2', 'bd6dea97-0257-49fd-89d9-317db8770b5d', 12, 4, 1, 1, 2, 6, 7, 4, NULL, '2025/26', '2025-09-05 18:02:23.000254+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('5f6658ba-5641-41da-a657-23dbe98d92e6', 'e5d8b585-f0db-4412-b206-f18bca7d3cfa', 13, 4, 1, 1, 2, 5, 8, 4, NULL, '2025/26', '2025-09-05 18:02:23.000254+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('7f177f87-6ccb-4590-b361-8f4aa969969f', '1f14dfef-d703-443f-8fb6-449837eef586', 14, 3, 0, 0, 3, 4, 11, 0, NULL, '2025/26', '2025-09-05 18:02:23.000254+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('b3b5b44f-8023-45ef-ae7d-b75323c17116', 'bcb16996-e039-48a8-9a67-f74ccb6e532f', 15, 4, 0, 0, 4, 5, 13, 0, NULL, '2025/26', '2025-09-05 18:02:23.000254+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('cd8f57d1-c146-477a-b7d3-00b5b8a4f90c', '6879c62c-954d-4013-92af-50576e000d36', 16, 3, 0, 0, 3, 4, 22, 0, NULL, '2025/26', '2025-09-05 18:02:23.000254+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('450c2da7-5f87-4ec8-b10b-012a4175ada2', '8774bda3-7e00-4fb4-aa55-3307e374646a', 1, 3, 3, 0, 0, 9, 1, 9, NULL, '2025/26', '2025-09-05 18:02:23.000254+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('486a0b2a-47f8-4294-92d9-c7f30ca626f8', '7a79fc39-65a3-4c15-aa0e-b3d360cd6189', 2, 3, 2, 1, 0, 7, 4, 7, NULL, '2025/26', '2025-09-05 18:02:23.000254+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('2e52eac1-1ff8-43e3-bf18-53a73a132f46', '445f4dbd-eeb3-4eeb-87fb-ecee77d3bac3', 3, 3, 2, 0, 1, 5, 2, 6, NULL, '2025/26', '2025-09-05 18:02:23.000254+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('8b8dbd89-a17b-4df9-b95d-51439824bcaa', 'b221c27a-d23c-4556-9ee0-5ad88b3c09b8', 4, 3, 2, 0, 1, 8, 6, 6, NULL, '2025/26', '2025-09-05 18:02:23.000254+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('6cb2726a-7abe-40c0-bcf0-e1579d3641a0', 'c2d1eaba-0689-450c-b9d0-ccd4de88a2e3', 5, 3, 1, 2, 0, 7, 1, 5, NULL, '2025/26', '2025-09-05 18:02:23.000254+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('4317ab14-2a06-4136-8fe1-98f44db1f9df', 'e84bcd0f-5f0d-43d5-811a-3eb56e1301da', 6, 3, 1, 2, 0, 6, 1, 5, NULL, '2025/26', '2025-09-05 18:02:23.000254+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('03e0fff1-5fd2-487e-90b7-e93e50e6f7f4', 'bfc00294-f28c-4de9-8f17-1e3b4284ca5c', 7, 3, 1, 1, 1, 6, 3, 4, NULL, '2025/26', '2025-09-05 18:02:23.000254+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('09ed16fb-2557-45b0-bac7-4a23ccaefaef', 'dcfe8ff6-49a5-4c0e-ad31-72971d7e94c9', 8, 3, 1, 1, 1, 4, 2, 4, NULL, '2025/26', '2025-09-05 18:02:23.000254+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('0dfe4383-193c-4bbe-adb1-a9525aa4d0ac', '917cecc0-002e-4d86-9ab1-a73cf5583f41', 9, 3, 1, 1, 1, 8, 9, 4, NULL, '2025/26', '2025-09-05 18:02:23.000254+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('0679e819-39b4-421d-acc7-36b4e3d0d5d2', '9c919d3d-0d86-49d9-90b4-821eb0f60aa5', 10, 3, 1, 0, 2, 9, 10, 3, NULL, '2025/26', '2025-09-05 18:02:23.000254+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('1dc5c5cb-5f5a-4872-8a1e-f6ba8bc4592c', '50abe950-0e11-46ad-9326-e59f7c561c94', 11, 3, 1, 0, 2, 6, 10, 3, NULL, '2025/26', '2025-09-05 18:02:23.000254+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('3514afe5-6c61-42ee-9e54-162558904c60', '11d06eb2-1be4-43e6-8153-764b52086bb5', 12, 3, 0, 2, 1, 2, 7, 2, NULL, '2025/26', '2025-09-05 18:02:23.000254+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('7e2aabc1-7bb4-41f6-a669-cdc0d2b82302', '568e99ad-d9e1-4f2d-a517-88d3a725755b', 13, 3, 0, 0, 3, 2, 12, 0, NULL, '2025/26', '2025-09-05 18:02:23.000254+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('bb8a9c0c-4bf4-435a-ac0c-f745d3059440', 'c81ba53f-59ca-4861-b9fa-42784ddc732b', 14, 3, 0, 0, 3, 1, 12, 0, NULL, '2025/26', '2025-09-05 18:02:23.000254+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('4adf139f-0800-47d9-a153-e397731e2cc8', '80ac3bd4-4a57-48a1-98ec-0cd3ec657533', 1, 3, 3, 0, 0, 10, 2, 9, NULL, '2025/26', '2025-09-05 18:02:23.000254+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('f43341bf-6c2e-4b0f-91bb-cf6171f31938', '9a0d2e89-613d-4dfd-975b-0ce590a2fb2a', 2, 2, 2, 0, 0, 15, 1, 6, NULL, '2025/26', '2025-09-05 18:02:23.000254+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('9f3ef55a-4537-43ca-97bb-d63519750f9f', '4d71e1ef-3a25-4b1a-9897-71a3b0fafafd', 3, 3, 2, 0, 1, 11, 2, 6, NULL, '2025/26', '2025-09-05 18:02:23.000254+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('b4af4f0b-71b1-49d2-ab24-a1628e66be12', '9bf9c72d-ce0a-4cf3-a0cc-6a36f484113f', 4, 3, 2, 0, 1, 5, 12, 6, NULL, '2025/26', '2025-09-05 18:02:23.000254+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('7d68b8da-5f44-4389-b1a1-d9a7be6e617a', '579f2d2b-039f-41d3-b391-61da28a1e02f', 5, 1, 1, 0, 0, 4, 3, 3, NULL, '2025/26', '2025-09-05 18:02:23.000254+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('0280fdd7-095a-4cf4-9aa3-90ff0c7e1196', 'e0e7afaa-449b-4299-b6d6-d20b7c58c63d', 6, 3, 0, 1, 2, 3, 5, 1, NULL, '2025/26', '2025-09-05 18:02:23.000254+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('cdf0d959-15b8-4ba4-b262-78d7bbbc6b54', '01600050-5e40-460d-a1a1-40d2ee9bcbc2', 7, 2, 0, 1, 1, 0, 3, 1, NULL, '2025/26', '2025-09-05 18:02:23.000254+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('4ec37d06-351e-4b58-9130-56fd758dda1b', 'f52ad52f-bb65-4531-8cb4-bf76e131f686', 8, 2, 0, 0, 2, 1, 10, 0, NULL, '2025/26', '2025-09-05 18:02:23.000254+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('d1183e8b-072f-480c-a799-c7141d74dcc0', 'b86367ef-883f-4b73-9c98-77e7a0daf8b8', 9, 3, 0, 0, 3, 3, 14, 0, NULL, '2025/26', '2025-09-05 18:02:23.000254+00');


--
-- PostgreSQL database dump complete
--

