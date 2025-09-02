'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import RichTextEditor from '../../components/RichTextEditor'
import ImageUploader from '../../components/ImageUploader'
import AuthGuard from '../../AuthGuard'
import { getErrorMessage } from '../../types/error.types'
import { ValidatedInput, ValidationRules } from '../../components/FormValidation'

export default function NewNewsForm() {
  return (
    <AuthGuard>
      <NewNewsFormContent />
    </AuthGuard>
  )
}

function NewNewsFormContent() {
  const router = useRouter()
  const supabase = createClient()
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [formValid, setFormValid] = useState({
    title: false,
    excerpt: true, // Not required
    content: false
  })
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'match_report',
    image_url: '',
    is_featured: false,
    published_at: new Date().toISOString().split('T')[0]
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.title.trim()) {
      setMessage('Fehler: Titel ist erforderlich')
      return
    }
    
    if (!formData.content.trim()) {
      setMessage('Fehler: Inhalt ist erforderlich')
      return
    }
    
    // Check if form is valid
    const isFormValid = formValid.title && formValid.content
    if (!isFormValid) {
      setMessage('Fehler: Bitte korrigieren Sie die Eingabefehler')
      return
    }
    
    setSaving(true)
    
    try {
      // Log the data being sent
      console.log('Sending data to Supabase:', {
        ...formData,
        published_at: new Date(formData.published_at).toISOString()
      })
      
      const { data, error } = await supabase
        .from('news')
        .insert([{
          ...formData,
          published_at: new Date(formData.published_at).toISOString()
        }])
        .select()
      
      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw error
      }
      
      console.log('Article created successfully:', data)
      setMessage('Artikel erfolgreich erstellt!')
      setTimeout(() => {
        router.push('/admin/news')
      }, 1500)
    } catch (error) {
      console.error('Fehler beim Erstellen des Artikels:', error)
      setMessage('Fehler beim Erstellen: ' + getErrorMessage(error))
      setSaving(false)
    }
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Neuer News-Artikel</h1>
        <Link href="/admin/news">← Zurück zur Übersicht</Link>
      </div>

      {message && (
        <div className={`admin-alert ${message.includes('Fehler') ? 'admin-alert-error' : 'admin-alert-success'}`}>
          {message}
        </div>
      )}

      <div className="admin-card">
        <form onSubmit={handleSubmit} className="admin-form">
          <ValidatedInput
            label="Titel"
            value={formData.title}
            onChange={(value) => setFormData({ ...formData, title: value })}
            onValidityChange={(valid) => setFormValid({ ...formValid, title: valid })}
            required
            placeholder="z.B. Sieg gegen FC Beispiel"
            rules={[
              ValidationRules.titleLength()
            ]}
          />

          <ValidatedInput
            label="Kurzbeschreibung"
            value={formData.excerpt}
            onChange={(value) => setFormData({ ...formData, excerpt: value })}
            onValidityChange={(valid) => setFormValid({ ...formValid, excerpt: valid })}
            placeholder="Kurze Zusammenfassung für die Vorschau"
            rules={[
              ValidationRules.maxLength(200)
            ]}
          />

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
            <label>Inhalt</label>
            <RichTextEditor
              value={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              placeholder="Artikel-Inhalt verfassen..."
            />
          </div>

          <ImageUploader
            currentImageUrl={formData.image_url}
            onImageUploaded={(url) => setFormData({ ...formData, image_url: url })}
          />

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
            <label htmlFor="featured" style={{ margin: 0 }}>Als Featured-Artikel markieren</label>
          </div>

          <div className="admin-actions">
            <button type="submit" className="admin-btn admin-btn-success" disabled={saving}>
              {saving ? 'Wird erstellt...' : 'Artikel erstellen'}
            </button>
            <Link href="/admin/news">
              <button type="button" className="admin-btn">
                Abbrechen
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}