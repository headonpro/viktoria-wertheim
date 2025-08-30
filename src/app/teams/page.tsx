'use client'

import React, { useState } from 'react'
import PageLayout from '@/components/PageLayout'
import AnimatedSection from '@/components/AnimatedSection'
import { IconBallFootball, IconUsers, IconTrophy, IconCalendar, IconMapPin, IconClock } from '@tabler/icons-react'

export default function TeamsPage() {
  const [selectedTeam, setSelectedTeam] = useState('first')

  // Mock-Daten für Teams
  const teams = {
    first: {
      name: '1. Mannschaft',
      league: 'Kreisliga A',
      coach: 'Thomas Müller',
      captain: 'Max Schmidt',
      training: 'Di & Do, 19:00 Uhr',
      position: 3,
      points: 28,
      players: [
        { number: 1, name: 'Jan Neuer', position: 'Torwart', age: 28 },
        { number: 4, name: 'Felix Weber', position: 'Abwehr', age: 25 },
        { number: 5, name: 'Markus Berg', position: 'Abwehr', age: 27 },
        { number: 6, name: 'Stefan Klein', position: 'Abwehr', age: 24 },
        { number: 8, name: 'Michael Bauer', position: 'Mittelfeld', age: 26 },
        { number: 10, name: 'Max Schmidt', position: 'Mittelfeld', age: 29, captain: true },
        { number: 11, name: 'Thomas Wagner', position: 'Mittelfeld', age: 23 },
        { number: 7, name: 'David Fischer', position: 'Sturm', age: 22 },
        { number: 9, name: 'Robert Mayer', position: 'Sturm', age: 25 },
        { number: 14, name: 'Christian Wolf', position: 'Sturm', age: 21 },
      ],
      nextMatch: {
        opponent: 'SV Nassig',
        date: '28.01.2024',
        time: '14:30',
        location: 'Heimspiel'
      },
      lastResults: [
        { opponent: 'FC Mondfeld', result: '3:1', type: 'Sieg' },
        { opponent: 'TSV Kreuzwertheim', result: '2:2', type: 'Unentschieden' },
        { opponent: 'SG Dertingen', result: '4:0', type: 'Sieg' },
      ]
    },
    second: {
      name: '2. Mannschaft',
      league: 'Kreisklasse B',
      coach: 'Andreas Schmidt',
      captain: 'Peter Wagner',
      training: 'Mo & Mi, 19:00 Uhr',
      position: 5,
      points: 22,
      players: [
        { number: 1, name: 'Marco Hoffmann', position: 'Torwart', age: 24 },
        { number: 2, name: 'Simon Braun', position: 'Abwehr', age: 22 },
        { number: 3, name: 'Jonas Meyer', position: 'Abwehr', age: 26 },
        { number: 4, name: 'Lukas Schulz', position: 'Abwehr', age: 23 },
        { number: 5, name: 'Daniel Koch', position: 'Mittelfeld', age: 25 },
        { number: 6, name: 'Peter Wagner', position: 'Mittelfeld', age: 27, captain: true },
        { number: 7, name: 'Tobias Richter', position: 'Mittelfeld', age: 21 },
        { number: 8, name: 'Niklas Frank', position: 'Sturm', age: 20 },
        { number: 9, name: 'Kevin Becker', position: 'Sturm', age: 24 },
        { number: 10, name: 'Tim Zimmermann', position: 'Sturm', age: 22 },
      ],
      nextMatch: {
        opponent: 'FC Eichel',
        date: '28.01.2024',
        time: '12:30',
        location: 'Auswärtsspiel'
      },
      lastResults: [
        { opponent: 'SV Urphar', result: '2:1', type: 'Sieg' },
        { opponent: 'TSV Bettingen', result: '1:3', type: 'Niederlage' },
        { opponent: 'FC Hundheim', result: '2:0', type: 'Sieg' },
      ]
    },
    youth: {
      name: 'Jugendmannschaften',
      league: 'Verschiedene Jugendligen',
      coach: 'Jugendtrainer-Team',
      captain: 'Verschiedene',
      training: 'Nach Altersklasse',
      position: 0,
      points: 0,
      players: [],
      teams: [
        { name: 'A-Jugend (U19)', league: 'Kreisliga', coach: 'Martin Schneider', players: 18 },
        { name: 'B-Jugend (U17)', league: 'Kreisklasse', coach: 'Oliver Lang', players: 16 },
        { name: 'C-Jugend (U15)', league: 'Kreisklasse', coach: 'Christian Beck', players: 20 },
        { name: 'D-Jugend (U13)', league: 'Kreisklasse', coach: 'Sebastian Kraus', players: 22 },
        { name: 'E-Jugend (U11)', league: 'Fairplay-Liga', coach: 'Michael Horn', players: 15 },
        { name: 'F-Jugend (U9)', league: 'Fairplay-Liga', coach: 'Thomas Vogel', players: 12 },
        { name: 'Bambini (U7)', league: 'Spieltage', coach: 'Stefan Roth', players: 10 },
      ],
      nextMatch: {
        opponent: 'Verschiedene',
        date: 'Wochenende',
        time: 'Siehe Plan',
        location: 'Verschiedene'
      },
      lastResults: []
    }
  }

  const currentTeam = teams[selectedTeam as keyof typeof teams]

  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-viktoria-dark pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <AnimatedSection animation="fadeIn" className="mb-8" immediate={true}>
            <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden">
              <div className="border-b-2 border-viktoria-blue dark:border-viktoria-yellow px-4 py-2 text-center">
                <h1 className="text-gray-900 dark:text-white font-semibold text-sm">
                  Unsere Mannschaften
                </h1>
              </div>
              <div className="p-6">
                <p className="text-gray-600 dark:text-gray-400 text-center">
                  Alle Teams des SV Viktoria Wertheim im Überblick
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* Team Selector */}
          <AnimatedSection animation="slideUp" delay={0.1} className="mb-8" immediate={true}>
            <div className="flex flex-wrap gap-4">
              {Object.entries(teams).map(([key, team]) => (
                <button
                  key={key}
                  onClick={() => setSelectedTeam(key)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    selectedTeam === key
                      ? 'bg-viktoria-blue dark:bg-viktoria-yellow text-white dark:text-viktoria-blue shadow-lg transform scale-105'
                      : 'bg-white dark:bg-viktoria-dark-light text-gray-700 dark:text-gray-300 hover:shadow-md'
                  }`}
                >
                  <IconUsers size={20} className="inline mr-2" />
                  {team.name}
                </button>
              ))}
            </div>
          </AnimatedSection>

          {/* Team Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Info */}
            <AnimatedSection animation="slideUp" delay={0.2} className="lg:col-span-2" immediate={true}>
              <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden">
                <div className="border-b-2 border-viktoria-blue dark:border-viktoria-yellow px-4 py-2 text-center">
                  <h2 className="text-gray-900 dark:text-white font-semibold text-sm">
                    {currentTeam.name}
                  </h2>
                </div>
                <div className="p-6">

                {/* Team Details */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 dark:bg-viktoria-dark rounded-lg p-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Liga</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{currentTeam.league}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-viktoria-dark rounded-lg p-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Trainer</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{currentTeam.coach}</p>
                  </div>
                  {currentTeam.captain !== 'Verschiedene' && (
                    <div className="bg-gray-50 dark:bg-viktoria-dark rounded-lg p-4">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Kapitän</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{currentTeam.captain}</p>
                    </div>
                  )}
                  <div className="bg-gray-50 dark:bg-viktoria-dark rounded-lg p-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Training</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{currentTeam.training}</p>
                  </div>
                  {currentTeam.position > 0 && (
                    <>
                      <div className="bg-gray-50 dark:bg-viktoria-dark rounded-lg p-4">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Tabellenplatz</p>
                        <p className="font-semibold text-2xl text-viktoria-blue dark:text-viktoria-yellow">
                          {currentTeam.position}.
                        </p>
                      </div>
                      <div className="bg-gray-50 dark:bg-viktoria-dark rounded-lg p-4">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Punkte</p>
                        <p className="font-semibold text-2xl text-viktoria-blue dark:text-viktoria-yellow">
                          {currentTeam.points}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* Players List or Youth Teams */}
                {selectedTeam === 'youth' ? (
                  <>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">
                      <IconUsers size={20} className="inline mr-2" />
                      Jugendteams
                    </h3>
                    <div className="space-y-3">
                      {currentTeam.teams?.map((team, index) => (
                        <div key={index} className="bg-gray-50 dark:bg-viktoria-dark rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white">{team.name}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Liga: {team.league}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Trainer: {team.coach}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-viktoria-blue dark:text-viktoria-yellow">
                                {team.players}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Spieler</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">
                      <IconUsers size={20} className="inline mr-2" />
                      Spielerkader
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left py-2 text-sm text-gray-600 dark:text-gray-400">Nr.</th>
                            <th className="text-left py-2 text-sm text-gray-600 dark:text-gray-400">Name</th>
                            <th className="text-left py-2 text-sm text-gray-600 dark:text-gray-400">Position</th>
                            <th className="text-left py-2 text-sm text-gray-600 dark:text-gray-400">Alter</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentTeam.players.map((player) => (
                            <tr key={player.number} className="border-b border-gray-100 dark:border-gray-800">
                              <td className="py-2 text-gray-900 dark:text-white font-semibold">{player.number}</td>
                              <td className="py-2 text-gray-900 dark:text-white">
                                {player.name}
                                {player.captain && (
                                  <span className="ml-2 text-xs px-2 py-1 bg-viktoria-yellow text-viktoria-blue rounded-full">
                                    Kapitän
                                  </span>
                                )}
                              </td>
                              <td className="py-2 text-gray-600 dark:text-gray-400">{player.position}</td>
                              <td className="py-2 text-gray-600 dark:text-gray-400">{player.age}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
                </div>
              </div>
            </AnimatedSection>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Next Match */}
              <AnimatedSection animation="slideUp" delay={0.3}>
                <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden">
                  <div className="border-b-2 border-viktoria-blue dark:border-viktoria-yellow px-4 py-2 text-center">
                    <h3 className="text-gray-900 dark:text-white font-semibold text-sm">
                      Nächstes Spiel
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-2">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      vs. {currentTeam.nextMatch.opponent}
                    </p>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <IconCalendar size={16} className="mr-1" />
                      {currentTeam.nextMatch.date}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <IconClock size={16} className="mr-1" />
                      {currentTeam.nextMatch.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <IconMapPin size={16} className="mr-1" />
                      {currentTeam.nextMatch.location}
                    </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* Last Results */}
              {currentTeam.lastResults.length > 0 && (
                <AnimatedSection animation="slideUp" delay={0.4}>
                  <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden">
                    <div className="border-b-2 border-viktoria-blue dark:border-viktoria-yellow px-4 py-2 text-center">
                      <h3 className="text-gray-900 dark:text-white font-semibold text-sm">
                        Letzte Ergebnisse
                      </h3>
                    </div>
                    <div className="p-4">
                      <div className="space-y-3">
                      {currentTeam.lastResults.map((result, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-gray-900 dark:text-white">
                              vs. {result.opponent}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`text-lg font-bold ${
                              result.type === 'Sieg' ? 'text-green-600' :
                              result.type === 'Niederlage' ? 'text-red-600' :
                              'text-yellow-600'
                            }`}>
                              {result.result}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              result.type === 'Sieg' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                              result.type === 'Niederlage' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                              'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            }`}>
                              {result.type}
                            </span>
                          </div>
                        </div>
                      ))}
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              )}

              {/* Team Stats */}
              {currentTeam.position > 0 && (
                <AnimatedSection animation="slideUp" delay={0.5}>
                  <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden">
                    <div className="border-b-2 border-viktoria-blue dark:border-viktoria-yellow px-4 py-2 text-center">
                      <h3 className="text-gray-900 dark:text-white font-semibold text-sm">
                        Saisonstatistik
                      </h3>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-3xl font-bold text-viktoria-blue dark:text-viktoria-yellow">62</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Tore erzielt</p>
                        </div>
                        <div>
                          <p className="text-3xl font-bold text-viktoria-blue dark:text-viktoria-yellow">24</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Gegentore</p>
                        </div>
                        <div>
                          <p className="text-3xl font-bold text-viktoria-blue dark:text-viktoria-yellow">9</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Siege</p>
                        </div>
                        <div>
                          <p className="text-3xl font-bold text-viktoria-blue dark:text-viktoria-yellow">12</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Spiele</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}