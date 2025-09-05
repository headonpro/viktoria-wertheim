-- Smart Data Automation for Viktoria Wertheim
-- This migration implements intelligent data processing that automatically
-- calculates league tables, statistics, and generates content when match results are updated

-- ================================
-- 1. Enhanced Schema for Smart Data
-- ================================

-- Match Events table for detailed tracking
CREATE TABLE IF NOT EXISTS match_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
    player_id UUID REFERENCES players(id) ON DELETE SET NULL,
    team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    event_type VARCHAR(20) NOT NULL, -- 'goal', 'yellow_card', 'red_card', 'assist', 'substitution'
    event_time INTEGER, -- minute of the event
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Team Form table for tracking last 5 games performance
CREATE TABLE IF NOT EXISTS team_form (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    season VARCHAR(20) DEFAULT '2025/26',
    form_string VARCHAR(5), -- e.g., "WWLDW" (W=Win, L=Loss, D=Draw)
    form_points INTEGER DEFAULT 0, -- points from last 5 games
    recent_goals_for INTEGER DEFAULT 0,
    recent_goals_against INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT team_form_unique UNIQUE (team_id, season)
);

-- Auto-generated News template
CREATE TABLE IF NOT EXISTS news_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    template_type VARCHAR(50) NOT NULL, -- 'victory', 'defeat', 'draw', 'big_win'
    title_template TEXT NOT NULL,
    content_template TEXT NOT NULL,
    conditions JSONB, -- conditions when to use this template
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Content Generation Log
CREATE TABLE IF NOT EXISTS content_generation_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    trigger_type VARCHAR(50) NOT NULL,
    trigger_data JSONB,
    generated_content_type VARCHAR(50),
    generated_content_id UUID,
    status VARCHAR(20) DEFAULT 'pending',
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ================================
-- 2. Functions for League Calculations
-- ================================

-- Function to calculate league table position for a team
CREATE OR REPLACE FUNCTION calculate_league_table(target_season VARCHAR(20) DEFAULT '2025/26')
RETURNS TABLE(
    team_id UUID,
    team_name VARCHAR(100),
    position INTEGER,
    played INTEGER,
    won INTEGER,
    drawn INTEGER,
    lost INTEGER,
    goals_for INTEGER,
    goals_against INTEGER,
    goal_difference INTEGER,
    points INTEGER
) AS $$
BEGIN
    RETURN QUERY
    WITH team_stats AS (
        SELECT 
            t.id as team_id,
            t.name as team_name,
            -- Count games played (where team is home or away and match is completed)
            COUNT(CASE WHEN m.status = 'completed' THEN 1 END)::INTEGER as played,
            -- Count wins
            COUNT(CASE 
                WHEN m.status = 'completed' AND (
                    (t.id = m.home_team_id AND m.home_score > m.away_score) OR
                    (t.id = m.away_team_id AND m.away_score > m.home_score)
                ) THEN 1 END)::INTEGER as won,
            -- Count draws
            COUNT(CASE 
                WHEN m.status = 'completed' AND m.home_score = m.away_score 
                AND (t.id = m.home_team_id OR t.id = m.away_team_id)
                THEN 1 END)::INTEGER as drawn,
            -- Count losses
            COUNT(CASE 
                WHEN m.status = 'completed' AND (
                    (t.id = m.home_team_id AND m.home_score < m.away_score) OR
                    (t.id = m.away_team_id AND m.away_score < m.home_score)
                ) THEN 1 END)::INTEGER as lost,
            -- Goals for
            COALESCE(SUM(CASE 
                WHEN m.status = 'completed' AND t.id = m.home_team_id THEN m.home_score
                WHEN m.status = 'completed' AND t.id = m.away_team_id THEN m.away_score
                ELSE 0
            END), 0)::INTEGER as goals_for,
            -- Goals against
            COALESCE(SUM(CASE 
                WHEN m.status = 'completed' AND t.id = m.home_team_id THEN m.away_score
                WHEN m.status = 'completed' AND t.id = m.away_team_id THEN m.home_score
                ELSE 0
            END), 0)::INTEGER as goals_against
        FROM teams t
        LEFT JOIN matches m ON (t.id = m.home_team_id OR t.id = m.away_team_id)
        WHERE t.season = target_season
        GROUP BY t.id, t.name
    ),
    ranked_teams AS (
        SELECT *,
            (goals_for - goals_against) as goal_difference,
            -- Calculate points: 3 for win, 1 for draw, 0 for loss
            (won * 3 + drawn * 1) as points
        FROM team_stats
    )
    SELECT 
        rt.team_id,
        rt.team_name,
        ROW_NUMBER() OVER (
            ORDER BY rt.points DESC, 
                    rt.goal_difference DESC, 
                    rt.goals_for DESC, 
                    rt.team_name ASC
        )::INTEGER as position,
        rt.played,
        rt.won,
        rt.drawn,
        rt.lost,
        rt.goals_for,
        rt.goals_against,
        rt.goal_difference,
        rt.points
    FROM ranked_teams rt
    ORDER BY position;
