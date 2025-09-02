'use client'

import React from 'react'
import { IconNews } from '@tabler/icons-react'
import type { Database } from '@/lib/database.types'

type News = Database['public']['Tables']['news']['Row']

interface NewsTickerProps {
  news: News[]
  onNewsClick?: (article: News) => void
}

export default function NewsTicker({ news, onNewsClick }: NewsTickerProps) {
  if (!news || news.length === 0) {
    return null
  }

  // Format news for ticker
  const tickerNews = news.map(item => ({
    ...item,
    displayTitle: `📰 ${item.title}`
  }))

  return (
    <div className="bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-dark dark:to-viktoria-dark-light rounded-lg shadow-lg overflow-hidden">
      <div className="flex items-center">
        {/* News Label */}
        <div className="bg-viktoria-yellow px-4 py-2 flex items-center space-x-2 flex-shrink-0">
          <IconNews size={16} className="text-viktoria-blue" />
          <span className="text-viktoria-blue font-semibold text-sm">NEWS</span>
        </div>

        {/* Ticker Content */}
        <div className="flex-1 overflow-hidden">
          <div className="flex items-center animate-scroll-left whitespace-nowrap py-2">
            {tickerNews.map((item) => (
              <React.Fragment key={item.id}>
                <span
                  className="text-white text-sm cursor-pointer hover:text-viktoria-yellow transition-colors"
                  onClick={() => onNewsClick && onNewsClick(item)}
                >
                  {item.displayTitle}
                </span>
                <span className="mx-8 text-viktoria-yellow text-2xl">•</span>
              </React.Fragment>
            ))}
            {/* Duplicate for seamless loop */}
            {tickerNews.map((item) => (
              <React.Fragment key={`dup-${item.id}`}>
                <span
                  className="text-white text-sm cursor-pointer hover:text-viktoria-yellow transition-colors"
                  onClick={() => onNewsClick && onNewsClick(item)}
                >
                  {item.displayTitle}
                </span>
                <span className="mx-8 text-viktoria-yellow text-2xl">•</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}