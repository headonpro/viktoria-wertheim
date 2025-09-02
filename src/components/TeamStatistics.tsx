'use client'

import React from 'react'
import { IconChartBar, IconTrendingUp, IconTrendingDown, IconMinus, IconSoccerField } from '@tabler/icons-react'

interface TeamStatisticsProps {
  teamId: string
  teamName: string
  played?: number
  won?: number
  drawn?: number
  lost?: number
  goalsFor?: number
  goalsAgainst?: number
  points?: number
  position?: number
}

export default function TeamStatistics({
  played = 0,
  won = 0,
  drawn = 0,
  lost = 0,
  goalsFor = 0,
  goalsAgainst = 0,
  points = 0
}: TeamStatisticsProps) {
  // Calculate statistics
  const winRate = played > 0 ? Math.round((won / played) * 100) : 0
  const goalDifference = goalsFor - goalsAgainst
  const pointsPerGame = played > 0 ? (points / played).toFixed(1) : '0.0'
  const goalsPerGame = played > 0 ? (goalsFor / played).toFixed(1) : '0.0'
  
  // Determine form (last 5 games simulation based on overall performance)
  const getFormIndicator = () => {
    if (winRate > 60) return { icon: IconTrendingUp, color: 'text-viktoria-blue dark:text-viktoria-yellow', text: 'Sehr gut' }
    if (winRate > 40) return { icon: IconMinus, color: 'text-gray-500 dark:text-gray-400', text: 'Stabil' }
    return { icon: IconTrendingDown, color: 'text-gray-400 dark:text-gray-500', text: 'Ausbaufähig' }
  }
  
  const form = getFormIndicator()
  const FormIcon = form.icon

  return (
    <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 px-4 py-3">
        <h3 className="text-white dark:text-gray-900 font-bold text-sm uppercase tracking-wider flex items-center">
          <IconChartBar size={18} className="mr-2" />
          Saisonstatistik
        </h3>
      </div>
      
      <div className="p-4 sm:p-5">
        
        {/* Main Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center bg-gradient-to-br from-gray-50 to-white dark:from-viktoria-dark-lighter dark:to-viktoria-dark rounded-lg p-3 border border-gray-100 dark:border-gray-700">
            <p className="text-2xl sm:text-3xl font-bold text-viktoria-blue dark:text-viktoria-yellow">
              {won}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide mt-1">Siege</p>
          </div>
          <div className="text-center bg-gradient-to-br from-gray-50 to-white dark:from-viktoria-dark-lighter dark:to-viktoria-dark rounded-lg p-3 border border-gray-100 dark:border-gray-700">
            <p className="text-2xl sm:text-3xl font-bold text-gray-600 dark:text-gray-300">
              {drawn}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide mt-1">Unent.</p>
          </div>
          <div className="text-center bg-gradient-to-br from-gray-50 to-white dark:from-viktoria-dark-lighter dark:to-viktoria-dark rounded-lg p-3 border border-gray-100 dark:border-gray-700">
            <p className="text-2xl sm:text-3xl font-bold text-gray-600 dark:text-gray-300">
              {lost}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide mt-1">Niederl.</p>
          </div>
        </div>

        {/* Goal Statistics */}
        <div className="bg-gradient-to-br from-gray-50 to-white dark:from-viktoria-dark-lighter dark:to-viktoria-dark rounded-lg p-3 mb-4 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <IconSoccerField size={16} className="text-viktoria-blue dark:text-viktoria-yellow mr-2" />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Torverhältnis</span>
            </div>
          </div>
          <div className="flex items-center justify-around">
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900 dark:text-white">{goalsFor}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Erzielt</p>
            </div>
            <div className="text-gray-400 dark:text-gray-600 text-lg">:</div>
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900 dark:text-white">{goalsAgainst}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Kassiert</p>
            </div>
            <div className="text-center border-l border-gray-200 dark:border-gray-700 pl-3">
              <p className={`text-xl font-bold ${goalDifference > 0 ? 'text-viktoria-blue dark:text-viktoria-yellow' : goalDifference < 0 ? 'text-gray-400' : 'text-gray-600 dark:text-gray-300'}`}>
                {goalDifference > 0 ? '+' : ''}{goalDifference}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Differenz</p>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="space-y-2">
          <div className="flex items-center justify-between py-2 px-3 bg-gradient-to-br from-gray-50 to-white dark:from-viktoria-dark-lighter dark:to-viktoria-dark rounded-lg border border-gray-100 dark:border-gray-700">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Siegquote</span>
            <div className="flex items-center">
              <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                <div 
                  className="bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${winRate}%` }}
                />
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-white">{winRate}%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between py-2 px-3 bg-gradient-to-br from-gray-50 to-white dark:from-viktoria-dark-lighter dark:to-viktoria-dark rounded-lg border border-gray-100 dark:border-gray-700">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Punkte/Spiel</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">{pointsPerGame}</span>
          </div>
          
          <div className="flex items-center justify-between py-2 px-3 bg-gradient-to-br from-gray-50 to-white dark:from-viktoria-dark-lighter dark:to-viktoria-dark rounded-lg border border-gray-100 dark:border-gray-700">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Tore/Spiel</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">{goalsPerGame}</span>
          </div>
          
          <div className="flex items-center justify-between py-2 px-3 bg-gradient-to-br from-gray-50 to-white dark:from-viktoria-dark-lighter dark:to-viktoria-dark rounded-lg border border-gray-100 dark:border-gray-700">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Form</span>
            <div className="flex items-center">
              <FormIcon size={16} className={`mr-1 ${form.color}`} />
              <span className={`text-sm font-bold ${form.color}`}>{form.text}</span>
            </div>
          </div>
        </div>

        {/* Season Progress */}
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Saisonfortschritt</span>
            <span className="text-xs font-bold text-gray-900 dark:text-white">{played} von 30 Spielen</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(played / 30) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}