'use client'

import React from 'react'
import { IconTrendingUp, IconTrendingDown, IconMinus } from '@tabler/icons-react'
import type { Database } from '@/lib/database.types'

type LeagueStanding = Database['public']['Tables']['league_standings']['Row']

interface SimpleLeagueTableProps {
  standings: LeagueStanding[]
  selectedTeamId: string
  onShowFullTable?: () => void
}

export default function SimpleLeagueTable({ standings, selectedTeamId, onShowFullTable }: SimpleLeagueTableProps) {
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

  if (!standings || standings.length === 0) {
    return (
      <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">Keine Tabellendaten verfügbar</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden">
      <div className="border-b-2 border-viktoria-blue dark:border-viktoria-yellow px-4 py-2 text-center">
        <h3 className="text-gray-900 dark:text-white font-semibold text-sm">Tabelle</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-viktoria-dark-lighter">
            <tr>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Pl.</th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Team</th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400">Sp.</th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400">S</th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400">U</th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400">N</th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400">Tore</th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400">Pkt.</th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-viktoria-dark-lighter">
            {standings.slice(0, 5).map((team) => (
              <tr 
                key={team.id}
                className={`hover:bg-gray-50 dark:hover:bg-viktoria-dark-lighter transition-colors ${
                  team.team_id === selectedTeamId ? 'bg-viktoria-blue/10 dark:bg-viktoria-yellow/10' : ''
                }`}
              >
                <td className="px-2 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">
                  {team.position}
                </td>
                <td className="px-2 py-2 text-left">
                  <span className={`text-sm ${team.team_id === selectedTeamId ? 'font-bold text-viktoria-blue dark:text-viktoria-yellow' : 'text-gray-700 dark:text-gray-300'}`}>
                    {team.team_name}
                  </span>
                </td>
                <td className="px-2 py-2 text-center text-sm text-gray-600 dark:text-gray-400">{team.played}</td>
                <td className="px-2 py-2 text-center text-sm text-gray-600 dark:text-gray-400">{team.won}</td>
                <td className="px-2 py-2 text-center text-sm text-gray-600 dark:text-gray-400">{team.drawn}</td>
                <td className="px-2 py-2 text-center text-sm text-gray-600 dark:text-gray-400">{team.lost}</td>
                <td className="px-2 py-2 text-center text-sm text-gray-600 dark:text-gray-400">
                  {team.goals_for}:{team.goals_against}
                </td>
                <td className="px-2 py-2 text-center text-sm font-bold text-gray-900 dark:text-white">{team.points}</td>
                <td className="px-2 py-2 text-center">{getTrendIcon(team.trend)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {onShowFullTable && (
        <div className="px-4 py-3 bg-gray-50 dark:bg-viktoria-dark-lighter">
          <button 
            onClick={onShowFullTable}
            className="text-sm text-viktoria-blue dark:text-viktoria-yellow hover:underline"
          >
            Vollständige Tabelle anzeigen →
          </button>
        </div>
      )}
    </div>
  )
}