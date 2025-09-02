'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AuthGuard from '../AuthGuard'
import { getErrorMessage } from '../types/error.types'

interface Match {
  id: string
  home_team: string
  away_team: string
  home_team_id: string | null
  away_team_id: string | null
  match_date: string
  match_time: string | null
  home_score: number | null
  away_score: number | null
  location: string | null
  match_type: string | null
  status: string | null
}

interface Team {
  id: string
  name: string
}

export default function MatchesManager({ 
  initialMatches, 
  teams 
}: { 
  initialMatches: Match[]
  teams: Team[]
}) {
  return (
    <AuthGuard>
      <MatchesManagerContent initialMatches={initialMatches} teams={teams} />
    </AuthGuard>
  )
}

function MatchesManagerContent({ initialMatches, teams }: { initialMatches: Match[], teams: Team[] }) {
  const [matches, setMatches] = useState(initialMatches)
  const [showForm, setShowForm] = useState(false)
  const [editingMatch, setEditingMatch] = useState<Match | null>(null)
  const [message, setMessage] = useState('')
  const [filter, setFilter] = useState('all')
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    home_team: '',
    away_team: '',
    home_team_id: '',
    away_team_id: '',
    match_date: new Date().toISOString().split('T')[0],
    match_time: '15:00',
    home_score: null as number | null,
    away_score: null as number | null,
    location: '',
    match_type: 'Liga',
    status: 'scheduled'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const dataToSave = {
        ...formData,
        home_team_id: formData.home_team_id || null,
        away_team_id: formData.away_team_id || null
      }

      if (editingMatch) {
        const { error } = await supabase
          .from('matches')
          .update(dataToSave)
          .eq('id', editingMatch.id)
        
        if (error) throw error
        setMessage('Spiel aktualisiert!')
      } else {
        const { error } = await supabase
          .from('matches')
          .insert([dataToSave])
        
        if (error) throw error
        setMessage('Spiel erstellt!')
      }
      
      router.refresh()
      setShowForm(false)
      setEditingMatch(null)
      resetForm()
    } catch (error) {
      console.error('Fehler:', error)
      setMessage('Fehler: ' + getErrorMessage(error))
    }
  }

  const handleEdit = (match: Match) => {
    setEditingMatch(match)
    setFormData({
      home_team: match.home_team,
      away_team: match.away_team,
      home_team_id: match.home_team_id || '',
      away_team_id: match.away_team_id || '',
      match_date: match.match_date.split('T')[0],
      match_time: match.match_time || '15:00',
      home_score: match.home_score,
      away_score: match.away_score,
      location: match.location || '',
      match_type: match.match_type || 'Liga',
      status: match.status || 'scheduled'
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Spiel wirklich löschen?')) return
    
    try {
      const { error } = await supabase
        .from('matches')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      setMessage('Spiel gelöscht')
      setMatches(matches.filter(m => m.id !== id))
    } catch (error) {
      console.error('Fehler:', error)
      setMessage('Fehler: ' + getErrorMessage(error))
    }
  }

  const resetForm = () => {
    setFormData({
      home_team: '',
      away_team: '',
      home_team_id: '',
      away_team_id: '',
      match_date: new Date().toISOString().split('T')[0],
      match_time: '15:00',
      home_score: null,
      away_score: null,
      location: '',
      match_type: 'Liga',
      status: 'scheduled'
    })
  }

  const filteredMatches = matches.filter(match => {
    if (filter === 'all') return true
    if (filter === 'upcoming') return !match.home_score && !match.away_score
    if (filter === 'completed') return match.home_score !== null || match.away_score !== null
    return true
  })

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Spielplan-Verwaltung</h1>
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
              onClick={() => { setShowForm(true); setEditingMatch(null); resetForm() }}
              className="admin-btn admin-btn-success"
            >
              + Neues Spiel
            </button>
            
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px' }}
            >
              <option value="all">Alle Spiele</option>
              <option value="upcoming">Kommende</option>
              <option value="completed">Beendet</option>
            </select>
          </div>
          
          <div style={{ fontSize: '14px', color: '#666' }}>
            {filteredMatches.length} Spiele
          </div>
        </div>

        {showForm && (
          <div className="admin-card admin-form-card">
            <h3>{editingMatch ? 'Spiel bearbeiten' : 'Neues Spiel'}</h3>
            <form onSubmit={handleSubmit} className="admin-form">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="admin-form-group">
                  <label>Heimmannschaft *</label>
                  <input
                    type="text"
                    value={formData.home_team}
                    onChange={(e) => setFormData({ ...formData, home_team: e.target.value })}
                    required
                    placeholder="z.B. SV Viktoria Wertheim"
                  />
                  <select 
                    value={formData.home_team_id}
                    onChange={(e) => setFormData({ ...formData, home_team_id: e.target.value })}
                    style={{ marginTop: '5px' }}
                  >
                    <option value="">Team verknüpfen (optional)</option>
                    {teams.map(team => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-group">
                  <label>Auswärtsmannschaft *</label>
                  <input
                    type="text"
                    value={formData.away_team}
                    onChange={(e) => setFormData({ ...formData, away_team: e.target.value })}
                    required
                    placeholder="z.B. FC Beispiel"
                  />
                  <select 
                    value={formData.away_team_id}
                    onChange={(e) => setFormData({ ...formData, away_team_id: e.target.value })}
                    style={{ marginTop: '5px' }}
                  >
                    <option value="">Team verknüpfen (optional)</option>
                    {teams.map(team => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-group">
                  <label>Datum *</label>
                  <input
                    type="date"
                    value={formData.match_date}
                    onChange={(e) => setFormData({ ...formData, match_date: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label>Uhrzeit</label>
                  <input
                    type="time"
                    value={formData.match_time}
                    onChange={(e) => setFormData({ ...formData, match_time: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Heim-Tore</label>
                  <input
                    type="number"
                    value={formData.home_score || ''}
                    onChange={(e) => setFormData({ ...formData, home_score: e.target.value ? parseInt(e.target.value) : null })}
                    min="0"
                    placeholder="0"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Auswärts-Tore</label>
                  <input
                    type="number"
                    value={formData.away_score || ''}
                    onChange={(e) => setFormData({ ...formData, away_score: e.target.value ? parseInt(e.target.value) : null })}
                    min="0"
                    placeholder="0"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Spielort</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="z.B. Sportplatz Wertheim"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Spieltyp</label>
                  <select 
                    value={formData.match_type}
                    onChange={(e) => setFormData({ ...formData, match_type: e.target.value })}
                  >
                    <option value="Liga">Liga</option>
                    <option value="Pokal">Pokal</option>
                    <option value="Freundschaftsspiel">Freundschaftsspiel</option>
                    <option value="Turnier">Turnier</option>
                  </select>
                </div>
              </div>

              <div className="admin-actions" style={{ marginTop: '20px' }}>
                <button type="submit" className="admin-btn admin-btn-primary">
                  {editingMatch ? 'Aktualisieren' : 'Erstellen'}
                </button>
                <button 
                  type="button" 
                  onClick={() => { setShowForm(false); setEditingMatch(null); resetForm() }}
                  className="admin-btn"
                >
                  Abbrechen
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Desktop Table */}
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Datum</th>
                <th>Zeit</th>
                <th>Heim</th>
                <th>Gast</th>
                <th>Ergebnis</th>
                <th>Typ</th>
                <th>Ort</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {filteredMatches.map((match) => (
                <tr key={match.id}>
                  <td>{formatDate(match.match_date)}</td>
                  <td>{match.match_time || '-'}</td>
                  <td><strong>{match.home_team}</strong></td>
                  <td>{match.away_team}</td>
                  <td>
                    {match.home_score !== null && match.away_score !== null 
                      ? `${match.home_score}:${match.away_score}`
                      : '-'
                    }
                  </td>
                  <td>{match.match_type || 'Liga'}</td>
                  <td>{match.location || '-'}</td>
                  <td>
                    <div className="admin-actions">
                      <button 
                        onClick={() => handleEdit(match)}
                        className="admin-btn admin-btn-primary admin-btn-small"
                      >
                        Bearbeiten
                      </button>
                      <button 
                        onClick={() => handleDelete(match.id)}
                        className="admin-btn admin-btn-danger admin-btn-small"
                      >
                        Löschen
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="admin-mobile-cards">
          {filteredMatches.map((match) => (
            <div key={match.id} className="admin-mobile-card">
              <div className="admin-mobile-card-header">
                <strong>{match.home_team}</strong> vs <strong>{match.away_team}</strong>
                {match.home_score !== null && match.away_score !== null && (
                  <span style={{ marginLeft: '10px', color: '#FFD700', fontWeight: 'bold' }}>
                    {match.home_score}:{match.away_score}
                  </span>
                )}
              </div>
              
              <div className="admin-mobile-card-row">
                <div className="admin-mobile-card-label">Datum:</div>
                <div className="admin-mobile-card-value">{formatDate(match.match_date)}</div>
              </div>
              
              <div className="admin-mobile-card-row">
                <div className="admin-mobile-card-label">Zeit:</div>
                <div className="admin-mobile-card-value">{match.match_time || '-'}</div>
              </div>
              
              <div className="admin-mobile-card-row">
                <div className="admin-mobile-card-label">Typ:</div>
                <div className="admin-mobile-card-value">{match.match_type || 'Liga'}</div>
              </div>
              
              <div className="admin-mobile-card-row">
                <div className="admin-mobile-card-label">Ort:</div>
                <div className="admin-mobile-card-value">{match.location || '-'}</div>
              </div>
              
              <div className="admin-mobile-card-row">
                <div className="admin-mobile-card-label">Aktionen:</div>
                <div className="admin-mobile-card-value">
                  <div className="admin-actions">
                    <button 
                      onClick={() => handleEdit(match)}
                      className="admin-btn admin-btn-primary admin-btn-small"
                    >
                      Bearbeiten
                    </button>
                    <button 
                      onClick={() => handleDelete(match.id)}
                      className="admin-btn admin-btn-danger admin-btn-small"
                    >
                      Löschen
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Data State */}
        {filteredMatches.length === 0 && (
          <div className="admin-loading">
            <p>Keine Spiele gefunden</p>
          </div>
        )}
      </div>
    </div>
  )
}