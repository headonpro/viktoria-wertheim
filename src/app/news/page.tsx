'use client'

import React, { useState } from 'react'
import PageLayout from '@/components/PageLayout'
import AnimatedSection from '@/components/AnimatedSection'
import NewsModal from '@/components/NewsModal'
import { IconCalendar, IconEye, IconUser, IconFilter, IconSearch } from '@tabler/icons-react'

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Mock-Daten für News
  const newsArticles = [
    {
      id: 1,
      title: 'Großartiger Sieg gegen FC Mondfeld',
      excerpt: 'Mit einer starken Mannschaftsleistung gewinnt unsere erste Mannschaft verdient mit 3:1 gegen den Tabellendritten.',
      content: 'Nach einem schwierigen Start in die Partie konnte sich unsere Mannschaft schnell fangen und dominierte das Spielgeschehen...',
      date: '2024-01-21',
      author: 'Pressewart',
      category: 'match',
      image: '/api/placeholder/800/400',
      views: 234,
      team: '1. Mannschaft'
    },
    {
      id: 2,
      title: 'Neue Verstärkungen für die Rückrunde',
      excerpt: 'Der SV Viktoria Wertheim freut sich, drei neue Spieler für die zweite Mannschaft präsentieren zu dürfen.',
      content: 'Die Vereinsführung hat in der Winterpause drei vielversprechende Talente verpflichtet...',
      date: '2024-01-20',
      author: 'Vorstand',
      category: 'transfer',
      image: '/api/placeholder/800/400',
      views: 189,
      team: '2. Mannschaft'
    },
    {
      id: 3,
      title: 'Jugend siegt im Pokalspiel',
      excerpt: 'Unsere U19 zieht nach einem spannenden Elfmeterschießen in die nächste Runde des Kreispokals ein.',
      content: 'In einem dramatischen Pokalspiel konnte sich unsere U19 durchsetzen...',
      date: '2024-01-19',
      author: 'Jugendleiter',
      category: 'youth',
      image: '/api/placeholder/800/400',
      views: 156,
      team: 'Jugend'
    },
    {
      id: 4,
      title: 'Wintertraining startet erfolgreich',
      excerpt: 'Bei optimalen Bedingungen startete die erste Mannschaft in die Vorbereitung auf die Rückrunde.',
      content: 'Trainer und Mannschaft zeigten sich hochmotiviert beim ersten Training des neuen Jahres...',
      date: '2024-01-18',
      author: 'Trainer',
      category: 'training',
      image: '/api/placeholder/800/400',
      views: 145,
      team: '1. Mannschaft'
    },
    {
      id: 5,
      title: 'Vereinsheim: Neue Öffnungszeiten',
      excerpt: 'Ab Februar gelten neue Öffnungszeiten für unser Vereinsheim. Alle Mitglieder und Gäste sind herzlich willkommen.',
      content: 'Das Vereinsheim wird ab Februar zu erweiterten Zeiten geöffnet sein...',
      date: '2024-01-17',
      author: 'Vereinswirt',
      category: 'club',
      image: '/api/placeholder/800/400',
      views: 98,
      team: 'Verein'
    },
    {
      id: 6,
      title: 'Jahreshauptversammlung 2024',
      excerpt: 'Die diesjährige Jahreshauptversammlung findet am 15. März statt. Alle Mitglieder sind eingeladen.',
      content: 'Der Vorstand lädt alle Mitglieder zur Jahreshauptversammlung ein...',
      date: '2024-01-16',
      author: 'Vorstand',
      category: 'club',
      image: '/api/placeholder/800/400',
      views: 201,
      team: 'Verein'
    }
  ]

  const categories = [
    { id: 'all', name: 'Alle News', icon: '📰' },
    { id: 'match', name: 'Spielberichte', icon: '⚽' },
    { id: 'transfer', name: 'Transfers', icon: '🤝' },
    { id: 'youth', name: 'Jugend', icon: '👦' },
    { id: 'training', name: 'Training', icon: '🏃' },
    { id: 'club', name: 'Verein', icon: '🏛️' }
  ]

  const filteredArticles = newsArticles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleArticleClick = (article: any) => {
    setSelectedArticle(article)
    setIsModalOpen(true)
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-viktoria-dark pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <AnimatedSection animation="fadeIn" className="mb-8" immediate={true}>
            <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden">
              <div className="border-b-2 border-viktoria-blue dark:border-viktoria-yellow px-4 py-2 text-center">
                <h1 className="text-gray-900 dark:text-white font-semibold text-sm">
                  News & Aktuelles
                </h1>
              </div>
              <div className="p-6">
                <p className="text-gray-600 dark:text-gray-400 text-center">
                  Alle Neuigkeiten rund um den SV Viktoria Wertheim
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* Search and Filter Bar */}
          <AnimatedSection animation="slideUp" delay={0.1} className="mb-6" immediate={true}>
            <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden">
              <div className="border-b-2 border-viktoria-blue dark:border-viktoria-yellow px-4 py-2 text-center">
                <h3 className="text-gray-900 dark:text-white font-semibold text-sm">
                  Suche & Filter
                </h3>
              </div>
              <div className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="News durchsuchen..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-viktoria-dark border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-viktoria-blue dark:focus:ring-viktoria-yellow text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div className="flex items-center space-x-2">
                  <IconFilter className="text-gray-400" size={20} />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 bg-gray-50 dark:bg-viktoria-dark border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-viktoria-blue dark:focus:ring-viktoria-yellow text-gray-900 dark:text-white"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Category Pills */}
          <AnimatedSection animation="slideUp" delay={0.2} className="mb-6" immediate={true}>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-viktoria-yellow text-viktoria-blue font-medium'
                      : 'bg-white dark:bg-viktoria-dark-light text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-viktoria-dark-lighter'
                  }`}
                >
                  <span className="mr-2">{cat.icon}</span>
                  {cat.name}
                </button>
              ))}
            </div>
          </AnimatedSection>

          {/* News Grid */}
          <AnimatedSection animation="slideUp" delay={0.3} immediate={true}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article, index) => (
                <div
                  key={article.id}
                  className="cursor-pointer group"
                  onClick={() => handleArticleClick(article)}
                >
                  <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    {/* Image */}
                    <div className="h-48 bg-gray-200 dark:bg-viktoria-dark relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-viktoria-yellow text-viktoria-blue text-xs font-semibold rounded-full">
                          {article.team}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-viktoria-blue dark:group-hover:text-viktoria-yellow transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                        {article.excerpt}
                      </p>

                      {/* Meta Info */}
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <IconCalendar size={14} />
                            <span>{new Date(article.date).toLocaleDateString('de-DE')}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <IconEye size={14} />
                            <span>{article.views}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <IconUser size={14} />
                          <span>{article.author}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* Load More Button */}
          <AnimatedSection animation="fadeIn" delay={0.5} className="mt-8 text-center">
            <button className="px-6 py-2 bg-viktoria-yellow hover:bg-yellow-500 text-viktoria-blue rounded-lg transition-colors font-medium">
              Weitere News laden
            </button>
          </AnimatedSection>
        </div>

        {/* News Modal */}
        <NewsModal
          article={selectedArticle}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedArticle(null)
          }}
        />
      </div>
    </PageLayout>
  )
}