'use client'

import React from 'react'
import { IconTrendingUp, IconTrendingDown, IconMinus } from '@tabler/icons-react'

interface SimpleLeagueTableProps {
  selectedTeam: '1' | '2' | '3'
  onShowFullTable?: () => void
}

export default function SimpleLeagueTable({ selectedTeam, onShowFullTable }: SimpleLeagueTableProps) {
  // Mock-Daten für Ligatabellen
  const tables = {
    '1': [
      { position: 1, team: 'FC Külsheim', games: 12, wins: 10, draws: 1, losses: 1, goals: '32:8', points: 31, trend: 'up' },
      { position: 2, team: 'TSV Kreuzwertheim', games: 12, wins: 9, draws: 2, losses: 1, goals: '28:11', points: 29, trend: 'up' },
      { position: 3, team: 'SV Viktoria Wertheim', games: 12, wins: 9, draws: 1, losses: 2, goals: '25:12', points: 28, trend: 'neutral', isOurTeam: true },
      { position: 4, team: 'FC Mondfeld', games: 12, wins: 7, draws: 3, losses: 2, goals: '22:15', points: 24, trend: 'down' },
      { position: 5, team: 'SG Dertingen', games: 12, wins: 6, draws: 2, losses: 4, goals: '20:18', points: 20, trend: 'up' },
    ],
    '2': [
      { position: 3, team: 'FC Eichel II', games: 12, wins: 8, draws: 2, losses: 2, goals: '26:14', points: 26, trend: 'up' },
      { position: 4, team: 'SV Nassig II', games: 12, wins: 7, draws: 2, losses: 3, goals: '24:16', points: 23, trend: 'neutral' },
      { position: 5, team: 'SV Viktoria Wertheim II', games: 12, wins: 7, draws: 1, losses: 4, goals: '22:18', points: 22, trend: 'down', isOurTeam: true },
      { position: 6, team: 'SG Dertingen II', games: 12, wins: 6, draws: 1, losses: 5, goals: '20:20', points: 19, trend: 'down' },
      { position: 7, team: 'TSV Urphar', games: 12, wins: 5, draws: 2, losses: 5, goals: '18:22', points: 17, trend: 'neutral' },
    ],
    '3': [
      { position: 6, team: 'FC Grünenwört', games: 12, wins: 5, draws: 3, losses: 4, goals: '19:17', points: 18, trend: 'up' },
      { position: 7, team: 'SV Stadtprozelten', games: 12, wins: 5, draws: 2, losses: 5, goals: '18:20', points: 17, trend: 'neutral' },
      { position: 8, team: 'SV Viktoria Wertheim III', games: 12, wins: 4, draws: 3, losses: 5, goals: '16:19', points: 15, trend: 'up', isOurTeam: true },
      { position: 9, team: 'FC Bettingen', games: 12, wins: 3, draws: 3, losses: 6, goals: '14:22', points: 12, trend: 'down' },
      { position: 10, team: 'SV Kembach', games: 12, wins: 2, draws: 2, losses: 8, goals: '10:28', points: 8, trend: 'down' },
    ]
  }

  const currentTable = tables[selectedTeam]

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <IconTrendingUp size={16} className="text-green-500" />
      case 'down':
        return <IconTrendingDown size={16} className="text-red-500" />
      default:
        return <IconMinus size={16} className="text-gray-400" />
    }
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
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Pl.</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Team</th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 hidden sm:table-cell">Sp.</th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 hidden md:table-cell">S</th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 hidden md:table-cell">U</th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 hidden md:table-cell">N</th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 hidden sm:table-cell">Tore</th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400">Pkt.</th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-viktoria-dark-lighter">
            {currentTable.map((row) => (
              <tr 
                key={row.position}
                className={`${
                  row.isOurTeam 
                    ? 'bg-viktoria-blue/10 dark:bg-viktoria-yellow/10 font-semibold' 
                    : 'hover:bg-gray-50 dark:hover:bg-viktoria-dark-lighter/50'
                } transition-colors`}
              >
                <td className="px-3 py-3 text-sm text-gray-900 dark:text-gray-100">{row.position}.</td>
                <td className="px-3 py-3 text-sm text-gray-900 dark:text-gray-100">
                  {row.team}
                  {row.isOurTeam && <span className="ml-1 text-viktoria-blue dark:text-viktoria-yellow">●</span>}
                </td>
                <td className="px-3 py-3 text-sm text-center text-gray-600 dark:text-gray-300 hidden sm:table-cell">{row.games}</td>
                <td className="px-3 py-3 text-sm text-center text-gray-600 dark:text-gray-300 hidden md:table-cell">{row.wins}</td>
                <td className="px-3 py-3 text-sm text-center text-gray-600 dark:text-gray-300 hidden md:table-cell">{row.draws}</td>
                <td className="px-3 py-3 text-sm text-center text-gray-600 dark:text-gray-300 hidden md:table-cell">{row.losses}</td>
                <td className="px-3 py-3 text-sm text-center text-gray-600 dark:text-gray-300 hidden sm:table-cell">{row.goals}</td>
                <td className="px-3 py-3 text-sm text-center font-bold text-gray-900 dark:text-gray-100">{row.points}</td>
                <td className="px-3 py-3 text-center">{getTrendIcon(row.trend)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-3 bg-gray-50 dark:bg-viktoria-dark-lighter">
        <button 
          onClick={onShowFullTable}
          className="text-sm text-viktoria-blue dark:text-viktoria-yellow hover:underline"
        >
          Vollständige Tabelle anzeigen →
        </button>
      </div>
    </div>
  )
}