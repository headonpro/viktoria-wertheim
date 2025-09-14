'use client'

import React, { useState, useMemo, useEffect, useRef } from 'react'
import TeamStatus from '@/components/TeamStatus'
import GameCards from '@/components/GameCards'
import SimpleLeagueTable from '@/components/SimpleLeagueTable'
import TopScorers from '@/components/TopScorers'
import NewsCarousel from '@/components/NewsCarousel'
import SponsorShowcase from '@/components/SponsorShowcase'
import VereinsAssistent from '@/components/VereinsAssistent'
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

// Extended type for standings with team_name (added by HomePage.tsx)
interface EnrichedLeagueStanding extends LeagueStanding {
  team_name: string
  league: string
}

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
    'Kreisliga A': EnrichedLeagueStanding[]
    'Kreisklasse A': EnrichedLeagueStanding[]
    'Kreisklasse B': EnrichedLeagueStanding[]
  }
  allLeagueStandings: EnrichedLeagueStanding[]
  lastFiveMatches: {
    '1': Match[]
    '2': Match[]
    '3': Match[]
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
  const [newsArticles, setNewsArticles] = useState(data.news)
  const gameCardsRef = useRef<HTMLDivElement>(null)

  // Map team selection to actual team IDs
  const teamIdMap = useMemo(() => ({
    '1': '229cb117-471a-4bcc-b60e-d73772738943', // SV Viktoria Wertheim (1. Mannschaft)
    '2': '568e99ad-d9e1-4f2d-a517-88d3a725755b', // SV Viktoria Wertheim 2 (2. Mannschaft)
    '3': 'b86367ef-883f-4b73-9c98-77e7a0daf8b8'  // SpG Viktoria Wertheim 3/Grünenwört (3. Mannschaft)
  }), [])

  const leagueMap = useMemo(() => ({
    '1': 'Kreisliga A',
    '2': 'Kreisklasse A',  
    '3': 'Kreisklasse B'
  } as const), [])

  // Filter data based on selected team
  const filteredData = useMemo(() => {
    const teamId = teamIdMap[selectedTeam]
    const league = leagueMap[selectedTeam]
    
    // Filter matches for the selected team
    const teamMatches = data.matches.filter(m => 
      m.home_team_id === teamId || m.away_team_id === teamId
    )
    
    // Find last completed match (most recent)
    const completedMatches = teamMatches.filter(m => m.status === 'completed')
    const lastMatch = completedMatches.length > 0 
      ? completedMatches[completedMatches.length - 1]  // Last in ascending order = most recent
      : undefined
    
    // Find next scheduled match (earliest upcoming)
    const nextMatch = teamMatches.find(m => m.status === 'scheduled')
    
    // Filter scorers for the selected team
    const teamName = selectedTeam === '1' ? 'SV Viktoria Wertheim' :
                     selectedTeam === '2' ? 'SV Viktoria Wertheim 2' :
                     'SpG Viktoria Wertheim 3/Grünenwört'
    
    const filteredScorers = data.scorers.filter(scorer => 
      scorer.team_name === teamName
    )
    
    return {
      lastMatch,
      nextMatch,
      leagueStandings: data.leagueStandings[league] || [],
      scorers: filteredScorers
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

  const handleViewsUpdate = (articleId: string | number, newViews: number) => {
    // Update the local state with new view count
    setNewsArticles(prevArticles => 
      prevArticles.map(article => 
        article.id === articleId 
          ? { ...article, views: newViews }
          : article
      )
    )
    
    // Update the selected article if it's the same one
    if (selectedNewsArticle && selectedNewsArticle.id === articleId) {
      setSelectedNewsArticle(prev => prev ? { ...prev, views: newViews } : null)
    }
  }

  // Update VereinsAssistent height to match GameCards
  useEffect(() => {
    const updateHeight = () => {
      if (gameCardsRef.current) {
        const height = gameCardsRef.current.offsetHeight
        document.documentElement.style.setProperty('--game-cards-height', `${height}px`)
      }
    }

    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [filteredData.lastMatch, filteredData.nextMatch])

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


      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        {/* Team Status Bar */}
        <AnimatedSection animation="fadeIn" className="mb-6" immediate={true}>
          <TeamStatus 
            selectedTeam={selectedTeam} 
            onTeamChange={setSelectedTeam} 
            teams={data.teams} 
            leagueStandings={data.allLeagueStandings}
            lastFiveMatches={data.lastFiveMatches[selectedTeam]}
          />
        </AnimatedSection>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Game Cards */}
            <AnimatedSection animation="slideUp" delay={0.1} immediate={true}>
              <div ref={gameCardsRef}>
                <GameCards 
                  lastMatch={filteredData.lastMatch}
                  nextMatch={filteredData.nextMatch}
                />
              </div>
            </AnimatedSection>

            {/* League Table - Desktop Only (in left column) */}
            <AnimatedSection animation="slideUp" delay={0.2} className="hidden lg:block" immediate={true}>
              <SimpleLeagueTable 
                standings={filteredData.leagueStandings}
                selectedTeamId={teamIdMap[selectedTeam]}
                onShowFullTable={() => setIsLeagueTableModalOpen(true)}
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

            {/* Sponsors Section - Desktop Only (in left column) */}
            <AnimatedSection animation="slideUp" delay={0.3} className="hidden lg:block" immediate={true}>
              <SponsorShowcase 
                sponsors={data.sponsors}
                onBecomeSponsor={() => setIsSponsorModalOpen(true)}
              />
            </AnimatedSection>

            {/* News Carousel - Mobile/Tablet Only */}
            <AnimatedSection animation="slideUp" delay={0.3} className="lg:hidden" immediate={true}>
              <NewsCarousel 
                newsArticles={newsArticles}
                onNewsClick={handleNewsClick}
              />
            </AnimatedSection>

            {/* Top Scorers - Mobile/Tablet Only */}
            <AnimatedSection animation="slideUp" delay={0.35} className="lg:hidden" immediate={true}>
              <TopScorers scorers={filteredData.scorers} />
            </AnimatedSection>

            {/* Vereins Assistent - Mobile/Tablet Only */}
            <AnimatedSection animation="slideUp" delay={0.4} className="lg:hidden" immediate={true}>
              <div className="h-[400px]">
                <VereinsAssistent />
              </div>
            </AnimatedSection>
          </div>

          {/* Right Column - Sidebar */}
          <div className="hidden lg:block space-y-6">
            {/* Vereins Assistent - Desktop Only */}
            <AnimatedSection animation="slideUp" delay={0.15} immediate={true}>
              <div className="h-full" style={{ height: 'var(--game-cards-height, 400px)' }}>
                <VereinsAssistent />
              </div>
            </AnimatedSection>

            {/* Top Scorers - Desktop Only */}
            <AnimatedSection animation="slideUp" delay={0.2} immediate={true}>
              <TopScorers scorers={filteredData.scorers} />
            </AnimatedSection>

            {/* News - Desktop Only */}
            <AnimatedSection animation="slideUp" delay={0.3} immediate={true}>
              <NewsCarousel 
                newsArticles={newsArticles}
                onNewsClick={handleNewsClick}
                isDesktopSidebar={true}
              />
            </AnimatedSection>
          </div>
        </div>

        {/* Sponsors Section - Mobile/Tablet Only */}
        <AnimatedSection animation="slideUp" delay={0.5} className="mt-8 lg:hidden" immediate={true}>
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
        onViewsUpdate={handleViewsUpdate}
      />
      <LeagueTableModal 
        isOpen={isLeagueTableModalOpen}
        onClose={() => setIsLeagueTableModalOpen(false)}
        selectedTeam={selectedTeam}
        allStandings={data.allLeagueStandings}
        teams={data.teams}
      />
      <SponsorModal 
        isOpen={isSponsorModalOpen}
        onClose={() => setIsSponsorModalOpen(false)}
      />
    </div>
  )
}