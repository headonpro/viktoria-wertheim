-- Sync data for contacts
TRUNCATE TABLE contacts CASCADE;
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
-- Data for Name: contacts; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.contacts (id, role, name, email, phone, order_position, department, is_active, created_at, updated_at) VALUES ('e50e1cbb-1250-41ec-b81b-8cd9502506d2', 'Trainer 1. Mannschaft', 'Alexander Helfenstein', 'sport@viktoria-wertheim.de', NULL, 1, 'sports', true, '2025-09-06 21:09:20.64613+00', '2025-09-06 21:09:20.64613+00');
INSERT INTO public.contacts (id, role, name, email, phone, order_position, department, is_active, created_at, updated_at) VALUES ('c172a89c-7ad5-49d3-a3b1-daff8dde8232', 'Trainer 2. Mannschaft', 'Marcel Eckhardt', 'sport@viktoria-wertheim.de', NULL, 2, 'sports', true, '2025-09-06 21:09:20.64613+00', '2025-09-06 21:09:20.64613+00');
INSERT INTO public.contacts (id, role, name, email, phone, order_position, department, is_active, created_at, updated_at) VALUES ('82a7ed1a-66c1-4f36-8afd-bb32dab5b4da', 'Trainer 3. Mannschaft (SpG)', 'Florian Helfenstein', 'sport@viktoria-wertheim.de', NULL, 3, 'sports', true, '2025-09-06 21:09:20.64613+00', '2025-09-06 21:09:20.64613+00');
INSERT INTO public.contacts (id, role, name, email, phone, order_position, department, is_active, created_at, updated_at) VALUES ('c0e0f25e-cdfd-4c01-8950-d7b1194b05d3', 'Schriftführer', 'Klaus Schmidt', 'info@viktoria-wertheim.de', '09342 / 91237', 999, 'board', true, '2025-08-31 12:11:24.001342+00', '2025-08-31 12:11:24.001342+00');
INSERT INTO public.contacts (id, role, name, email, phone, order_position, department, is_active, created_at, updated_at) VALUES ('ac1389d7-9a55-4373-9dfb-dbef900dcae4', 'Platzwart', 'Stefan Zimmermann', NULL, '09342 / 91241', 999, 'facilities', true, '2025-08-31 12:11:24.001342+00', '2025-08-31 12:11:24.001342+00');
INSERT INTO public.contacts (id, role, name, email, phone, order_position, department, is_active, created_at, updated_at) VALUES ('6e0b453d-e9d2-4707-8556-9616b7468ffe', 'Vereinsheim', 'Maria König', 'vereinsheim@viktoria-wertheim.de', '09342 / 91242', 999, 'facilities', true, '2025-08-31 12:11:24.001342+00', '2025-08-31 12:11:24.001342+00');
INSERT INTO public.contacts (id, role, name, email, phone, order_position, department, is_active, created_at, updated_at) VALUES ('bd8ff286-8c1a-4c32-b78f-b156cade8682', 'Pressewart', 'Robert Schäfer', 'presse@viktoria-wertheim.de', '0174 / 4567890', 999, 'general', true, '2025-08-31 12:11:24.001342+00', '2025-08-31 12:11:24.001342+00');
INSERT INTO public.contacts (id, role, name, email, phone, order_position, department, is_active, created_at, updated_at) VALUES ('d13243f7-26ff-4b44-a896-162e3717feae', 'Social Media', 'Julia Meyer', 'social@viktoria-wertheim.de', NULL, 999, 'general', true, '2025-08-31 12:11:24.001342+00', '2025-08-31 12:11:24.001342+00');
INSERT INTO public.contacts (id, role, name, email, phone, order_position, department, is_active, created_at, updated_at) VALUES ('5e3e3a97-500a-4377-9c5b-9ddad1f791dd', '1. Vorsitzender', 'Michael Schneider', 'vorsitzender@viktoria-wertheim.de', '09342 / 91234', 999, 'board', true, '2025-08-31 12:11:24.001342+00', '2025-08-31 12:11:24.001342+00');
INSERT INTO public.contacts (id, role, name, email, phone, order_position, department, is_active, created_at, updated_at) VALUES ('f8728bb9-13b3-4bb3-a453-0226c4dfb9cf', 'Jugendbeauftragter', 'Christian Först', 'jugend@viktoria-wertheim.de', '09342 / 91240', 999, 'youth', true, '2025-08-31 12:11:24.001342+00', '2025-09-06 21:19:04.322282+00');
INSERT INTO public.contacts (id, role, name, email, phone, order_position, department, is_active, created_at, updated_at) VALUES ('c78425f8-4847-4a62-9ae9-20cda63ea309', '2. Vorsitzender', 'Thomas Weber', 'stellvertreter@viktoria-wertheim.de', '09342 / 91235', 999, 'board', true, '2025-08-31 12:11:24.001342+00', '2025-08-31 12:11:24.001342+00');
INSERT INTO public.contacts (id, role, name, email, phone, order_position, department, is_active, created_at, updated_at) VALUES ('862204f6-0c09-47fd-8d5e-16390c767289', 'Kassenwart', 'Sandra Müller', 'kasse@viktoria-wertheim.de', '09342 / 91236', 999, 'finance', true, '2025-08-31 12:11:24.001342+00', '2025-08-31 12:11:24.001342+00');


--
-- PostgreSQL database dump complete
--

