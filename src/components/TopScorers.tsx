'use client'

import React from 'react'
import { IconBallFootball } from '@tabler/icons-react'
import type { Database } from '@/lib/database.types'

type Scorer = Database['public']['Tables']['scorers']['Row']

interface TopScorersProps {
  scorers: Scorer[]
}

export default function TopScorers({ scorers }: TopScorersProps) {

  if (!scorers || scorers.length === 0) {
    return (
      <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">Keine Torschützen verfügbar</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 px-4 py-3">
        <h3 className="text-white dark:text-gray-900 font-bold text-sm uppercase tracking-wider text-center">Torschützenliste</h3>
      </div>
      
      <div className="p-4 sm:p-5">
        <div className="space-y-2">
          {scorers.slice(0, 5).map((scorer, index) => (
            <div 
              key={scorer.id}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                index < 3 
                  ? 'bg-gradient-to-r from-gray-50 to-white dark:from-viktoria-dark-lighter dark:to-viktoria-dark border border-gray-100 dark:border-gray-700 hover:border-viktoria-blue/30 dark:hover:border-viktoria-yellow/30' 
                  : 'hover:bg-gray-50 dark:hover:bg-viktoria-dark-lighter/50'
              }`}
            >
              {/* Position */}
              <div className={`font-bold text-lg sm:text-xl w-10 text-center flex-shrink-0 ${
                index === 0 ? 'text-3xl' : index < 3 ? 'text-2xl' : ''
              }`}>
                {index === 0 && '🥇'}
                {index === 1 && '🥈'}
                {index === 2 && '🥉'}
                {index > 2 && (
                  <span className="text-gray-500 dark:text-gray-400 text-base">{index + 1}.</span>
                )}
              </div>
              
              {/* Player Info */}
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm sm:text-base truncate ${
                  index < 3 
                    ? 'text-gray-900 dark:text-white' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {scorer.player_name}
                </p>

              </div>
              
              {/* Stats */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <IconBallFootball size={16} className="text-viktoria-blue dark:text-viktoria-yellow" />
                <span className={`font-bold ${
                  index === 0 
                    ? 'text-lg sm:text-xl text-viktoria-blue dark:text-viktoria-yellow' 
                    : 'text-base sm:text-lg text-gray-900 dark:text-white'
                }`}>
                  {scorer.goals}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}