END;
$$ LANGUAGE plpgsql;

-- Function to update league standings table
CREATE OR REPLACE FUNCTION update_league_standings(target_season VARCHAR(20) DEFAULT '2025/26')
RETURNS VOID AS $$
BEGIN
    -- Clear existing standings for the season
    DELETE FROM league_standings WHERE season = target_season;
    
    -- Insert new calculated standings
    INSERT INTO league_standings (
        team_id, team_name, position, played, won, drawn, lost,
        goals_for, goals_against, points, season, updated_at
    )
    SELECT 
        team_id, team_name, position, played, won, drawn, lost,
        goals_for, goals_against, points, target_season, CURRENT_TIMESTAMP
    FROM calculate_league_table(target_season);
    
    -- Update teams table with current position and points
    UPDATE teams t
    SET 
        table_position = ls.position,
        points = ls.points,
        games_played = ls.played,
        wins = ls.won,
        draws = ls.drawn,
        losses = ls.lost,
        goals_for = ls.goals_for,
        goals_against = ls.goals_against,
        updated_at = CURRENT_TIMESTAMP
    FROM league_standings ls
    WHERE t.id = ls.team_id AND ls.season = target_season;
    
    RAISE NOTICE 'League standings updated for season %', target_season;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate team form (last 5 games)
CREATE OR REPLACE FUNCTION calculate_team_form(target_team_id UUID, target_season VARCHAR(20) DEFAULT '2025/26')
RETURNS VOID AS $$
DECLARE
    form_record RECORD;
    form_str VARCHAR(5) := '';
    form_pts INTEGER := 0;
    goals_f INTEGER := 0;
    goals_a INTEGER := 0;
BEGIN
    -- Get last 5 completed matches for the team
    FOR form_record IN (
        SELECT 
            CASE 
                WHEN m.home_team_id = target_team_id AND m.home_score > m.away_score THEN 'W'
                WHEN m.away_team_id = target_team_id AND m.away_score > m.home_score THEN 'W'
                WHEN m.home_score = m.away_score THEN 'D'
                ELSE 'L'
            END as result,
            CASE 
                WHEN m.home_team_id = target_team_id THEN m.home_score
                ELSE m.away_score
            END as team_goals,
            CASE 
                WHEN m.home_team_id = target_team_id THEN m.away_score
                ELSE m.home_score
            END as opponent_goals
        FROM matches m
        WHERE 
            (m.home_team_id = target_team_id OR m.away_team_id = target_team_id)
            AND m.status = 'completed'
        ORDER BY m.match_date DESC, m.match_time DESC
        LIMIT 5
    ) LOOP
        form_str := form_str || form_record.result;
        form_pts := form_pts + CASE 
            WHEN form_record.result = 'W' THEN 3
            WHEN form_record.result = 'D' THEN 1
            ELSE 0
        END;
        goals_f := goals_f + form_record.team_goals;
        goals_a := goals_a + form_record.opponent_goals;
    END LOOP;
    
    -- Update or insert team form
    INSERT INTO team_form (team_id, season, form_string, form_points, recent_goals_for, recent_goals_against)
    VALUES (target_team_id, target_season, form_str, form_pts, goals_f, goals_a)
    ON CONFLICT (team_id, season) 
    DO UPDATE SET 
        form_string = EXCLUDED.form_string,
        form_points = EXCLUDED.form_points,
        recent_goals_for = EXCLUDED.recent_goals_for,
        recent_goals_against = EXCLUDED.recent_goals_against,
        updated_at = CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- ================================
