'use client'

import React from 'react'
import { IconStar } from '@tabler/icons-react'

import type { Database } from '@/lib/database.types'

type Sponsor = Database['public']['Tables']['sponsors']['Row']

interface SponsorShowcaseProps {
  sponsors: {
    premium: Sponsor[]
    gold: Sponsor[]
    silver: Sponsor[]
  }
  onBecomeSponsor?: () => void
}

export default function SponsorShowcase({ sponsors, onBecomeSponsor }: SponsorShowcaseProps) {
  return (
    <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 px-4 py-3">
        <h3 className="text-white dark:text-gray-900 font-bold text-sm uppercase tracking-wider text-center">Partner & Sponsoren</h3>
      </div>

      {/* Sponsors Grid */}
      <div className="p-4 sm:p-5">
        {/* Premium Sponsors */}
        <div className="mb-6">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <IconStar size={20} className="text-viktoria-yellow" />
            <h3 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wide">Premium Partner</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sponsors.premium.map((sponsor) => (
              <div
                key={sponsor.id}
                className="group relative bg-gradient-to-br from-gray-50 to-white dark:from-viktoria-dark-lighter dark:to-viktoria-dark rounded-lg p-4 border border-gray-100 dark:border-gray-700 transition-all duration-300"
              >
                <div className="text-center">
                  {sponsor.name === 'Partnerprogramm in Vorbereitung' ? (
                    <>
                      <div className="h-12 sm:h-14 flex items-center justify-center mb-2">
                        <div className="text-sm sm:text-base font-bold text-gray-600 dark:text-gray-400">
                          {sponsor.name}
                        </div>
                      </div>
                      {sponsor.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 font-medium">{sponsor.description}</p>
                      )}
                    </>
                  ) : sponsor.website ? (
                    <a href={sponsor.website} className="block">
                      <div className="h-12 sm:h-14 flex items-center justify-center mb-2">
                        <div className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-200 group-hover:text-viktoria-blue dark:group-hover:text-viktoria-yellow transition-colors">
                          {sponsor.name}
                        </div>
                      </div>
                      {sponsor.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium hover:text-viktoria-blue dark:hover:text-viktoria-yellow transition-colors">{sponsor.description}</p>
                      )}
                    </a>
                  ) : (
                    <>
                      <div className="h-12 sm:h-14 flex items-center justify-center mb-2">
                        <div className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-200">
                          {sponsor.name}
                        </div>
                      </div>
                      {sponsor.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{sponsor.description}</p>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gold Sponsors */}
        {sponsors.gold.length > 0 && (
          <div className="mb-5">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <div className="w-5 h-5 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full shadow-sm" />
              <h3 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wide">Gold Partner</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {sponsors.gold.map((sponsor) => (
                <a
                  key={sponsor.id}
                  href={sponsor.website || '#'}
                  className="group bg-gradient-to-br from-gray-50 to-white dark:from-viktoria-dark-lighter dark:to-viktoria-dark rounded-lg p-3 flex items-center justify-center border border-gray-100 dark:border-gray-700 hover:border-viktoria-blue/30 dark:hover:border-viktoria-yellow/30 transition-all duration-200 hover:shadow-sm"
                >
                  <div className="text-center">
                    {sponsor.logo_url ? (
                      <img 
                        src={sponsor.logo_url} 
                        alt={sponsor.name}
                        className={`h-12 w-auto object-contain transition-all duration-200 hover:scale-105 ${
                          sponsor.name === 'Zorbas' 
                            ? 'dark:invert dark:brightness-90' 
                            : 'invert dark:invert-0'
                        }`}
                      />
                    ) : (
                      <div className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-viktoria-blue dark:group-hover:text-viktoria-yellow transition-colors">
                        {sponsor.name}
                      </div>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Silver Sponsors */}
        {sponsors.silver.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <div className="w-5 h-5 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full shadow-sm" />
              <h3 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wide">Silber Partner</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {sponsors.silver.map((sponsor) => (
                <a
                  key={sponsor.id}
                  href={sponsor.website || '#'}
                  className="group bg-gradient-to-br from-gray-50 to-white dark:from-viktoria-dark-lighter dark:to-viktoria-dark rounded-lg p-2 flex items-center justify-center border border-gray-100 dark:border-gray-700 hover:border-viktoria-blue/30 dark:hover:border-viktoria-yellow/30 transition-all duration-200 hover:shadow-sm min-h-[60px]"
                >
                  {sponsor.logo_url ? (
                    <img 
                      src={sponsor.logo_url} 
                      alt={sponsor.name}
                      className={`h-10 w-auto object-contain transition-all duration-200 hover:scale-105 ${
                        sponsor.name === 'Zorbas' 
                          ? 'dark:invert dark:brightness-90' 
                          : 'invert dark:invert-0'
                      }`}
                    />
                  ) : (
                    <div className="text-xs font-medium text-gray-600 dark:text-gray-400 group-hover:text-viktoria-blue dark:group-hover:text-viktoria-yellow transition-colors text-center">
                      {sponsor.name}
                    </div>
                  )}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* CTA - Temporarily disabled during development */}
        {/* 
          TODO: Sponsorenpakete sind gerade in Entwicklung
          Das Modal und der Button sind temporär ausgeblendet
        */}
        {false && (
          <div className="mt-6 p-4 bg-gradient-to-r from-viktoria-blue/5 to-viktoria-blue-light/5 dark:from-viktoria-yellow/10 dark:to-yellow-600/10 rounded-lg border border-viktoria-blue/10 dark:border-viktoria-yellow/20">
            <div className="text-center">
              <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-3">
                Werden Sie Teil unserer Erfolgsgeschichte!
              </p>
              <div className="flex justify-center">
                <button 
                  onClick={onBecomeSponsor}
                  className="px-6 py-2.5 bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 hover:from-viktoria-blue-light hover:to-viktoria-blue dark:hover:from-yellow-600 dark:hover:to-viktoria-yellow text-white dark:text-gray-900 rounded-lg transition-all duration-300 text-sm font-bold uppercase tracking-wide shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Sponsor werden
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}