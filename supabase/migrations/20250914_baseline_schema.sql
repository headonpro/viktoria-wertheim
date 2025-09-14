-- Baseline Migration: Complete Schema from Production
-- Created: 2025-09-14
-- This migration represents the current production state

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Teams table (core entity)
CREATE TABLE IF NOT EXISTS public.teams (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name character varying NOT NULL UNIQUE,
    short_name character varying,
    league character varying,
    coach character varying,
    captain character varying,
    training_schedule text,
    season character varying DEFAULT '2023/24'::character varying NOT NULL,
    team_type character varying NOT NULL CHECK (team_type::text = ANY (ARRAY['first'::character varying::text, 'second'::character varying::text, 'third'::character varying::text, 'youth'::character varying::text])),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    is_own_team boolean DEFAULT false
);

-- Players table
CREATE TABLE IF NOT EXISTS public.players (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    team_id uuid REFERENCES public.teams(id),
    name character varying NOT NULL,
    number integer,
    position character varying,
    age integer,
    is_captain boolean DEFAULT false,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Matches table
CREATE TABLE IF NOT EXISTS public.matches (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    home_team character varying NOT NULL,
    away_team character varying NOT NULL,
    home_team_id uuid REFERENCES public.teams(id),
    away_team_id uuid REFERENCES public.teams(id),
    home_score integer,
    away_score integer,
    match_date date NOT NULL,
    match_time time without time zone,
    location character varying,
    match_type character varying DEFAULT 'league'::character varying,
    status character varying DEFAULT 'scheduled'::character varying CHECK (status::text = ANY (ARRAY['scheduled'::character varying::text, 'live'::character varying::text, 'completed'::character varying::text, 'cancelled'::character varying::text])),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    season character varying DEFAULT '2025/26'::character varying
);

-- Match events table
CREATE TABLE IF NOT EXISTS public.match_events (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    match_id uuid REFERENCES public.matches(id),
    player_id uuid REFERENCES public.players(id),
    team_id uuid REFERENCES public.teams(id),
    event_type character varying NOT NULL,
    event_time integer,
    description text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- League standings table
CREATE TABLE IF NOT EXISTS public.league_standings (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    team_id uuid REFERENCES public.teams(id),
    position integer NOT NULL,
    played integer DEFAULT 0,
    won integer DEFAULT 0,
    drawn integer DEFAULT 0,
    lost integer DEFAULT 0,
    goals_for integer DEFAULT 0,
    goals_against integer DEFAULT 0,
    goal_difference integer GENERATED ALWAYS AS (goals_for - goals_against) STORED,
    points integer DEFAULT 0,
    trend character varying CHECK (trend::text = ANY (ARRAY['up'::character varying::text, 'down'::character varying::text, 'neutral'::character varying::text])),
    season character varying DEFAULT '2023/24'::character varying,
    updated_at timestamp with time zone DEFAULT now()
);

-- Scorers table
CREATE TABLE IF NOT EXISTS public.scorers (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    player_id uuid,
    player_name character varying NOT NULL,
    team_id uuid REFERENCES public.teams(id),
    team_name character varying,
    goals integer DEFAULT 0,
    assists integer DEFAULT 0,
    season character varying DEFAULT '2023/24'::character varying,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Team form table
CREATE TABLE IF NOT EXISTS public.team_form (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    team_id uuid REFERENCES public.teams(id),
    season character varying DEFAULT '2025/26'::character varying,
    form_string character varying,
    form_points integer DEFAULT 0,
    recent_goals_for integer DEFAULT 0,
    recent_goals_against integer DEFAULT 0,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- News table
CREATE TABLE IF NOT EXISTS public.news (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    title character varying NOT NULL,
    excerpt text,
    content text,
    image_url text,
    views integer DEFAULT 0,
    published_at timestamp with time zone DEFAULT now(),
    category character varying CHECK (category::text = ANY (ARRAY['match_report'::character varying::text, 'transfers'::character varying::text, 'youth'::character varying::text, 'training'::character varying::text, 'club_news'::character varying::text, 'general'::character varying::text])),
    is_featured boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- News templates table
CREATE TABLE IF NOT EXISTS public.news_templates (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    template_type character varying NOT NULL,
    title_template text NOT NULL,
    content_template text NOT NULL,
    conditions jsonb,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- Content generation log table
CREATE TABLE IF NOT EXISTS public.content_generation_log (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    trigger_type character varying NOT NULL,
    trigger_data jsonb,
    generated_content_type character varying,
    generated_content_id uuid,
    status character varying DEFAULT 'pending'::character varying,
    error_message text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- Contacts table
CREATE TABLE IF NOT EXISTS public.contacts (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    role character varying NOT NULL,
    name character varying NOT NULL UNIQUE,
    email character varying,
    phone character varying,
    order_position integer DEFAULT 999 NOT NULL,
    department character varying CHECK (department::text = ANY (ARRAY['general'::character varying::text, 'board'::character varying::text, 'sports'::character varying::text, 'youth'::character varying::text, 'finance'::character varying::text, 'facilities'::character varying::text])),
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Sponsors table
CREATE TABLE IF NOT EXISTS public.sponsors (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name character varying NOT NULL,
    logo_url text,
    website text,
    category character varying CHECK (category::text = ANY (ARRAY['Hauptsponsor'::character varying::text, 'Premium Partner'::character varying::text, 'Partner'::character varying::text, 'Förderer'::character varying::text])),
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Newsletter subscribers table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    email character varying NOT NULL,
    is_active boolean DEFAULT true,
    subscribed_at timestamp with time zone DEFAULT now(),
    unsubscribed_at timestamp with time zone
);

-- Newsletter history table
CREATE TABLE IF NOT EXISTS public.newsletter_history (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    subject character varying NOT NULL,
    content text NOT NULL,
    sent_by character varying,
    recipient_count integer DEFAULT 0,
    sent_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);

-- Youth teams table
CREATE TABLE IF NOT EXISTS public.youth_teams (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name character varying NOT NULL,
    league character varying,
    coach character varying,
    player_count integer DEFAULT 0,
    age_group character varying,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Schema migrations table
CREATE TABLE IF NOT EXISTS public.schema_migrations (
    version character varying PRIMARY KEY,
    applied_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    checksum character varying,
    description text
);

-- Create view for contacts by department
CREATE OR REPLACE VIEW public.contacts_by_department AS
SELECT * FROM public.contacts
WHERE is_active = true
ORDER BY department, order_position, name;

-- Enable RLS on all tables
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.league_standings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scorers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_form ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_generation_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.youth_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schema_migrations ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies for public read access
CREATE POLICY "Allow public read" ON public.teams FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON public.players FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON public.matches FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON public.league_standings FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON public.scorers FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON public.news FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON public.contacts FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON public.sponsors FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON public.youth_teams FOR SELECT USING (true);

-- Comments
COMMENT ON TABLE public.teams IS 'Team metadata only. Statistics are maintained in league_standings table.';
COMMENT ON TABLE public.league_standings IS 'Single source of truth for all team statistics, positions, and league-related data.';
COMMENT ON TABLE public.matches IS 'Optimized indexes on 2025-01-14 - removed unused indexes based on Supabase advisor recommendations';
COMMENT ON TABLE public.news IS 'News articles table with primary key restored after data-sync issue';
COMMENT ON TABLE public.newsletter_subscribers IS 'Newsletter subscriber list with consolidated RLS policies for improved performance';
COMMENT ON TABLE public.newsletter_history IS 'Tracks the history of sent newsletters';
COMMENT ON COLUMN public.teams.is_own_team IS 'Indicates if this team belongs to our club (true) or is an opponent team (false)';