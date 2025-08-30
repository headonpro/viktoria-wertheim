'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IconX, IconCalendar, IconUser, IconEye } from '@tabler/icons-react'

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
}

export default function NewsModal({ article, isOpen, onClose }: NewsModalProps) {
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
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-2xl md:w-full md:max-h-[90vh] bg-white dark:bg-viktoria-dark-light rounded-xl shadow-2xl overflow-hidden z-50"
          >
            {/* Header */}
            <div className="bg-white dark:bg-viktoria-dark-light">
              <div className="border-b-2 border-viktoria-blue dark:border-viktoria-yellow px-6 py-4 flex items-center justify-between">
                <h2 className="text-gray-900 dark:text-white font-semibold text-lg">News Artikel</h2>
                <button
                  onClick={onClose}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  aria-label="Schließen"
                >
                  <IconX size={24} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-80px)] md:max-h-[calc(90vh-120px)]">
              {/* Image */}
              {article.image && article.image !== '/api/placeholder/800/400' && (
                <div className="h-64 bg-gray-200 dark:bg-viktoria-dark-lighter relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  {/* In a real implementation, you would add an img tag here */}
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
                    <span>{article.views} Aufrufe</span>
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
                    <button className="px-4 py-2 bg-viktoria-yellow hover:bg-yellow-500 text-viktoria-blue rounded-lg transition-colors text-sm font-medium">
                      Teilen
                    </button>
                  </div>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-200 dark:bg-viktoria-dark-lighter hover:bg-gray-300 dark:hover:bg-viktoria-dark text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm"
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