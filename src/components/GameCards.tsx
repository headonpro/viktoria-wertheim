'use client'

import React from 'react'
import { IconCalendar, IconClock, IconMapPin, IconTrophy, IconSoccerField, IconChevronRight } from '@tabler/icons-react'
import type { Database } from '@/lib/database.types'

type Match = Database['public']['Tables']['matches']['Row']

interface GameCardsProps {
  lastMatch?: Match | null
  nextMatch?: Match | null
}

export default function GameCards({ lastMatch, nextMatch }: GameCardsProps) {
  // Helper function to determine if Viktoria won
  const isViktoriaWin = (match: Match) => {
    const isViktoriaHome = match.home_team?.includes('Viktoria')
    const homeWon = (match.home_score || 0) > (match.away_score || 0)
    return isViktoriaHome ? homeWon : !homeWon
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Letztes Spiel */}
      {lastMatch && (
        <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
          <div className="bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 px-4 py-3">
            <h3 className="text-white dark:text-gray-900 font-bold text-sm uppercase tracking-wider text-center">Letztes Spiel</h3>
          </div>
          
          <div className="p-4 sm:p-5 space-y-4">
            {/* Score Display */}
            <div className="bg-gray-50 dark:bg-viktoria-dark rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 text-center">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-medium truncate px-1">
                    {lastMatch.home_team}
                  </p>
                  <p className="text-4xl sm:text-5xl font-bold text-viktoria-blue dark:text-viktoria-yellow">
                    {lastMatch.home_score}
                  </p>
                </div>
                <div className="px-3">
                  <span className="text-2xl text-gray-300 dark:text-gray-600">:</span>
                </div>
                <div className="flex-1 text-center">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-medium truncate px-1">
                    {lastMatch.away_team}
                  </p>
                  <p className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
                    {lastMatch.away_score}
                  </p>
                </div>
              </div>
              
              {/* Result indicator */}
              {lastMatch.home_score !== null && lastMatch.away_score !== null && (
                <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className={`text-center text-xs font-bold px-3 py-1.5 rounded-full ${
                    isViktoriaWin(lastMatch) 
                      ? 'bg-viktoria-blue/10 text-viktoria-blue dark:bg-viktoria-yellow/20 dark:text-viktoria-yellow' 
                      : lastMatch.home_score === lastMatch.away_score 
                        ? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                  }`}>
                    {isViktoriaWin(lastMatch) ? '✓ SIEG' : lastMatch.home_score === lastMatch.away_score ? '— UNENTSCHIEDEN' : '✗ NIEDERLAGE'}
                  </div>
                </div>
              )}
            </div>
            
            {/* Match Details */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                <IconCalendar size={16} className="text-viktoria-blue dark:text-viktoria-yellow flex-shrink-0" />
                <span className="text-sm font-medium">
                  {new Date(lastMatch.match_date).toLocaleDateString('de-DE', { 
                    weekday: 'short', 
                    day: '2-digit', 
                    month: '2-digit', 
                    year: 'numeric' 
                  })}
                </span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                <IconClock size={16} className="text-viktoria-blue dark:text-viktoria-yellow flex-shrink-0" />
                <span className="text-sm">{lastMatch.match_time?.slice(0, 5)} Uhr</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                <IconMapPin size={16} className="text-viktoria-blue dark:text-viktoria-yellow flex-shrink-0" />
                <span className="text-sm truncate">{lastMatch.location}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nächstes Spiel */}
      {nextMatch && (
        <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
          <div className="bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 px-4 py-3">
            <h3 className="text-white dark:text-gray-900 font-bold text-sm uppercase tracking-wider text-center">Nächstes Spiel</h3>
          </div>
          
          <div className="p-4 sm:p-5 space-y-4">
            {/* Teams Display */}
            <div className="bg-gray-50 dark:bg-viktoria-dark rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 text-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center shadow-inner">
                    <span className="text-sm sm:text-base font-bold text-gray-600 dark:text-gray-300">
                      {nextMatch.home_team?.split(' ')[0]?.slice(0, 3).toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white truncate px-1">
                    {nextMatch.home_team}
                  </p>
                </div>
                
                <div className="px-2 sm:px-3">
                  <div className="bg-viktoria-blue dark:bg-viktoria-yellow text-white dark:text-gray-900 text-sm font-bold px-3 py-1.5 rounded-full shadow-md">
                    VS
                  </div>
                </div>
                
                <div className="flex-1 text-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 bg-gradient-to-br from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 rounded-full flex items-center justify-center shadow-inner">
                    <span className="text-sm sm:text-base font-bold text-white dark:text-gray-900">
                      SVW
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white truncate px-1">
                    {nextMatch.away_team}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Match Details */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                <IconCalendar size={16} className="text-viktoria-blue dark:text-viktoria-yellow flex-shrink-0" />
                <span className="text-sm font-medium">
                  {new Date(nextMatch.match_date).toLocaleDateString('de-DE', { 
                    weekday: 'short', 
                    day: '2-digit', 
                    month: '2-digit', 
                    year: 'numeric' 
                  })}
                </span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                <IconClock size={16} className="text-viktoria-blue dark:text-viktoria-yellow flex-shrink-0" />
                <span className="text-sm">{nextMatch.match_time?.slice(0, 5)} Uhr</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                <IconMapPin size={16} className="text-viktoria-blue dark:text-viktoria-yellow flex-shrink-0" />
                <span className="text-sm truncate">{nextMatch.location}</span>
              </div>
            </div>
            
            {/* Call to Action */}
            <div className="pt-3">
              <div className="bg-viktoria-blue/5 dark:bg-viktoria-yellow/10 rounded-lg px-4 py-3 flex items-center justify-between group-hover:bg-viktoria-blue/10 dark:group-hover:bg-viktoria-yellow/20 transition-colors">
                <p className="text-xs font-semibold text-viktoria-blue dark:text-viktoria-yellow">
                  Komm vorbei und unterstütze uns!
                </p>
                <IconChevronRight size={16} className="text-viktoria-blue dark:text-viktoria-yellow" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fallback wenn keine Daten */}
      {!lastMatch && !nextMatch && (
        <div className="col-span-1 sm:col-span-2 bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg p-8 text-center">
          <IconSoccerField size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">Keine Spieldaten verfügbar</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Die Spielpläne werden in Kürze aktualisiert</p>
        </div>
      )}
    </div>
  )
}