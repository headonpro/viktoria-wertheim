'use client'

import React from 'react'
import { IconUsers, IconStar } from '@tabler/icons-react'

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
    <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="border-b-2 border-viktoria-blue dark:border-viktoria-yellow px-4 py-2">
        <div className="flex flex-col items-center">
          <div className="flex items-center space-x-2">
            <IconUsers size={16} className="text-viktoria-blue dark:text-viktoria-yellow" />
            <h3 className="text-gray-900 dark:text-white font-semibold text-sm">Unsere Partner & Sponsoren</h3>
          </div>

        </div>
      </div>

      {/* Sponsors Grid */}
      <div className="p-6">
        {/* Premium Sponsors */}
        <div className="mb-5">
          <div className="flex items-center space-x-2 mb-3">
            <IconStar size={18} className="text-viktoria-yellow" />
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Premium Partner</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {sponsors.premium.map((sponsor) => (
              <a
                key={sponsor.id}
                href={sponsor.website || '#'}
                className="group bg-gray-50 dark:bg-viktoria-dark-lighter rounded-lg p-3 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-viktoria-dark transition-colors"
              >
                <div className="text-center">
                  <div className="h-12 flex items-center justify-center">
                    <div className="text-lg font-bold text-gray-700 dark:text-gray-300 group-hover:text-viktoria-blue dark:group-hover:text-viktoria-yellow transition-colors">
                      {sponsor.name}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Premium Partner</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Gold Sponsors */}
        <div className="mb-5">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-4 h-4 bg-yellow-500 rounded-full" />
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Gold Partner</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {sponsors.gold.map((sponsor) => (
              <a
                key={sponsor.id}
                href={sponsor.website || '#'}
                className="group bg-gray-50 dark:bg-viktoria-dark-lighter rounded-lg p-2 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-viktoria-dark transition-colors"
              >
                <div className="text-center">
                  <div className="h-8 flex items-center justify-center">
                    <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 group-hover:text-viktoria-blue dark:group-hover:text-viktoria-yellow transition-colors">
                      {sponsor.name}
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Silver Sponsors */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-4 h-4 bg-gray-400 rounded-full" />
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Silber Partner</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {sponsors.silver.map((sponsor) => (
              <a
                key={sponsor.id}
                href={sponsor.website || '#'}
                className="group bg-gray-50 dark:bg-viktoria-dark-lighter rounded-lg p-2 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-viktoria-dark transition-colors"
              >
                <div className="text-center">
                  <div className="text-xs font-medium text-gray-600 dark:text-gray-400 group-hover:text-viktoria-blue dark:group-hover:text-viktoria-yellow transition-colors">
                    {sponsor.name}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-6 p-3 bg-gradient-to-r from-viktoria-blue/10 to-viktoria-blue-light/10 dark:from-viktoria-yellow/10 dark:to-yellow-600/10 rounded-lg">
          <div className="text-center">
            <p className="text-xs text-gray-700 dark:text-gray-300 mb-2">
              Werden Sie Teil unserer Erfolgsgeschichte!
            </p>
            <div className="flex justify-center">
              <button 
                onClick={onBecomeSponsor}
                className="px-6 py-2 bg-viktoria-yellow hover:bg-yellow-500 text-viktoria-blue rounded-lg transition-colors text-sm font-medium"
              >
                Sponsor werden
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}