import React from 'react'
import { createClient } from '@/lib/supabase/server'
import TeamsPageClient from '@/components/TeamsPageClient'
import { Metadata } from 'next'
import type { Database } from '@/lib/database.types'

type Team = Database['public']['Tables']['teams']['Row']
type Player = Database['public']['Tables']['players']['Row']
type Match = Database['public']['Tables']['matches']['Row']
type YouthTeam = Database['public']['Tables']['youth_teams']['Row']
type LeagueStanding = Database['public']['Tables']['league_standings']['Row']

// Define client types
interface ClientPlayer {
  id: string
  name: string
  number: number | null
  position: string | null
  age: number | null
  is_captain: boolean | null
}

interface ClientMatch {
  opponent: string
  result: string
  type: string
}

interface ClientNextMatch {
  opponent: string
  date: string
  time: string
  location: string
}

interface ClientTeam {
  id: string
  name: string
  league: string
  coach: string
  captain: string
  training: string
  position: number
  points: number
  teamType: string
  players: ClientPlayer[]
  lastResults?: ClientMatch[]
  nextMatch?: ClientNextMatch | null
  leagueStats?: {
    played: number
    won: number
    drawn: number
    lost: number
    goalsFor: number
    goalsAgainst: number
  } | null
}

export const metadata: Metadata = {
  title: 'Unsere Mannschaften - SV Viktoria Wertheim',
  description: 'Alle Teams des SV Viktoria Wertheim im Überblick - Erste Mannschaft, Zweite Mannschaft und Jugendteams'
}

export default async function TeamsPage() {
  const supabase = await createClient()
  
  let teams: Team[] = []
  let players: Player[] = []
  let matches: Match[] = []
  let youthTeams: YouthTeam[] = []
  let leagueStandings: LeagueStanding[] = []
  
  try {
    // Fetch all data in parallel
    const results = await Promise.all([
      supabase.from('teams').select('*').order('team_type'),
      supabase.from('players').select('*').order('number'),
      supabase.from('matches')
        .select('*')
        .order('match_date', { ascending: false })
        .limit(20),
      supabase.from('youth_teams').select('*').order('age_group'),
      supabase
        .from('league_standings')
        .select('*')
        .in('season', ['2024/25', '2025/26']) // Current and upcoming season
        .order('season', { ascending: false })
        .order('position')
    ])
    
    teams = results[0].data || []
    players = results[1].data || []
    matches = results[2].data || []
    youthTeams = results[3].data || []
    leagueStandings = results[4].data || []
    
    // Log any errors from individual queries
    const tableNames = ['teams', 'players', 'matches', 'youth_teams', 'league_standings']
    results.forEach((result, index) => {
      if (result.error) {
        console.error(`Error fetching ${tableNames[index]}:`, result.error)
      }
    })
  } catch (error) {
    console.error('Critical error in TeamsPage:', error)
    // Return empty arrays on failure
    teams = []
    players = []
    matches = []
    youthTeams = []
    leagueStandings = []
  }
  
  // Group players by team_id
  const playersByTeam: Record<string, Player[]> = {}
  if (players) {
    players.forEach(player => {
      const teamId = player.team_id || 'unassigned'
      if (!playersByTeam[teamId]) {
        playersByTeam[teamId] = []
      }
      playersByTeam[teamId].push(player)
    })
  }
  
  // Group matches by team (for last results and next match)
  const matchesByTeam: Record<string, { lastResults: ClientMatch[], nextMatch: ClientNextMatch | null }> = {}
  if (teams && matches) {
    teams.forEach(team => {
      const teamMatches = matches.filter(match => 
        match.home_team_id === team.id || match.away_team_id === team.id
      )
      
      const now = new Date()
      const pastMatches = teamMatches
        .filter(m => new Date(m.match_date) < now && m.status === 'completed')
        .slice(0, 3)
      
      const futureMatches = teamMatches
        .filter(m => new Date(m.match_date) >= now)
        .sort((a, b) => new Date(a.match_date).getTime() - new Date(b.match_date).getTime())
      
      matchesByTeam[team.id] = {
        lastResults: pastMatches.map(match => {
          const isHome = match.home_team_id === team.id
          const opponent = isHome ? match.away_team : match.home_team
          const ourScore = isHome ? match.home_score : match.away_score
          const theirScore = isHome ? match.away_score : match.home_score
          
          let type = 'Unentschieden'
          if (ourScore !== null && theirScore !== null) {
            if (ourScore > theirScore) type = 'Sieg'
            else if (ourScore < theirScore) type = 'Niederlage'
          }
          
          return {
            opponent,
            result: `${ourScore ?? '-'}:${theirScore ?? '-'}`,
            type
          }
        }),
        nextMatch: futureMatches[0] ? {
          opponent: futureMatches[0].home_team_id === team.id 
            ? futureMatches[0].away_team 
            : futureMatches[0].home_team,
          date: futureMatches[0].match_date,
          time: futureMatches[0].match_time || 'TBD',
          location: futureMatches[0].home_team_id === team.id ? 'Heimspiel' : 'Auswärtsspiel'
        } : null
      }
    })
  }
  
  // Create league stats map with name variation handling
  const leagueStatsByTeam: Record<string, LeagueStanding | null> = {}
  if (leagueStandings) {
    teams.forEach(team => {
      const teamStats = leagueStandings.find(standing => {
        // Direct team_id match
        if (standing.team_id === team.id) return true
        
        // Exact name match
        if (standing.team_name === team.name) return true
        
        // Handle II vs 2 notation for second team
        if (team.name === 'SV Viktoria Wertheim II' && 
            standing.team_name === 'SV Viktoria Wertheim 2') return true
        
        // Handle SpG variation for third team (team III is stored as SpG in teams table)
        if (team.name === 'SpG Vikt. Wertheim 3/Grünenwört' && 
            standing.team_name === 'SV Viktoria Wertheim III') return true
            
        // Also handle numeric variation for SpG team
        if (team.name === 'SpG Vikt. Wertheim 3/Grünenwört' && 
            standing.team_name === 'SV Viktoria Wertheim 3') return true
        
        return false
      })
      leagueStatsByTeam[team.id] = teamStats || null
    })
  }
  
  // Transform data to match client expectations
  const teamsData: ClientTeam[] = (teams || []).map(team => {
    const leagueStats = leagueStatsByTeam[team.id]
    return {
      id: team.id,
      name: team.name,
      league: team.league || 'Liga nicht angegeben',
      coach: team.coach || 'Trainer nicht angegeben',
      captain: team.captain || 'Kapitän nicht angegeben',
      training: team.training_schedule || 'Training nach Vereinbarung',
      position: team.table_position || 0,
      points: team.points || 0,
      teamType: team.team_type || 'senior',
      players: playersByTeam[team.id] || [],
      ...matchesByTeam[team.id],
      leagueStats: leagueStats ? {
        played: leagueStats.played || 0,
        won: leagueStats.won || 0,
        drawn: leagueStats.drawn || 0,
        lost: leagueStats.lost || 0,
        goalsFor: leagueStats.goals_for || 0,
        goalsAgainst: leagueStats.goals_against || 0
      } : null
    }
  })
  
  return <TeamsPageClient 
    teams={teamsData}
    youthTeams={youthTeams || []}
  />
}