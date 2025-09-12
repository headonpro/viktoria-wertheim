-- Fix Security Issues identified by Supabase Linter
-- Date: 2025-01-12

-- =====================================================
-- 1. Remove SECURITY DEFINER from Views
-- =====================================================

-- Drop and recreate views without SECURITY DEFINER
-- team_statistics_view
DROP VIEW IF EXISTS public.team_statistics_view CASCADE;
CREATE OR REPLACE VIEW public.team_statistics_view AS
SELECT 
    t.id,
    t.name,
    t.club_name,
    t.is_viktoria,
    t.team_type,
    COUNT(DISTINCT m.id) as total_matches,
    COUNT(DISTINCT CASE WHEN m.home_team_id = t.id AND m.home_score > m.away_score THEN m.id
                        WHEN m.away_team_id = t.id AND m.away_score > m.home_score THEN m.id END) as wins,
    COUNT(DISTINCT CASE WHEN m.home_score = m.away_score THEN m.id END) as draws,
    COUNT(DISTINCT CASE WHEN m.home_team_id = t.id AND m.home_score < m.away_score THEN m.id
                        WHEN m.away_team_id = t.id AND m.away_score < m.home_score THEN m.id END) as losses,
    COALESCE(SUM(CASE WHEN m.home_team_id = t.id THEN m.home_score
                      WHEN m.away_team_id = t.id THEN m.away_score END), 0) as goals_for,
    COALESCE(SUM(CASE WHEN m.home_team_id = t.id THEN m.away_score
                      WHEN m.away_team_id = t.id THEN m.home_score END), 0) as goals_against
FROM public.teams t
LEFT JOIN public.matches m ON (m.home_team_id = t.id OR m.away_team_id = t.id) 
    AND m.status = 'completed'
GROUP BY t.id, t.name, t.club_name, t.is_viktoria, t.team_type;

-- match_results_view
DROP VIEW IF EXISTS public.match_results_view CASCADE;
CREATE OR REPLACE VIEW public.match_results_view AS
SELECT 
    m.id,
    m.match_date,
    m.match_time,
    m.home_team_id,
    ht.name as home_team_name,
    ht.club_name as home_club_name,
    m.away_team_id,
    at.name as away_team_name,
    at.club_name as away_club_name,
    m.home_score,
    m.away_score,
    m.status,
    m.competition,
    m.season_id,
    s.name as season_name,
    m.match_type,
    m.venue,
    m.attendance,
    m.referee
FROM public.matches m
LEFT JOIN public.teams ht ON m.home_team_id = ht.id
LEFT JOIN public.teams at ON m.away_team_id = at.id
LEFT JOIN public.seasons s ON m.season_id = s.id;

-- league_standings_view
DROP VIEW IF EXISTS public.league_standings_view CASCADE;
CREATE OR REPLACE VIEW public.league_standings_view AS
SELECT 
    ls.id,
    ls.season_id,
    s.name as season_name,
    ls.team_id,
    t.name as team_name,
    t.club_name,
    t.is_viktoria,
    ls.league_type,
    ls.position,
    ls.played,
    ls.won,
    ls.drawn,
    ls.lost,
    ls.goals_for,
    ls.goals_against,
    ls.goal_difference,
    ls.points,
    ls.form,
    ls.last_updated
FROM public.league_standings ls
JOIN public.teams t ON ls.team_id = t.id
JOIN public.seasons s ON ls.season_id = s.id
ORDER BY ls.league_type, ls.position;

-- recent_matches
DROP VIEW IF EXISTS public.recent_matches CASCADE;
CREATE OR REPLACE VIEW public.recent_matches AS
SELECT 
    m.*,
    ht.name as home_team_name,
    ht.club_name as home_club_name,
    at.name as away_team_name,
    at.club_name as away_club_name
