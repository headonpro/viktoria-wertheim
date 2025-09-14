import { NextRequest } from 'next/server'
import { createApiHandler } from '@/lib/api/middleware'
import { createClient } from '@/lib/supabase/server'
import logger from '@/lib/logger'

// GET /api/homepage/dynamic-content - Get all dynamic content for homepage
export const GET = createApiHandler(async (_request: NextRequest) => {
    const supabase = await createClient()
    
    logger.info('Fetching dynamic homepage content')
    
    // Get latest match results (last 3 completed matches)
    const { data: latestResults, error: resultsError } = await supabase
      .from('match_results_view')
      .select('*')
      .eq('status', 'completed')
      .order('match_date', { ascending: false })
      .limit(3)
    
    // Get upcoming matches (next 3 matches)
    const { data: upcomingMatches, error: upcomingError } = await supabase
      .from('upcoming_matches')
      .select('*')
      .order('match_date', { ascending: true })
      .limit(3)
    
    // Get current league table (top 5)
    const { data: leagueTable, error: tableError } = await supabase
      .from('current_league_table')
      .select('*')
      .order('position', { ascending: true })
      .limit(5)
    
    // Get our team's position and stats
    const { data: ourTeam, error: teamError } = await supabase
      .from('team_statistics_view')
      .select('*')
      .ilike('name', '%viktoria%')
      .single()
    
    // Get latest news (most recent 4 articles)
    const { data: latestNews, error: newsError } = await supabase
      .from('news')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(4)
    
    // Get team form for our team
    const { data: teamForm, error: formError } = ourTeam?.id ? await supabase
      .from('team_form')
      .select('*')
      .eq('team_id', ourTeam.id)
      .single() : { data: null, error: null }
    
    // Get top scorers
    const { data: topScorers, error: scorersError } = await supabase
      .from('top_scorers_view')
      .select('*')
      .order('goals', { ascending: false })
      .limit(5)
    
    // Prepare homepage content sections
    const homepageContent = {
      hero_section: {
        next_match: upcomingMatches?.[0] || null,
        team_position: ourTeam?.current_position || 'N/A',
        team_points: ourTeam?.current_points || 0,
        team_form: teamForm?.form_string || '',
        last_updated: new Date().toISOString()
      },
      
      latest_results: {
        title: 'Letzte Ergebnisse',
        matches: latestResults?.map(match => ({
          id: match.id,
          home_team: match.home_team_name || match.home_team,
          away_team: match.away_team_name || match.away_team,
          home_score: match.home_score,
          away_score: match.away_score,
          match_date: match.match_date,
          result_type: match.result_type,
          winner: match.winner
        })) || []
      },
      
      upcoming_matches: {
        title: 'Nächste Spiele',
        matches: upcomingMatches?.map(match => ({
          id: match.id,
          home_team: match.home_team,
          away_team: match.away_team,
          match_date: match.match_date,
          match_time: match.match_time,
          location: match.location,
          match_type: match.match_type
        })) || []
      },
      
      league_table: {
        title: 'Tabellenstand',
        table: leagueTable?.map(team => ({
          position: team.position,
          team_name: team.team_name,
          played: team.played,
          points: team.points,
          goal_difference: team.goal_difference,
          form: team.form_string,
          is_our_team: team.team_name?.toLowerCase().includes('viktoria') || false
        })) || [],
        show_full_table_link: true
      },
      
      team_stats: {
        title: 'Team-Statistiken',
        position: ourTeam?.current_position || 'N/A',
        points: ourTeam?.current_points || 0,
        played: ourTeam?.matches_played || 0,
        won: ourTeam?.matches_won || 0,
        drawn: ourTeam?.matches_drawn || 0,
        lost: ourTeam?.matches_lost || 0,
        goals_for: ourTeam?.goals_for || 0,
        goals_against: ourTeam?.goals_against || 0,
        goal_difference: ourTeam?.goal_difference || 0,
        win_percentage: ourTeam?.win_percentage || 0,
        form: {
          string: teamForm?.form_string || '',
          points: teamForm?.form_points || 0,
          recent_goals_for: teamForm?.recent_goals_for || 0,
          recent_goals_against: teamForm?.recent_goals_against || 0
        }
      },
      
      latest_news: {
        title: 'Aktuelle News',
        articles: latestNews?.map(article => ({
          id: article.id,
          title: article.title,
          excerpt: article.excerpt,
          published_at: article.published_at,
          category: article.category,
          is_featured: article.is_featured,
          views: article.views
        })) || []
      },
      
      top_scorers: {
        title: 'Torschützenliste',
        scorers: topScorers?.map(scorer => ({
          player_name: scorer.player_name,
          team_name: scorer.team_name,
          goals: scorer.goals,
          assists: scorer.assists,
          player_number: scorer.player_number,
          position: scorer.player_position
        })) || []
      },
      
      meta: {
        generated_at: new Date().toISOString(),
        season: '2025/26',
        auto_refresh_interval: 300, // 5 minutes
        content_freshness: {
          results: resultsError ? 'error' : 'fresh',
          upcoming: upcomingError ? 'error' : 'fresh', 
          table: tableError ? 'error' : 'fresh',
          news: newsError ? 'error' : 'fresh',
          stats: teamError ? 'error' : 'fresh'
        }
      }
    }
    
    // Log any errors but don't fail the entire request
    if (resultsError) logger.warn('Error fetching latest results', { error: resultsError })
    if (upcomingError) logger.warn('Error fetching upcoming matches', { error: upcomingError })
    if (tableError) logger.warn('Error fetching league table', { error: tableError })
    if (teamError) logger.warn('Error fetching team stats', { error: teamError })
    if (newsError) logger.warn('Error fetching latest news', { error: newsError })
    if (formError) logger.warn('Error fetching team form', { error: formError })
    if (scorersError) logger.warn('Error fetching top scorers', { error: scorersError })
    
    return homepageContent
  })