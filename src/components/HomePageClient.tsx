'use client'

import React, { useState, useMemo } from 'react'
import TeamStatus from '@/components/TeamStatus'
import GameCards from '@/components/GameCards'
import SimpleLeagueTable from '@/components/SimpleLeagueTable'
import TopScorers from '@/components/TopScorers'
import NewsCarousel from '@/components/NewsCarousel'
import NewsTicker from '@/components/NewsTicker'
import SponsorShowcase from '@/components/SponsorShowcase'
import NewsModal from '@/components/NewsModal'
import LeagueTableModal from '@/components/LeagueTableModal'
import SponsorModal from '@/components/SponsorModal'
import AnimatedSection from '@/components/AnimatedSection'
import type { Database } from '@/lib/database.types'

type Team = Database['public']['Tables']['teams']['Row']
type Match = Database['public']['Tables']['matches']['Row']
type News = Database['public']['Tables']['news']['Row']
type Scorer = Database['public']['Tables']['scorers']['Row']
type Sponsor = Database['public']['Tables']['sponsors']['Row']
type LeagueStanding = Database['public']['Tables']['league_standings']['Row']

interface ProcessedData {
  teams: Team[]
  matches: Match[]
  news: News[]
  scorers: Scorer[]
  sponsors: {
    premium: Sponsor[]
    gold: Sponsor[]
    silver: Sponsor[]
  }
  leagueStandings: {
    'Kreisliga A': LeagueStanding[]
    'Kreisklasse B': LeagueStanding[]
    'Kreisklasse C': LeagueStanding[]
  }
}

interface HomePageClientProps {
  data: ProcessedData
}

export default function HomePageClient({ data }: HomePageClientProps) {
  const [selectedTeam, setSelectedTeam] = useState<'1' | '2' | '3'>('1')
  const [selectedNewsArticle, setSelectedNewsArticle] = useState<News | null>(null)
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false)
  const [isLeagueTableModalOpen, setIsLeagueTableModalOpen] = useState(false)
  const [isSponsorModalOpen, setIsSponsorModalOpen] = useState(false)

  // Map team selection to actual team IDs
  const teamIdMap = useMemo(() => ({
    '1': 'a1111111-1111-1111-1111-111111111111',
    '2': 'a2222222-2222-2222-2222-222222222222',
    '3': 'a3333333-3333-3333-3333-333333333333'
  }), [])

  const leagueMap = useMemo(() => ({
    '1': 'Kreisliga A',
    '2': 'Kreisklasse B',
    '3': 'Kreisklasse C'
  } as const), [])

  // Filter data based on selected team
  const filteredData = useMemo(() => {
    const teamId = teamIdMap[selectedTeam]
    const league = leagueMap[selectedTeam]
    
    return {
      lastMatch: data.matches.find(m => 
        (m.home_team_id === teamId || m.away_team_id === teamId) && 
        m.status === 'completed'
      ),
      nextMatch: data.matches.find(m => 
        (m.home_team_id === teamId || m.away_team_id === teamId) && 
        m.status === 'scheduled'
      ),
      leagueStandings: data.leagueStandings[league] || []
    }
  }, [selectedTeam, data, teamIdMap, leagueMap])

  const handleNewsClick = (article: News) => {
    setSelectedNewsArticle(article)
    setIsNewsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsNewsModalOpen(false)
    setSelectedNewsArticle(null)
  }

  // Transform news article for modal
  const transformedNewsArticle = selectedNewsArticle ? {
    id: selectedNewsArticle.id,
    title: selectedNewsArticle.title,
    excerpt: selectedNewsArticle.excerpt || '',
    content: selectedNewsArticle.content || '',
    date: selectedNewsArticle.published_at || new Date().toISOString(),
    author: 'SV Viktoria Wertheim',
    category: selectedNewsArticle.category || 'News',
    image: selectedNewsArticle.image_url || '/placeholder.jpg',
    views: selectedNewsArticle.views || 0,
    team: '1. Mannschaft'
  } : null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-viktoria-dark pt-20">
      {/* News Ticker */}
      <div className="mt-6 mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="slideUp" immediate={true}>
            <NewsTicker news={data.news} onNewsClick={handleNewsClick} />
          </AnimatedSection>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        {/* Team Status Bar */}
        <AnimatedSection animation="fadeIn" className="mb-6" immediate={true}>
          <TeamStatus selectedTeam={selectedTeam} onTeamChange={setSelectedTeam} teams={data.teams} />
        </AnimatedSection>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Game Cards */}
            <AnimatedSection animation="slideUp" delay={0.1} immediate={true}>
              <GameCards 
                lastMatch={filteredData.lastMatch}
                nextMatch={filteredData.nextMatch}
              />
            </AnimatedSection>

            {/* League Table - Mobile/Tablet Only */}
            <AnimatedSection animation="slideUp" delay={0.2} className="lg:hidden" immediate={true}>
              <SimpleLeagueTable 
                standings={filteredData.leagueStandings}
                selectedTeamId={teamIdMap[selectedTeam]}
                onShowFullTable={() => setIsLeagueTableModalOpen(true)}
              />
            </AnimatedSection>

            {/* Top Scorers - Mobile/Tablet Only */}
            <AnimatedSection animation="slideUp" delay={0.3} className="lg:hidden" immediate={true}>
              <TopScorers scorers={data.scorers} />
            </AnimatedSection>

            {/* News Carousel - Mobile/Tablet Only */}
            <AnimatedSection animation="slideUp" delay={0.4} className="lg:hidden" immediate={true}>
              <NewsCarousel 
                newsArticles={data.news}
                onNewsClick={handleNewsClick}
              />
            </AnimatedSection>
          </div>

          {/* Right Column - Sidebar */}
          <div className="hidden lg:block space-y-6">
            {/* News - Desktop Only */}
            <AnimatedSection animation="slideUp" delay={0.2} immediate={true}>
              <NewsCarousel 
                newsArticles={data.news}
                onNewsClick={handleNewsClick}
                isDesktopSidebar={true}
              />
            </AnimatedSection>

            {/* League Table - Desktop Only */}
            <AnimatedSection animation="slideUp" delay={0.3} immediate={true}>
              <SimpleLeagueTable 
                standings={filteredData.leagueStandings}
                selectedTeamId={teamIdMap[selectedTeam]}
                onShowFullTable={() => setIsLeagueTableModalOpen(true)}
              />
            </AnimatedSection>

            {/* Top Scorers - Desktop Only */}
            <AnimatedSection animation="slideUp" delay={0.4} immediate={true}>
              <TopScorers scorers={data.scorers} />
            </AnimatedSection>
          </div>
        </div>

        {/* Sponsors Section */}
        <AnimatedSection animation="slideUp" delay={0.5} className="mt-8" immediate={true}>
          <SponsorShowcase 
            sponsors={data.sponsors}
            onBecomeSponsor={() => setIsSponsorModalOpen(true)}
          />
        </AnimatedSection>
      </div>

      {/* Modals */}
      <NewsModal 
        isOpen={isNewsModalOpen}
        onClose={handleCloseModal}
        article={transformedNewsArticle}
      />
      <LeagueTableModal 
        isOpen={isLeagueTableModalOpen}
        onClose={() => setIsLeagueTableModalOpen(false)}
        selectedTeam={selectedTeam}
      />
      <SponsorModal 
        isOpen={isSponsorModalOpen}
        onClose={() => setIsSponsorModalOpen(false)}
      />
    </div>
  )
}