FROM public.matches m
JOIN public.teams ht ON m.home_team_id = ht.id
JOIN public.teams at ON m.away_team_id = at.id
WHERE m.status = 'completed'
ORDER BY m.match_date DESC, m.match_time DESC
LIMIT 10;

-- top_scorers_view
DROP VIEW IF EXISTS public.top_scorers_view CASCADE;
CREATE OR REPLACE VIEW public.top_scorers_view AS
SELECT 
    p.id,
    p.name,
    p.position,
    p.jersey_number,
    p.team_id,
    t.name as team_name,
    t.club_name,
    COUNT(g.id) as goals,
    COUNT(DISTINCT g.match_id) as matches_scored_in
FROM public.players p
JOIN public.teams t ON p.team_id = t.id
LEFT JOIN public.goals g ON g.scorer_id = p.id
WHERE p.is_active = true
GROUP BY p.id, p.name, p.position, p.jersey_number, p.team_id, t.name, t.club_name
HAVING COUNT(g.id) > 0
ORDER BY goals DESC
LIMIT 20;

-- upcoming_matches
DROP VIEW IF EXISTS public.upcoming_matches CASCADE;
CREATE OR REPLACE VIEW public.upcoming_matches AS
SELECT 
    m.*,
    ht.name as home_team_name,
    ht.club_name as home_club_name,
    at.name as away_team_name,
    at.club_name as away_club_name
FROM public.matches m
JOIN public.teams ht ON m.home_team_id = ht.id
JOIN public.teams at ON m.away_team_id = at.id
WHERE m.status IN ('scheduled', 'postponed')
ORDER BY m.match_date ASC, m.match_time ASC
LIMIT 10;

-- contacts_by_department
DROP VIEW IF EXISTS public.contacts_by_department CASCADE;
CREATE OR REPLACE VIEW public.contacts_by_department AS
SELECT 
    c.id,
    c.name,
    c.role,
    c.department,
    c.email,
    c.phone,
    c.image_url,
    c.is_active,
    c.display_order
FROM public.contacts c
WHERE c.is_active = true
ORDER BY c.department, c.display_order, c.name;

-- current_league_table
DROP VIEW IF EXISTS public.current_league_table CASCADE;
CREATE OR REPLACE VIEW public.current_league_table AS
SELECT 
    ls.*,
    t.name as team_name,
    t.club_name,
    t.is_viktoria
FROM public.league_standings ls
JOIN public.teams t ON ls.team_id = t.id
JOIN public.seasons s ON ls.season_id = s.id
WHERE s.is_current = true
ORDER BY ls.league_type, ls.position;

-- =====================================================
-- 2. Set search_path for Functions
-- =====================================================

