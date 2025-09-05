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

INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('70f1763d-5dba-4624-8cd9-6cc2c10af807', 'd78d0ef6-9385-4d6c-b318-fdba356aadfc', 2, 4, 3, 1, 0, 21, 3, 10, NULL, '2025/26', '2025-09-05 17:16:01.49286+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('df4ec0a9-766e-4cb1-84ce-1e7a6a188a08', 'b7719b48-7f84-4e9e-a8b1-f54d59d886ab', 3, 4, 3, 0, 1, 13, 5, 9, NULL, '2025/26', '2025-09-05 17:16:01.49286+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('83312f8e-ba69-479b-9121-0bafe6879f5f', '6afef842-87b5-4609-a033-04b665539dac', 4, 4, 3, 0, 0, 10, 5, 9, NULL, '2025/26', '2025-09-05 17:16:01.49286+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('7f4b6113-73ec-4905-86ee-bb99df315de6', '124a11ec-bcd1-4173-954f-35e25c375de4', 99, 4, 0, 0, 0, 0, 0, 0, NULL, '2025/26', '2025-09-05 17:16:01.49286+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('3aedde4e-5a38-460b-ad76-74fb7248d18e', '12894fca-7337-4202-986a-41d6c92ba7c8', 5, 4, 2, 1, 1, 6, 7, 7, NULL, '2025/26', '2025-09-05 17:16:01.49286+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('486f51a4-58af-426a-9fe3-d0bfb3109337', '4cb0373a-86a1-44de-a19f-7afb6d8cdebd', 16, 4, 0, 0, 3, 2, 16, 0, NULL, '2025/26', '2025-09-05 17:16:01.49286+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('20c48eb3-76f9-4fe2-bb61-5c23fddb57cb', '973aa8c2-4901-47b1-9b51-6aae5168d2fc', 1, 4, 4, 0, 0, 15, 2, 12, NULL, '2025/26', '2025-09-05 17:16:01.49286+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('b62db2bd-4d3e-4b6b-9a92-05e6c42a358d', 'cc4cee49-d32b-4864-b7e9-37dada8c3185', 6, 4, 2, 0, 1, 10, 4, 6, NULL, '2025/26', '2025-09-05 17:16:01.49286+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('7ae12d39-b785-49f3-9d6b-784652885893', 'd5162c49-76b0-4cb8-afdd-dee5b1b5478d', 7, 4, 1, 2, 1, 8, 9, 5, NULL, '2025/26', '2025-09-05 17:16:01.49286+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('cd09ee2f-18b4-48f1-b3d6-c702fbffa496', '00c6158e-ff2e-4913-b6b2-1e624ef9004b', 8, 4, 1, 1, 2, 9, 11, 4, NULL, '2025/26', '2025-09-05 17:16:01.49286+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('948803e1-da78-4f9b-b352-764227d28d8d', 'ea1b5c7e-aaaa-416a-8898-9a982f1cb76c', 9, 4, 1, 1, 2, 5, 9, 4, NULL, '2025/26', '2025-09-05 17:16:01.49286+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('0ae669ff-d350-4b72-b87e-903db9d68a85', '229cb117-471a-4bcc-b60e-d73772738943', 11, 3, 1, 1, 1, 4, 5, 4, NULL, '2025/26', '2025-09-05 17:16:01.49286+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('aa7d3f43-62d0-4eb4-8fc3-8344a0386c32', 'bd6dea97-0257-49fd-89d9-317db8770b5d', 10, 4, 1, 1, 1, 6, 11, 4, NULL, '2025/26', '2025-09-05 17:16:01.49286+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('0b346cbc-e50b-4937-9d98-bbf4de3c321e', 'e5d8b585-f0db-4412-b206-f18bca7d3cfa', 12, 4, 1, 0, 2, 3, 6, 3, NULL, '2025/26', '2025-09-05 17:16:01.49286+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('73496821-0dc3-4ae1-931b-08bef3bbd0d1', '1f14dfef-d703-443f-8fb6-449837eef586', 13, 4, 0, 1, 3, 7, 14, 1, NULL, '2025/26', '2025-09-05 17:16:01.49286+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('bc8641b6-4766-45e0-a7e1-4f35996e740e', 'bcb16996-e039-48a8-9a67-f74ccb6e532f', 14, 4, 0, 1, 3, 5, 16, 1, NULL, '2025/26', '2025-09-05 17:16:01.49286+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('f60191ac-9133-4d0c-86db-eb93c7689d02', '6879c62c-954d-4013-92af-50576e000d36', 15, 4, 0, 0, 4, 3, 13, 0, NULL, '2025/26', '2025-09-05 17:16:01.49286+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('a0dccb86-9c94-4ffd-841d-081f5651c04b', '11d06eb2-1be4-43e6-8153-764b52086bb5', 99, 0, 0, 0, 0, 0, 0, 0, NULL, '2025/26', '2025-09-05 17:16:01.49286+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('c6e05aa7-1222-4fec-b8ce-c3b8150774cf', '568e99ad-d9e1-4f2d-a517-88d3a725755b', 99, 0, 0, 0, 0, 0, 0, 0, NULL, '2025/26', '2025-09-05 17:16:01.49286+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('f02cb292-b43c-4413-a03a-a648eda437d3', '445f4dbd-eeb3-4eeb-87fb-ecee77d3bac3', 99, 0, 0, 0, 0, 0, 0, 0, NULL, '2025/26', '2025-09-05 17:16:01.49286+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('5d503c6e-fcce-43f5-b40c-e440dfead278', 'b221c27a-d23c-4556-9ee0-5ad88b3c09b8', 99, 0, 0, 0, 0, 0, 0, 0, NULL, '2025/26', '2025-09-05 17:16:01.49286+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('e8e57995-ab77-4665-872a-4a581753bdbf', 'c2d1eaba-0689-450c-b9d0-ccd4de88a2e3', 99, 0, 0, 0, 0, 0, 0, 0, NULL, '2025/26', '2025-09-05 17:16:01.49286+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('81dd566d-cc08-460d-b6a6-cd43bbeb7ded', 'e84bcd0f-5f0d-43d5-811a-3eb56e1301da', 99, 0, 0, 0, 0, 0, 0, 0, NULL, '2025/26', '2025-09-05 17:16:01.49286+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('5e7d1fc2-b710-4256-83c5-f8c697fdbadf', 'bfc00294-f28c-4de9-8f17-1e3b4284ca5c', 99, 0, 0, 0, 0, 0, 0, 0, NULL, '2025/26', '2025-09-05 17:16:01.49286+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('3febc7f0-f24f-4966-83a1-2029b959ea11', 'dcfe8ff6-49a5-4c0e-ad31-72971d7e94c9', 99, 0, 0, 0, 0, 0, 0, 0, NULL, '2025/26', '2025-09-05 17:16:01.49286+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('5c6eb9da-8c42-49f0-8078-31f86a28ae07', '917cecc0-002e-4d86-9ab1-a73cf5583f41', 99, 0, 0, 0, 0, 0, 0, 0, NULL, '2025/26', '2025-09-05 17:16:01.49286+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('7589abc8-6075-4e32-8d59-13b11da2ae96', '9c919d3d-0d86-49d9-90b4-821eb0f60aa5', 99, 0, 0, 0, 0, 0, 0, 0, NULL, '2025/26', '2025-09-05 17:16:01.49286+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('e9e26ee2-8c06-4a03-9edb-5e5457a3dd1b', '50abe950-0e11-46ad-9326-e59f7c561c94', 99, 0, 0, 0, 0, 0, 0, 0, NULL, '2025/26', '2025-09-05 17:16:01.49286+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('afe3e0ba-c14c-4bc3-acf8-2fca25cfc44b', 'c81ba53f-59ca-4861-b9fa-42784ddc732b', 99, 0, 0, 0, 0, 0, 0, 0, NULL, '2025/26', '2025-09-05 17:16:01.49286+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('65ce5e3d-7dc2-4fa1-a439-618aa645d0bf', '7a79fc39-65a3-4c15-aa0e-b3d360cd6189', 10, 0, 0, 0, 0, 0, 0, 0, NULL, '2025/26', '2025-09-05 17:16:01.49286+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('5f432037-9f55-4b16-b932-5e566685808e', '8774bda3-7e00-4fb4-aa55-3307e374646a', 11, 0, 0, 0, 0, 0, 0, 0, NULL, '2025/26', '2025-09-05 17:16:01.49286+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('9799c2d1-9f16-46b1-ad3e-95ac60a8a04e', '80ac3bd4-4a57-48a1-98ec-0cd3ec657533', 99, 0, 0, 0, 0, 0, 0, 0, NULL, '2025/26', '2025-09-05 17:16:01.49286+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('68a84cc7-7b95-48dd-ba4b-daa907c52c21', '9a0d2e89-613d-4dfd-975b-0ce590a2fb2a', 99, 0, 0, 0, 0, 0, 0, 0, NULL, '2025/26', '2025-09-05 17:16:01.49286+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('aa753d92-9c33-4f7c-9694-af6be085778f', '4d71e1ef-3a25-4b1a-9897-71a3b0fafafd', 99, 0, 0, 0, 0, 0, 0, 0, NULL, '2025/26', '2025-09-05 17:16:01.49286+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('5fd0285b-e898-478d-8f49-fbe0b769b98c', '9bf9c72d-ce0a-4cf3-a0cc-6a36f484113f', 99, 0, 0, 0, 0, 0, 0, 0, NULL, '2025/26', '2025-09-05 17:16:01.49286+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('1eb9feaa-3e2f-4ee2-9336-066fda32a578', '579f2d2b-039f-41d3-b391-61da28a1e02f', 99, 0, 0, 0, 0, 0, 0, 0, NULL, '2025/26', '2025-09-05 17:16:01.49286+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('a8728168-030e-4112-ac79-3674c2846ac6', 'e0e7afaa-449b-4299-b6d6-d20b7c58c63d', 99, 0, 0, 0, 0, 0, 0, 0, NULL, '2025/26', '2025-09-05 17:16:01.49286+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('3e28ed1f-d4a2-45b7-8c53-a4f4f60f7f5a', '01600050-5e40-460d-a1a1-40d2ee9bcbc2', 99, 0, 0, 0, 0, 0, 0, 0, NULL, '2025/26', '2025-09-05 17:16:01.49286+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('6ada84e4-5deb-42e3-b3a7-857df504da58', 'f52ad52f-bb65-4531-8cb4-bf76e131f686', 99, 0, 0, 0, 0, 0, 0, 0, NULL, '2025/26', '2025-09-05 17:16:01.49286+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('b2cbaba4-1bb5-4f48-a1fe-c7860dafea18', 'b86367ef-883f-4b73-9c98-77e7a0daf8b8', 99, 0, 0, 0, 0, 0, 0, 0, NULL, '2025/26', '2025-09-05 17:16:01.49286+00');


--
-- PostgreSQL database dump complete
--

