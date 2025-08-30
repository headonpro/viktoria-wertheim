'use client'

import React, { useState } from 'react'
import PageLayout from '@/components/PageLayout'
import AnimatedSection from '@/components/AnimatedSection'
import TeamStatistics from '@/components/TeamStatistics'
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
  leagueStats?: {
    played: number
    won: number
    drawn: number
    lost: number
    goalsFor: number
    goalsAgainst: number
  } | null
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
          {/* Team Selector */}
          <AnimatedSection animation="slideUp" className="mb-8" immediate={true}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {teams.map((team, index) => {
                // Bestimme den Button-Text basierend auf der Reihenfolge
                const buttonLabels = ['1. Mannschaft', '2. Mannschaft', '3. Mannschaft']
                const buttonText = buttonLabels[index] || team.name
                
                return (
                  <button
                    key={team.id}
                    onClick={() => setSelectedTeamId(team.id)}
                    className={`px-3 py-4 rounded-lg font-semibold transition-all duration-300 flex flex-col items-center justify-center text-center ${
                      selectedTeamId === team.id
                        ? 'bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 text-white dark:text-gray-900 shadow-lg transform scale-105'
                        : 'bg-white dark:bg-viktoria-dark-light text-gray-700 dark:text-gray-300 hover:shadow-md border border-gray-200 dark:border-gray-700 hover:border-viktoria-blue/30 dark:hover:border-viktoria-yellow/30'
                    }`}
                  >
                    <span className="text-sm sm:text-base leading-tight font-semibold">
                      {buttonText}
                    </span>
                  </button>
                )
              })}
              {youthTeams.length > 0 && (
                <button
                  onClick={() => setSelectedTeamId('youth')}
                  className={`px-3 py-4 rounded-lg font-semibold transition-all duration-300 flex flex-col items-center justify-center text-center ${
                    isYouthSelected
                      ? 'bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 text-white dark:text-gray-900 shadow-lg transform scale-105'
                      : 'bg-white dark:bg-viktoria-dark-light text-gray-700 dark:text-gray-300 hover:shadow-md border border-gray-200 dark:border-gray-700 hover:border-viktoria-blue/30 dark:hover:border-viktoria-yellow/30'
                  }`}
                >
                  <span className="text-sm sm:text-base leading-tight font-semibold">Jugend</span>
                </button>
              )}
            </div>
          </AnimatedSection>

          {/* Team Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Info */}
            <AnimatedSection animation="slideUp" className="lg:col-span-2" immediate={true}>
              <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 px-4 py-3">
                  <h2 className="text-white dark:text-gray-900 font-bold text-sm uppercase tracking-wider text-center">
                    {currentTeam.name}
                  </h2>
                </div>
                <div className="p-5 sm:p-6">

                {/* Team Details */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-6">
                  <div className="bg-gradient-to-br from-gray-50 to-white dark:from-viktoria-dark-lighter dark:to-viktoria-dark rounded-lg p-4 border border-gray-100 dark:border-gray-700 hover:border-viktoria-blue/30 dark:hover:border-viktoria-yellow/30 transition-colors text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium uppercase tracking-wide">Liga</p>
                    <p className="font-bold text-gray-900 dark:text-white">{currentTeam.league}</p>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-white dark:from-viktoria-dark-lighter dark:to-viktoria-dark rounded-lg p-4 border border-gray-100 dark:border-gray-700 hover:border-viktoria-blue/30 dark:hover:border-viktoria-yellow/30 transition-colors text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium uppercase tracking-wide">Trainer</p>
                    <p className="font-bold text-gray-900 dark:text-white">{currentTeam.coach}</p>
                  </div>
                  {!isYouthSelected && currentTeam.captain !== 'Verschiedene' && (
                    <div className="bg-gradient-to-br from-gray-50 to-white dark:from-viktoria-dark-lighter dark:to-viktoria-dark rounded-lg p-4 border border-gray-100 dark:border-gray-700 hover:border-viktoria-blue/30 dark:hover:border-viktoria-yellow/30 transition-colors text-center">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium uppercase tracking-wide">Kapitän</p>
                      <p className="font-bold text-gray-900 dark:text-white">{currentTeam.captain}</p>
                    </div>
                  )}
                  <div className="bg-gradient-to-br from-gray-50 to-white dark:from-viktoria-dark-lighter dark:to-viktoria-dark rounded-lg p-4 border border-gray-100 dark:border-gray-700 hover:border-viktoria-blue/30 dark:hover:border-viktoria-yellow/30 transition-colors text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium uppercase tracking-wide">Training</p>
                    <p className="font-bold text-gray-900 dark:text-white">{currentTeam.training}</p>
                  </div>
                  {!isYouthSelected && currentTeam.position > 0 && (
                    <>
                      <div className="bg-gradient-to-br from-gray-50 to-white dark:from-viktoria-dark-lighter dark:to-viktoria-dark rounded-lg p-4 border border-gray-100 dark:border-gray-700 hover:border-viktoria-blue/30 dark:hover:border-viktoria-yellow/30 transition-colors text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium uppercase tracking-wide">Tabellenplatz</p>
                        <p className="font-bold text-3xl bg-gradient-to-br from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 bg-clip-text text-transparent">
                          {currentTeam.position}.
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-gray-50 to-white dark:from-viktoria-dark-lighter dark:to-viktoria-dark rounded-lg p-4 border border-gray-100 dark:border-gray-700 hover:border-viktoria-blue/30 dark:hover:border-viktoria-yellow/30 transition-colors text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium uppercase tracking-wide">Punkte</p>
                        <p className="font-bold text-3xl bg-gradient-to-br from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 bg-clip-text text-transparent">
                          {currentTeam.points}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* Players List or Youth Teams */}
                {isYouthSelected ? (
                  <>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center">
                      <IconUsers size={20} className="mr-2 text-viktoria-blue dark:text-viktoria-yellow" />
                      Jugendteams
                    </h3>
                    <div className="space-y-3">
                      {youthTeams.map((team) => (
                        <div key={team.id} className="bg-gradient-to-br from-gray-50 to-white dark:from-viktoria-dark-lighter dark:to-viktoria-dark rounded-lg p-4 border border-gray-100 dark:border-gray-700 hover:border-viktoria-blue/30 dark:hover:border-viktoria-yellow/30 transition-all duration-200 hover:shadow-md text-center">
                          <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-2">{team.name}</h4>
                          {team.player_count && (
                            <div className="mb-3">
                              <p className="text-3xl font-bold bg-gradient-to-br from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 bg-clip-text text-transparent">
                                {team.player_count}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Spieler</p>
                            </div>
                          )}
                          {team.league && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              <span className="font-medium">Liga:</span> {team.league}
                            </p>
                          )}
                          {team.coach && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              <span className="font-medium">Trainer:</span> {team.coach}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center">
                      <IconUsers size={20} className="mr-2 text-viktoria-blue dark:text-viktoria-yellow" />
                      Spielerkader
                    </h3>
                    {currentTeam.players.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gradient-to-b from-gray-50 to-white dark:from-viktoria-dark-lighter dark:to-viktoria-dark-light">
                            <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                              <th className="text-left py-3 px-2 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Nr.</th>
                              <th className="text-left py-3 px-2 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Name</th>
                              <th className="text-left py-3 px-2 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">Position</th>
                              <th className="text-left py-3 px-2 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">Alter</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentTeam.players.map((player) => (
                              <tr key={player.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-viktoria-dark-lighter/50 transition-colors">
                                <td className="py-3 px-2 text-gray-900 dark:text-white font-bold">
                                  {player.number || '-'}
                                </td>
                                <td className="py-3 px-2">
                                  <span className="text-gray-900 dark:text-white font-medium">
                                    {player.name}
                                  </span>
                                  {player.is_captain && (
                                    <span className="ml-2 text-xs px-2 py-1 bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 text-white dark:text-gray-900 rounded-full font-bold">
                                      C
                                    </span>
                                  )}
                                </td>
                                <td className="py-3 px-2 text-gray-600 dark:text-gray-400 hidden sm:table-cell">
                                  {player.position || '-'}
                                </td>
                                <td className="py-3 px-2 text-gray-600 dark:text-gray-400 hidden sm:table-cell">
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
                <AnimatedSection animation="slideUp" immediate={true}>
                  <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 px-4 py-3">
                      <h3 className="text-white dark:text-gray-900 font-bold text-sm uppercase tracking-wider text-center">
                        Nächstes Spiel
                      </h3>
                    </div>
                    <div className="p-4 sm:p-5">
                      <div className="space-y-3">
                        <p className="font-bold text-lg text-gray-900 dark:text-white text-center">
                          vs. {currentTeam.nextMatch.opponent}
                        </p>
                        <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <IconCalendar size={16} className="mr-2 text-viktoria-blue dark:text-viktoria-yellow" />
                            <span className="font-medium">
                              {new Date(currentTeam.nextMatch.date).toLocaleDateString('de-DE', { 
                                weekday: 'short', 
                                day: '2-digit', 
                                month: '2-digit', 
                                year: 'numeric' 
                              })}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <IconClock size={16} className="mr-2 text-viktoria-blue dark:text-viktoria-yellow" />
                            <span className="font-medium">{currentTeam.nextMatch.time}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <IconMapPin size={16} className="mr-2 text-viktoria-blue dark:text-viktoria-yellow" />
                            <span className="font-medium">{currentTeam.nextMatch.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              )}

              {/* Last Results */}
              {!isYouthSelected && currentTeam.lastResults && currentTeam.lastResults.length > 0 && (
                <AnimatedSection animation="slideUp" immediate={true}>
                  <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 px-4 py-3">
                      <h3 className="text-white dark:text-gray-900 font-bold text-sm uppercase tracking-wider text-center">
                        Letzte Ergebnisse
                      </h3>
                    </div>
                    <div className="p-4 sm:p-5">
                      <div className="space-y-3">
                        {currentTeam.lastResults.map((result, index) => (
                          <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-gray-50 to-white dark:from-viktoria-dark-lighter dark:to-viktoria-dark border border-gray-100 dark:border-gray-700 hover:border-viktoria-blue/30 dark:hover:border-viktoria-yellow/30 transition-colors">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                vs. {result.opponent}
                              </p>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className="font-bold text-lg text-gray-900 dark:text-white">
                                {result.result}
                              </span>
                              <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                                result.type === 'Sieg' 
                                  ? 'bg-viktoria-blue/10 text-viktoria-blue dark:bg-viktoria-yellow/20 dark:text-viktoria-yellow'
                                  : result.type === 'Niederlage'
                                  ? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                              }`}>
                                {result.type === 'Sieg' ? 'S' : result.type === 'Niederlage' ? 'N' : 'U'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              )}

              {/* Team Statistics */}
              {!isYouthSelected && currentTeam.leagueStats && (
                <AnimatedSection animation="slideUp" immediate={true}>
                  <TeamStatistics
                    teamId={currentTeam.id}
                    teamName={currentTeam.name}
                    played={currentTeam.leagueStats.played}
                    won={currentTeam.leagueStats.won}
                    drawn={currentTeam.leagueStats.drawn}
                    lost={currentTeam.leagueStats.lost}
                    goalsFor={currentTeam.leagueStats.goalsFor}
                    goalsAgainst={currentTeam.leagueStats.goalsAgainst}
                    points={currentTeam.points}
                    position={currentTeam.position}
                  />
                </AnimatedSection>
              )}

              {/* Placeholder for youth teams */}
              {isYouthSelected && (
                <AnimatedSection animation="slideUp" immediate={true}>
                  <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 px-4 py-3">
                      <h3 className="text-white dark:text-gray-900 font-bold text-sm uppercase tracking-wider text-center">
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