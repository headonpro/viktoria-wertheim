'use client'

import React from 'react'
import { IconCalendar, IconClock, IconMapPin } from '@tabler/icons-react'

interface GameCardsProps {
  selectedTeam: '1' | '2' | '3'
}

export default function GameCards({ selectedTeam }: GameCardsProps) {
  // Mock-Daten für Spiele
  const games = {
    '1': [
      {
        id: 1,
        type: 'last',
        homeTeam: 'SV Viktoria Wertheim',
        awayTeam: 'FC Mondfeld',
        homeScore: 3,
        awayScore: 1,
        date: '21.01.2024',
        time: '15:00',
        location: 'Sportplatz Wertheim'
      },
      {
        id: 2,
        type: 'next',
        homeTeam: 'TSV Kreuzwertheim',
        awayTeam: 'SV Viktoria Wertheim',
        date: '28.01.2024',
        time: '14:30',
        location: 'Sportplatz Kreuzwertheim'
      }
    ],
    '2': [
      {
        id: 3,
        type: 'last',
        homeTeam: 'SV Viktoria Wertheim II',
        awayTeam: 'SG Dertingen',
        homeScore: 2,
        awayScore: 2,
        date: '21.01.2024',
        time: '13:00',
        location: 'Sportplatz Wertheim'
      },
      {
        id: 4,
        type: 'next',
        homeTeam: 'SV Viktoria Wertheim II',
        awayTeam: 'FC Eichel',
        date: '28.01.2024',
        time: '12:30',
        location: 'Sportplatz Wertheim'
      }
    ],
    '3': [
      {
        id: 5,
        type: 'last',
        homeTeam: 'FC Grünenwört',
        awayTeam: 'SV Viktoria Wertheim III',
        homeScore: 1,
        awayScore: 4,
        date: '21.01.2024',
        time: '11:00',
        location: 'Sportplatz Grünenwört'
      },
      {
        id: 6,
        type: 'next',
        homeTeam: 'SV Viktoria Wertheim III',
        awayTeam: 'SV Nassig',
        date: '28.01.2024',
        time: '10:30',
        location: 'Sportplatz Wertheim'
      }
    ]
  }

  const currentGames = games[selectedTeam]
  const lastGame = currentGames.find(g => g.type === 'last')
  const nextGame = currentGames.find(g => g.type === 'next')

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Letztes Spiel */}
      {lastGame && (
        <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden">
          <div className="border-b-2 border-viktoria-blue dark:border-viktoria-yellow px-4 py-2 text-center">
            <h3 className="text-gray-900 dark:text-white font-semibold text-sm">Letztes Spiel</h3>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="text-center flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{lastGame.homeTeam}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{lastGame.homeScore}</p>
              </div>
              <div className="px-2">
                <span className="text-gray-400">:</span>
              </div>
              <div className="text-center flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{lastGame.awayTeam}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{lastGame.awayScore}</p>
              </div>
            </div>
            <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <IconCalendar size={14} />
                <span>{lastGame.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <IconClock size={14} />
                <span>{lastGame.time} Uhr</span>
              </div>
              <div className="flex items-center space-x-2">
                <IconMapPin size={14} />
                <span>{lastGame.location}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nächstes Spiel */}
      {nextGame && (
        <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden">
          <div className="border-b-2 border-viktoria-blue dark:border-viktoria-yellow px-4 py-2 text-center">
            <h3 className="text-gray-900 dark:text-white font-semibold text-sm">Nächstes Spiel</h3>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="text-center flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{nextGame.homeTeam}</p>
              </div>
              <div className="px-2">
                <span className="text-xl text-gray-400 font-bold">VS</span>
              </div>
              <div className="text-center flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{nextGame.awayTeam}</p>
              </div>
            </div>
            <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <IconCalendar size={14} />
                <span>{nextGame.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <IconClock size={14} />
                <span>{nextGame.time} Uhr</span>
              </div>
              <div className="flex items-center space-x-2">
                <IconMapPin size={14} />
                <span>{nextGame.location}</span>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}