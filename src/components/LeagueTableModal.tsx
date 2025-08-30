'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IconX, IconTrendingUp, IconTrendingDown, IconMinus } from '@tabler/icons-react'

interface LeagueTableModalProps {
  isOpen: boolean
  onClose: () => void
  selectedTeam: string
}

interface TeamData {
  position: number
  team: string
  matches: number
  wins: number
  draws: number
  losses: number
  goals: string
  diff: string
  points: number
  trend: 'up' | 'down' | 'same'
  isPromoted?: boolean
  isRelegation?: boolean
  isPlayoff?: boolean
  isOwnTeam?: boolean
}

export default function LeagueTableModal({ isOpen, onClose, selectedTeam }: LeagueTableModalProps) {
  // Mock data for different teams
  const getTableData = (team: string): TeamData[] => {
    if (team === '1') {
      return [
        { position: 1, team: 'TSV Kreuzwertheim', matches: 18, wins: 13, draws: 3, losses: 2, goals: '41:15', diff: '+26', points: 42, trend: 'up', isPromoted: true },
        { position: 2, team: 'FC Külsheim', matches: 18, wins: 12, draws: 4, losses: 2, goals: '38:18', diff: '+20', points: 40, trend: 'same', isPromoted: true },
        { position: 3, team: 'SV Viktoria Wertheim', matches: 18, wins: 11, draws: 5, losses: 2, goals: '35:16', diff: '+19', points: 38, trend: 'up', isPlayoff: true, isOwnTeam: true },
        { position: 4, team: 'SpVgg Hainstadt', matches: 18, wins: 10, draws: 4, losses: 4, goals: '32:20', diff: '+12', points: 34, trend: 'down', isPlayoff: true },
        { position: 5, team: 'TSV Mudau', matches: 18, wins: 9, draws: 5, losses: 4, goals: '30:22', diff: '+8', points: 32, trend: 'up' },
        { position: 6, team: 'SV Nassig', matches: 18, wins: 8, draws: 6, losses: 4, goals: '28:24', diff: '+4', points: 30, trend: 'same' },
        { position: 7, team: 'TSV Höpfingen', matches: 18, wins: 7, draws: 5, losses: 6, goals: '25:26', diff: '-1', points: 26, trend: 'down' },
        { position: 8, team: 'FV Mosbach', matches: 18, wins: 6, draws: 5, losses: 7, goals: '22:28', diff: '-6', points: 23, trend: 'same' },
        { position: 9, team: 'TSV Oberwittstadt', matches: 18, wins: 5, draws: 6, losses: 7, goals: '20:30', diff: '-10', points: 21, trend: 'up' },
        { position: 10, team: 'FC Grünsfeld', matches: 18, wins: 5, draws: 4, losses: 9, goals: '18:32', diff: '-14', points: 19, trend: 'down' },
        { position: 11, team: 'SV Königshofen', matches: 18, wins: 4, draws: 5, losses: 9, goals: '16:35', diff: '-19', points: 17, trend: 'same' },
        { position: 12, team: 'TSV Rosenberg', matches: 18, wins: 3, draws: 5, losses: 10, goals: '15:38', diff: '-23', points: 14, trend: 'down', isRelegation: true },
        { position: 13, team: 'SpG Windischbuch/Schwabhausen', matches: 18, wins: 2, draws: 4, losses: 12, goals: '12:40', diff: '-28', points: 10, trend: 'same', isRelegation: true },
        { position: 14, team: 'SG Unterschüpf/Kupprichhausen', matches: 18, wins: 1, draws: 3, losses: 14, goals: '10:42', diff: '-32', points: 6, trend: 'down', isRelegation: true }
      ]
    } else if (team === '2') {
      return [
        { position: 1, team: 'FC Hundheim/Steinbach', matches: 16, wins: 12, draws: 2, losses: 2, goals: '42:15', diff: '+27', points: 38, trend: 'up', isPromoted: true },
        { position: 2, team: 'SV Viktoria Wertheim II', matches: 16, wins: 11, draws: 3, losses: 2, goals: '38:18', diff: '+20', points: 36, trend: 'same', isOwnTeam: true, isPromoted: true },
        { position: 3, team: 'TSV Gerchsheim', matches: 16, wins: 10, draws: 3, losses: 3, goals: '35:20', diff: '+15', points: 33, trend: 'up' },
        { position: 4, team: 'SV Schönfeld', matches: 16, wins: 9, draws: 3, losses: 4, goals: '30:22', diff: '+8', points: 30, trend: 'down' },
        { position: 5, team: 'SpG Boxtal/Mondfeld', matches: 16, wins: 8, draws: 4, losses: 4, goals: '28:24', diff: '+4', points: 28, trend: 'up' },
        { position: 6, team: 'TSV Werbach', matches: 16, wins: 7, draws: 4, losses: 5, goals: '26:25', diff: '+1', points: 25, trend: 'same' },
        { position: 7, team: 'FC Freudenberg', matches: 16, wins: 6, draws: 4, losses: 6, goals: '24:28', diff: '-4', points: 22, trend: 'down' },
        { position: 8, team: 'TSV Buchen II', matches: 16, wins: 5, draws: 4, losses: 7, goals: '20:30', diff: '-10', points: 19, trend: 'same' },
        { position: 9, team: 'SG Rauenberg', matches: 16, wins: 4, draws: 5, losses: 7, goals: '18:32', diff: '-14', points: 17, trend: 'up' },
        { position: 10, team: 'FV Reichenbuch', matches: 16, wins: 3, draws: 4, losses: 9, goals: '15:35', diff: '-20', points: 13, trend: 'down', isRelegation: true },
        { position: 11, team: 'TSV Götzingen', matches: 16, wins: 2, draws: 3, losses: 11, goals: '12:38', diff: '-26', points: 9, trend: 'same', isRelegation: true },
        { position: 12, team: 'FC Altheim', matches: 16, wins: 1, draws: 2, losses: 13, goals: '10:40', diff: '-30', points: 5, trend: 'down', isRelegation: true }
      ]
    } else {
      return [
        { position: 1, team: 'JFG Taubertal U19', matches: 14, wins: 11, draws: 2, losses: 1, goals: '45:12', diff: '+33', points: 35, trend: 'up', isPromoted: true },
        { position: 2, team: 'TSG Hoffenheim U18', matches: 14, wins: 10, draws: 3, losses: 1, goals: '42:15', diff: '+27', points: 33, trend: 'same', isPromoted: true },
        { position: 3, team: 'SV Viktoria Wertheim U19', matches: 14, wins: 9, draws: 3, losses: 2, goals: '38:18', diff: '+20', points: 30, trend: 'up', isOwnTeam: true },
        { position: 4, team: 'FC Astoria Walldürn U19', matches: 14, wins: 8, draws: 2, losses: 4, goals: '32:22', diff: '+10', points: 26, trend: 'down' },
        { position: 5, team: 'TSV Tauberbischofsheim U19', matches: 14, wins: 7, draws: 3, losses: 4, goals: '28:24', diff: '+4', points: 24, trend: 'up' },
        { position: 6, team: 'SV Königheim U19', matches: 14, wins: 6, draws: 3, losses: 5, goals: '25:26', diff: '-1', points: 21, trend: 'same' },
        { position: 7, team: 'SpG Krautheim/Westernhausen U19', matches: 14, wins: 5, draws: 3, losses: 6, goals: '22:28', diff: '-6', points: 18, trend: 'down' },
        { position: 8, team: 'TSV Oberwittstadt U19', matches: 14, wins: 4, draws: 4, losses: 6, goals: '20:30', diff: '-10', points: 16, trend: 'same' },
        { position: 9, team: 'FV Lauda U19', matches: 14, wins: 3, draws: 3, losses: 8, goals: '18:35', diff: '-17', points: 12, trend: 'up' },
        { position: 10, team: 'TSV Mudau U19', matches: 14, wins: 2, draws: 2, losses: 10, goals: '15:40', diff: '-25', points: 8, trend: 'down', isRelegation: true },
        { position: 11, team: 'SG Boxtal/Mondfeld U19', matches: 14, wins: 1, draws: 1, losses: 12, goals: '10:45', diff: '-35', points: 4, trend: 'same', isRelegation: true }
      ]
    }
  }

  const tableData = getTableData(selectedTeam)
  const teamName = selectedTeam === '1' ? '1. Mannschaft' : selectedTeam === '2' ? '2. Mannschaft' : 'U19'
  const leagueName = selectedTeam === '1' ? 'Kreisliga Tauberbischofsheim' : selectedTeam === '2' ? 'Kreisklasse A' : 'Junioren Kreisliga'

  const getTrendIcon = (trend: string) => {
    switch(trend) {
      case 'up': return <IconTrendingUp size={16} className="text-green-600 dark:text-green-500" />
      case 'down': return <IconTrendingDown size={16} className="text-red-600 dark:text-red-500" />
      default: return <IconMinus size={16} className="text-gray-400" />
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-5xl md:w-full md:max-h-[90vh] bg-white dark:bg-viktoria-dark-light rounded-xl shadow-2xl overflow-hidden z-50"
          >
            {/* Header */}
            <div className="bg-white dark:bg-viktoria-dark-light">
              <div className="border-b-2 border-viktoria-blue dark:border-viktoria-yellow px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-gray-900 dark:text-white font-semibold text-lg">{leagueName}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Saison 2024/25 - {teamName}</p>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  aria-label="Schließen"
                >
                  <IconX size={24} />
                </button>
              </div>
            </div>

            {/* Table Content */}
            <div className="overflow-auto max-h-[calc(90vh-80px)]">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-viktoria-dark sticky top-0">
                  <tr>
                    <th className="px-2 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400">Pl.</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400">Mannschaft</th>
                    <th className="px-2 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400">Sp.</th>
                    <th className="px-2 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400">S</th>
                    <th className="px-2 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400">U</th>
                    <th className="px-2 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400">N</th>
                    <th className="px-2 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400">Tore</th>
                    <th className="px-2 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400">Diff.</th>
                    <th className="px-2 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400">Pkt.</th>
                    <th className="px-2 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {tableData.map((team) => (
                    <tr 
                      key={team.position} 
                      className={`
                        ${team.isOwnTeam ? 'bg-viktoria-blue/10 dark:bg-viktoria-yellow/10' : ''}
                        ${team.isPromoted ? 'bg-green-50 dark:bg-green-900/20' : ''}
                        ${team.isPlayoff ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                        ${team.isRelegation ? 'bg-red-50 dark:bg-red-900/20' : ''}
                        hover:bg-gray-50 dark:hover:bg-viktoria-dark-lighter transition-colors
                      `}
                    >
                      <td className="px-2 py-3 text-sm font-semibold text-gray-900 dark:text-white">
                        {team.position}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                        <div className="flex items-center">
                          {team.team}
                          {team.isOwnTeam && (
                            <span className="ml-2 text-xs font-semibold text-viktoria-blue dark:text-viktoria-yellow">
                              (SV Viktoria)
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-2 py-3 text-sm text-center text-gray-600 dark:text-gray-400">
                        {team.matches}
                      </td>
                      <td className="px-2 py-3 text-sm text-center text-gray-600 dark:text-gray-400">
                        {team.wins}
                      </td>
                      <td className="px-2 py-3 text-sm text-center text-gray-600 dark:text-gray-400">
                        {team.draws}
                      </td>
                      <td className="px-2 py-3 text-sm text-center text-gray-600 dark:text-gray-400">
                        {team.losses}
                      </td>
                      <td className="px-2 py-3 text-sm text-center text-gray-600 dark:text-gray-400">
                        {team.goals}
                      </td>
                      <td className="px-2 py-3 text-sm text-center font-medium text-gray-900 dark:text-white">
                        {team.diff}
                      </td>
                      <td className="px-2 py-3 text-sm text-center font-bold text-gray-900 dark:text-white">
                        {team.points}
                      </td>
                      <td className="px-2 py-3 text-center">
                        {getTrendIcon(team.trend)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Legend */}
              <div className="p-4 bg-gray-50 dark:bg-viktoria-dark border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-wrap gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-100 dark:bg-green-900/30 rounded"></div>
                    <span className="text-gray-600 dark:text-gray-400">Aufstieg</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-100 dark:bg-blue-900/30 rounded"></div>
                    <span className="text-gray-600 dark:text-gray-400">Relegation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-100 dark:bg-red-900/30 rounded"></div>
                    <span className="text-gray-600 dark:text-gray-400">Abstieg</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-viktoria-blue/20 dark:bg-viktoria-yellow/20 rounded"></div>
                    <span className="text-gray-600 dark:text-gray-400">SV Viktoria Wertheim</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}