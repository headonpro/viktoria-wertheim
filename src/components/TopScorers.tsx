'use client'

import React from 'react'
import { IconBallFootball, IconTarget, IconTrophy } from '@tabler/icons-react'

export default function TopScorers() {
  // Mock-Daten für Torschützen
  const scorers = [
    { id: 1, name: 'Max Müller', team: '1. Mannschaft', goals: 18, assists: 7, position: 1 },
    { id: 2, name: 'Thomas Schmidt', team: '1. Mannschaft', goals: 14, assists: 5, position: 2 },
    { id: 3, name: 'Jan Weber', team: '2. Mannschaft', goals: 12, assists: 9, position: 3 },
    { id: 4, name: 'Felix Wagner', team: '1. Mannschaft', goals: 10, assists: 3, position: 4 },
    { id: 5, name: 'Lukas Becker', team: '3. Mannschaft', goals: 8, assists: 4, position: 5 },
  ]

  const getMedalColor = (position: number) => {
    switch (position) {
      case 1:
        return 'text-yellow-500'
      case 2:
        return 'text-gray-400'
      case 3:
        return 'text-orange-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden">
      <div className="border-b-2 border-viktoria-blue dark:border-viktoria-yellow px-4 py-2">
        <div className="flex items-center justify-center space-x-2">
          <IconTrophy size={16} className="text-viktoria-blue dark:text-viktoria-yellow" />
          <h3 className="text-gray-900 dark:text-white font-semibold text-sm">Torschützenliste</h3>
        </div>
      </div>
      
      <div className="p-4">
        <div className="space-y-3">
          {scorers.map((scorer) => (
            <div 
              key={scorer.id}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-viktoria-dark-lighter/50 transition-colors"
            >
              {/* Position */}
              <div className={`font-bold text-lg w-8 text-center ${getMedalColor(scorer.position)}`}>
                {scorer.position === 1 && '🥇'}
                {scorer.position === 2 && '🥈'}
                {scorer.position === 3 && '🥉'}
                {scorer.position > 3 && `${scorer.position}.`}
              </div>

              {/* Player Info */}
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white">{scorer.name}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">{scorer.team}</p>
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="flex items-center space-x-1">
                    <IconBallFootball size={14} className="text-gray-400" />
                    <span className="font-bold text-lg text-gray-900 dark:text-white">{scorer.goals}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Tore</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center space-x-1">
                    <IconTarget size={14} className="text-gray-400" />
                    <span className="font-semibold text-gray-700 dark:text-gray-300">{scorer.assists}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Assists</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Summary */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-viktoria-dark-lighter">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-gray-50 dark:bg-viktoria-dark-lighter rounded-lg p-2">
              <p className="text-2xl font-bold text-viktoria-blue dark:text-viktoria-yellow">62</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Gesamttore</p>
            </div>
            <div className="bg-gray-50 dark:bg-viktoria-dark-lighter rounded-lg p-2">
              <p className="text-2xl font-bold text-viktoria-blue dark:text-viktoria-yellow">28</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Vorlagen</p>
            </div>
            <div className="bg-gray-50 dark:bg-viktoria-dark-lighter rounded-lg p-2">
              <p className="text-2xl font-bold text-viktoria-blue dark:text-viktoria-yellow">15</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Torschützen</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}