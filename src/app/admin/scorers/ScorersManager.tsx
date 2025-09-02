'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AuthGuard from '../AuthGuard'
import { getErrorMessage } from '../types/error.types'

interface Scorer {
  id: string
  player_name: string
  player_id: string | null
  team_name: string | null
  team_id: string | null
  goals: number | null
  assists: number | null
  season: string | null
}

interface Player {
  id: string
  name: string
  team_id: string | null
}

interface Team {
  id: string
  name: string
}

export default function ScorersManager({ 
  initialScorers, 
  players,
  teams 
}: { 
  initialScorers: Scorer[]
  players: Player[]
  teams: Team[]
}) {
  return (
    <AuthGuard>
      <ScorersManagerContent initialScorers={initialScorers} players={players} teams={teams} />
    </AuthGuard>
  )
}

function ScorersManagerContent({ 
  initialScorers, 
  players,
  teams 
}: { 
  initialScorers: Scorer[]
  players: Player[]
  teams: Team[]
}) {
  const [scorers, setScorers] = useState(initialScorers)
  const [selectedSeason, setSelectedSeason] = useState('2025/26')
  const [showForm, setShowForm] = useState(false)
  const [editingScorer, setEditingScorer] = useState<Scorer | null>(null)
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    player_name: '',
    player_id: '',
    team_name: '',
    team_id: '',
    goals: 0,
    assists: 0,
    season: '2025/26'
  })

  const filteredScorers = scorers
    .filter(s => !selectedSeason || s.season === selectedSeason)
    .sort((a, b) => (b.goals || 0) - (a.goals || 0))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const dataToSave = {
        ...formData,
        player_id: formData.player_id || null,
        team_id: formData.team_id || null
      }

      if (editingScorer) {
        const { error } = await supabase
          .from('scorers')
          .update(dataToSave)
          .eq('id', editingScorer.id)
        
        if (error) throw error
        setMessage('Torschütze aktualisiert!')
      } else {
        const { error } = await supabase
          .from('scorers')
          .insert([dataToSave])
        
        if (error) throw error
        setMessage('Torschütze hinzugefügt!')
      }
      
      router.refresh()
      setShowForm(false)
      setEditingScorer(null)
      resetForm()
    } catch (error) {
      console.error('Fehler:', error)
      setMessage('Fehler: ' + getErrorMessage(error))
    }
  }

  const handleEdit = (scorer: Scorer) => {
    setEditingScorer(scorer)
    setFormData({
      player_name: scorer.player_name,
      player_id: scorer.player_id || '',
      team_name: scorer.team_name || '',
      team_id: scorer.team_id || '',
      goals: scorer.goals || 0,
      assists: scorer.assists || 0,
      season: scorer.season || '2025/26'
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Torschütze wirklich löschen?')) return
    
    try {
      const { error } = await supabase
        .from('scorers')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      setMessage('Torschütze gelöscht')
      setScorers(scorers.filter(s => s.id !== id))
    } catch (error) {
      console.error('Fehler:', error)
      setMessage('Fehler: ' + getErrorMessage(error))
    }
  }

  const resetForm = () => {
    setFormData({
      player_name: '',
      player_id: '',
      team_name: '',
      team_id: '',
      goals: 0,
      assists: 0,
      season: '2025/26'
    })
  }

  const handlePlayerSelect = (playerId: string) => {
    const player = players.find(p => p.id === playerId)
    if (player) {
      const team = teams.find(t => t.id === player.team_id)
      setFormData({
        ...formData,
        player_id: playerId,
        player_name: player.name,
        team_id: player.team_id || '',
        team_name: team?.name || ''
      })
    }
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Torschützenliste verwalten</h1>
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
              onClick={() => { setShowForm(true); setEditingScorer(null); resetForm() }}
              className="admin-btn admin-btn-success"
            >
              + Neuer Torschütze
            </button>
            
            <select 
              value={selectedSeason} 
              onChange={(e) => setSelectedSeason(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px' }}
            >
              <option value="">Alle Saisons</option>
              <option value="2025/26">2025/26</option>
              <option value="2024/25">2024/25</option>
              <option value="2023/24">2023/24</option>
            </select>
          </div>
          
          <div style={{ fontSize: '14px', color: '#666' }}>
            {filteredScorers.length} Torschützen
          </div>
        </div>

        {showForm && (
          <div className="admin-card admin-form-card">
            <h3>{editingScorer ? 'Torschütze bearbeiten' : 'Neuer Torschütze'}</h3>
            <form onSubmit={handleSubmit} className="admin-form">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="admin-form-group">
                  <label>Spieler auswählen</label>
                  <select 
                    value={formData.player_id}
                    onChange={(e) => handlePlayerSelect(e.target.value)}
                  >
                    <option value="">-- Spieler wählen --</option>
                    {players.map(player => (
                      <option key={player.id} value={player.id}>
                        {player.name} {player.team_id && `(${teams.find(t => t.id === player.team_id)?.name})`}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-group">
                  <label>Spielername (manuell) *</label>
                  <input
                    type="text"
                    value={formData.player_name}
                    onChange={(e) => setFormData({ ...formData, player_name: e.target.value })}
                    required
                    placeholder="z.B. Max Mustermann"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Team</label>
                  <select 
                    value={formData.team_id}
                    onChange={(e) => {
                      const team = teams.find(t => t.id === e.target.value)
                      setFormData({ 
                        ...formData, 
                        team_id: e.target.value,
                        team_name: team?.name || ''
                      })
                    }}
                  >
                    <option value="">-- Team wählen --</option>
                    {teams.map(team => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-group">
                  <label>Teamname (manuell)</label>
                  <input
                    type="text"
                    value={formData.team_name}
                    onChange={(e) => setFormData({ ...formData, team_name: e.target.value })}
                    placeholder="z.B. 1. Mannschaft"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Tore *</label>
                  <input
                    type="number"
                    value={formData.goals}
                    onChange={(e) => setFormData({ ...formData, goals: parseInt(e.target.value) || 0 })}
                    min="0"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label>Vorlagen</label>
                  <input
                    type="number"
                    value={formData.assists}
                    onChange={(e) => setFormData({ ...formData, assists: parseInt(e.target.value) || 0 })}
                    min="0"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Saison</label>
                  <select 
                    value={formData.season}
                    onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                  >
                    <option value="2025/26">2025/26</option>
                    <option value="2024/25">2024/25</option>
                    <option value="2023/24">2023/24</option>
                  </select>
                </div>
              </div>

              <div className="admin-actions" style={{ marginTop: '20px' }}>
                <button type="submit" className="admin-btn admin-btn-primary">
                  {editingScorer ? 'Aktualisieren' : 'Hinzufügen'}
                </button>
                <button 
                  type="button" 
                  onClick={() => { setShowForm(false); setEditingScorer(null); resetForm() }}
                  className="admin-btn"
                >
                  Abbrechen
                </button>
              </div>
            </form>
          </div>
        )}

        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Spieler</th>
              <th>Team</th>
              <th>Tore</th>
              <th>Vorlagen</th>
              <th>Scorerpunkte</th>
              <th>Saison</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {filteredScorers.map((scorer, index) => (
              <tr key={scorer.id}>
                <td>
                  {index === 0 && '🥇'}
                  {index === 1 && '🥈'}
                  {index === 2 && '🥉'}
                  {index > 2 && index + 1}
                </td>
                <td><strong>{scorer.player_name}</strong></td>
                <td>{scorer.team_name || '-'}</td>
                <td style={{ fontSize: '18px', fontWeight: 'bold', color: '#28a745' }}>
                  {scorer.goals || 0}
                </td>
                <td>{scorer.assists || 0}</td>
                <td><strong>{(scorer.goals || 0) + (scorer.assists || 0)}</strong></td>
                <td>{scorer.season || '-'}</td>
                <td>
                  <div className="admin-actions">
                    <button 
                      onClick={() => handleEdit(scorer)}
                      className="admin-btn admin-btn-primary"
                      style={{ padding: '4px 8px', fontSize: '12px' }}
                    >
                      Bearbeiten
                    </button>
                    <button 
                      onClick={() => handleDelete(scorer.id)}
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
      </div>
    </div>
  )
}