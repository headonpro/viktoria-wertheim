'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import RichTextEditor from '../../components/RichTextEditor'
import ImageUploader from '../../components/ImageUploader'
import AuthGuard from '../../AuthGuard'
import { getErrorMessage } from '../../types/error.types'

interface NewsArticle {
  id: string
  title: string
  content: string | null
  excerpt: string | null
  category: string | null
  published_at: string | null
  is_featured: boolean | null
  image_url: string | null
}

export default function NewsEditor({ article }: { article: NewsArticle }) {
  return (
    <AuthGuard>
      <NewsEditorContent article={article} />
    </AuthGuard>
  )
}

function NewsEditorContent({ article }: { article: NewsArticle }) {
  const router = useRouter()
  const supabase = createClient()
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    title: article.title,
    content: article.content || '',
    excerpt: article.excerpt || '',
    category: article.category || 'Erste Mannschaft',
    image_url: article.image_url || '',
    is_featured: article.is_featured || false,
    published_at: article.published_at 
      ? new Date(article.published_at).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      const { error } = await supabase
        .from('news')
        .update({
          ...formData,
          published_at: new Date(formData.published_at).toISOString()
        })
        .eq('id', article.id)
      
      if (error) throw error
      
      setMessage('Artikel erfolgreich aktualisiert!')
      setTimeout(() => {
        router.push('/admin/news')
      }, 1500)
    } catch (error) {
      console.error('Fehler beim Speichern:', error)
      setMessage('Fehler beim Speichern: ' + getErrorMessage(error))
      setSaving(false)
    }
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Artikel bearbeiten</h1>
        <Link href="/admin/news">← Zurück zur Übersicht</Link>
      </div>

      {message && (
        <div className={`admin-alert ${message.includes('Fehler') ? 'admin-alert-error' : 'admin-alert-success'}`}>
          {message}
        </div>
      )}

      <div className="admin-card">
        <form onSubmit={handleSubmit} className="admin-form">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
            {/* Left Column - Main Content */}
            <div>
              <div className="admin-form-group">
                <label>Titel *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="z.B. Sieg gegen FC Beispiel"
                  style={{ fontSize: '18px', fontWeight: 'bold' }}
                />
              </div>

              <div className="admin-form-group">
                <label>Kurzbeschreibung</label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Kurze Zusammenfassung für die Vorschau (max. 160 Zeichen)"
                  rows={3}
                  maxLength={160}
                />
                <small>{formData.excerpt.length}/160 Zeichen</small>
              </div>

              <div className="admin-form-group">
                <label>Inhalt</label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                  placeholder="Artikel-Inhalt verfassen..."
                />
              </div>
            </div>

            {/* Right Column - Meta & Settings */}
            <div>
              <div className="admin-card" style={{ background: '#262626', border: '1px solid #404040' }}>
                <h3>Einstellungen</h3>
                
                <div className="admin-form-group">
                  <label>Kategorie</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="match_report">Spielbericht</option>
                    <option value="transfers">Transfers</option>
                    <option value="youth">Jugend</option>
                    <option value="training">Training</option>
                    <option value="club_news">Vereinsnachrichten</option>
                    <option value="general">Allgemein</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label>Veröffentlichungsdatum</label>
                  <input
                    type="date"
                    value={formData.published_at}
                    onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
                  />
                </div>

                <div className="admin-form-group" style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    style={{ width: 'auto', marginRight: '10px' }}
                  />
                  <label htmlFor="featured" style={{ margin: 0 }}>
                    ⭐ Als Featured-Artikel markieren
                  </label>
                </div>

                <ImageUploader
                  currentImageUrl={formData.image_url}
                  onImageUploaded={(url) => setFormData({ ...formData, image_url: url })}
                />
              </div>

              <div className="admin-actions" style={{ marginTop: '20px' }}>
                <button 
                  type="submit" 
                  className="admin-btn admin-btn-success"
                  disabled={saving}
                  style={{ width: '100%' }}
                >
                  {saving ? 'Speichert...' : '💾 Änderungen speichern'}
                </button>
                <Link href="/admin/news" style={{ width: '100%' }}>
                  <button 
                    type="button" 
                    className="admin-btn"
                    style={{ width: '100%' }}
                  >
                    Abbrechen
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}