'use client'

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IconX, IconCalendar, IconUser, IconEye } from '@tabler/icons-react'
import SmartImage from '@/components/SmartImage'
import { createClient } from '@/lib/supabase/client'

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

interface NewsModalProps {
  article: NewsArticle | null
  isOpen: boolean
  onClose: () => void
  onViewsUpdate?: (articleId: string | number, newViews: number) => void
}

export default function NewsModal({ article, isOpen, onClose, onViewsUpdate }: NewsModalProps) {
  const [displayViews, setDisplayViews] = useState<number | null>(null)
  const [hasTrackedView, setHasTrackedView] = useState(false)
  
  // Track view when modal opens
  const trackView = useCallback(async () => {
    if (!article || hasTrackedView) return

    try {
      // Use Supabase directly to increment views
      const supabase = createClient()
      const { data, error } = await supabase
        .rpc('increment_news_views', { news_id: article.id })

      if (error) {
        console.error('Error incrementing views:', error)
        return
      }

      // Update local state with new view count
      const newViews = data || (article.views + 1)
      setDisplayViews(newViews)
      setHasTrackedView(true)

      // Notify parent component about the new view count
      if (onViewsUpdate) {
        onViewsUpdate(article.id, newViews)
      }
    } catch (error) {
      console.error('Error tracking view:', error)
    }
  }, [article, hasTrackedView, onViewsUpdate])
  
  // Handle keyboard events and view tracking
  React.useEffect(() => {
    if (isOpen && article) {
      // Track view when modal opens
      trackView()
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose()
        }
      }
      
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden' // Prevent background scroll
      
      // Focus the modal
      const modal = document.getElementById('news-modal')
      if (modal) {
        modal.focus()
      }
      
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
        document.body.style.overflow = ''
      }
    } else {
      // Reset tracking state when modal closes
      setHasTrackedView(false)
      setDisplayViews(null)
    }
  }, [isOpen, article, onClose, trackView])

  if (!article) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            id="news-modal"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-2xl md:w-full md:max-h-[90vh] bg-white dark:bg-viktoria-dark-light rounded-xl shadow-2xl overflow-hidden z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-content"
            tabIndex={-1}
          >
            {/* Header */}
            <div className="bg-white dark:bg-viktoria-dark-light">
              <div className="bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 px-6 py-4 flex items-center justify-between">
                <h2 id="modal-title" className="text-white dark:text-gray-900 font-bold text-lg uppercase tracking-wider">News Artikel</h2>
                <button
                  onClick={onClose}
                  className="text-white/80 dark:text-gray-900/80 hover:text-white dark:hover:text-gray-900 transition-colors bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20 rounded-full p-1.5 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-viktoria-blue"
                  aria-label="Modal schließen"
                >
                  <IconX size={20} aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div id="modal-content" className="overflow-y-auto max-h-[calc(90vh-80px)] md:max-h-[calc(90vh-120px)]">
              {/* Image */}
              {article.image && article.image !== '/placeholder.svg' && (
                <div className="h-64 bg-gray-200 dark:bg-viktoria-dark-lighter relative overflow-hidden">
                  <SmartImage
                    src={article.image}
                    alt={article.title}
                    className=""
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
              )}

              {/* Article Content */}
              <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {article.title}
                </h1>

                {/* Meta Info */}
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
                  <div className="flex items-center space-x-1">
                    <IconCalendar size={16} />
                    <span>{new Date(article.date).toLocaleDateString('de-DE')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <IconUser size={16} />
                    <span>{article.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <IconEye size={16} />
                    <span>{displayViews !== null ? displayViews : article.views} Aufrufe</span>
                  </div>
                </div>

                {/* Article Text */}
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  {article.excerpt && (
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                      {article.excerpt}
                    </p>
                  )}
                  
                  {article.content ? (
                    <div 
                      className="text-gray-700 dark:text-gray-300 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: article.content }} 
                    />
                  ) : (
                    <>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                        Mit einer beeindruckenden Mannschaftsleistung konnte unsere erste Mannschaft einen wichtigen Sieg einfahren. 
                        Von Beginn an zeigte das Team eine konzentrierte Leistung und ließ dem Gegner kaum Chancen.
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                        Bereits in der ersten Halbzeit konnte durch zwei schnelle Tore eine komfortable Führung herausgespielt werden. 
                        Die Defensive stand sicher und ließ nur wenige gefährliche Aktionen zu.
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        In der zweiten Halbzeit verwaltete die Mannschaft das Ergebnis clever und konnte durch einen späten Treffer 
                        den Endstand von 3:1 herstellen. Dieser Sieg festigt die Position in der oberen Tabellenhälfte.
                      </p>
                    </>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-viktoria-dark-lighter flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button 
                      className="px-4 py-2 bg-viktoria-yellow hover:bg-yellow-500 text-viktoria-blue rounded-lg transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-viktoria-yellow focus:ring-offset-2"
                      aria-label="Artikel teilen"
                    >
                      Teilen
                    </button>
                  </div>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-200 dark:bg-viktoria-dark-lighter hover:bg-gray-300 dark:hover:bg-viktoria-dark text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                    aria-label="Modal schließen"
                  >
                    Schließen
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}