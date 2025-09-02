import React from 'react'
import { createClient } from '@/lib/supabase/server'
import HomePageClient from '@/components/HomePageClient'
import type { Database } from '@/lib/database.types'
import { logError } from '@/lib/error-utils'

type Team = Database['public']['Tables']['teams']['Row']
type Match = Database['public']['Tables']['matches']['Row']
type News = Database['public']['Tables']['news']['Row']
type Scorer = Database['public']['Tables']['scorers']['Row']
type Sponsor = Database['public']['Tables']['sponsors']['Row']
type LeagueStanding = Database['public']['Tables']['league_standings']['Row']

export default async function HomePage() {
  const supabase = await createClient()
  
  let teams: Team[] | null
  let matches: Match[] | null
  let news: News[] | null
  let scorers: Scorer[] | null
  let sponsors: Sponsor[] | null
  let leagueStandings: LeagueStanding[] | null
  
  try {
    // Fetch all data in parallel
    const results = await Promise.all([
      supabase.from('teams').select('*').order('team_type'),
      supabase.from('matches').select('*').order('match_date', { ascending: true }),
      supabase.from('news').select('*').order('published_at', { ascending: false }).limit(5),
      supabase.from('scorers')
        .select('*')
        .or('team_name.ilike.%Viktoria Wertheim%,team_name.ilike.%Vikt. Wertheim%')
        .order('goals', { ascending: false })
        .limit(10),
      supabase.from('sponsors').select('*').order('category', { ascending: true }),
      supabase.from('league_standings').select('*').eq('season', '2024/25').order('position')
    ])
    
    teams = results[0].data
    matches = results[1].data
    news = results[2].data
    scorers = results[3].data
    sponsors = results[4].data
    leagueStandings = results[5].data
    
    // Log any errors from individual queries
    const tableNames = ['teams', 'matches', 'news', 'scorers', 'sponsors', 'league_standings']
    results.forEach((result, index) => {
      if (result.error) {
        logError(result.error, `HomePage.fetch.${tableNames[index]}`)
      }
    })
  } catch (error) {
    logError(error, 'HomePage.fetchData')
    // Return empty data on critical error
    teams = []
    matches = []
    news = []
    scorers = []
    sponsors = []
    leagueStandings = []
  }

  // Process data for client and get last 5 matches per team
  const teamIds = {
    '1': 'a1111111-1111-1111-1111-111111111111',
    '2': 'a2222222-2222-2222-2222-222222222222',
    '3': 'a3333333-3333-3333-3333-333333333333'
  }
  
  // Get last 5 completed matches for each team
  const getLastFiveMatches = (teamId: string) => {
    const teamMatches = matches?.filter(m => 
      (m.home_team_id === teamId || m.away_team_id === teamId) && m.status === 'completed'
    ) || []
    
    // Return last 5 matches (oldest first, newest last - for form display)
    return teamMatches.slice(-5)
  }
  
  const processedData = {
    teams: teams || [],
    matches: matches || [],
    news: news || [],
    scorers: scorers || [],
    sponsors: {
      premium: sponsors?.filter(s => s.category === 'Premium Partner') || [],
      gold: sponsors?.filter(s => s.category === 'Hauptsponsor') || [],
      silver: sponsors?.filter(s => s.category === 'Partner') || []
    },
    leagueStandings: {
      'Kreisliga A': leagueStandings?.filter(s => s.league === 'bfv-Kreisliga Tauberbischofsheim') || [],
      'Kreisklasse A': leagueStandings?.filter(s => s.league === 'bfv-Kreisklasse A Tauberbischofsheim') || [],
      'Kreisklasse B': leagueStandings?.filter(s => s.league === 'bfv-Kreisklasse B Tauberbischofsheim') || []
    },
    allLeagueStandings: leagueStandings || [], // Add all standings for modal
    lastFiveMatches: {
      '1': getLastFiveMatches(teamIds['1']),
      '2': getLastFiveMatches(teamIds['2']),
      '3': getLastFiveMatches(teamIds['3'])
    }
  }

  return <HomePageClient data={processedData} />
}