'use client'

import React from 'react'
import { IconTrendingUp, IconTrendingDown, IconMinus } from '@tabler/icons-react'
import type { Database } from '@/lib/database.types'
import { getTeamAbbreviation } from '@/lib/teams/team-data'

type LeagueStanding = Database['public']['Tables']['league_standings']['Row']

interface SimpleLeagueTableProps {
  standings: LeagueStanding[]
  selectedTeamId?: string
  onShowFullTable?: () => void
}

export default function SimpleLeagueTable({ standings, onShowFullTable }: SimpleLeagueTableProps) {
  const getTrendIcon = (trend: string | null) => {
    switch (trend) {
      case 'up':
        return <IconTrendingUp size={16} className="text-green-500" />
      case 'down':
        return <IconTrendingDown size={16} className="text-red-500" />
      default:
        return <IconMinus size={16} className="text-gray-400" />
    }
  }



  // Find the team's position in the standings
  const getDisplayedStandings = () => {
    // Find any Viktoria Wertheim team (including SpG variants)
    const teamIndex = standings.findIndex(team => {
      const name = team.team_name || ''
      // Suche nach verschiedenen Schreibweisen von Viktoria Wertheim
      return name === 'SV Viktoria Wertheim' || 
             name.includes('Viktoria Wertheim') || 
             name.includes('Vikt. Wertheim') // Für SpG Vikt. Wertheim 3/Grünenwört
    })
    
    if (teamIndex === -1) {
      // Team not found, show top 5
      return standings.slice(0, 5)
    }
    
    // Calculate range to show team in middle (position 3 of 5)
    let startIndex = Math.max(0, teamIndex - 2)
    let endIndex = startIndex + 5
    
    // Adjust if we're at the end of the table
    if (endIndex > standings.length) {
      endIndex = standings.length
      startIndex = Math.max(0, endIndex - 5)
    }
    
    return standings.slice(startIndex, endIndex)
  }

  const displayedStandings = getDisplayedStandings()

  if (!standings || standings.length === 0) {
    return (
      <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">Keine Tabellendaten verfügbar</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 px-4 py-3">
        <h3 className="text-white dark:text-gray-900 font-bold text-sm uppercase tracking-wider text-center">Tabelle</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-b from-gray-50 to-white dark:from-viktoria-dark-lighter dark:to-viktoria-dark-light border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-2 sm:px-3 py-3 text-left text-[10px] sm:text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Pl.</th>
              <th className="px-2 sm:px-3 py-3 text-left text-[10px] sm:text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Team</th>
              <th className="px-2 sm:px-3 py-3 text-center text-[10px] sm:text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">Sp.</th>
              <th className="px-2 sm:px-3 py-3 text-center text-[10px] sm:text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">S</th>
              <th className="px-2 sm:px-3 py-3 text-center text-[10px] sm:text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">U</th>
              <th className="px-2 sm:px-3 py-3 text-center text-[10px] sm:text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">N</th>
              <th className="px-2 sm:px-3 py-3 text-center text-[10px] sm:text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">Tore</th>
              <th className="px-2 sm:px-3 py-3 text-center text-[10px] sm:text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Pkt.</th>
              <th className="px-1 py-3 text-center"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {displayedStandings.map((team) => (
              <tr 
                key={team.id}
                className={`hover:bg-gray-50 dark:hover:bg-viktoria-dark-lighter/50 transition-all duration-200 ${
                  (team.team_name?.includes('Viktoria Wertheim') || team.team_name?.includes('Vikt. Wertheim'))
                    ? 'bg-gradient-to-r from-viktoria-blue/10 to-viktoria-blue-light/10 dark:from-viktoria-yellow/15 dark:to-yellow-600/15 shadow-sm' 
                    : ''
                }`}
              >
                <td className="px-2 sm:px-3 py-3 text-left">
                  <div className={`text-sm sm:text-base font-bold ${
                    team.position === 1 ? 'text-viktoria-yellow' :
                    team.position <= 3 ? 'text-viktoria-blue dark:text-viktoria-yellow' :
                    'text-gray-600 dark:text-gray-400'
                  }`}>
                    {team.position}
                  </div>
                </td>
                <td className="px-2 sm:px-3 py-3 text-left">
                  <span className={`text-xs sm:text-sm font-medium ${
                    (team.team_name?.includes('Viktoria Wertheim') || team.team_name?.includes('Vikt. Wertheim'))
                      ? 'font-bold text-viktoria-blue dark:text-viktoria-yellow' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    <span className="hidden sm:inline">{team.team_name}</span>
                    <span className="sm:hidden">{getTeamAbbreviation(team.team_name)}</span>
                  </span>
                </td>
                <td className="px-2 sm:px-3 py-3 text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400 hidden sm:table-cell">{team.played}</td>
                <td className="px-2 sm:px-3 py-3 text-center">
                  <span className="text-xs sm:text-sm font-medium text-viktoria-blue dark:text-viktoria-yellow">{team.won}</span>
                </td>
                <td className="px-2 sm:px-3 py-3 text-center">
                  <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">{team.drawn}</span>
                </td>
                <td className="px-2 sm:px-3 py-3 text-center">
                  <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-500">{team.lost}</span>
                </td>
                <td className="px-2 sm:px-3 py-3 text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400 hidden sm:table-cell">
                  <span className="font-mono">{team.goals_for}:{team.goals_against}</span>
                </td>
                <td className="px-2 sm:px-3 py-3 text-center">
                  <span className={`text-sm sm:text-base font-bold ${
                    (team.team_name?.includes('Viktoria Wertheim') || team.team_name?.includes('Vikt. Wertheim'))
                      ? 'text-viktoria-blue dark:text-viktoria-yellow' 
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {team.points}
                  </span>
                </td>
                <td className="px-1 py-3 text-center">{getTrendIcon(team.trend)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {onShowFullTable && (
        <div className="px-4 py-3 bg-gradient-to-b from-gray-50 to-white dark:from-viktoria-dark-lighter dark:to-viktoria-dark-light border-t border-gray-100 dark:border-gray-700">
          <button 
            onClick={onShowFullTable}
            className="w-full text-sm font-semibold text-viktoria-blue dark:text-viktoria-yellow hover:text-viktoria-blue-light dark:hover:text-yellow-500 transition-colors flex items-center justify-center gap-2 py-1"
          >
            Vollständige Tabelle anzeigen
            <span className="text-lg">→</span>
          </button>
        </div>
      )}
    </div>
  )
}