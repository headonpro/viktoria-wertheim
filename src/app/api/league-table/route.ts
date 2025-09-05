import { NextRequest } from 'next/server'
import { createApiHandler } from '@/lib/api/middleware'
import { createClient } from '@/lib/supabase/server'
import logger from '@/lib/logger'

// GET /api/league-table - Get current league table with live calculations
export const GET = createApiHandler(async (request: NextRequest) => {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const season = searchParams.get('season') || '2025/26'
    
    logger.info('Fetching live league table', { season })
    
    // Get current league table with form and statistics
    const { data: leagueTable, error: tableError } = await supabase
      .from('current_league_table')
      .select('*')
      .eq('season', season)
      .order('position', { ascending: true })
    
    if (tableError) {
      logger.error('Error fetching league table', { error: tableError })
      throw new Error('Failed to fetch league table')
    }
    
    // Get team statistics for additional context
    const { data: teamStats, error: statsError } = await supabase
      .from('team_statistics_view')
      .select('*')
      .order('current_position', { ascending: true })
    
    if (statsError) {
      logger.warn('Error fetching team statistics', { error: statsError })
    }
    
    // Combine league table with enhanced statistics
    const enhancedTable = leagueTable?.map(team => {
      const stats = teamStats?.find(stat => stat.id === team.team_id)
      
      return {
        ...team,
        win_percentage: stats?.win_percentage || 0,
        avg_goals_per_game: stats?.avg_goals_per_game || 0,
        form_analysis: {
          form_string: team.form_string || '',
          recent_points: team.form_points_last_5 || 0,
          form_trend: team.form_string ? 
            (team.form_string.split('W').length - 1 > team.form_string.split('L').length - 1 ? 'improving' : 
             team.form_string.split('W').length - 1 < team.form_string.split('L').length - 1 ? 'declining' : 'stable') 
            : 'unknown'
        },
        table_context: {
          zone: team.table_zone,
          zone_description: {
            'promotion': 'Aufstiegsplatz',
            'relegation': 'Abstiegsplatz', 
            'mid_table': 'Mittelfeld'
          }[team.table_zone || 'unknown'] || 'Unbekannt'
        }
      }
    }) || []
    
    // Calculate additional league statistics
    const leagueStats = {
      total_teams: enhancedTable.length,
      total_matches_played: enhancedTable.reduce((sum, team) => sum + (team.played || 0), 0) / 2, // Divide by 2 as each match involves 2 teams
      total_goals: enhancedTable.reduce((sum, team) => sum + (team.goals_for || 0), 0),
      avg_goals_per_match: enhancedTable.length > 0 ? 
        enhancedTable.reduce((sum, team) => sum + (team.goals_for || 0), 0) / 
        Math.max(1, enhancedTable.reduce((sum, team) => sum + (team.played || 0), 0) / 2) : 0,
      most_goals_for: Math.max(...enhancedTable.map(team => team.goals_for || 0)),
      least_goals_against: Math.min(...enhancedTable.map(team => team.goals_against || 0)),
      last_updated: new Date().toISOString()
    }
    
    return {
      league_table: enhancedTable,
      league_statistics: leagueStats,
      season,
      generated_at: new Date().toISOString()
    }
  })