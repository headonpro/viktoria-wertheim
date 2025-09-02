'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AuthGuard from '../AuthGuard'
import { getErrorMessage, logError } from '@/lib/error-utils'

interface Subscriber {
  id: string
  email: string
  is_active: boolean | null
  subscribed_at: string | null
  unsubscribed_at: string | null
}

export default function NewsletterManager({ initialSubscribers }: { initialSubscribers: Subscriber[] }) {
  return (
    <AuthGuard>
      <NewsletterManagerContent initialSubscribers={initialSubscribers} />
    </AuthGuard>
  )
}

function NewsletterManagerContent({ initialSubscribers }: { initialSubscribers: Subscriber[] }) {
  const [subscribers, setSubscribers] = useState(initialSubscribers)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [message, setMessage] = useState('')
  const [selectedEmails, setSelectedEmails] = useState<string[]>([])
  const router = useRouter()
  const supabase = createClient()

  const filteredSubscribers = subscribers.filter(s => {
    const matchesFilter = filter === 'all' || 
      (filter === 'active' && s.is_active) ||
      (filter === 'inactive' && !s.is_active)
    const matchesSearch = s.email.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const handleToggleActive = async (subscriber: Subscriber) => {
    try {
      const updates = {
        is_active: !subscriber.is_active,
        unsubscribed_at: !subscriber.is_active ? null : new Date().toISOString()
      }
      
      const { error } = await supabase
        .from('newsletter_subscribers')
        .update(updates)
        .eq('id', subscriber.id)
      
      if (error) throw error
      
      setSubscribers(subscribers.map(s => 
        s.id === subscriber.id ? { ...s, ...updates } : s
      ))
    } catch (error) {
      logError(error, 'NewsletterManager.handleToggleActive')
      setMessage('Fehler: ' + getErrorMessage(error))
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Abonnent wirklich löschen?')) return
    
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      setMessage('Abonnent gelöscht')
      setSubscribers(subscribers.filter(s => s.id !== id))
    } catch (error) {
      logError(error, 'NewsletterManager.handleDelete')
      setMessage('Fehler: ' + getErrorMessage(error))
    }
  }

  const handleAddSubscriber = async () => {
    const email = prompt('E-Mail-Adresse eingeben:')
    if (!email || !email.includes('@')) {
      setMessage('Ungültige E-Mail-Adresse')
      return
    }

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ 
          email, 
          is_active: true,
          subscribed_at: new Date().toISOString()
        }])
      
      if (error) throw error
      
      setMessage('Abonnent hinzugefügt!')
      router.refresh()
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'code' in error && error.code === '23505') {
        setMessage('Diese E-Mail ist bereits registriert')
      } else {
        logError(error, 'NewsletterManager.handleAddSubscriber')
        setMessage('Fehler: ' + getErrorMessage(error))
      }
    }
  }

  const handleExport = () => {
    const activeSubscribers = subscribers.filter(s => s.is_active)
    const emails = activeSubscribers.map(s => s.email).join('\n')
    
    const blob = new Blob([emails], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
    
    setMessage(`${activeSubscribers.length} E-Mail-Adressen exportiert`)
  }

  const handleExportCSV = () => {
    const csv = [
      'E-Mail,Aktiv,Angemeldet am,Abgemeldet am',
      ...subscribers.map(s => 
        `"${s.email}",${s.is_active ? 'Ja' : 'Nein'},"${s.subscribed_at || ''}","${s.unsubscribed_at || ''}"`
      )
    ].join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    
    setMessage('CSV exportiert')
  }

  const toggleSelectAll = () => {
    if (selectedEmails.length === filteredSubscribers.length) {
      setSelectedEmails([])
    } else {
      setSelectedEmails(filteredSubscribers.map(s => s.email))
    }
  }

  const handleBulkDelete = async () => {
    if (!selectedEmails.length) return
    if (!confirm(`${selectedEmails.length} Abonnenten wirklich löschen?`)) return

    try {
      for (const email of selectedEmails) {
        await supabase
          .from('newsletter_subscribers')
          .delete()
          .eq('email', email)
      }
      
      setMessage(`${selectedEmails.length} Abonnenten gelöscht`)
      setSelectedEmails([])
      router.refresh()
    } catch (error) {
      logError(error, 'NewsletterManager.handleBulkDelete')
      setMessage('Fehler: ' + getErrorMessage(error))
    }
  }

  const formatDate = (date: string | null) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const stats = {
    total: subscribers.length,
    active: subscribers.filter(s => s.is_active).length,
    inactive: subscribers.filter(s => !s.is_active).length
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Newsletter-Abonnenten</h1>
        <Link href="/admin">← Zurück zum Dashboard</Link>
      </div>

      {message && (
        <div className={`admin-alert ${message.includes('Fehler') ? 'admin-alert-error' : 'admin-alert-success'}`}>
          {message}
        </div>
      )}

      {/* Statistik-Karten */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        <div className="admin-card">
          <h3>Gesamt</h3>
          <p style={{ fontSize: '2em', margin: '10px 0' }}>{stats.total}</p>
        </div>
        <div className="admin-card">
          <h3>Aktiv</h3>
          <p style={{ fontSize: '2em', margin: '10px 0', color: '#28a745' }}>{stats.active}</p>
        </div>
        <div className="admin-card">
          <h3>Inaktiv</h3>
          <p style={{ fontSize: '2em', margin: '10px 0', color: '#dc3545' }}>{stats.inactive}</p>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-actions" style={{ marginBottom: '20px', justifyContent: 'space-between' }}>
          <div className="admin-actions">
            <button onClick={handleAddSubscriber} className="admin-btn admin-btn-success">
              + Abonnent hinzufügen
            </button>
            
            <button onClick={handleExport} className="admin-btn admin-btn-primary">
              E-Mails exportieren
            </button>
            
            <button onClick={handleExportCSV} className="admin-btn admin-btn-primary">
              CSV exportieren
            </button>
            
            {selectedEmails.length > 0 && (
              <button onClick={handleBulkDelete} className="admin-btn admin-btn-danger">
                {selectedEmails.length} löschen
              </button>
            )}
          </div>
          
          <div className="admin-actions">
            <input
              type="text"
              placeholder="E-Mail suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
            
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px' }}
            >
              <option value="all">Alle</option>
              <option value="active">Aktiv</option>
              <option value="inactive">Inaktiv</option>
            </select>
          </div>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedEmails.length === filteredSubscribers.length && filteredSubscribers.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
              <th>E-Mail</th>
              <th>Status</th>
              <th>Angemeldet</th>
              <th>Abgemeldet</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubscribers.map((subscriber) => (
              <tr key={subscriber.id} style={{ opacity: subscriber.is_active ? 1 : 0.6 }}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedEmails.includes(subscriber.email)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedEmails([...selectedEmails, subscriber.email])
                      } else {
                        setSelectedEmails(selectedEmails.filter(e => e !== subscriber.email))
                      }
                    }}
                  />
                </td>
                <td>
                  <strong>{subscriber.email}</strong>
                </td>
                <td>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '4px',
                    background: subscriber.is_active ? 'var(--viktoria-green, #00A86B)' : '#dc3545',
                    color: '#fff',
                    fontSize: '12px'
                  }}>
                    {subscriber.is_active ? 'Aktiv' : 'Inaktiv'}
                  </span>
                </td>
                <td>{formatDate(subscriber.subscribed_at)}</td>
                <td>{formatDate(subscriber.unsubscribed_at)}</td>
                <td>
                  <div className="admin-actions">
                    <button 
                      onClick={() => handleToggleActive(subscriber)}
                      className={`admin-btn ${subscriber.is_active ? '' : 'admin-btn-success'}`}
                      style={{ padding: '4px 8px', fontSize: '12px' }}
                    >
                      {subscriber.is_active ? 'Deaktivieren' : 'Aktivieren'}
                    </button>
                    <button 
                      onClick={() => handleDelete(subscriber.id)}
                      className="admin-btn admin-btn-danger"
                      style={{ padding: '4px 8px', fontSize: '12px' }}
                    >
                      Löschen
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredSubscribers.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            Keine Abonnenten gefunden
          </div>
        )}
      </div>
    </div>
  )
}