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
  
  // Transform database fields to match existing component expectations
  const newsArticles = (news || []).map(article => ({
    id: article.id,
    title: article.title,
    excerpt: article.excerpt || article.content?.substring(0, 150) + '...' || '',
    content: article.content || '',
    date: article.published_at || new Date().toISOString(),
    author: 'Pressewart', // author field doesn't exist in DB
    category: article.category || 'club',
    image: article.image_url || '/api/placeholder/800/400',
    views: article.views || 0,
    team: 'Verein' // team field doesn't exist in DB
  }))
  
  return <NewsPageClient newsArticles={newsArticles} />
}