'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IconX, IconTrendingUp, IconTrendingDown, IconMinus } from '@tabler/icons-react'
import type { Database } from '@/lib/database.types'

type Team = Database['public']['Tables']['teams']['Row']
type LeagueStanding = Database['public']['Tables']['league_standings']['Row']

interface LeagueTableModalProps {
  isOpen: boolean
  onClose: () => void
  selectedTeam: string
  allStandings?: LeagueStanding[]
  teams?: Team[]
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

export default function LeagueTableModal({ isOpen, onClose, selectedTeam, allStandings = [], teams = [] }: LeagueTableModalProps) {
  const [tableData, setTableData] = useState<TeamData[]>([])
  const [teamInfo, setTeamInfo] = useState<{ name: string; league: string } | null>(null)

  useEffect(() => {
    if (isOpen && selectedTeam) {
      processLeagueData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, selectedTeam, allStandings, teams])

  const processLeagueData = () => {
    try {
      // Map selectedTeam ('1', '2', '3') to actual team IDs
      const teamIdMap: Record<string, string> = {
        '1': '229cb117-471a-4bcc-b60e-d73772738943', // SV Viktoria Wertheim (1. Mannschaft)
        '2': '568e99ad-d9e1-4f2d-a517-88d3a725755b', // SV Viktoria Wertheim 2 (2. Mannschaft)
        '3': 'b86367ef-883f-4b73-9c98-77e7a0daf8b8'  // SpG Viktoria Wertheim 3/Grünenwört (3. Mannschaft)
      }
      
      const actualTeamId = teamIdMap[selectedTeam] || selectedTeam
      
      // Get team info from props
      const teamData = teams.find(t => t.id === actualTeamId)

      if (!teamData) {
        // Fallback for team info
        const fallbackTeamName = selectedTeam === '1' ? '1. Mannschaft' : selectedTeam === '2' ? '2. Mannschaft' : 'U19'
        const fallbackLeagueName = selectedTeam === '1' ? 'Kreisliga Tauberbischofsheim' : selectedTeam === '2' ? 'Kreisklasse A' : 'Junioren Kreisliga'
        setTeamInfo({ name: fallbackTeamName, league: fallbackLeagueName })
        setTableData([])
      } else {
        setTeamInfo({ name: teamData.name || '', league: teamData.league || 'Unbekannte Liga' })
        
        // Filter league standings for that league
        if (teamData.league && allStandings) {
          // Get all teams in the same league
          const teamsInLeague = teams.filter(t => t.league === teamData.league)
          const teamIdsInLeague = teamsInLeague.map(t => t.id)

          // Filter standings for teams in this league
          const standingsData = allStandings.filter(s => s.team_id && teamIdsInLeague.includes(s.team_id))

          if (standingsData.length > 0) {
            // Map database data to component interface
            const mappedData: TeamData[] = standingsData.map(row => {
              const team = teams.find(t => t.id === row.team_id)
              return {
              position: row.position,
              team: team?.name || 'Unknown Team',
              matches: row.played || 0,
              wins: row.won || 0,
              draws: row.drawn || 0,
              losses: row.lost || 0,
              goals: `${row.goals_for || 0}:${row.goals_against || 0}`,
              diff: row.goal_difference ? (row.goal_difference > 0 ? `+${row.goal_difference}` : `${row.goal_difference}`) : '0',
              points: row.points || 0,
              trend: (row.trend === 'up' || row.trend === 'down' || row.trend === 'same') ? row.trend : 'same',
              // Check if this is our team
              isOwnTeam: row.team_id === actualTeamId || (team?.name || '').includes('Viktoria Wertheim'),
              // Mark promotion/relegation zones based on position
              isPromoted: row.position <= 2,
              isPlayoff: row.position === 3 || row.position === 4,
              isRelegation: row.position >= (standingsData.length - 2)
            }
            })
            setTableData(mappedData)
          } else {
            setTableData([])
          }
        } else {
          setTableData([])
        }
      }
    } catch {
      // Error is handled in parent component
      setTableData([])
    }
  }

  const teamName = teamInfo?.name || (selectedTeam === '1' ? '1. Mannschaft' : selectedTeam === '2' ? '2. Mannschaft' : 'U19')
  const leagueName = teamInfo?.league || (selectedTeam === '1' ? 'Kreisliga Tauberbischofsheim' : selectedTeam === '2' ? 'Kreisklasse A' : 'Junioren Kreisliga')

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
            <div className="bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-white dark:text-gray-900 font-bold text-lg uppercase tracking-wider">{leagueName}</h2>
                <p className="text-sm text-white/80 dark:text-gray-700 mt-1">Saison 2024/25 - {teamName}</p>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 dark:text-gray-700 hover:text-white dark:hover:text-gray-900 transition-colors"
                aria-label="Schließen"
              >
                <IconX size={24} />
              </button>
            </div>

            {/* Table Content */}
            <div className="overflow-auto max-h-[calc(90vh-80px)]">
              {tableData.length === 0 ? (
                <div className="flex items-center justify-center p-12">
                  <p className="text-gray-500 dark:text-gray-400">Keine Tabellendaten verfügbar</p>
                </div>
              ) : (
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-viktoria-dark sticky top-0">
                  <tr>
                    <th scope="col" className="px-2 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400">Pl.</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400">Mannschaft</th>
                    <th scope="col" className="px-2 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400">Sp.</th>
                    <th scope="col" className="px-2 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400">S</th>
                    <th scope="col" className="px-2 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400">U</th>
                    <th scope="col" className="px-2 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400">N</th>
                    <th scope="col" className="px-2 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400">Tore</th>
                    <th scope="col" className="px-2 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400">Diff.</th>
                    <th scope="col" className="px-2 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400">Pkt.</th>
                    <th scope="col" className="px-2 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400">Trend</th>
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
              )}

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