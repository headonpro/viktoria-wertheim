-- Sync data for newsletter_subscribers
TRUNCATE TABLE newsletter_subscribers CASCADE;
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
-- Data for Name: newsletter_subscribers; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.newsletter_subscribers (id, email, is_active, subscribed_at, unsubscribed_at) VALUES ('ea2c4d61-e5b6-4a0f-adad-057f28f3740f', 'fan1@example.com', true, '2025-08-30 13:51:25.510737+00', NULL);
INSERT INTO public.newsletter_subscribers (id, email, is_active, subscribed_at, unsubscribed_at) VALUES ('86d6acb2-4e15-4ae9-9920-254de698b511', 'mitglied@viktoria-wertheim.de', true, '2025-08-30 13:51:25.510737+00', NULL);
INSERT INTO public.newsletter_subscribers (id, email, is_active, subscribed_at, unsubscribed_at) VALUES ('68f3e138-d65a-4d7d-8df8-77abe30e5386', 'supporter@gmail.com', true, '2025-08-30 13:51:25.510737+00', NULL);


--
-- PostgreSQL database dump complete
--

