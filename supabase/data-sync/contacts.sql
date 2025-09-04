-- Sync data for contacts
TRUNCATE TABLE contacts CASCADE;
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
-- Data for Name: contacts; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.contacts (id, role, name, email, phone, order_position, department, is_active, created_at, updated_at) VALUES ('5e3e3a97-500a-4377-9c5b-9ddad1f791dd', '1. Vorsitzender', 'Michael Schneider', 'vorsitzender@viktoria-wertheim.de', '09342 / 91234', 999, 'board', true, '2025-08-31 12:11:24.001342+00', '2025-08-31 12:11:24.001342+00');
INSERT INTO public.contacts (id, role, name, email, phone, order_position, department, is_active, created_at, updated_at) VALUES ('c78425f8-4847-4a62-9ae9-20cda63ea309', '2. Vorsitzender', 'Thomas Weber', 'stellvertreter@viktoria-wertheim.de', '09342 / 91235', 999, 'board', true, '2025-08-31 12:11:24.001342+00', '2025-08-31 12:11:24.001342+00');
INSERT INTO public.contacts (id, role, name, email, phone, order_position, department, is_active, created_at, updated_at) VALUES ('862204f6-0c09-47fd-8d5e-16390c767289', 'Kassenwart', 'Sandra Müller', 'kasse@viktoria-wertheim.de', '09342 / 91236', 999, 'finance', true, '2025-08-31 12:11:24.001342+00', '2025-08-31 12:11:24.001342+00');
INSERT INTO public.contacts (id, role, name, email, phone, order_position, department, is_active, created_at, updated_at) VALUES ('c0e0f25e-cdfd-4c01-8950-d7b1194b05d3', 'Schriftführer', 'Klaus Schmidt', 'info@viktoria-wertheim.de', '09342 / 91237', 999, 'board', true, '2025-08-31 12:11:24.001342+00', '2025-08-31 12:11:24.001342+00');
INSERT INTO public.contacts (id, role, name, email, phone, order_position, department, is_active, created_at, updated_at) VALUES ('96a8eb84-8bbb-4062-afd6-1e0c641807a1', 'Sportlicher Leiter', 'Jürgen Fischer', 'sport@viktoria-wertheim.de', '09342 / 91238', 999, 'sports', true, '2025-08-31 12:11:24.001342+00', '2025-08-31 12:11:24.001342+00');
INSERT INTO public.contacts (id, role, name, email, phone, order_position, department, is_active, created_at, updated_at) VALUES ('9d8b4c3e-9e1a-4299-bd9d-9b6479e4926b', 'Trainer 1. Mannschaft', 'Frank Wagner', NULL, '0171 / 1234567', 999, 'sports', true, '2025-08-31 12:11:24.001342+00', '2025-08-31 12:11:24.001342+00');
INSERT INTO public.contacts (id, role, name, email, phone, order_position, department, is_active, created_at, updated_at) VALUES ('d71f43a9-29ae-45d8-bb6b-717842045b18', 'Trainer 2. Mannschaft', 'Peter Bauer', NULL, '0172 / 2345678', 999, 'sports', true, '2025-08-31 12:11:24.001342+00', '2025-08-31 12:11:24.001342+00');
INSERT INTO public.contacts (id, role, name, email, phone, order_position, department, is_active, created_at, updated_at) VALUES ('0dafd541-f9c1-49fc-9b37-01a534f253f0', 'Trainer 3. Mannschaft', 'Markus Klein', NULL, '0173 / 3456789', 999, 'sports', true, '2025-08-31 12:11:24.001342+00', '2025-08-31 12:11:24.001342+00');
INSERT INTO public.contacts (id, role, name, email, phone, order_position, department, is_active, created_at, updated_at) VALUES ('f8728bb9-13b3-4bb3-a453-0226c4dfb9cf', 'Jugendleiterin', 'Lisa Hoffmann', 'jugend@viktoria-wertheim.de', '09342 / 91240', 999, 'youth', true, '2025-08-31 12:11:24.001342+00', '2025-08-31 12:11:24.001342+00');
INSERT INTO public.contacts (id, role, name, email, phone, order_position, department, is_active, created_at, updated_at) VALUES ('ac1389d7-9a55-4373-9dfb-dbef900dcae4', 'Platzwart', 'Stefan Zimmermann', NULL, '09342 / 91241', 999, 'facilities', true, '2025-08-31 12:11:24.001342+00', '2025-08-31 12:11:24.001342+00');
INSERT INTO public.contacts (id, role, name, email, phone, order_position, department, is_active, created_at, updated_at) VALUES ('6e0b453d-e9d2-4707-8556-9616b7468ffe', 'Vereinsheim', 'Maria König', 'vereinsheim@viktoria-wertheim.de', '09342 / 91242', 999, 'facilities', true, '2025-08-31 12:11:24.001342+00', '2025-08-31 12:11:24.001342+00');
INSERT INTO public.contacts (id, role, name, email, phone, order_position, department, is_active, created_at, updated_at) VALUES ('bd8ff286-8c1a-4c32-b78f-b156cade8682', 'Pressewart', 'Robert Schäfer', 'presse@viktoria-wertheim.de', '0174 / 4567890', 999, 'general', true, '2025-08-31 12:11:24.001342+00', '2025-08-31 12:11:24.001342+00');
INSERT INTO public.contacts (id, role, name, email, phone, order_position, department, is_active, created_at, updated_at) VALUES ('d13243f7-26ff-4b44-a896-162e3717feae', 'Social Media', 'Julia Meyer', 'social@viktoria-wertheim.de', NULL, 999, 'general', true, '2025-08-31 12:11:24.001342+00', '2025-08-31 12:11:24.001342+00');


--
-- PostgreSQL database dump complete
--

