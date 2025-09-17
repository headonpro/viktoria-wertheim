'use client'

import React from 'react'
import { IconCalendar, IconClock, IconMapPin, IconSoccerField } from '@tabler/icons-react'
import type { Database } from '@/lib/database.types'
import { getTeamAbbreviation, getTeamLogo } from '@/lib/teams/team-data'
import { TEAM_LOGOS } from '@/lib/teams/team-logos'

type Match = Database['public']['Tables']['matches']['Row']

interface NextMatchCardProps {
  match: Match | null
  className?: string
}

export default function NextMatchCard({ match, className = '' }: NextMatchCardProps) {
  if (!match) {
    return (
      <div className={`bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg p-8 text-center ${className}`}>
        <IconSoccerField size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
        <p className="text-gray-500 dark:text-gray-400 font-medium">Kein nächstes Spiel</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Die Spielpläne werden in Kürze aktualisiert</p>
      </div>
    )
  }

  return (
    <div className={`bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group ${className}`}>
      <div className="bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 px-4 py-3">
        <h3 className="text-white dark:text-gray-900 font-bold text-sm uppercase tracking-wider text-center">
          Nächstes Spiel
        </h3>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Teams Display */}
        <div className="bg-gray-50 dark:bg-viktoria-dark-lighter rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 text-center max-w-[45%]">
              <div className="h-12 sm:h-14 mb-2 flex items-center justify-center">
                {getTeamLogo(match.home_team) ? (
                  <picture>
                    {TEAM_LOGOS[getTeamLogo(match.home_team)!]?.webp && (
                      <source
                        srcSet={`${TEAM_LOGOS[getTeamLogo(match.home_team)!].webp!.small} 1x, ${TEAM_LOGOS[getTeamLogo(match.home_team)!].webp!.medium} 2x`}
                        type="image/webp"
                      />
                    )}
                    <img
                      src={getTeamLogo(match.home_team)!}
                      alt={match.home_team || ''}
                      width={48}
                      height={48}
                      className="max-h-full max-w-full object-contain"
                      loading="lazy"
                    />
                  </picture>
                ) : (
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-lg flex items-center justify-center">
                    <span className="text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-300">
                      {getTeamAbbreviation(match.home_team).slice(0, 3)}
                    </span>
                  </div>
                )}
              </div>
              <div className="h-10 flex items-center justify-center">
                <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white truncate px-1 w-full">
                  {getTeamAbbreviation(match.home_team)}
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
                {getTeamLogo(match.away_team) ? (
                  <picture>
                    {TEAM_LOGOS[getTeamLogo(match.away_team)!]?.webp && (
                      <source
                        srcSet={`${TEAM_LOGOS[getTeamLogo(match.away_team)!].webp!.small} 1x, ${TEAM_LOGOS[getTeamLogo(match.away_team)!].webp!.medium} 2x`}
                        type="image/webp"
                      />
                    )}
                    <img
                      src={getTeamLogo(match.away_team)!}
                      alt={match.away_team || ''}
                      width={48}
                      height={48}
                      className="max-h-full max-w-full object-contain"
                      loading="lazy"
                    />
                  </picture>
                ) : (
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 rounded-lg flex items-center justify-center">
                    <span className="text-xs sm:text-sm font-bold text-white dark:text-gray-900">
                      {getTeamAbbreviation(match.away_team).slice(0, 3)}
                    </span>
                  </div>
                )}
              </div>
              <div className="h-10 flex items-center justify-center">
                <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white truncate px-1 w-full">
                  {getTeamAbbreviation(match.away_team)}
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
              {new Date(match.match_date).toLocaleDateString('de-DE', {
                weekday: 'short',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })}
            </span>
          </div>
          <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
            <IconClock size={16} className="text-viktoria-blue dark:text-viktoria-yellow flex-shrink-0" />
            <span className="text-sm">{match.match_time?.slice(0, 5)} Uhr</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
            <IconMapPin size={16} className="text-viktoria-blue dark:text-viktoria-yellow flex-shrink-0" />
            <span className="text-sm truncate">{match.location}</span>
          </div>
        </div>

        {/* Call to Action */}
        <div className="pt-3">
          <div className="text-center py-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              <span className="inline-block text-viktoria-blue dark:text-viktoria-yellow font-bold">Komm vorbei</span>
              <span className="mx-1.5">•</span>
              <span className="inline-block">unterstütze uns!</span>
            </p>
            <div className="flex items-center justify-center gap-2 mt-1">
              <div className="h-px w-8 bg-gradient-to-r from-transparent via-viktoria-blue dark:via-viktoria-yellow to-transparent"></div>
              <IconSoccerField size={14} className="text-viktoria-blue dark:text-viktoria-yellow opacity-60" />
              <div className="h-px w-8 bg-gradient-to-l from-transparent via-viktoria-blue dark:via-viktoria-yellow to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}