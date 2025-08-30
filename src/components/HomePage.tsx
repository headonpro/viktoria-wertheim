import React from 'react'
import { createClient } from '@/lib/supabase/server'
import HomePageClient from '@/components/HomePageClient'
import type { Database } from '@/lib/database.types'

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
      supabase.from('matches').select('*').order('match_date', { ascending: false }),
      supabase.from('news').select('*').order('published_at', { ascending: false }).limit(5),
      supabase.from('scorers').select('*').order('goals', { ascending: false }).limit(5),
      supabase.from('sponsors').select('*').order('category', { ascending: true }),
      supabase.from('league_standings').select('*').order('position')
    ])
    
    teams = results[0].data
    matches = results[1].data
    news = results[2].data
    scorers = results[3].data
    sponsors = results[4].data
    leagueStandings = results[5].data
    
    // Log any errors from individual queries
    results.forEach((result, index) => {
      if (result.error) {
        const tableNames = ['teams', 'matches', 'news', 'scorers', 'sponsors', 'league_standings']
        console.error(`Error fetching ${tableNames[index]}:`, result.error)
      }
    })
  } catch (error) {
    console.error('Error fetching data for HomePage:', error)
    // Return empty data on critical error
    teams = []
    matches = []
    news = []
    scorers = []
    sponsors = []
    leagueStandings = []
  }

  // Process data for client
  const processedData = {
    teams: teams || [],
    matches: matches || [],
    news: news || [],
    scorers: scorers || [],
    sponsors: {
      premium: sponsors?.filter(s => s.category === 'Hauptsponsor' || s.category === 'Premium Partner') || [],
      gold: sponsors?.filter(s => s.category === 'Partner') || [],
      silver: sponsors?.filter(s => s.category === 'Förderer') || []
    },
    leagueStandings: {
      'Kreisliga A': leagueStandings?.filter(s => s.league === 'Kreisliga A') || [],
      'Kreisklasse B': leagueStandings?.filter(s => s.league === 'Kreisklasse B') || [],
      'Kreisklasse C': leagueStandings?.filter(s => s.league === 'Kreisklasse C') || []
    }
  }

  return <HomePageClient data={processedData} />
}