# Smart Data Automation - SV Viktoria Wertheim

This document describes the intelligent data processing system that automatically calculates statistics, generates content, and updates the website when match results are entered.

## Overview

The Smart Data Automation system transforms simple match result entries into a complete data ecosystem with automatic:

- **League Table Calculation** - Real-time standings from match results
- **Team Statistics** - Automatic performance metrics and form tracking  
- **Content Generation** - Automated news article creation
- **Homepage Updates** - Dynamic content refresh

## How It Works

### The Magic Behind the Automation

When a match result is entered (e.g., "SV Viktoria 3:1 FC Musterstadt"), the system automatically:

1. **Database Trigger Fires** → Match result update detected
2. **League Table Recalculated** → All team positions, points, statistics updated
3. **Team Form Updated** → Last 5 games performance calculated  
4. **Content Generated** → News article automatically created from templates
5. **Homepage Refreshed** → Latest results, table, news updated

### Example Workflow

```
Manager enters: "3:1 victory against FC Musterstadt"
                        ↓
            Database Trigger Activated
                        ↓
            ┌─────────────────────────────┐
            │   AUTOMATIC PROCESSING      │
            ├─────────────────────────────┤
            │ ✅ League table recalculated │
            │ ✅ Team form updated (WWLDW) │
            │ ✅ News article generated    │
            │ ✅ Homepage content updated  │
            └─────────────────────────────┘
                        ↓
    Website visitors see updated content immediately!
```

## Database Schema

### Smart Data Tables

#### `team_form` - Team Performance Tracking
```sql
team_id           UUID      -- Reference to team
season            VARCHAR   -- Season (e.g., "2025/26")
form_string       VARCHAR   -- Last 5 games ("WWLDW")
form_points       INTEGER   -- Points from last 5 games
recent_goals_for  INTEGER   -- Goals scored in last 5
recent_goals_against INTEGER -- Goals conceded in last 5
```

#### `news_templates` - Content Generation Templates
```sql
template_type     VARCHAR   -- 'victory', 'defeat', 'draw', 'big_victory'
title_template    TEXT      -- "Wichtiger {score} Sieg gegen {opponent}!"
content_template  TEXT      -- Full article template with placeholders
conditions        JSONB     -- When to use this template
```

#### `content_generation_log` - Automation Tracking
```sql
trigger_type      VARCHAR   -- 'match_result_update'
trigger_data      JSONB     -- Match information
generated_content_type VARCHAR -- 'news_article'
generated_content_id UUID   -- Created article ID
status           VARCHAR    -- 'pending', 'completed', 'failed'
```

#### `match_events` - Detailed Match Tracking
```sql
match_id         UUID      -- Reference to match
player_id        UUID      -- Player involved
event_type       VARCHAR   -- 'goal', 'yellow_card', 'red_card', 'assist'
event_time       INTEGER   -- Minute of the event
description      TEXT      -- Event details
```

### Smart Functions

#### `calculate_league_table()` - Live League Calculation
```sql
SELECT * FROM calculate_league_table('2025/26');
```
Returns complete league table with positions, points, goal difference, etc.

#### `update_league_standings()` - Update League Table
```sql
SELECT update_league_standings('2025/26');
```
Recalculates and updates the entire league table.

#### `calculate_team_form()` - Team Form Analysis
```sql
SELECT calculate_team_form(team_id, '2025/26');
```
Updates team form based on last 5 games.

### Smart Views

#### `current_league_table` - Live League Table
```sql
SELECT * FROM current_league_table ORDER BY position;
```
Real-time league standings with form and statistics.

#### `team_statistics_view` - Enhanced Team Stats
```sql
SELECT * FROM team_statistics_view WHERE name ILIKE '%viktoria%';
```
Complete team statistics with performance metrics.

#### `match_results_view` - Match Results with Analysis
```sql
SELECT * FROM match_results_view ORDER BY match_date DESC;
```
Match results with winner analysis and goal differences.

## Database Triggers

### `match_result_automation_trigger`
```sql
-- Triggers on INSERT or UPDATE of matches table
-- When: Match status = 'completed' OR scores updated
-- Actions:
--   1. Update league standings for season
--   2. Calculate team form for both teams
--   3. Log content generation request
```

