import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Simple test endpoint without middleware wrapper
export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Test 1: Direct query to current_league_table
    const { data: leagueData, error: leagueError } = await supabase
      .from('current_league_table')
      .select('*')
      .eq('season', '2025/26')
    
    // Test 2: Direct query to team_statistics_view  
    const { data: statsData, error: statsError } = await supabase
      .from('team_statistics_view')
      .select('*')
    
    // Test 3: Direct query to teams
    const { data: teamsData, error: teamsError } = await supabase
      .from('teams')
      .select('id, name, season')
    
    return NextResponse.json({
      success: true,
      tests: {
        current_league_table: {
          count: leagueData?.length || 0,
          error: leagueError?.message || null,
          sample: leagueData?.[0] || null
        },
        team_statistics_view: {
          count: statsData?.length || 0,
          error: statsError?.message || null,
          sample: statsData?.[0] || null
        },
        teams: {
          count: teamsData?.length || 0,
          error: teamsError?.message || null,
          data: teamsData || []
        }
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}