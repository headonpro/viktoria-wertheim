'use client'

import React from 'react'
import { IconBallFootball, IconTarget, IconTrophy } from '@tabler/icons-react'
import type { Database } from '@/lib/database.types'

type Scorer = Database['public']['Tables']['scorers']['Row']

interface TopScorersProps {
  scorers: Scorer[]
}

export default function TopScorers({ scorers }: TopScorersProps) {
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

  if (!scorers || scorers.length === 0) {
    return (
      <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">Keine Torschützen verfügbar</p>
      </div>
    )
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
          {scorers.map((scorer, index) => (
            <div 
              key={scorer.id}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-viktoria-dark-lighter/50 transition-colors"
            >
              {/* Position */}
              <div className={`font-bold text-lg w-8 text-center ${getMedalColor(index + 1)}`}>
                {index === 0 && '🥇'}
                {index === 1 && '🥈'}
                {index === 2 && '🥉'}
                {index > 2 && `${index + 1}.`}
              </div>
              
              {/* Player Info */}
              <div className="flex-1">
                <p className="text-gray-900 dark:text-white font-medium text-sm">{scorer.player_name}</p>
                <p className="text-gray-600 dark:text-gray-400 text-xs">{scorer.team_name || 'Unbekannt'}</p>
              </div>
              
              {/* Stats */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <IconBallFootball size={14} className="text-viktoria-blue dark:text-viktoria-yellow" />
                  <span className="text-gray-900 dark:text-white font-bold text-sm">{scorer.goals}</span>
                </div>
                {scorer.assists && scorer.assists > 0 && (
                  <div className="flex items-center space-x-1">
                    <IconTarget size={14} className="text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400 text-sm">{scorer.assists}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}