**Trigger Logic:**
```sql
CREATE TRIGGER match_result_automation_trigger
    AFTER INSERT OR UPDATE ON matches
    FOR each ROW
    EXECUTE FUNCTION on_match_result_change();
```

## Content Generation System

### News Templates

The system includes 4 template types:

#### 1. Victory Template
- **Trigger**: Team wins by 1-2 goals
- **Title**: "Wichtiger {score} Sieg gegen {opponent}!"
- **Content**: Positive match report with table position

#### 2. Big Victory Template  
- **Trigger**: Team wins by 3+ goals
- **Title**: "Kantersieg! {score} gegen {opponent}"
- **Content**: Celebration of dominant performance

#### 3. Draw Template
- **Trigger**: Match ends in tie
- **Title**: "Unentschieden gegen {opponent} - {score}"
- **Content**: Balanced match analysis

#### 4. Defeat Template
- **Trigger**: Team loses
- **Title**: "Knappe {score} Niederlage gegen {opponent}"
- **Content**: Constructive loss analysis

### Template Variables

All templates support these placeholders:
- `{score}` → "2:1", "3:0", etc.
- `{opponent}` → "FC Musterstadt"
- `{table_position}` → "3"
- `{points}` → "15"
- `{match_summary}` → Generated match analysis
- `{next_match}` → Next game information

### Content Generation Process

1. **Match Result Updated** → Trigger logs content request
2. **Template Selection** → System picks appropriate template
3. **Data Enrichment** → Variables replaced with real data
4. **Article Creation** → News article created as draft
5. **Review Ready** → Article available for admin review/publish

## API Endpoints

### Live Data APIs

#### `GET /api/league-table`
Real-time league table with live calculations.

```json
{
  "success": true,
  "data": {
    "league_table": [
      {
        "position": 1,
        "team_name": "SV Viktoria Wertheim",
        "played": 10,
        "points": 25,
        "form_string": "WWWDW",
        "table_zone": "promotion"
      }
    ]
  }
}
```

#### `GET /api/homepage/dynamic-content`
Auto-updating homepage content.

```json
{
  "success": true,
  "data": {
    "latest_results": [...],
    "upcoming_matches": [...],
    "league_table": [...],
    "team_stats": {...},
    "latest_news": [...]
  }
}
```

### Admin APIs (Require Authentication)

#### `PUT /api/admin/matches/[id]/result`
Update match result and trigger automation.

```bash
curl -X PUT \
  -H 'X-Admin-Password: YOUR_PASSWORD' \
  -H 'Content-Type: application/json' \
  -d '{"home_score": 2, "away_score": 1}' \
  'http://localhost:3000/api/admin/matches/MATCH_ID/result'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "match": {...},
    "automation_triggered": {
      "league_standings_updated": true,
      "team_form_calculated": true,
      "content_generation_queued": true
    },
    "current_league_table": [...]
  }
}
```

#### `GET /api/admin/content-generation`
Process pending content generation requests.

```bash
curl -X GET \
  -H 'X-Admin-Password: YOUR_PASSWORD' \
  'http://localhost:3000/api/admin/content-generation'
```

#### `POST /api/admin/content-generation`
Test content generation system.

```bash
curl -X POST \
  -H 'X-Admin-Password: YOUR_PASSWORD' \
  -H 'Content-Type: application/json' \
  -d '{"action": "test"}' \
  'http://localhost:3000/api/admin/content-generation'
```

## Automation Scripts

### Content Generation Cron Job
```bash
# Add to crontab for automatic processing
*/10 * * * * /opt/viktoria-wertheim/scripts/content-generation-cron.sh
```

The cron job:
- Runs every 10 minutes
- Processes pending content generation
- Creates news articles from templates
- Logs all activity

### Testing Automation
```bash
# Test the entire automation system
./scripts/test-smart-automation.sh
```

This script verifies:
- Database functions work correctly
- API endpoints respond properly  
- Templates are loaded
- Triggers are installed

## Usage Examples

### Scenario 1: Regular Match Result Entry

**Input:** Manager updates match via Supabase Studio
- Home Team: SV Viktoria Wertheim  
- Away Team: FC Testlingen
- Score: 2-1
- Status: completed

