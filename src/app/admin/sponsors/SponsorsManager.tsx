'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AuthGuard from '../AuthGuard'
import { getErrorMessage } from '../types/error.types'

interface Sponsor {
  id: string
  name: string
  category: string | null
  logo_url: string | null
  website: string | null
  description: string | null
  is_active: boolean | null
}

export default function SponsorsManager({ initialSponsors }: { initialSponsors: Sponsor[] }) {
  return (
    <AuthGuard>
      <SponsorsManagerContent initialSponsors={initialSponsors} />
    </AuthGuard>
  )
}

function SponsorsManagerContent({ initialSponsors }: { initialSponsors: Sponsor[] }) {
  const [sponsors, setSponsors] = useState(initialSponsors)
  const [showForm, setShowForm] = useState(false)
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null)
  const [message, setMessage] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    name: '',
    category: 'Gold',
    logo_url: '',
    website: '',
    description: '',
    is_active: true
  })

  const categories = ['Premium', 'Gold', 'Silber', 'Bronze', 'Partner']

  const filteredSponsors = sponsors.filter(s => 
    filterCategory === 'all' || s.category === filterCategory
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingSponsor) {
        const { error } = await supabase
          .from('sponsors')
          .update(formData)
          .eq('id', editingSponsor.id)
        
        if (error) throw error
        setMessage('Sponsor aktualisiert!')
      } else {
        const { error } = await supabase
          .from('sponsors')
          .insert([formData])
        
        if (error) throw error
        setMessage('Sponsor hinzugefügt!')
      }
      
      router.refresh()
      setShowForm(false)
      setEditingSponsor(null)
      resetForm()
    } catch (error) {
      console.error('Fehler:', error)
      setMessage('Fehler: ' + getErrorMessage(error))
    }
  }

  const handleEdit = (sponsor: Sponsor) => {
    setEditingSponsor(sponsor)
    setFormData({
      name: sponsor.name,
      category: sponsor.category || 'Gold',
      logo_url: sponsor.logo_url || '',
      website: sponsor.website || '',
      description: sponsor.description || '',
      is_active: sponsor.is_active !== false
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Sponsor wirklich löschen?')) return
    
    try {
      const { error } = await supabase
        .from('sponsors')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      setMessage('Sponsor gelöscht')
      setSponsors(sponsors.filter(s => s.id !== id))
    } catch (error) {
      console.error('Fehler:', error)
      setMessage('Fehler: ' + getErrorMessage(error))
    }
  }

  const toggleActive = async (sponsor: Sponsor) => {
    try {
      const { error } = await supabase
        .from('sponsors')
        .update({ is_active: !sponsor.is_active })
        .eq('id', sponsor.id)
      
      if (error) throw error
      
      setSponsors(sponsors.map(s => 
        s.id === sponsor.id ? { ...s, is_active: !s.is_active } : s
      ))
    } catch (error) {
      console.error('Fehler:', error)
      setMessage('Fehler: ' + getErrorMessage(error))
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Gold',
      logo_url: '',
      website: '',
      description: '',
      is_active: true
    })
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Sponsoren verwalten</h1>
        <Link href="/admin">← Zurück zum Dashboard</Link>
      </div>

      {message && (
        <div className={`admin-alert ${message.includes('Fehler') ? 'admin-alert-error' : 'admin-alert-success'}`}>
          {message}
        </div>
      )}

      <div className="admin-card">
        <div className="admin-actions" style={{ marginBottom: '20px', justifyContent: 'space-between' }}>
          <div className="admin-actions">
            <button 
              onClick={() => { setShowForm(true); setEditingSponsor(null); resetForm() }}
              className="admin-btn admin-btn-success"
            >
              + Neuer Sponsor
            </button>
            
            <select 
              value={filterCategory} 
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px' }}
            >
              <option value="all">Alle Kategorien</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div style={{ fontSize: '14px', color: '#666' }}>
            {filteredSponsors.length} Sponsoren ({sponsors.filter(s => s.is_active).length} aktiv)
          </div>
        </div>

        {showForm && (
          <div className="admin-card admin-form-card">
            <h3>{editingSponsor ? 'Sponsor bearbeiten' : 'Neuer Sponsor'}</h3>
            <form onSubmit={handleSubmit} className="admin-form">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="admin-form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="z.B. Musterfirma GmbH"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Kategorie</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-group">
                  <label>Logo-URL</label>
                  <input
                    type="url"
                    value={formData.logo_url}
                    onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                    placeholder="https://beispiel.de/logo.png"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Website</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://www.beispiel.de"
                  />
                </div>

                <div className="admin-form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Beschreibung</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Kurze Beschreibung des Sponsors..."
                    rows={3}
                  />
                </div>

                <div className="admin-form-group" style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    style={{ width: 'auto', marginRight: '10px' }}
                  />
                  <label htmlFor="active" style={{ margin: 0 }}>Aktiv</label>
                </div>
              </div>

              <div className="admin-actions" style={{ marginTop: '20px' }}>
                <button type="submit" className="admin-btn admin-btn-primary">
                  {editingSponsor ? 'Aktualisieren' : 'Hinzufügen'}
                </button>
                <button 
                  type="button" 
                  onClick={() => { setShowForm(false); setEditingSponsor(null); resetForm() }}
                  className="admin-btn"
                >
                  Abbrechen
                </button>
              </div>
            </form>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {filteredSponsors.map((sponsor) => (
            <div 
              key={sponsor.id} 
              className="admin-card" 
              style={{ 
                opacity: sponsor.is_active ? 1 : 0.6,
                border: sponsor.category === 'Premium' ? '2px solid #FFD700' : '1px solid #ddd'
              }}
            >
              {sponsor.logo_url && (
                <div style={{ 
                  height: '100px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginBottom: '15px',
                  background: '#2a2a2a',
                  borderRadius: '4px'
                }}>
                  <img 
                    src={sponsor.logo_url} 
                    alt={sponsor.name}
                    style={{ maxHeight: '80px', maxWidth: '100%', objectFit: 'contain' }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              )}
              
              <h3 style={{ marginBottom: '10px' }}>{sponsor.name}</h3>
              
              <div style={{ marginBottom: '15px' }}>
                <span className="admin-btn" style={{ 
                  padding: '4px 8px', 
                  fontSize: '12px',
                  background: sponsor.category === 'Premium' ? 'var(--viktoria-yellow, #FFD700)' : 
                             sponsor.category === 'Gold' ? '#FFA500' :
                             sponsor.category === 'Silber' ? '#C0C0C0' : '#CD7F32',
                  color: sponsor.category === 'Silber' ? '#000' : '#fff'
                }}>
                  {sponsor.category}
                </span>
                
                {!sponsor.is_active && (
                  <span style={{ marginLeft: '10px', color: '#dc3545', fontSize: '12px' }}>
                    (Inaktiv)
                  </span>
                )}
              </div>
              
              {sponsor.website && (
                <p style={{ fontSize: '14px', marginBottom: '10px' }}>
                  <a href={sponsor.website} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff' }}>
                    Website →
                  </a>
                </p>
              )}
              
              {sponsor.description && (
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
                  {sponsor.description}
                </p>
              )}
              
              <div className="admin-actions">
                <button 
                  onClick={() => handleEdit(sponsor)}
                  className="admin-btn admin-btn-primary"
                  style={{ padding: '4px 8px', fontSize: '12px' }}
                >
                  Bearbeiten
                </button>
                <button 
                  onClick={() => toggleActive(sponsor)}
                  className={`admin-btn ${sponsor.is_active ? '' : 'admin-btn-success'}`}
                  style={{ padding: '4px 8px', fontSize: '12px' }}
                >
                  {sponsor.is_active ? 'Deaktivieren' : 'Aktivieren'}
                </button>
                <button 
                  onClick={() => handleDelete(sponsor.id)}
                  className="admin-btn admin-btn-danger"
                  style={{ padding: '4px 8px', fontSize: '12px' }}
                >
                  Löschen
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}