-- batch_update_standings
CREATE OR REPLACE FUNCTION public.batch_update_standings(p_updates jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    -- Function body remains the same
    -- Just adding SET search_path
    UPDATE league_standings
    SET 
        position = (update_data->>'position')::integer,
        played = (update_data->>'played')::integer,
        won = (update_data->>'won')::integer,
        drawn = (update_data->>'drawn')::integer,
        lost = (update_data->>'lost')::integer,
        goals_for = (update_data->>'goals_for')::integer,
        goals_against = (update_data->>'goals_against')::integer,
        goal_difference = (update_data->>'goal_difference')::integer,
        points = (update_data->>'points')::integer,
        form = update_data->>'form',
        last_updated = CURRENT_TIMESTAMP
    FROM jsonb_array_elements(p_updates) AS update_data
    WHERE id = (update_data->>'id')::uuid;
END;
$$;

-- calculate_league_table
CREATE OR REPLACE FUNCTION public.calculate_league_table(p_season_id uuid, p_league_type text)
RETURNS TABLE(
    team_id uuid,
    team_name text,
    played integer,
    won integer,
    drawn integer,
    lost integer,
    goals_for integer,
    goals_against integer,
    goal_difference integer,
    points integer
)
LANGUAGE plpgsql
STABLE
SET search_path = public, pg_temp
AS $$
BEGIN
    RETURN QUERY
    WITH match_results AS (
        SELECT 
            m.id,
            m.home_team_id,
            m.away_team_id,
            m.home_score,
            m.away_score,
            CASE 
                WHEN m.home_score > m.away_score THEN 'home_win'
                WHEN m.home_score < m.away_score THEN 'away_win'
                ELSE 'draw'
            END as result
        FROM matches m
        WHERE m.season_id = p_season_id
        AND m.status = 'completed'
        AND m.competition = p_league_type
    ),
    team_stats AS (
        -- Home team stats
        SELECT 
            home_team_id as team_id,
            COUNT(*) as played,
            SUM(CASE WHEN result = 'home_win' THEN 1 ELSE 0 END) as won,
            SUM(CASE WHEN result = 'draw' THEN 1 ELSE 0 END) as drawn,
            SUM(CASE WHEN result = 'away_win' THEN 1 ELSE 0 END) as lost,
            SUM(home_score) as goals_for,
            SUM(away_score) as goals_against
        FROM match_results
        GROUP BY home_team_id
        
        UNION ALL
        
        -- Away team stats
        SELECT 
            away_team_id as team_id,
            COUNT(*) as played,
            SUM(CASE WHEN result = 'away_win' THEN 1 ELSE 0 END) as won,
            SUM(CASE WHEN result = 'draw' THEN 1 ELSE 0 END) as drawn,
            SUM(CASE WHEN result = 'home_win' THEN 1 ELSE 0 END) as lost,
            SUM(away_score) as goals_for,
            SUM(home_score) as goals_against
        FROM match_results
        GROUP BY away_team_id
    )
    SELECT 
        ts.team_id,
        t.name as team_name,
        SUM(ts.played)::integer as played,
        SUM(ts.won)::integer as won,
        SUM(ts.drawn)::integer as drawn,
        SUM(ts.lost)::integer as lost,
        SUM(ts.goals_for)::integer as goals_for,
        SUM(ts.goals_against)::integer as goals_against,
        (SUM(ts.goals_for) - SUM(ts.goals_against))::integer as goal_difference,
        (SUM(ts.won) * 3 + SUM(ts.drawn))::integer as points
    FROM team_stats ts
    JOIN teams t ON ts.team_id = t.id
    GROUP BY ts.team_id, t.name
    ORDER BY points DESC, goal_difference DESC, goals_for DESC;
END;
$$;

-- calculate_team_form
CREATE OR REPLACE FUNCTION public.calculate_team_form(p_team_id uuid, p_limit integer DEFAULT 5)
RETURNS text
LANGUAGE plpgsql
STABLE
SET search_path = public, pg_temp
AS $$
DECLARE
    v_form text := '';
    v_match record;
BEGIN
    FOR v_match IN
        SELECT 
            CASE 
                WHEN (home_team_id = p_team_id AND home_score > away_score) OR
                     (away_team_id = p_team_id AND away_score > home_score) THEN 'W'
                WHEN home_score = away_score THEN 'D'
                ELSE 'L'
            END as result
        FROM matches
        WHERE (home_team_id = p_team_id OR away_team_id = p_team_id)
        AND status = 'completed'
        ORDER BY match_date DESC, match_time DESC
        LIMIT p_limit
    LOOP
        v_form := v_match.result || v_form;
    END LOOP;
    
    RETURN v_form;
END;
$$;

-- get_team_standings
CREATE OR REPLACE FUNCTION public.get_team_standings(p_team_id uuid DEFAULT NULL)
RETURNS TABLE(
    team_id uuid,
    team_name text,
    league_type text,
    position integer,
    played integer,
    won integer,
    drawn integer,
    lost integer,
    goals_for integer,
    goals_against integer,
    goal_difference integer,
    points integer,
    form text
)
LANGUAGE plpgsql
STABLE
SET search_path = public, pg_temp
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ls.team_id,
        t.name as team_name,
        ls.league_type,
        ls.position,
        ls.played,
        ls.won,
        ls.drawn,
        ls.lost,
        ls.goals_for,
        ls.goals_against,
        ls.goal_difference,
        ls.points,
        ls.form
    FROM league_standings ls
    JOIN teams t ON ls.team_id = t.id
    JOIN seasons s ON ls.season_id = s.id
    WHERE s.is_current = true
    AND (p_team_id IS NULL OR ls.team_id = p_team_id)
    ORDER BY ls.league_type, ls.position;
END;
$$;

-- recalculate_all_league_standings
CREATE OR REPLACE FUNCTION public.recalculate_all_league_standings()
RETURNS void
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
DECLARE
    v_season record;
    v_league text;
BEGIN
    -- Get current season
    SELECT * INTO v_season FROM seasons WHERE is_current = true LIMIT 1;
    
    IF v_season IS NULL THEN
        RAISE EXCEPTION 'No current season found';
    END IF;
    
    -- Recalculate for each league type
    FOR v_league IN SELECT DISTINCT league_type FROM league_standings WHERE season_id = v_season.id
    LOOP
        PERFORM update_league_standings_from_matches(v_season.id, v_league);
    END LOOP;
END;
$$;

-- update_league_standings_from_matches
CREATE OR REPLACE FUNCTION public.update_league_standings_from_matches(p_season_id uuid, p_league_type text)
RETURNS void
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
    -- Delete existing standings for this season and league
    DELETE FROM league_standings 
    WHERE season_id = p_season_id AND league_type = p_league_type;
    
    -- Insert new calculated standings
    INSERT INTO league_standings (
        season_id, team_id, league_type, position, played, won, drawn, lost,
        goals_for, goals_against, goal_difference, points, form
    )
    SELECT 
        p_season_id,
        team_id,
        p_league_type,
        ROW_NUMBER() OVER (ORDER BY points DESC, goal_difference DESC, goals_for DESC),
        played, won, drawn, lost,
        goals_for, goals_against, goal_difference, points,
        calculate_team_form(team_id, 5)
    FROM calculate_league_table(p_season_id, p_league_type);
END;
$$;

-- update_team_form
CREATE OR REPLACE FUNCTION public.update_team_form(p_team_id uuid)
RETURNS void
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
    UPDATE league_standings
    SET form = calculate_team_form(p_team_id, 5),
        last_updated = CURRENT_TIMESTAMP
    WHERE team_id = p_team_id
    AND season_id IN (SELECT id FROM seasons WHERE is_current = true);
END;
$$;

-- update_team_standings
CREATE OR REPLACE FUNCTION public.update_team_standings(p_match_id uuid)
RETURNS void
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
DECLARE
    v_match record;
BEGIN
    -- Get match details
    SELECT * INTO v_match FROM matches WHERE id = p_match_id;
    
    IF v_match IS NULL THEN
        RETURN;
    END IF;
    
    -- Update standings for the league this match belongs to
    PERFORM update_league_standings_from_matches(v_match.season_id, v_match.competition);
    
    -- Update form for both teams
    PERFORM update_team_form(v_match.home_team_id);
    PERFORM update_team_form(v_match.away_team_id);
END;
$$;

-- update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- update_viktoria_standings_from_matches
CREATE OR REPLACE FUNCTION public.update_viktoria_standings_from_matches()
RETURNS void
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
DECLARE
    v_season record;
BEGIN
    -- Get current season
    SELECT * INTO v_season FROM seasons WHERE is_current = true LIMIT 1;
    
    IF v_season IS NULL THEN
        RAISE EXCEPTION 'No current season found';
    END IF;
    
    -- Update standings for all Viktoria teams
    UPDATE league_standings ls
    SET 
        played = stats.played,
        won = stats.won,
        drawn = stats.drawn,
        lost = stats.lost,
        goals_for = stats.goals_for,
        goals_against = stats.goals_against,
        goal_difference = stats.goals_for - stats.goals_against,
        points = stats.won * 3 + stats.drawn,
        form = calculate_team_form(ls.team_id, 5),
        last_updated = CURRENT_TIMESTAMP
    FROM (
        SELECT 
            team_id,
            played, won, drawn, lost,
            goals_for, goals_against
        FROM calculate_league_table(v_season.id, 'league')
    ) stats
    WHERE ls.team_id = stats.team_id
    AND ls.season_id = v_season.id
    AND ls.team_id IN (SELECT id FROM teams WHERE is_viktoria = true);
END;
$$;

-- =====================================================
-- 3. Enable RLS for unprotected tables
-- =====================================================

-- Enable RLS on tables that don't have it
ALTER TABLE public.content_generation_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schema_migrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_form ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies for public read access
-- content_generation_log - only admins can modify, everyone can read
CREATE POLICY "Allow public read access" ON public.content_generation_log
    FOR SELECT USING (true);

CREATE POLICY "Allow admin insert" ON public.content_generation_log
    FOR INSERT WITH CHECK (auth.jwt() ->> 'email' IN (
        SELECT unnest(string_to_array(current_setting('app.admin_emails', true), ','))
    ));

-- news_templates - only admins can modify, everyone can read active templates
CREATE POLICY "Allow public read active templates" ON public.news_templates
    FOR SELECT USING (is_active = true);

CREATE POLICY "Allow admin full access" ON public.news_templates
    FOR ALL USING (auth.jwt() ->> 'email' IN (
        SELECT unnest(string_to_array(current_setting('app.admin_emails', true), ','))
    ));

-- match_events - everyone can read, only admins can modify
CREATE POLICY "Allow public read access" ON public.match_events
    FOR SELECT USING (true);

CREATE POLICY "Allow admin modifications" ON public.match_events
    FOR ALL USING (auth.jwt() ->> 'email' IN (
        SELECT unnest(string_to_array(current_setting('app.admin_emails', true), ','))
    ));

-- schema_migrations - only service role can access
CREATE POLICY "Service role only" ON public.schema_migrations
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- team_form - everyone can read
CREATE POLICY "Allow public read access" ON public.team_form
    FOR SELECT USING (true);

CREATE POLICY "Allow admin modifications" ON public.team_form
    FOR ALL USING (auth.jwt() ->> 'email' IN (
        SELECT unnest(string_to_array(current_setting('app.admin_emails', true), ','))
    ));

-- Grant necessary permissions
GRANT SELECT ON public.content_generation_log TO anon, authenticated;
GRANT SELECT ON public.news_templates TO anon, authenticated;
GRANT SELECT ON public.match_events TO anon, authenticated;
GRANT SELECT ON public.team_form TO anon, authenticated;

GRANT ALL ON public.content_generation_log TO authenticated;
GRANT ALL ON public.news_templates TO authenticated;
GRANT ALL ON public.match_events TO authenticated;
GRANT ALL ON public.team_form TO authenticated;

-- schema_migrations should only be accessible by service role
REVOKE ALL ON public.schema_migrations FROM anon, authenticated;

-- =====================================================
-- 4. Additional Security Hardening
-- =====================================================

-- Ensure all views have proper permissions
GRANT SELECT ON public.team_statistics_view TO anon, authenticated;
GRANT SELECT ON public.match_results_view TO anon, authenticated;
GRANT SELECT ON public.league_standings_view TO anon, authenticated;
GRANT SELECT ON public.recent_matches TO anon, authenticated;
GRANT SELECT ON public.top_scorers_view TO anon, authenticated;
GRANT SELECT ON public.upcoming_matches TO anon, authenticated;
GRANT SELECT ON public.contacts_by_department TO anon, authenticated;
GRANT SELECT ON public.current_league_table TO anon, authenticated;

-- Ensure functions have proper security settings
-- All functions already have SECURITY DEFINER or appropriate security context