-- 3. Trigger Functions
-- ================================

-- Function that triggers when match result is updated
CREATE OR REPLACE FUNCTION on_match_result_change()
RETURNS TRIGGER AS $$
DECLARE
    affected_season VARCHAR(20);
BEGIN
    -- Determine the season from team data or default to current
    SELECT season INTO affected_season FROM teams 
    WHERE id = COALESCE(NEW.home_team_id, OLD.home_team_id) 
    LIMIT 1;
    
    IF affected_season IS NULL THEN
        affected_season := '2025/26';
    END IF;
    
    -- If match status changed to completed or score was updated
    IF (TG_OP = 'UPDATE' AND NEW.status = 'completed') OR
       (TG_OP = 'UPDATE' AND (NEW.home_score != OLD.home_score OR NEW.away_score != OLD.away_score)) OR
       (TG_OP = 'INSERT' AND NEW.status = 'completed') THEN
        
        -- Update league standings
        PERFORM update_league_standings(affected_season);
        
        -- Update team form for both teams
        IF NEW.home_team_id IS NOT NULL THEN
            PERFORM calculate_team_form(NEW.home_team_id, affected_season);
        END IF;
        
        IF NEW.away_team_id IS NOT NULL THEN
            PERFORM calculate_team_form(NEW.away_team_id, affected_season);
        END IF;
        
        -- Log content generation trigger
        INSERT INTO content_generation_log (
            trigger_type, 
            trigger_data, 
            generated_content_type,
            status
        ) VALUES (
            'match_result_update',
            json_build_object(
                'match_id', NEW.id,
                'home_team', NEW.home_team,
                'away_team', NEW.away_team,
                'home_score', NEW.home_score,
                'away_score', NEW.away_score
            ),
            'news_article',
            'pending'
        );
        
        RAISE NOTICE 'Match result updated - triggered league standings and content generation';
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- ================================
-- 4. Create Triggers
-- ================================

-- Trigger for automatic league table updates
CREATE TRIGGER match_result_automation_trigger
    AFTER INSERT OR UPDATE ON matches
    FOR EACH ROW
    EXECUTE FUNCTION on_match_result_change();

-- Update triggers for match_events
CREATE TRIGGER update_match_events_updated_at BEFORE UPDATE ON match_events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================
-- 5. Insert News Templates
-- ================================

INSERT INTO news_templates (template_type, title_template, content_template, conditions) VALUES
('victory', 
 'Wichtiger {score} Sieg gegen {opponent}!', 
 'Ein starker Auftritt unserer Mannschaft führte zu einem verdienten {score} Sieg gegen {opponent}. 

Die Partie war von Beginn an umkämpft, doch unsere Spieler zeigten eine geschlossene Mannschaftsleistung und konnten sich am Ende durchsetzen.

**Spielverlauf:**
{match_summary}

**Tabellenstand:**
Mit diesem wichtigen Sieg steht unser Team nun auf Platz {table_position} der Tabelle mit {points} Punkten.

**Nächstes Spiel:**
{next_match}',
 '{"min_goal_difference": 1}'),

('big_victory', 
 'Kantersieg! {score} gegen {opponent}', 
 'Was für eine Demonstration unserer Offensivkraft! Mit einem überzeugenden {score} konnten wir {opponent} deutlich distanzieren.

Von der ersten Minute an dominierten unsere Spieler das Geschehen und ließen dem Gegner keine Chance zur Entfaltung.

**Spielverlauf:**
{match_summary}

**Tabellenstand:**
Durch diesen Kantersieg verbessern wir uns auf Platz {table_position} mit {points} Punkten.

**Nächstes Spiel:**
{next_match}',
 '{"min_goal_difference": 3}'),