**Automatic Output:**
1. League table recalculated (Viktoria moves up 2 positions)
2. Team form updated from "WLDW" to "WLDWW"
3. News article generated: "Wichtiger 2:1 Sieg gegen FC Testlingen!"
4. Homepage shows updated results, table, and news

### Scenario 2: Big Victory

**Input:** Match result 4-0 victory

**Automatic Output:**
1. "Big victory" template used
2. News title: "Kantersieg! 4:0 gegen [Opponent]"
3. Content celebrates dominant performance
4. League table shows improved goal difference

### Scenario 3: API-Based Update

**Input:** Admin uses API to update match
```bash
curl -X PUT \
  -H 'X-Admin-Password: PASSWORD' \
  -d '{"home_score": 1, "away_score": 3}' \
  '/api/admin/matches/123/result'
```

**Automatic Output:**
1. API returns updated league table
2. Shows automation was triggered
3. Content generation queued for processing
4. Next cron run creates "defeat" news article

## Configuration

### Environment Variables
```bash
# Required for content generation API
NEXT_PUBLIC_ADMIN_PASSWORD=YourSecurePassword

# Database connection (automatically configured)
DATABASE_URL=postgresql://postgres:postgres@localhost:54322/postgres
```

### Cron Job Setup
```bash
# Add content generation to crontab
crontab -e

# Add this line for every 10 minutes processing:
*/10 * * * * /path/to/viktoria-wertheim/scripts/content-generation-cron.sh
```

## Monitoring & Debugging

### Check Automation Status
```sql
-- View recent content generation activity
SELECT * FROM content_generation_log 
ORDER BY created_at DESC 
LIMIT 10;

-- Check current league table
SELECT * FROM current_league_table 
ORDER BY position;

-- View team form
SELECT t.name, tf.form_string, tf.form_points 
FROM teams t
JOIN team_form tf ON t.id = tf.team_id
WHERE t.season = '2025/26';
```

### Debugging Failed Automation
```sql
-- Find failed content generation
SELECT * FROM content_generation_log 
WHERE status = 'failed';

-- Check if triggers are active
SELECT * FROM pg_trigger 
WHERE tgname = 'match_result_automation_trigger';

-- Test league calculation manually
SELECT * FROM calculate_league_table('2025/26');
```

### Logs
```bash
# Content generation logs
tail -f /var/log/viktoria/content-generation.log

# Application logs
docker logs viktoria-frontend --tail 50

# Database logs
docker logs supabase-db --tail 50
```

## Benefits

### For Admins/Managers
- ✅ **One-Step Updates**: Just enter match result, everything else happens automatically
- ✅ **No Manual Calculations**: League table always current without manual work
- ✅ **Instant Content**: News articles generated immediately  
- ✅ **Consistent Website**: Homepage always shows latest information

### for Website Visitors
- ✅ **Always Current**: League table and statistics are real-time
- ✅ **Fresh Content**: New articles appear automatically after matches
- ✅ **Rich Information**: Deep statistics and analysis without manual work
- ✅ **Professional Look**: Consistent, well-formatted content

### For Developers
- ✅ **Event-Driven**: Clean architecture with automatic reactions
- ✅ **Extensible**: Easy to add new automation rules
- ✅ **Reliable**: Database-level automation that always works
- ✅ **Testable**: Comprehensive test suite for all automation

## Future Enhancements

### Possible Extensions
1. **Player Statistics** - Auto-track individual player performance
2. **Match Predictions** - Use form data to predict upcoming results
3. **Social Media** - Auto-post to Facebook/Twitter after matches
4. **Email Alerts** - Notify fans about important results
5. **Mobile Notifications** - Push notifications for live updates

### Advanced Features
1. **Multi-League Support** - Handle youth teams, women's teams
2. **Season Management** - Auto-rollover to new seasons
3. **Competition Handling** - Cup matches, friendlies
4. **Analytics Dashboard** - Visual statistics and trends

---

## Summary

The Smart Data Automation system transforms the SV Viktoria Wertheim website from a static information site to an intelligent, self-updating platform. 

**What changed:** Simple match result entry now triggers comprehensive website updates.

**Result:** Professional sports website with real-time data, automated content, and minimal manual work.

The system is production-ready and will handle all match result processing automatically, providing visitors with always-current information and administrators with minimal workload.