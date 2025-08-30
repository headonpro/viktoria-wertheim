'use client'

import React from 'react'
import { IconCalendar, IconClock, IconMapPin } from '@tabler/icons-react'
import type { Database } from '@/lib/database.types'

type Match = Database['public']['Tables']['matches']['Row']

interface GameCardsProps {
  lastMatch?: Match | null
  nextMatch?: Match | null
}

export default function GameCards({ lastMatch, nextMatch }: GameCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Letztes Spiel */}
      {lastMatch && (
        <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden">
          <div className="border-b-2 border-viktoria-blue dark:border-viktoria-yellow px-4 py-2 text-center">
            <h3 className="text-gray-900 dark:text-white font-semibold text-sm">Letztes Spiel</h3>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="text-center flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{lastMatch.home_team}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{lastMatch.home_score}</p>
              </div>
              <div className="px-2">
                <span className="text-gray-400">:</span>
              </div>
              <div className="text-center flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{lastMatch.away_team}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{lastMatch.away_score}</p>
              </div>
            </div>
            <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <IconCalendar size={14} />
                <span>{new Date(lastMatch.match_date).toLocaleDateString('de-DE')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <IconClock size={14} />
                <span>{lastMatch.match_time?.slice(0, 5)} Uhr</span>
              </div>
              <div className="flex items-center space-x-2">
                <IconMapPin size={14} />
                <span>{lastMatch.location}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nächstes Spiel */}
      {nextMatch && (
        <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden">
          <div className="border-b-2 border-viktoria-blue dark:border-viktoria-yellow px-4 py-2 text-center">
            <h3 className="text-gray-900 dark:text-white font-semibold text-sm">Nächstes Spiel</h3>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="text-center flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{nextMatch.home_team}</p>
              </div>
              <div className="px-2">
                <span className="text-xl text-gray-400 font-bold">VS</span>
              </div>
              <div className="text-center flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{nextMatch.away_team}</p>
              </div>
            </div>
            <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <IconCalendar size={14} />
                <span>{new Date(nextMatch.match_date).toLocaleDateString('de-DE')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <IconClock size={14} />
                <span>{nextMatch.match_time?.slice(0, 5)} Uhr</span>
              </div>
              <div className="flex items-center space-x-2">
                <IconMapPin size={14} />
                <span>{nextMatch.location}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fallback wenn keine Daten */}
      {!lastMatch && !nextMatch && (
        <div className="col-span-2 bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">Keine Spieldaten verfügbar</p>
        </div>
      )}
    </div>
  )
}