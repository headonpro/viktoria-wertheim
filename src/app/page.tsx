'use client'

import React, { useState } from 'react'
import PageLayout from '@/components/PageLayout'
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

export default function Home() {
  const [selectedTeam, setSelectedTeam] = useState('1')
  const [selectedNewsArticle, setSelectedNewsArticle] = useState(null)
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false)
  const [isLeagueTableModalOpen, setIsLeagueTableModalOpen] = useState(false)
  const [isSponsorModalOpen, setIsSponsorModalOpen] = useState(false)

  const handleNewsClick = (article: any) => {
    setSelectedNewsArticle(article)
    setIsNewsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsNewsModalOpen(false)
    setSelectedNewsArticle(null)
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-viktoria-dark pt-20">
        {/* News Ticker */}
        <div className="mt-6 mb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection animation="slideUp" immediate={true}>
              <NewsTicker onNewsClick={handleNewsClick} />
            </AnimatedSection>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
          {/* Team Status Bar */}
          <AnimatedSection animation="fadeIn" className="mb-6" immediate={true}>
            <TeamStatus selectedTeam={selectedTeam} onTeamSelect={setSelectedTeam} />
          </AnimatedSection>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Game Cards */}
              <AnimatedSection animation="slideUp" delay={0.1} immediate={true}>
                <GameCards selectedTeam={selectedTeam} />
              </AnimatedSection>

              {/* League Table */}
              <AnimatedSection animation="slideUp" delay={0.2} immediate={true}>
                <SimpleLeagueTable 
                  selectedTeam={selectedTeam} 
                  onShowFullTable={() => setIsLeagueTableModalOpen(true)}
                />
              </AnimatedSection>

              {/* Sponsors - Desktop - Moved to left column bottom */}
              <AnimatedSection animation="slideUp" delay={0.3} className="hidden lg:block">
                <SponsorShowcase onBecomeSponsor={() => setIsSponsorModalOpen(true)} />
              </AnimatedSection>

              {/* Mobile/Tablet News Carousel */}
              <AnimatedSection animation="slideUp" delay={0.3} className="lg:hidden">
                <NewsCarousel onNewsClick={handleNewsClick} />
              </AnimatedSection>

              {/* Top Scorers - Mobile/Tablet */}
              <AnimatedSection animation="slideUp" delay={0.4} className="lg:hidden">
                <TopScorers />
              </AnimatedSection>

              {/* Sponsors - Mobile/Tablet */}
              <AnimatedSection animation="slideUp" delay={0.5} className="lg:hidden">
                <SponsorShowcase onBecomeSponsor={() => setIsSponsorModalOpen(true)} />
              </AnimatedSection>
            </div>

            {/* Right Column - Sidebar */}
            <div className="hidden lg:block space-y-6">
              {/* Desktop News */}
              <AnimatedSection animation="slideUp" delay={0.2}>
                <NewsCarousel onNewsClick={handleNewsClick} isDesktopSidebar={true} />
              </AnimatedSection>

              {/* Top Scorers */}
              <AnimatedSection animation="slideUp" delay={0.3}>
                <TopScorers />
              </AnimatedSection>
            </div>
          </div>

          {/* Additional Content Section */}
          <AnimatedSection animation="fadeIn" delay={0.6} className="mt-8">
            <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Willkommen beim SV Viktoria Wertheim
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Seit 1921 steht unser Verein für Leidenschaft, Teamgeist und sportlichen Erfolg. 
                Mit über 500 Mitgliedern und drei aktiven Mannschaften sind wir ein wichtiger 
                Bestandteil des Sports in Wertheim und der Region.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-viktoria-blue dark:text-viktoria-yellow">1921</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Gegründet</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-viktoria-blue dark:text-viktoria-yellow">500+</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Mitglieder</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-viktoria-blue dark:text-viktoria-yellow">3</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Mannschaften</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-viktoria-blue dark:text-viktoria-yellow">15</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Jugendteams</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* News Modal */}
        <NewsModal 
          article={selectedNewsArticle} 
          isOpen={isNewsModalOpen} 
          onClose={handleCloseModal} 
        />

        {/* League Table Modal */}
        <LeagueTableModal
          isOpen={isLeagueTableModalOpen}
          onClose={() => setIsLeagueTableModalOpen(false)}
          selectedTeam={selectedTeam}
        />

        {/* Sponsor Modal */}
        <SponsorModal
          isOpen={isSponsorModalOpen}
          onClose={() => setIsSponsorModalOpen(false)}
        />
      </div>
    </PageLayout>
  )
}