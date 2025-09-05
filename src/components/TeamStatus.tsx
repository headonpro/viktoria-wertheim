'use client'

import React from 'react'
import { IconTrophy, IconChartBar, IconUsers } from '@tabler/icons-react'
import type { Database } from '@/lib/database.types'

type Team = Database['public']['Tables']['teams']['Row']
type LeagueStanding = Database['public']['Tables']['league_standings']['Row']

interface TeamStatusProps {
  selectedTeam: '1' | '2' | '3'
  onTeamChange: (team: '1' | '2' | '3') => void
  teams?: Team[]
  leagueStandings?: LeagueStanding[]
  lastFiveMatches?: Database['public']['Tables']['matches']['Row'][]
}

interface TeamWithStats extends Team {
  wins?: number
  draws?: number
  losses?: number
  games_played?: number
}

export default function TeamStatus({ selectedTeam, onTeamChange, teams: teamsData, leagueStandings, lastFiveMatches }: TeamStatusProps) {
  // Map team selection to actual team IDs
  const teamIdMap = {
    '1': '229cb117-471a-4bcc-b60e-d73772738943', // SV Viktoria Wertheim (1. Mannschaft)
    '2': '568e99ad-d9e1-4f2d-a517-88d3a725755b', // SV Viktoria Wertheim 2 (2. Mannschaft)
    '3': 'b86367ef-883f-4b73-9c98-77e7a0daf8b8'  // SpG Viktoria Wertheim 3/Grünenwört (3. Mannschaft)
  }

  // Use data from props if available, otherwise use fallback
  const getTeamInfo = () => {
    const teamId = teamIdMap[selectedTeam]
    
    if (teamsData && teamsData.length > 0 && leagueStandings && leagueStandings.length > 0) {
      const team = teamsData.find(t => t.id === teamId)
      const standing = leagueStandings.find(ls => ls.team_id === teamId)
      
      if (team && standing) {
        return {
          name: team.name || team.short_name || `${selectedTeam}. Mannschaft`,
          league: team.league || 'Unbekannte Liga',
          position: standing.position || 0,
          points: standing.points || 0,
          wins: standing.won || 0,
          draws: standing.drawn || 0,
          losses: standing.lost || 0,
          gamesPlayed: standing.played || 0
        }
      }
    }
    
    // Fallback data if no teams data is provided
    const fallbackTeams = {
      '1': { name: '1. Mannschaft', league: 'Kreisliga', position: 11, points: 4, wins: 0, draws: 0, losses: 0, gamesPlayed: 0 },
      '2': { name: '2. Mannschaft', league: 'Kreisklasse A', position: 13, points: 0, wins: 0, draws: 0, losses: 0, gamesPlayed: 0 },
      '3': { name: '3. Mannschaft', league: 'Kreisklasse B', position: 9, points: 0, wins: 0, draws: 0, losses: 0, gamesPlayed: 0 }
    }
    return fallbackTeams[selectedTeam] || fallbackTeams['1']
  }

  // Get real stats from teams table (they have all the data we need)
  const calculateStats = () => {
    const teamInfo = getTeamInfo()
    
    // The teamInfo already has all the stats we need from the teams table
    return {
      position: teamInfo.position,
      points: teamInfo.points,
      wins: teamInfo.wins,
      draws: teamInfo.draws,
      losses: teamInfo.losses,
      gamesPlayed: teamInfo.gamesPlayed
    }
  }

  // Calculate match results for last 5 games display
  const getMatchResults = () => {
    if (!lastFiveMatches || lastFiveMatches.length === 0) {
      return []
    }

    const teamId = teamIdMap[selectedTeam]
    
    return lastFiveMatches.map(match => {
      const isHome = match.home_team_id === teamId
      const homeScore = match.home_score || 0
      const awayScore = match.away_score || 0
      
      if (isHome) {
        if (homeScore > awayScore) return 'W' // Win
        if (homeScore < awayScore) return 'L' // Loss
        return 'D' // Draw
      } else {
        if (awayScore > homeScore) return 'W' // Win
        if (awayScore < homeScore) return 'L' // Loss
        return 'D' // Draw
      }
    })
  }

  const teams = {
    '1': { 
      name: '1. Mannschaft', 
      league: 'Kreisliga', 
      color: 'from-viktoria-blue to-viktoria-blue-light' 
    },
    '2': { 
      name: '2. Mannschaft', 
      league: 'Kreisklasse A', 
      color: 'from-viktoria-green to-green-600' 
    },
    '3': { 
      name: '3. Mannschaft', 
      league: 'Kreisklasse B', 
      color: 'from-gray-600 to-gray-700' 
    }
  }

  const currentTeam = teams[selectedTeam]
  const currentStats = calculateStats()
  const matchResults = getMatchResults()

  // Calculate actual stats from matches if available
  const actualGamesPlayed = matchResults.length
  
  // Override stats with actual match count if we have match data
  if (actualGamesPlayed > 0) {
    currentStats.gamesPlayed = actualGamesPlayed
  }

  // Pad with empty slots if less than 5 matches (add to beginning for older games)
  const displayResults: (string | null)[] = [...matchResults]
  while (displayResults.length < 5) {
    displayResults.unshift(null)  // Add to beginning, not end
  }

  return (
    <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 px-4 py-3">
        <h3 className="text-white dark:text-gray-900 font-bold text-sm uppercase tracking-wider text-center">Team Status</h3>
      </div>
      
      {/* Team Selector Tabs */}
      <div className="flex bg-gray-50 dark:bg-viktoria-dark-lighter border-b border-gray-200 dark:border-viktoria-dark-lighter">
        {Object.entries(teams).map(([key, team]) => (
          <button
            key={key}
            onClick={() => onTeamChange(key as '1' | '2' | '3')}
            className={`flex-1 px-3 py-3 sm:px-4 sm:py-2 text-sm font-medium transition-all duration-300 ${
              selectedTeam === key
                ? 'text-viktoria-blue dark:text-viktoria-yellow border-b-2 border-viktoria-blue dark:border-viktoria-yellow bg-white dark:bg-viktoria-dark-light'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/70 dark:hover:bg-viktoria-dark-light/70'
            }`}
          >
            <div className="text-center">
              <div className="truncate">{team.name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-500 hidden sm:block mt-0.5">
                {team.league}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Team Statistics - Unified Layout */}
      <div className="p-4 sm:p-5">
        {/* Position, Form and Points Row */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* Position Card */}
          <div className="bg-gray-50 dark:bg-viktoria-dark-lighter rounded-lg p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <IconTrophy size={18} className="text-viktoria-blue dark:text-viktoria-yellow" />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">Platz</span>
            </div>
            <p className="text-3xl font-bold text-viktoria-blue dark:text-viktoria-yellow">{currentStats.position}.</p>
          </div>

          {/* Form - Last 5 Matches */}
          <div className="bg-gray-50 dark:bg-viktoria-dark-lighter rounded-lg p-4">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">Form</span>
            </div>
            <div className="flex items-center justify-center space-x-1 h-9">
              {displayResults.map((result, index) => (
                <div
                  key={index}
                  className={`w-9 sm:w-7 h-5 sm:h-6 rounded flex items-center justify-center font-bold text-sm transition-all duration-200 ${
                    result === 'W' 
                      ? 'bg-green-500 text-white shadow-sm' 
                      : result === 'D' 
                      ? 'bg-gray-400 text-white shadow-sm'
                      : result === 'L'
                      ? 'bg-red-500 text-white shadow-sm'
                      : 'bg-gray-200 dark:bg-gray-700 border border-dashed border-gray-300 dark:border-gray-600'
                  }`}
                  title={
                    result === 'W' ? 'Sieg' :
                    result === 'D' ? 'Unentschieden' :
                    result === 'L' ? 'Niederlage' :
                    'Noch kein Spiel'
                  }
                >
                  {result === 'W' ? 'S' : result === 'D' ? 'U' : result === 'L' ? 'N' : '−'}
                </div>
              ))}
            </div>
          </div>

          {/* Points Card */}
          <div className="bg-gray-50 dark:bg-viktoria-dark-lighter rounded-lg p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <IconChartBar size={18} className="text-viktoria-blue dark:text-viktoria-yellow" />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">Punkte</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{currentStats.points}</p>
          </div>
        </div>

        {/* Statistics Summary */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-gray-50 dark:bg-viktoria-dark-lighter rounded-lg p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">Siege</span>
            </div>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{currentStats.wins}</p>
          </div>
          <div className="bg-gray-50 dark:bg-viktoria-dark-lighter rounded-lg p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">Unent.</span>
            </div>
            <p className="text-3xl font-bold text-gray-600 dark:text-gray-400">{currentStats.draws}</p>
          </div>
          <div className="bg-gray-50 dark:bg-viktoria-dark-lighter rounded-lg p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">Niederl.</span>
            </div>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">{currentStats.losses}</p>
          </div>
        </div>

        {/* Liga Info */}
        <div className="bg-gradient-to-r from-gray-50 to-white dark:from-viktoria-dark-lighter dark:to-viktoria-dark-light rounded-lg px-4 py-3 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <IconUsers size={16} className="text-viktoria-blue dark:text-viktoria-yellow" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {currentTeam.league}
              </span>
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
              {currentStats.gamesPlayed} Spiele
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}