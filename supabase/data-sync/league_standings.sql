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

INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('b85b7f5b-d016-4c12-8846-536553dec451', '568e99ad-d9e1-4f2d-a517-88d3a725755b', 13, 3, 0, 0, 3, 2, 12, 0, NULL, '2025/26', '2025-09-05 15:34:28.297689+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('56c5b494-16c3-4df2-a836-e9cb4d222605', '7a79fc39-65a3-4c15-aa0e-b3d360cd6189', 1, 3, 3, 1, 0, 10, 6, 10, NULL, '2025/26', '2025-09-05 15:34:28.297689+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('fe70e182-aebf-46c8-bdfa-0393e26b6b92', 'dcfe8ff6-49a5-4c0e-ad31-72971d7e94c9', 4, 3, 2, 1, 1, 7, 2, 7, NULL, '2025/26', '2025-09-05 15:34:28.297689+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('ba633e67-4796-4b50-ae1d-2e263e2853f7', 'b86367ef-883f-4b73-9c98-77e7a0daf8b8', 9, 3, 0, 0, 3, 3, 14, 0, NULL, '2025/26', '2025-09-05 15:29:38.259995+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('7a218d05-261f-481e-90aa-fc3fc1990c61', '4cb0373a-86a1-44de-a19f-7afb6d8cdebd', 1, 4, 3, 1, 0, 13, 5, 10, NULL, '2025/26', '2025-09-05 15:29:38.259995+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('ed1a7166-fd63-488b-9401-1a384322200e', 'c2d1eaba-0689-450c-b9d0-ccd4de88a2e3', 3, 3, 2, 2, 0, 13, 1, 8, NULL, '2025/26', '2025-09-05 15:34:28.297689+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('6c3924ca-08cb-4949-a4c9-7124430d2c65', '8774bda3-7e00-4fb4-aa55-3307e374646a', 2, 3, 3, 0, 0, 9, 1, 9, NULL, '2025/26', '2025-09-05 15:34:28.297689+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('e18c9881-41dc-46f4-86b3-6cb001832ff8', '445f4dbd-eeb3-4eeb-87fb-ecee77d3bac3', 5, 3, 2, 0, 1, 5, 2, 6, NULL, '2025/26', '2025-09-05 15:34:28.297689+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('219ce48e-ecaf-4f40-b397-76b4120e79ec', 'b221c27a-d23c-4556-9ee0-5ad88b3c09b8', 6, 3, 2, 0, 1, 8, 6, 6, NULL, '2025/26', '2025-09-05 15:34:28.297689+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('9436a162-aeb4-4c9d-a67a-9f859216306f', 'e84bcd0f-5f0d-43d5-811a-3eb56e1301da', 7, 3, 1, 2, 0, 6, 1, 5, NULL, '2025/26', '2025-09-05 15:34:28.297689+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('6018765c-03f8-41c1-bf9e-486d407c9af8', 'bfc00294-f28c-4de9-8f17-1e3b4284ca5c', 8, 3, 1, 1, 1, 6, 3, 4, NULL, '2025/26', '2025-09-05 15:34:28.297689+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('a86c1a14-d07a-4317-b6d1-ae9aeedd9dfb', '917cecc0-002e-4d86-9ab1-a73cf5583f41', 9, 3, 1, 1, 1, 8, 9, 4, NULL, '2025/26', '2025-09-05 15:34:28.297689+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('41185998-d9c7-4ede-ae10-0cd5b3899847', '9c919d3d-0d86-49d9-90b4-821eb0f60aa5', 10, 3, 1, 0, 2, 9, 10, 3, NULL, '2025/26', '2025-09-05 15:34:28.297689+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('86a8f8f1-4a4d-45c6-a91e-2163ce171838', '50abe950-0e11-46ad-9326-e59f7c561c94', 11, 3, 1, 0, 2, 6, 10, 3, NULL, '2025/26', '2025-09-05 15:34:28.297689+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('86fb272f-6d1c-4f04-942f-de50dceb684d', '11d06eb2-1be4-43e6-8153-764b52086bb5', 12, 3, 0, 2, 1, 2, 7, 2, NULL, '2025/26', '2025-09-05 15:34:28.297689+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('07c9b0a8-ed6f-4413-8e6b-43304d1d689f', 'c81ba53f-59ca-4861-b9fa-42784ddc732b', 14, 3, 0, 0, 3, 1, 12, 0, NULL, '2025/26', '2025-09-05 15:34:28.297689+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('2a568e6c-5fca-4858-9928-88315f372dac', '973aa8c2-4901-47b1-9b51-6aae5168d2fc', 2, 4, 3, 1, 0, 11, 4, 10, NULL, '2025/26', '2025-09-05 15:29:38.259995+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('f408a20d-088d-4007-9262-13038cd53acd', 'd78d0ef6-9385-4d6c-b318-fdba356aadfc', 3, 4, 3, 1, 0, 8, 3, 10, NULL, '2025/26', '2025-09-05 15:29:38.259995+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('d781382a-8308-4459-b738-0812b4b58645', 'b7719b48-7f84-4e9e-a8b1-f54d59d886ab', 4, 4, 2, 1, 1, 13, 5, 7, NULL, '2025/26', '2025-09-05 15:29:38.259995+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('8b0e77a6-d541-4fd7-ba4a-0669667e7353', '6afef842-87b5-4609-a033-04b665539dac', 5, 4, 2, 1, 1, 6, 4, 7, NULL, '2025/26', '2025-09-05 15:29:38.259995+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('dd2a3f9e-0c5f-4784-980d-6bfec085dac8', '124a11ec-bcd1-4173-954f-35e25c375de4', 6, 4, 2, 0, 2, 14, 11, 6, NULL, '2025/26', '2025-09-05 15:29:38.259995+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('3816a86b-e936-4688-b8bc-943beb9b5897', 'cc4cee49-d32b-4864-b7e9-37dada8c3185', 7, 3, 2, 0, 1, 7, 4, 6, NULL, '2025/26', '2025-09-05 15:29:38.259995+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('23975876-688c-41eb-bd4c-7b813a906cf0', 'd5162c49-76b0-4cb8-afdd-dee5b1b5478d', 8, 4, 2, 0, 2, 10, 8, 6, NULL, '2025/26', '2025-09-05 15:29:38.259995+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('c1ab4a5a-1572-4ef1-a184-5e9d7b7a8e52', '00c6158e-ff2e-4913-b6b2-1e624ef9004b', 9, 3, 1, 2, 0, 4, 3, 5, NULL, '2025/26', '2025-09-05 15:29:38.259995+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('8dbea2fe-fb1b-4e41-b033-1615127f585b', 'ea1b5c7e-aaaa-416a-8898-9a982f1cb76c', 10, 4, 1, 2, 1, 5, 6, 5, NULL, '2025/26', '2025-09-05 15:29:38.259995+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('3d30c9bb-0fdb-4953-adb2-31dcaca66c38', '229cb117-471a-4bcc-b60e-d73772738943', 11, 4, 1, 1, 2, 8, 9, 4, NULL, '2025/26', '2025-09-05 15:29:38.259995+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('97510fb4-5960-4f1e-ad13-2693d2ba8cc8', 'bd6dea97-0257-49fd-89d9-317db8770b5d', 12, 4, 1, 1, 2, 6, 7, 4, NULL, '2025/26', '2025-09-05 15:29:38.259995+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('82d90e11-afb9-4683-9acc-5d48888b4571', 'e5d8b585-f0db-4412-b206-f18bca7d3cfa', 13, 4, 1, 1, 2, 5, 8, 4, NULL, '2025/26', '2025-09-05 15:29:38.259995+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('136c1cbd-4024-47ef-8d7e-8520971d6585', '1f14dfef-d703-443f-8fb6-449837eef586', 14, 3, 0, 0, 3, 4, 11, 0, NULL, '2025/26', '2025-09-05 15:29:38.259995+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('a527cf47-c0d1-4648-afac-f46a089bcbd5', 'bcb16996-e039-48a8-9a67-f74ccb6e532f', 15, 4, 0, 0, 4, 5, 13, 0, NULL, '2025/26', '2025-09-05 15:29:38.259995+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('72dd223f-76d3-4701-996c-4ea6d3cf86eb', '6879c62c-954d-4013-92af-50576e000d36', 16, 3, 0, 0, 3, 4, 22, 0, NULL, '2025/26', '2025-09-05 15:29:38.259995+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('f6416448-0c53-4477-9074-3992055adb28', '80ac3bd4-4a57-48a1-98ec-0cd3ec657533', 1, 3, 3, 0, 0, 10, 2, 9, NULL, '2025/26', '2025-09-05 15:29:38.259995+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('0f88328e-b5c5-442f-8428-b13abf3e4541', '9a0d2e89-613d-4dfd-975b-0ce590a2fb2a', 2, 2, 2, 0, 0, 15, 1, 6, NULL, '2025/26', '2025-09-05 15:29:38.259995+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('3051b5eb-5db7-47ab-871f-ce1830fe2dbe', '4d71e1ef-3a25-4b1a-9897-71a3b0fafafd', 3, 3, 2, 0, 1, 11, 2, 6, NULL, '2025/26', '2025-09-05 15:29:38.259995+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('9e7afec4-178d-4082-8437-6be83846073c', '9bf9c72d-ce0a-4cf3-a0cc-6a36f484113f', 4, 3, 2, 0, 1, 5, 12, 6, NULL, '2025/26', '2025-09-05 15:29:38.259995+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('91b4eb0a-afb4-4376-8a69-bb7c8969674d', '579f2d2b-039f-41d3-b391-61da28a1e02f', 5, 1, 1, 0, 0, 4, 3, 3, NULL, '2025/26', '2025-09-05 15:29:38.259995+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('47fdaa49-d405-4c65-ba5f-45dbf1572283', 'e0e7afaa-449b-4299-b6d6-d20b7c58c63d', 6, 3, 0, 1, 2, 3, 5, 1, NULL, '2025/26', '2025-09-05 15:29:38.259995+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('0ea83815-ca75-4bbd-86d3-64ede5a56001', '01600050-5e40-460d-a1a1-40d2ee9bcbc2', 7, 2, 0, 1, 1, 0, 3, 1, NULL, '2025/26', '2025-09-05 15:29:38.259995+00');
INSERT INTO public.league_standings (id, team_id, "position", played, won, drawn, lost, goals_for, goals_against, points, trend, season, updated_at) VALUES ('7cd2b00d-f878-4083-ae2a-3d276b692f35', 'f52ad52f-bb65-4531-8cb4-bf76e131f686', 8, 2, 0, 0, 2, 1, 10, 0, NULL, '2025/26', '2025-09-05 15:29:38.259995+00');


--
-- PostgreSQL database dump complete
--

