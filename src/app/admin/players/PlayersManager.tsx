'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AuthGuard from '../AuthGuard'
import { getErrorMessage } from '../types/error.types'

interface Player {
  id: string
  name: string
  position: string | null
  number: number | null
  age: number | null
  is_captain: boolean | null
  is_active: boolean | null
  team_id: string | null
  teams?: { name: string } | null
}

interface Team {
  id: string
  name: string
}

interface PlayersManagerProps {
  initialPlayers: Player[]
  teams: Team[]
  selectedTeamId?: string
}

export default function PlayersManager({ initialPlayers, teams, selectedTeamId }: PlayersManagerProps) {
  return (
    <AuthGuard>
      <PlayersManagerContent 
        initialPlayers={initialPlayers} 
        teams={teams}
        selectedTeamId={selectedTeamId}
      />
    </AuthGuard>
  )
}

function PlayersManagerContent({ initialPlayers, teams, selectedTeamId }: PlayersManagerProps) {
  const [players, setPlayers] = useState(initialPlayers)
  const [showForm, setShowForm] = useState(false)
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()
  
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    number: 0,
    age: 0,
    team_id: selectedTeamId || '',
    is_captain: false,
    is_active: true
  })

  const positions = ['Torwart', 'Abwehr', 'Mittelfeld', 'Sturm']

  const handleSave = async () => {
    try {
      const dataToSave = {
        ...formData,
        number: formData.number || null,
        age: formData.age || null,
        position: formData.position || null,
        team_id: formData.team_id || null
      }

      if (editingPlayer) {
        const { error } = await supabase
          .from('players')
          .update(dataToSave)
          .eq('id', editingPlayer.id)
        
        if (error) throw error
        setMessage('Spieler aktualisiert!')
      } else {
        const { error } = await supabase
          .from('players')
          .insert([dataToSave])
        
        if (error) throw error
        setMessage('Spieler hinzugefügt!')
      }
      
      setShowForm(false)
      setEditingPlayer(null)
      router.refresh()
    } catch (error) {
      console.error('Fehler:', error)
      setMessage('Fehler: ' + getErrorMessage(error))
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Spieler wirklich löschen?')) return
    
    try {
      const { error } = await supabase
        .from('players')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      setMessage('Spieler gelöscht')
      setPlayers(players.filter(p => p.id !== id))
    } catch (error) {
      console.error('Fehler beim Löschen:', error)
      setMessage('Fehler beim Löschen: ' + getErrorMessage(error))
    }
  }

  const handleEdit = (player: Player) => {
    setEditingPlayer(player)
    setFormData({
      name: player.name,
      position: player.position || '',
      number: player.number || 0,
      age: player.age || 0,
      team_id: player.team_id || '',
      is_captain: player.is_captain || false,
      is_active: player.is_active !== false
    })
    setShowForm(true)
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Spieler-Verwaltung</h1>
        <Link href="/admin/teams">← Zurück zu Teams</Link>
      </div>

      {message && (
        <div className={`admin-alert ${message.includes('Fehler') ? 'admin-alert-error' : 'admin-alert-success'}`}>
          {message}
        </div>
      )}

      {/* Player Form */}
      {showForm && (
        <div className="admin-card" style={{ marginBottom: '20px' }}>
          <h2>{editingPlayer ? 'Spieler bearbeiten' : 'Neuer Spieler'}</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="admin-form">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="admin-form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="admin-form-group">
                <label>Team</label>
                <select
                  value={formData.team_id}
                  onChange={(e) => setFormData({ ...formData, team_id: e.target.value })}
                >
                  <option value="">Kein Team</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="admin-form-group">
                <label>Position</label>
                <select
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                >
                  <option value="">-</option>
                  {positions.map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>
              
              <div className="admin-form-group">
                <label>Rückennummer</label>
                <input
                  type="number"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: parseInt(e.target.value) })}
                  min="1"
                  max="99"
                />
              </div>
              
              <div className="admin-form-group">
                <label>Alter</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                  min="16"
                  max="50"
                />
              </div>
              
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <input
                    type="checkbox"
                    checked={formData.is_captain}
                    onChange={(e) => setFormData({ ...formData, is_captain: e.target.checked })}
                  />
                  Kapitän
                </label>
                
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  />
                  Aktiv
                </label>
              </div>
            </div>
            
            <div className="admin-actions">
              <button type="submit" className="admin-btn admin-btn-success">
                {editingPlayer ? 'Speichern' : 'Hinzufügen'}
              </button>
              <button 
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingPlayer(null)
                }}
                className="admin-btn"
              >
                Abbrechen
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Players Table */}
      <div className="admin-card">
        <div className="admin-actions" style={{ marginBottom: '20px' }}>
          <button 
            onClick={() => {
              setShowForm(true)
              setEditingPlayer(null)
              setFormData({
                name: '',
                position: '',
                number: 0,
                age: 0,
                team_id: selectedTeamId || '',
                is_captain: false,
                is_active: true
              })
            }}
            className="admin-btn admin-btn-success"
          >
            + Neuer Spieler
          </button>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Nr.</th>
              <th>Name</th>
              <th>Position</th>
              <th>Team</th>
              <th>Alter</th>
              <th>Status</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr key={player.id}>
                <td>{player.number || '-'}</td>
                <td>
                  {player.name}
                  {player.is_captain && ' ⚡'}
                </td>
                <td>{player.position || '-'}</td>
                <td>{player.teams?.name || '-'}</td>
                <td>{player.age || '-'}</td>
                <td>{player.is_active ? '✅' : '❌'}</td>
                <td>
                  <div className="admin-actions">
                    <button 
                      onClick={() => handleEdit(player)}
                      className="admin-btn admin-btn-primary"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => handleDelete(player.id)}
                      className="admin-btn admin-btn-danger"
                    >
                      🗑️
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