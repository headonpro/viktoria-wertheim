'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { getErrorMessage, logError } from '@/lib/error-utils'
import AuthGuard from '../AuthGuard'
import MobileNav from '../components/MobileNav'
import ResponsiveTable, { TableActions, StatusBadge } from '../components/ResponsiveTable'
import SearchFilterBar, { commonFilterOptions } from '../components/SearchFilterBar'

interface News extends Record<string, unknown> {
  id: string
  title: string
  content: string | null
  excerpt: string | null
  category: string | null
  published_at: string | null
  is_featured: boolean | null
  image_url: string | null
}

export default function NewsManager({ initialNews }: { initialNews: News[] }) {
  return (
    <AuthGuard>
      <NewsManagerContent initialNews={initialNews} />
    </AuthGuard>
  )
}

function NewsManagerContent({ initialNews }: { initialNews: News[] }) {
  const [news, setNews] = useState(initialNews)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [message, setMessage] = useState('')
  const supabase = createClient()

  // Filter news based on search and category
  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                          (item.content?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const handleDelete = async (id: string) => {
    if (!confirm('Artikel wirklich löschen?')) return
    
    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      setMessage('Artikel gelöscht')
      setNews(news.filter(item => item.id !== id))
    } catch (error) {
      logError(error, 'NewsManager.handleDelete')
      setMessage('Fehler beim Löschen: ' + getErrorMessage(error))
    }
  }

  const getCategoryLabel = (category: string | null) => {
    const labels: Record<string, string> = {
      'match_report': 'Spielbericht',
      'transfers': 'Transfers',
      'youth': 'Jugend',
      'training': 'Training',
      'club_news': 'Vereinsnachrichten',
      'general': 'Allgemein'
    }
    return labels[category || ''] || category || '-'
  }

  const formatDate = (date: string | null) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('de-DE')
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div className="admin-header-content">
          <div>
            <h1>News-Verwaltung</h1>
            <Link href="/admin">← Zurück zum Dashboard</Link>
          </div>
          <MobileNav />
        </div>
      </div>

      {message && (
        <div className={`admin-alert ${message.includes('Fehler') ? 'admin-alert-error' : 'admin-alert-success'}`}>
          {message}
        </div>
      )}

      <div className="admin-card">
        {/* Search and Filter Bar */}
        <SearchFilterBar
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="🔍 Artikel suchen..."
          filterValue={filterCategory}
          onFilterChange={setFilterCategory}
          filterOptions={commonFilterOptions.categories}
          filterLabel="Kategorie auswählen"
        >
          <Link href="/admin/news/new">
            <button className="admin-btn admin-btn-success">+ Neuer Artikel</button>
          </Link>
        </SearchFilterBar>

        {/* Results count */}
        <div className="admin-results-count">
          {filteredNews.length} von {news.length} Artikeln
        </div>

        {/* Responsive Table */}
        <ResponsiveTable<News>
          columns={[
            { 
              key: 'title', 
              label: 'Titel',
              mobileLabel: 'Titel'
            },
            { 
              key: 'category', 
              label: 'Kategorie',
              render: (value) => getCategoryLabel(value as string | null)
            },
            { 
              key: 'published_at', 
              label: 'Datum',
              render: (value) => formatDate(value as string | null)
            },
            { 
              key: 'is_featured', 
              label: 'Featured',
              render: (value) => (value as boolean) ? (
                <StatusBadge status="featured">⭐ Featured</StatusBadge>
              ) : '-',
              hideOnMobile: true
            },
            {
              key: 'actions',
              label: 'Aktionen',
              render: (_, item) => (
                <TableActions>
                  <Link href={`/admin/news/${item.id}`}>
                    <button className="admin-btn admin-btn-primary admin-btn-small">
                      ✏️ Bearbeiten
                    </button>
                  </Link>
                  <button 
                    onClick={() => handleDelete(item.id)} 
                    className="admin-btn admin-btn-danger admin-btn-small"
                  >
                    🗑️ Löschen
                  </button>
                </TableActions>
              )
            }
          ]}
          data={filteredNews}
          idField="id"
          mobileCardHeader={(item) => (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{item.title}</span>
              {item.is_featured && <span style={{ color: '#FFD700' }}>⭐</span>}
            </div>
          )}
        />
      </div>
    </div>
  )
}