('draw', 
 'Unentschieden gegen {opponent} - {score}', 
 'In einer umkämpften Partie trennten sich unsere Mannschaft und {opponent} mit einem {score} Unentschieden.

Beide Teams hatten ihre Chancen, doch am Ende war das Remis ein gerechtes Ergebnis.

**Spielverlauf:**
{match_summary}

**Tabellenstand:**
Mit dem Punkt stehen wir aktuell auf Platz {table_position} mit {points} Punkten.

**Nächstes Spiel:**
{next_match}',
 '{"goal_difference": 0}'),

('defeat', 
 'Knappe {score} Niederlage gegen {opponent}', 
 'Trotz einer kämpferischen Leistung mussten wir uns {opponent} mit {score} geschlagen geben.

Unsere Mannschaft zeigte Moral und ließ bis zum Schluss nicht nach, doch heute fehlte das Glück beim Abschluss.

**Spielverlauf:**
{match_summary}

**Tabellenstand:**
Nach dieser Niederlage stehen wir auf Platz {table_position} mit {points} Punkten.

**Nächstes Spiel:**
{next_match}',
 '{"max_goal_difference": -1}');

-- ================================
-- 6. Views for Easy Access
-- ================================

-- Current league table view
CREATE OR REPLACE VIEW current_league_table AS
SELECT 
    ls.*,
    tf.form_string,
    tf.form_points as form_points_last_5,
    CASE 
        WHEN ls.position <= 3 THEN 'promotion'
        WHEN ls.position >= (SELECT COUNT(*) - 2 FROM league_standings WHERE season = ls.season) THEN 'relegation'
        ELSE 'mid_table'
    END as table_zone
FROM league_standings ls
LEFT JOIN team_form tf ON ls.team_id = tf.team_id AND ls.season = tf.season
WHERE ls.season = '2025/26'
ORDER BY ls.position;

-- Team statistics view
CREATE OR REPLACE VIEW team_statistics_view AS
SELECT 
    t.*,
    ls.position as current_position,
    ls.points as current_points,
    ls.goal_difference,
    tf.form_string,
    tf.form_points as recent_form_points,
    -- Win percentage
    CASE 
        WHEN ls.played > 0 THEN ROUND((ls.won::NUMERIC / ls.played::NUMERIC) * 100, 1)
        ELSE 0
    END as win_percentage,
    -- Average goals per game
    CASE 
        WHEN ls.played > 0 THEN ROUND(ls.goals_for::NUMERIC / ls.played::NUMERIC, 1)
        ELSE 0
    END as avg_goals_per_game
FROM teams t
LEFT JOIN league_standings ls ON t.id = ls.team_id AND ls.season = t.season
LEFT JOIN team_form tf ON t.id = tf.team_id AND tf.season = t.season;

-- Recent match results with outcome
CREATE OR REPLACE VIEW match_results_view AS
SELECT 
    m.*,
    ht.name as home_team_name,
    at.name as away_team_name,
    CASE 
        WHEN m.home_score > m.away_score THEN ht.name
        WHEN m.away_score > m.home_score THEN at.name
        ELSE 'Draw'
    END as winner,
    CASE 
        WHEN m.home_score > m.away_score THEN 'home_win'
        WHEN m.away_score > m.home_score THEN 'away_win'
        ELSE 'draw'
    END as result_type,
    ABS(m.home_score - m.away_score) as goal_difference
FROM matches m
LEFT JOIN teams ht ON m.home_team_id = ht.id
LEFT JOIN teams at ON m.away_team_id = at.id
WHERE m.status = 'completed'
ORDER BY m.match_date DESC, m.match_time DESC;

RAISE NOTICE 'Smart Data Automation migration completed successfully!';
RAISE NOTICE 'League standings will now update automatically when match results are entered.';
RAISE NOTICE 'Use SELECT * FROM current_league_table; to view the live table.';