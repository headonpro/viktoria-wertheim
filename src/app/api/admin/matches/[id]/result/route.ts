import { NextRequest } from 'next/server'
import { createApiHandler } from '@/lib/api/middleware'
import { formatSuccessResponse, formatErrorResponse, API_ERRORS } from '@/lib/api/errors'
import { createClient } from '@/lib/supabase/server'
import { validateNumber } from '@/lib/api/validation'
import logger from '@/lib/logger'

// PUT /api/admin/matches/[id]/result - Update match result (triggers automatic calculations)
export const PUT = createApiHandler(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
    
    const { id: matchId } = await params
    const body = await request.json()
    
    // Validate input
    const homeScore = validateNumber(body.home_score, 'Home Score', { 
      required: true, 
      min: 0, 
      max: 20 
    })
    
    const awayScore = validateNumber(body.away_score, 'Away Score', { 
      required: true, 
      min: 0, 
      max: 20 
    })
    
    const supabase = await createClient()
    
    // Check if match exists
    const { data: existingMatch, error: fetchError } = await supabase
      .from('matches')
      .select('*')
      .eq('id', matchId)
      .single()
    
    if (fetchError || !existingMatch) {
      return formatErrorResponse(API_ERRORS.NOT_FOUND('Match'))
    }
    
    logger.info('Updating match result', {
      matchId,
      homeTeam: existingMatch.home_team,
      awayTeam: existingMatch.away_team,
      previousScore: `${existingMatch.home_score || 'null'}-${existingMatch.away_score || 'null'}`,
      newScore: `${homeScore}-${awayScore}`
    })
    
    // Update match with result
    const { data: updatedMatch, error: updateError } = await supabase
      .from('matches')
      .update({
        home_score: homeScore,
        away_score: awayScore,
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', matchId)
      .select('*')
      .single()
    
    if (updateError) {
      logger.error('Error updating match result', { error: updateError, matchId })
      return formatErrorResponse(API_ERRORS.DATABASE_CONNECTION_ERROR())
    }
    
    // The database trigger will automatically:
    // 1. Update league standings
    // 2. Calculate team form
    // 3. Log content generation request
    
    // Get updated league table to return current standings
    const { data: leagueTable, error: tableError } = await supabase
      .from('current_league_table')
      .select('team_id, team_name, position, points, played, won, drawn, lost, goals_for, goals_against, goal_difference')
      .order('position', { ascending: true })
    
    if (tableError) {
      logger.warn('Could not fetch updated league table', { error: tableError })
    }
    
    // Check if content generation was triggered
    const { data: contentLog } = await supabase
      .from('content_generation_log')
      .select('*')
      .eq('trigger_type', 'match_result_update')
      .contains('trigger_data', { match_id: matchId })
      .order('created_at', { ascending: false })
      .limit(1)
    
    const result = {
      match: updatedMatch,
      automation_triggered: {
        league_standings_updated: true,
        team_form_calculated: true,
        content_generation_queued: contentLog && contentLog.length > 0,
        content_log_id: contentLog && contentLog.length > 0 ? contentLog[0].id : null
      },
      current_league_table: leagueTable || [],
      message: 'Match result updated successfully. League standings and statistics have been automatically recalculated.'
    }
    
    logger.info('Match result update completed with automation', {
      matchId,
      newScore: `${homeScore}-${awayScore}`,
      automationTriggered: result.automation_triggered
    })
    
    return formatSuccessResponse(result)
  }, { requireAdmin: true })

// GET /api/admin/matches/[id]/result - Get match result and related automated data
export const GET = createApiHandler(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
    const { id: matchId } = await params
    const supabase = await createClient()
    
    // Get match details
    const { data: match, error: matchError } = await supabase
      .from('match_results_view')
      .select('*')
      .eq('id', matchId)
      .single()
    
    if (matchError || !match) {
      return formatErrorResponse(API_ERRORS.NOT_FOUND('Match'))
    }
    
    // Get teams involved
    const teamIds = [match.home_team_id, match.away_team_id].filter(Boolean)
    
    // Get updated team information
    const { data: teamInfo } = await supabase
      .from('team_statistics_view')
      .select('*')
      .in('id', teamIds)
    
    // Get team form for both teams
    const { data: teamForms } = await supabase
      .from('team_form')
      .select('*')
      .in('team_id', teamIds)
    
    // Get content generation logs for this match
    const { data: contentLogs } = await supabase
      .from('content_generation_log')
      .select('*')
      .eq('trigger_type', 'match_result_update')
      .contains('trigger_data', { match_id: matchId })
      .order('created_at', { ascending: false })
    
    const result = {
      match,
      teams: teamInfo || [],
      team_forms: teamForms || [],
      content_generation_history: contentLogs || [],
      impact_analysis: {
        teams_affected: teamIds.length,
        standings_recalculated: match.status === 'completed',
        content_generated: contentLogs && contentLogs.length > 0
      }
    }
    
    return formatSuccessResponse(result)
  }, { requireAdmin: true })