'use client'

import React, { useState } from 'react'
import PageLayout from '@/components/PageLayout'
import AnimatedSection from '@/components/AnimatedSection'
import NewsModal from '@/components/NewsModal'
import { IconCalendar, IconEye, IconUser, IconFilter, IconSearch } from '@tabler/icons-react'

interface NewsArticle {
  id: string | number
  title: string
  excerpt: string
  content: string
  date: string
  author: string
  category: string
  image: string
  views: number
  team: string
}

interface NewsPageClientProps {
  newsArticles: NewsArticle[]
}

export default function NewsPageClient({ newsArticles }: NewsPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

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

  const handleArticleClick = (article: NewsArticle) => {
    setSelectedArticle(article)
    setIsModalOpen(true)
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-viktoria-dark pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
{/* Categories and Search */}
          <AnimatedSection animation="slideUp" delay={0.1} className="mb-6" immediate={true}>
            {/* Desktop: Categories with integrated search */}
            <div className="hidden sm:flex items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-full transition-all duration-200 text-sm font-medium ${
                      selectedCategory === cat.id
                        ? 'bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 text-white dark:text-gray-900 shadow-md transform scale-105'
                        : 'bg-white dark:bg-viktoria-dark-light text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-viktoria-dark-lighter border border-gray-200 dark:border-gray-700 hover:border-viktoria-blue/30 dark:hover:border-viktoria-yellow/30'
                    }`}
                  >
                    <span className="mr-2">{cat.icon}</span>
                    {cat.name}
                  </button>
                ))}
              </div>
              
              {/* Compact Search */}
              <div className="relative">
                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Suche..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-48 pl-9 pr-3 py-2 bg-white dark:bg-viktoria-dark-light border border-gray-200 dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-viktoria-blue dark:focus:ring-viktoria-yellow text-gray-900 dark:text-white placeholder-gray-500 text-sm"
                />
              </div>
            </div>
            
            {/* Mobile: Only categories, no search */}
            <div className="sm:hidden relative">
              <div className="overflow-x-auto scrollbar-hide">
                <div className="flex gap-2 pb-2">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-4 py-2 rounded-full transition-all duration-200 text-sm font-medium whitespace-nowrap flex-shrink-0 ${
                        selectedCategory === cat.id
                          ? 'bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 text-white dark:text-gray-900 shadow-md'
                          : 'bg-white dark:bg-viktoria-dark-light text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <span className="mr-2">{cat.icon}</span>
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
              {/* Scroll indicator gradient */}
              <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-gray-50 dark:from-viktoria-dark to-transparent pointer-events-none" />
            </div>
          </AnimatedSection>

{/* News Grid */}
          <AnimatedSection animation="slideUp" delay={0.2} immediate={true}>
            {filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article) => (
                  <div
                    key={article.id}
                    className="cursor-pointer group"
                    onClick={() => handleArticleClick(article)}
                  >
                    <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                      {/* Image */}
                      <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1.5 bg-viktoria-blue/90 dark:bg-viktoria-yellow/90 backdrop-blur-sm text-white dark:text-gray-900 text-xs font-bold rounded-full uppercase tracking-wide">
                            {article.team}
                          </span>
                        </div>
                        <div className="absolute bottom-4 right-4">
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                              <IconEye size={12} className="text-white/90" />
                              <span className="text-white/90 text-xs font-medium">{article.views}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 sm:p-5">
                        <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white mb-2 group-hover:text-viktoria-blue dark:group-hover:text-viktoria-yellow transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <div className="h-[3.75rem] mb-4">
                          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
                            {article.excerpt}
                          </p>
                        </div>

                        {/* Meta Info */}
                        <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-1">
                              <IconCalendar size={14} className="text-viktoria-blue/50 dark:text-viktoria-yellow/50" />
                              <span className="text-gray-600 dark:text-gray-400 font-medium">
                                {new Date(article.date).toLocaleDateString('de-DE', { 
                                  day: '2-digit', 
                                  month: '2-digit', 
                                  year: 'numeric' 
                                })}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <IconUser size={14} className="text-viktoria-blue/50 dark:text-viktoria-yellow/50" />
                              <span className="text-gray-600 dark:text-gray-400 font-medium">{article.author}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  Keine News gefunden.
                </p>
              </div>
            )}
          </AnimatedSection>

          {/* Load More Button - only show if there are articles */}
          {newsArticles.length > 0 && (
            <AnimatedSection animation="fadeIn" delay={0.5} className="mt-8 text-center">
              <button className="px-8 py-3 bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 hover:from-viktoria-blue-light hover:to-viktoria-blue dark:hover:from-yellow-600 dark:hover:to-viktoria-yellow text-white dark:text-gray-900 rounded-lg transition-all duration-300 font-bold uppercase tracking-wide shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Weitere News laden
              </button>
            </AnimatedSection>
          )}
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