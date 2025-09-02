'use client'

import React from 'react'
import { IconCalendar, IconClock, IconMapPin, IconSoccerField, IconChevronRight } from '@tabler/icons-react'
import type { Database } from '@/lib/database.types'
import { getTeamAbbreviation, getTeamLogo } from '@/lib/teams/team-data'

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
            <div className="bg-gray-50 dark:bg-viktoria-dark-lighter rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 text-center max-w-[45%]">
                  <div className="h-12 sm:h-14 mb-2 flex items-center justify-center">
                    {getTeamLogo(lastMatch.home_team) ? (
                      <img 
                        src={getTeamLogo(lastMatch.home_team)!} 
                        alt={lastMatch.home_team || ''} 
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-lg flex items-center justify-center">
                        <span className="text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-300">
                          {getTeamAbbreviation(lastMatch.home_team).slice(0, 3)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="h-10 flex items-center justify-center">
                    <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white truncate px-1 w-full">
                      {getTeamAbbreviation(lastMatch.home_team)}
                    </p>
                  </div>
                  <p className="text-3xl font-bold text-viktoria-blue dark:text-viktoria-yellow">
                    {lastMatch.home_score}
                  </p>
                </div>
                <div className="px-3 flex items-center">
                  <span className="text-2xl text-gray-300 dark:text-gray-600">:</span>
                </div>
                <div className="flex-1 text-center max-w-[45%]">
                  <div className="h-12 sm:h-14 mb-2 flex items-center justify-center">
                    {getTeamLogo(lastMatch.away_team) ? (
                      <img 
                        src={getTeamLogo(lastMatch.away_team)!} 
                        alt={lastMatch.away_team || ''} 
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 rounded-lg flex items-center justify-center">
                        <span className="text-xs sm:text-sm font-bold text-white dark:text-gray-900">
                          {getTeamAbbreviation(lastMatch.away_team).slice(0, 3)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="h-10 flex items-center justify-center">
                    <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white truncate px-1 w-full">
                      {getTeamAbbreviation(lastMatch.away_team)}
                    </p>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {lastMatch.away_score}
                  </p>
                </div>
              </div>
              
              {/* Result indicator */}
              {lastMatch.home_score !== null && lastMatch.away_score !== null && (
                <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className={`text-center text-xs font-bold ${
                    isViktoriaWin(lastMatch) 
                      ? 'text-viktoria-blue dark:text-viktoria-yellow' 
                      : lastMatch.home_score === lastMatch.away_score 
                        ? 'text-gray-600 dark:text-gray-400'
                        : 'text-red-600 dark:text-red-400'
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
            <div className="bg-gray-50 dark:bg-viktoria-dark-lighter rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 text-center max-w-[45%]">
                  <div className="h-12 sm:h-14 mb-2 flex items-center justify-center">
                    {getTeamLogo(nextMatch.home_team) ? (
                      <img 
                        src={getTeamLogo(nextMatch.home_team)!} 
                        alt={nextMatch.home_team || ''} 
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-lg flex items-center justify-center">
                        <span className="text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-300">
                          {getTeamAbbreviation(nextMatch.home_team).slice(0, 3)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="h-10 flex items-center justify-center">
                    <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white truncate px-1 w-full">
                      {getTeamAbbreviation(nextMatch.home_team)}
                    </p>
                  </div>
                </div>
                
                <div className="px-2 sm:px-3 flex items-center">
                  <div className="bg-viktoria-blue dark:bg-viktoria-yellow text-white dark:text-gray-900 text-sm font-bold px-3 py-1.5 rounded-full shadow-md">
                    VS
                  </div>
                </div>
                
                <div className="flex-1 text-center max-w-[45%]">
                  <div className="h-12 sm:h-14 mb-2 flex items-center justify-center">
                    {getTeamLogo(nextMatch.away_team) ? (
                      <img 
                        src={getTeamLogo(nextMatch.away_team)!} 
                        alt={nextMatch.away_team || ''} 
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 rounded-lg flex items-center justify-center">
                        <span className="text-xs sm:text-sm font-bold text-white dark:text-gray-900">
                          {getTeamAbbreviation(nextMatch.away_team).slice(0, 3)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="h-10 flex items-center justify-center">
                    <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white truncate px-1 w-full">
                      {getTeamAbbreviation(nextMatch.away_team)}
                    </p>
                  </div>
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