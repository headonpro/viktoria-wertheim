'use client'

import React from 'react'
import { IconTrophy, IconChartBar, IconUsers, IconShield } from '@tabler/icons-react'
import type { Database } from '@/lib/database.types'

type Team = Database['public']['Tables']['teams']['Row']

interface TeamStatusProps {
  selectedTeam: '1' | '2' | '3'
  onTeamChange: (team: '1' | '2' | '3') => void
  teams?: Team[]
}

export default function TeamStatus({ selectedTeam, onTeamChange, teams: teamsData }: TeamStatusProps) {
  // Use data from props if available, otherwise use fallback
  const getTeamInfo = () => {
    if (teamsData && teamsData.length > 0) {
      const team = teamsData.find(t => t.id === selectedTeam)
      if (team) {
        return {
          name: team.name || team.short_name || `${selectedTeam}. Mannschaft`,
          league: team.league || 'Unbekannte Liga',
          position: team.table_position || 0,
          points: team.points || 0
        }
      }
    }
    
    // Fallback data if no teams data is provided
    const fallbackTeams = {
      '1': { name: '1. Mannschaft', league: 'Kreisliga A', position: 3, points: 28 },
      '2': { name: '2. Mannschaft', league: 'Kreisliga B', position: 5, points: 22 },
      '3': { name: '3. Mannschaft', league: 'Kreisliga C', position: 8, points: 15 }
    }
    return fallbackTeams[selectedTeam] || fallbackTeams['1']
  }

  // Calculate wins, draws, losses from points and games played
  // This is a simplified calculation - in a real app, you'd fetch this from matches table
  const calculateStats = () => {
    const teamInfo = getTeamInfo()
    const gamesPlayed = 12 // Default value, could be calculated from matches
    
    // Rough calculation based on points (3 for win, 1 for draw)
    const winEstimate = Math.floor(teamInfo.points / 3)
    const remainingPoints = teamInfo.points % 3
    const drawEstimate = remainingPoints
    const lossEstimate = Math.max(0, gamesPlayed - winEstimate - drawEstimate)
    
    return {
      position: teamInfo.position,
      points: teamInfo.points,
      wins: winEstimate,
      draws: drawEstimate,
      losses: lossEstimate
    }
  }

  const teams = {
    '1': { name: getTeamInfo().name, league: getTeamInfo().league, color: 'from-viktoria-blue to-viktoria-blue-light' },
    '2': { name: teamsData?.find(t => t.id === '2')?.name || '2. Mannschaft', league: teamsData?.find(t => t.id === '2')?.league || 'Kreisliga B', color: 'from-viktoria-green to-green-600' },
    '3': { name: teamsData?.find(t => t.id === '3')?.name || '3. Mannschaft', league: teamsData?.find(t => t.id === '3')?.league || 'Kreisliga C', color: 'from-gray-600 to-gray-700' }
  }

  const currentTeam = teams[selectedTeam]
  const currentStats = calculateStats()

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

      {/* Team Statistics */}
      <div className="p-4 sm:p-5">
        {/* Mobile Layout - Kompakte 2x2 Cards */}
        <div className="md:hidden">
          <div className="grid grid-cols-2 gap-4">
            {/* Position & Punkte Card */}
            <div className="bg-gray-50 dark:bg-viktoria-dark-lighter rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-viktoria-dark transition-colors duration-200">
              <div className="flex items-center justify-between mb-3">
                <IconTrophy size={20} className="text-viktoria-blue dark:text-viktoria-yellow" />
                <span className="text-3xl font-bold text-viktoria-blue dark:text-viktoria-yellow">{currentStats.position}</span>
              </div>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">Tabellenplatz</p>
              <div className="mt-2">
                <span className="text-lg font-bold text-gray-900 dark:text-white">{currentStats.points}</span>
                <span className="text-xs text-gray-500 dark:text-gray-500 ml-1">Punkte</span>
              </div>
            </div>

            {/* Siege Card */}
            <div className="bg-gray-50 dark:bg-viktoria-dark-lighter rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-viktoria-dark transition-colors duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">S</span>
                </div>
                <span className="text-3xl font-bold text-green-600 dark:text-green-400">{currentStats.wins}</span>
              </div>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">Siege</p>
            </div>

            {/* Unentschieden Card */}
            <div className="bg-gray-50 dark:bg-viktoria-dark-lighter rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-viktoria-dark transition-colors duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">U</span>
                </div>
                <span className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{currentStats.draws}</span>
              </div>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">Unentschieden</p>
            </div>

            {/* Niederlagen Card */}
            <div className="bg-gray-50 dark:bg-viktoria-dark-lighter rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-viktoria-dark transition-colors duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">N</span>
                </div>
                <span className="text-3xl font-bold text-red-600 dark:text-red-400">{currentStats.losses}</span>
              </div>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">Niederlagen</p>
            </div>
          </div>

          {/* Liga Info Bar - Mobile */}
          <div className="mt-4 bg-gradient-to-r from-gray-50 to-white dark:from-viktoria-dark-lighter dark:to-viktoria-dark-light rounded-lg px-4 py-3 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <IconUsers size={16} className="text-viktoria-blue dark:text-viktoria-yellow" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {currentTeam.league}
                </span>
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                Saison 24/25
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Layout - Improved 5-Column Grid */}
        <div className="hidden md:block">
          <div className="grid grid-cols-5 gap-4">
            {/* Position */}
            <div className="bg-gray-50 dark:bg-viktoria-dark-lighter rounded-lg p-3 text-center hover:bg-gray-100 dark:hover:bg-viktoria-dark transition-colors duration-200">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <IconTrophy size={16} className="text-viktoria-blue dark:text-viktoria-yellow" />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">Platz</span>
              </div>
              <p className="text-2xl font-bold text-viktoria-blue dark:text-viktoria-yellow">{currentStats.position}.</p>
            </div>

            {/* Points */}
            <div className="bg-gray-50 dark:bg-viktoria-dark-lighter rounded-lg p-3 text-center hover:bg-gray-100 dark:hover:bg-viktoria-dark transition-colors duration-200">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <IconChartBar size={16} className="text-viktoria-blue dark:text-viktoria-yellow" />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">Punkte</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentStats.points}</p>
            </div>

            {/* Wins */}
            <div className="bg-gray-50 dark:bg-viktoria-dark-lighter rounded-lg p-3 text-center hover:bg-gray-100 dark:hover:bg-viktoria-dark transition-colors duration-200">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">Siege</span>
              </div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{currentStats.wins}</p>
            </div>

            {/* Draws */}
            <div className="bg-gray-50 dark:bg-viktoria-dark-lighter rounded-lg p-3 text-center hover:bg-gray-100 dark:hover:bg-viktoria-dark transition-colors duration-200">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">Unentschieden</span>
              </div>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{currentStats.draws}</p>
            </div>

            {/* Losses */}
            <div className="bg-gray-50 dark:bg-viktoria-dark-lighter rounded-lg p-3 text-center hover:bg-gray-100 dark:hover:bg-viktoria-dark transition-colors duration-200">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">Niederlagen</span>
              </div>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{currentStats.losses}</p>
            </div>
          </div>

          {/* Additional Info - Desktop */}
          <div className="mt-4 bg-gradient-to-r from-gray-50 to-white dark:from-viktoria-dark-lighter dark:to-viktoria-dark-light rounded-lg px-4 py-3 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <IconUsers size={16} className="text-viktoria-blue dark:text-viktoria-yellow" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {currentTeam.league} • Saison 2024/2025
                </span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                12 Spiele gespielt
              </div>
            </div>
          </div>
        </div>
    </div>
    </div>
  )
}