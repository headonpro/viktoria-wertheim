'use client'

import React, { useState } from 'react'
import PageLayout from '@/components/PageLayout'
import AnimatedSection from '@/components/AnimatedSection'
import { IconUsers, IconCalendar, IconMapPin, IconClock } from '@tabler/icons-react'

interface Player {
  id: string
  name: string
  number: number | null
  position: string | null
  age: number | null
  is_captain: boolean | null
}

interface Match {
  opponent: string
  result: string
  type: string
}

interface NextMatch {
  opponent: string
  date: string
  time: string
  location: string
}

interface Team {
  id: string
  name: string
  league: string
  coach: string
  captain: string
  training: string
  position: number
  points: number
  teamType: string
  players: Player[]
  lastResults?: Match[]
  nextMatch?: NextMatch | null
}

interface YouthTeam {
  id: string
  name: string
  league: string | null
  coach: string | null
  player_count: number | null
  age_group: string | null
}

interface TeamsPageClientProps {
  teams: Team[]
  youthTeams: YouthTeam[]
}

export default function TeamsPageClient({ teams, youthTeams }: TeamsPageClientProps) {
  const [selectedTeamId, setSelectedTeamId] = useState(teams[0]?.id || 'youth')
  
  // Find the current team or create youth team object
  const currentTeam = teams.find(t => t.id === selectedTeamId) || {
    id: 'youth',
    name: 'Jugendmannschaften',
    league: 'Verschiedene Jugendligen',
    coach: 'Jugendtrainer-Team',
    captain: 'Verschiedene',
    training: 'Nach Altersklasse',
    position: 0,
    points: 0,
    teamType: 'youth',
    players: [],
    lastResults: [],
    nextMatch: null
  }
  
  const isYouthSelected = selectedTeamId === 'youth'

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
              {teams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => setSelectedTeamId(team.id)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    selectedTeamId === team.id
                      ? 'bg-viktoria-blue dark:bg-viktoria-yellow text-white dark:text-viktoria-blue shadow-lg transform scale-105'
                      : 'bg-white dark:bg-viktoria-dark-light text-gray-700 dark:text-gray-300 hover:shadow-md'
                  }`}
                >
                  <IconUsers size={20} className="inline mr-2" />
                  {team.name}
                </button>
              ))}
              {youthTeams.length > 0 && (
                <button
                  onClick={() => setSelectedTeamId('youth')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    isYouthSelected
                      ? 'bg-viktoria-blue dark:bg-viktoria-yellow text-white dark:text-viktoria-blue shadow-lg transform scale-105'
                      : 'bg-white dark:bg-viktoria-dark-light text-gray-700 dark:text-gray-300 hover:shadow-md'
                  }`}
                >
                  <IconUsers size={20} className="inline mr-2" />
                  Jugendmannschaften
                </button>
              )}
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
                  {!isYouthSelected && currentTeam.captain !== 'Verschiedene' && (
                    <div className="bg-gray-50 dark:bg-viktoria-dark rounded-lg p-4">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Kapitän</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{currentTeam.captain}</p>
                    </div>
                  )}
                  <div className="bg-gray-50 dark:bg-viktoria-dark rounded-lg p-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Training</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{currentTeam.training}</p>
                  </div>
                  {!isYouthSelected && currentTeam.position > 0 && (
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
                {isYouthSelected ? (
                  <>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">
                      <IconUsers size={20} className="inline mr-2" />
                      Jugendteams
                    </h3>
                    <div className="space-y-3">
                      {youthTeams.map((team) => (
                        <div key={team.id} className="bg-gray-50 dark:bg-viktoria-dark rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white">{team.name}</h4>
                              {team.league && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">Liga: {team.league}</p>
                              )}
                              {team.coach && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">Trainer: {team.coach}</p>
                              )}
                            </div>
                            {team.player_count && (
                              <div className="text-right">
                                <p className="text-2xl font-bold text-viktoria-blue dark:text-viktoria-yellow">
                                  {team.player_count}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Spieler</p>
                              </div>
                            )}
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
                    {currentTeam.players.length > 0 ? (
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
                              <tr key={player.id} className="border-b border-gray-100 dark:border-gray-800">
                                <td className="py-2 text-gray-900 dark:text-white font-semibold">
                                  {player.number || '-'}
                                </td>
                                <td className="py-2 text-gray-900 dark:text-white">
                                  {player.name}
                                  {player.is_captain && (
                                    <span className="ml-2 text-xs px-2 py-1 bg-viktoria-yellow text-viktoria-blue rounded-full">
                                      Kapitän
                                    </span>
                                  )}
                                </td>
                                <td className="py-2 text-gray-600 dark:text-gray-400">
                                  {player.position || '-'}
                                </td>
                                <td className="py-2 text-gray-600 dark:text-gray-400">
                                  {player.age || '-'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                        Keine Spieler gefunden
                      </p>
                    )}
                  </>
                )}
                </div>
              </div>
            </AnimatedSection>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Next Match */}
              {!isYouthSelected && currentTeam.nextMatch && (
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
                          {new Date(currentTeam.nextMatch.date).toLocaleDateString('de-DE')}
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
              )}

              {/* Last Results */}
              {!isYouthSelected && currentTeam.lastResults && currentTeam.lastResults.length > 0 && (
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
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="text-sm text-gray-900 dark:text-white">
                                vs. {result.opponent}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-gray-900 dark:text-white">
                                {result.result}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                result.type === 'Sieg' 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                                  : result.type === 'Niederlage'
                                  ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
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

              {/* Placeholder for youth teams */}
              {isYouthSelected && (
                <AnimatedSection animation="slideUp" delay={0.3}>
                  <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden">
                    <div className="border-b-2 border-viktoria-blue dark:border-viktoria-yellow px-4 py-2 text-center">
                      <h3 className="text-gray-900 dark:text-white font-semibold text-sm">
                        Jugend Info
                      </h3>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Unsere Jugendabteilung umfasst {youthTeams.length} Teams von den Bambinis bis zur A-Jugend.
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Für detaillierte Informationen zu Spielplänen und Trainingszeiten kontaktieren Sie bitte die jeweiligen Trainer.
                      </p>
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