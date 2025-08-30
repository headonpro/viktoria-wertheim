'use client'

import React, { useState } from 'react'
import { IconCalendar, IconArrowLeft, IconArrowRight, IconEye } from '@tabler/icons-react'
import Image from 'next/image'
import Link from 'next/link'

interface NewsCarouselProps {
  newsArticles?: any[]
  onNewsClick?: (article: any) => void
  isDesktopSidebar?: boolean
}

export default function NewsCarousel({ newsArticles, onNewsClick, isDesktopSidebar = false }: NewsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Mock-Daten für News
  const defaultNews = [
    {
      id: 1,
      title: 'Großartiger Sieg gegen FC Mondfeld',
      excerpt: 'Mit einer starken Mannschaftsleistung gewinnt unsere erste Mannschaft verdient mit 3:1 gegen den Tabellendritten.',
      date: '2024-01-21',
      image: '/api/placeholder/400/300',
      views: 234
    },
    {
      id: 2,
      title: 'Neue Verstärkungen für die Rückrunde',
      excerpt: 'Der SV Viktoria Wertheim freut sich, drei neue Spieler für die zweite Mannschaft präsentieren zu dürfen.',
      date: '2024-01-20',
      image: '/api/placeholder/400/300',
      views: 189
    },
    {
      id: 3,
      title: 'Jugend siegt im Pokalspiel',
      excerpt: 'Unsere U19 zieht nach einem spannenden Elfmeterschießen in die nächste Runde des Kreispokals ein.',
      date: '2024-01-19',
      image: '/api/placeholder/400/300',
      views: 156
    },
    {
      id: 4,
      title: 'Trainingsauftakt für die Rückrunde',
      excerpt: 'Nach der Winterpause startet die Mannschaft mit vollem Einsatz in die Vorbereitung auf die zweite Saisonhälfte.',
      date: '2024-01-18',
      image: '/api/placeholder/400/300',
      views: 142
    }
  ]

  const articles = newsArticles && newsArticles.length > 0 ? newsArticles : defaultNews

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % articles.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length)
  }

  if (isDesktopSidebar) {
    // Desktop Sidebar Version
    return (
      <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden">
        <div className="border-b-2 border-viktoria-blue dark:border-viktoria-yellow px-4 py-2 text-center">
          <h3 className="text-gray-900 dark:text-white font-semibold text-sm">Aktuelle News</h3>
        </div>
        <div className="p-4 space-y-4">
          {articles.slice(0, 3).map((article, index) => (
            <div
              key={article.id}
              className={`${index === 0 ? '' : 'border-t border-gray-200 dark:border-viktoria-dark-lighter pt-4'} cursor-pointer hover:opacity-80 transition-opacity`}
              onClick={() => onNewsClick && onNewsClick(article)}
            >
              {index === 0 ? (
                // Erster Artikel mit Bild
                <div className="space-y-3">
                  <div className="relative h-32 bg-gray-200 dark:bg-viktoria-dark-lighter rounded-lg overflow-hidden">
                    <Image
                      src={article.image || '/api/placeholder/400/300'}
                      alt={article.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="flex items-center space-x-2 text-white/90 text-xs">
                        <div className="flex items-center space-x-1">
                          <IconCalendar size={12} />
                          <span>{new Date(article.date).toLocaleDateString('de-DE')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <IconEye size={12} />
                          <span>{article.views}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                      {article.title}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                      {article.excerpt}
                    </p>
                  </div>
                </div>
              ) : (
                // Folgende Artikel ohne Bild
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">
                    {article.title}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                    <div className="flex items-center space-x-1">
                      <IconCalendar size={12} />
                      <span>{new Date(article.date).toLocaleDateString('de-DE')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <IconEye size={12} />
                      <span>{article.views}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="px-4 py-3 bg-gray-50 dark:bg-viktoria-dark-lighter">
          <Link href="/news" className="text-sm text-viktoria-blue dark:text-viktoria-yellow hover:underline inline-block">
            Alle News anzeigen →
          </Link>
        </div>
      </div>
    )
  }

  // Mobile/Tablet Carousel Version
  return (
    <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden">
      <div className="border-b-2 border-viktoria-blue dark:border-viktoria-yellow px-4 py-2">
        <h3 className="text-gray-900 dark:text-white font-semibold text-sm text-center">Aktuelle News</h3>
        <div className="flex items-center justify-center space-x-2 mt-1">
          <button
            onClick={prevSlide}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            aria-label="Vorherige News"
          >
            <IconArrowLeft size={20} />
          </button>
          <span className="text-gray-600 dark:text-gray-400 text-sm">
            {currentIndex + 1} / {articles.length}
          </span>
          <button
            onClick={nextSlide}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            aria-label="Nächste News"
          >
            <IconArrowRight size={20} />
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {articles.map((article) => (
              <div
                key={article.id}
                className="w-full flex-shrink-0 cursor-pointer"
                onClick={() => onNewsClick && onNewsClick(article)}
              >
                <div className="relative h-48 bg-gray-200 dark:bg-viktoria-dark-lighter">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h4 className="font-semibold text-white text-lg mb-1">
                      {article.title}
                    </h4>
                    <div className="flex items-center space-x-3 text-white/80 text-xs">
                      <div className="flex items-center space-x-1">
                        <IconCalendar size={12} />
                        <span>{new Date(article.date).toLocaleDateString('de-DE')}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <IconEye size={12} />
                        <span>{article.views} Aufrufe</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <button className="mt-3 text-sm text-viktoria-blue dark:text-viktoria-yellow hover:underline">
                    Weiterlesen →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}