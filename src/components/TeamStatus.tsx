'use client'

import React from 'react'
import { IconTrophy, IconChartBar, IconUsers } from '@tabler/icons-react'

interface TeamStatusProps {
  selectedTeam: '1' | '2' | '3'
  onTeamChange: (team: '1' | '2' | '3') => void
}

export default function TeamStatus({ selectedTeam, onTeamChange }: TeamStatusProps) {
  const teams = {
    '1': { name: '1. Mannschaft', league: 'Kreisliga A', color: 'from-viktoria-blue to-viktoria-blue-light' },
    '2': { name: '2. Mannschaft', league: 'Kreisliga B', color: 'from-viktoria-green to-green-600' },
    '3': { name: '3. Mannschaft', league: 'Kreisliga C', color: 'from-gray-600 to-gray-700' }
  }

  // Mock-Daten für Team-Statistiken
  const teamStats = {
    '1': { position: 3, points: 28, wins: 9, draws: 1, losses: 2 },
    '2': { position: 5, points: 22, wins: 7, draws: 1, losses: 4 },
    '3': { position: 8, points: 15, wins: 4, draws: 3, losses: 5 }
  }

  const currentTeam = teams[selectedTeam]
  const currentStats = teamStats[selectedTeam]

  return (
    <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden">
      {/* Team Selector Tabs */}
      <div className="flex border-b border-gray-200 dark:border-viktoria-dark-lighter">
        {Object.entries(teams).map(([key, team]) => (
          <button
            key={key}
            onClick={() => onTeamChange(key as '1' | '2' | '3')}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-all duration-300 ${
              selectedTeam === key
                ? 'text-viktoria-blue dark:text-viktoria-yellow border-b-2 border-viktoria-blue dark:border-viktoria-yellow bg-gray-50 dark:bg-viktoria-dark-lighter'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-viktoria-dark-lighter/50'
            }`}
          >
            {team.name}
            <span className="ml-2 text-xs text-gray-500 dark:text-gray-500 hidden sm:inline">
              {team.league}
            </span>
          </button>
        ))}
      </div>

      {/* Team Statistics */}
      <div className="p-4">
        {/* Mobile Layout - Kompakte 2x2 Ansicht */}
        <div className="md:hidden">
          <div className="grid grid-cols-2 gap-3">
            {/* Position & Punkte Karte */}
            <div className="bg-gray-50 dark:bg-viktoria-dark-lighter rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <IconTrophy size={20} className="text-viktoria-yellow" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{currentStats.position}.</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Tabellenplatz</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">{currentStats.points} Punkte</p>
            </div>

            {/* Bilanz Karte */}
            <div className="bg-gray-50 dark:bg-viktoria-dark-lighter rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <IconChartBar size={20} className="text-viktoria-yellow" />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Bilanz</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600 dark:text-gray-400">S</span>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">{currentStats.wins}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600 dark:text-gray-400">U</span>
                  <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{currentStats.draws}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600 dark:text-gray-400">N</span>
                  <span className="text-lg font-bold text-red-600 dark:text-red-400">{currentStats.losses}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Liga Info Bar */}
          <div className="mt-3 bg-gray-50 dark:bg-viktoria-dark-lighter rounded-lg px-3 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <IconUsers size={14} className="text-viktoria-yellow" />
                <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                  {currentTeam.league}
                </span>
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                12 Spiele • Saison 24/25
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Layout - Original 5er Grid */}
        <div className="hidden md:block">
          <div className="grid grid-cols-5 gap-4">
            {/* Position */}
            <div className="bg-gray-50 dark:bg-viktoria-dark-lighter rounded-lg p-3 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <IconTrophy size={16} className="text-viktoria-yellow" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Platz</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentStats.position}.</p>
            </div>

            {/* Points */}
            <div className="bg-gray-50 dark:bg-viktoria-dark-lighter rounded-lg p-3 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <IconChartBar size={16} className="text-viktoria-yellow" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Punkte</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentStats.points}</p>
            </div>

            {/* Wins */}
            <div className="bg-gray-50 dark:bg-viktoria-dark-lighter rounded-lg p-3 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span className="text-xs text-gray-600 dark:text-gray-400">Siege</span>
              </div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{currentStats.wins}</p>
            </div>

            {/* Draws */}
            <div className="bg-gray-50 dark:bg-viktoria-dark-lighter rounded-lg p-3 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span className="text-xs text-gray-600 dark:text-gray-400">Unent.</span>
              </div>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{currentStats.draws}</p>
            </div>

            {/* Losses */}
            <div className="bg-gray-50 dark:bg-viktoria-dark-lighter rounded-lg p-3 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span className="text-xs text-gray-600 dark:text-gray-400">Niederl.</span>
              </div>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{currentStats.losses}</p>
            </div>
          </div>

          {/* Additional Info - Desktop */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <IconUsers size={16} className="text-viktoria-yellow" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {currentTeam.league} • Saison 2024/2025
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              12 Spiele gespielt
            </div>
          </div>
      </div>
    </div>
    </div>
  )
}