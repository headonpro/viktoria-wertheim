import React from 'react'
import { createClient } from '@/lib/supabase/server'
import NewsPageClient from '@/components/NewsPageClient'
import { Metadata } from 'next'
import type { Database } from '@/lib/database.types'

type News = Database['public']['Tables']['news']['Row']

export const metadata: Metadata = {
  title: 'News & Aktuelles - SV Viktoria Wertheim',
  description: 'Alle Neuigkeiten rund um den SV Viktoria Wertheim - Spielberichte, Transfers, Vereinsnachrichten und mehr'
}

export default async function NewsPage() {
  const supabase = await createClient()
  
  let news: News[] = []
  
  try {
    // Fetch news articles from database
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('published_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching news:', error)
      news = []
    } else {
      news = data || []
    }
  } catch (error) {
    console.error('Critical error in NewsPage:', error)
    news = []
  }
  
  // Helper function to safely truncate text without breaking UTF-8 characters
  const safeExcerpt = (text: string | null, maxLength: number = 150): string => {
    if (!text) return ''
    
    // If text is shorter than maxLength, return as is
    if (text.length <= maxLength) return text
    
    // Find a safe cut point (not in the middle of a multi-byte character)
    let safeLength = maxLength
    
    // Check if we're in the middle of a multi-byte character
    // UTF-8 continuation bytes start with 10xxxxxx (0x80 to 0xBF)
    while (safeLength > 0 && (text.charCodeAt(safeLength) & 0xC0) === 0x80) {
      safeLength--
    }
    
    // Try to cut at a word boundary for better readability
    const truncated = text.substring(0, safeLength)
    const lastSpace = truncated.lastIndexOf(' ')
    
    if (lastSpace > safeLength * 0.8) {
      return truncated.substring(0, lastSpace) + '...'
    }
    
    return truncated + '...'
  }
  
  // Transform database fields to match existing component expectations
  const newsArticles = (news || []).map(article => ({
    id: article.id,
    title: article.title,
    excerpt: article.excerpt || safeExcerpt(article.content),
    content: article.content || '',
    date: article.published_at || new Date().toISOString(),
    author: 'Pressewart', // author field doesn't exist in DB
    category: article.category || 'club',
    image: article.image_url || '/placeholder.svg',
    views: article.views || 0,
    team: 'Verein' // team field doesn't exist in DB
  }))
  
  return <NewsPageClient newsArticles={newsArticles} />
}