'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AuthGuard from '../AuthGuard'
import { getErrorMessage } from '../types/error.types'

interface YouthTeam {
  id: string
  name: string
  age_group: string | null
  coach: string | null
  league: string | null
  player_count: number | null
}

export default function YouthTeamsManager({ initialTeams }: { initialTeams: YouthTeam[] }) {
  return (
    <AuthGuard>
      <YouthTeamsManagerContent initialTeams={initialTeams} />
    </AuthGuard>
  )
}

function YouthTeamsManagerContent({ initialTeams }: { initialTeams: YouthTeam[] }) {
  const [teams, setTeams] = useState(initialTeams)
  const [showForm, setShowForm] = useState(false)
  const [editingTeam, setEditingTeam] = useState<YouthTeam | null>(null)
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    name: '',
    age_group: 'U19',
    coach: '',
    league: '',
    player_count: 0
  })

  const ageGroups = ['U7', 'U9', 'U11', 'U13', 'U15', 'U17', 'U19', 'Frauen']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingTeam) {
        const { error } = await supabase
          .from('youth_teams')
          .update(formData)
          .eq('id', editingTeam.id)
        
        if (error) throw error
        setMessage('Jugendteam aktualisiert!')
      } else {
        const { error } = await supabase
          .from('youth_teams')
          .insert([formData])
        
        if (error) throw error
        setMessage('Jugendteam hinzugefügt!')
      }
      
      router.refresh()
      setShowForm(false)
      setEditingTeam(null)
      resetForm()
    } catch (error) {
      console.error('Fehler beim Speichern:', error)
      setMessage('Fehler: ' + getErrorMessage(error))
    }
  }

  const handleEdit = (team: YouthTeam) => {
    setEditingTeam(team)
    setFormData({
      name: team.name,
      age_group: team.age_group || 'U19',
      coach: team.coach || '',
      league: team.league || '',
      player_count: team.player_count || 0
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Jugendteam wirklich löschen?')) return
    
    try {
      const { error } = await supabase
        .from('youth_teams')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      setMessage('Jugendteam gelöscht')
      setTeams(teams.filter(t => t.id !== id))
    } catch (error) {
      console.error('Fehler beim Speichern:', error)
      setMessage('Fehler: ' + getErrorMessage(error))
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      age_group: 'U19',
      coach: '',
      league: '',
      player_count: 0
    })
  }

  const sortedTeams = [...teams].sort((a, b) => {
    const aIndex = ageGroups.indexOf(a.age_group || '')
    const bIndex = ageGroups.indexOf(b.age_group || '')
    return aIndex - bIndex
  })

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Jugendmannschaften verwalten</h1>
        <Link href="/admin">← Zurück zum Dashboard</Link>
      </div>

      {message && (
        <div className={`admin-alert ${message.includes('Fehler') ? 'admin-alert-error' : 'admin-alert-success'}`}>
          {message}
        </div>
      )}

      <div className="admin-card">
        <div className="admin-actions" style={{ marginBottom: '20px', justifyContent: 'space-between' }}>
          <button 
            onClick={() => { setShowForm(true); setEditingTeam(null); resetForm() }}
            className="admin-btn admin-btn-success"
          >
            + Neue Jugendmannschaft
          </button>
          
          <div style={{ fontSize: '14px', color: '#666' }}>
            {teams.length} Mannschaften | {teams.reduce((sum, t) => sum + (t.player_count || 0), 0)} Spieler gesamt
          </div>
        </div>

        {showForm && (
          <div className="admin-card admin-form-card">
            <h3>{editingTeam ? 'Jugendteam bearbeiten' : 'Neue Jugendmannschaft'}</h3>
            <form onSubmit={handleSubmit} className="admin-form">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="admin-form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="z.B. SV Viktoria Wertheim U15"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Altersklasse</label>
                  <select 
                    value={formData.age_group}
                    onChange={(e) => setFormData({ ...formData, age_group: e.target.value })}
                  >
                    {ageGroups.map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-group">
                  <label>Trainer</label>
                  <input
                    type="text"
                    value={formData.coach}
                    onChange={(e) => setFormData({ ...formData, coach: e.target.value })}
                    placeholder="z.B. Max Mustermann"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Liga</label>
                  <input
                    type="text"
                    value={formData.league}
                    onChange={(e) => setFormData({ ...formData, league: e.target.value })}
                    placeholder="z.B. Kreisliga U15"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Spieleranzahl</label>
                  <input
                    type="number"
                    value={formData.player_count}
                    onChange={(e) => setFormData({ ...formData, player_count: parseInt(e.target.value) || 0 })}
                    min="0"
                  />
                </div>
              </div>

              <div className="admin-actions" style={{ marginTop: '20px' }}>
                <button type="submit" className="admin-btn admin-btn-primary">
                  {editingTeam ? 'Aktualisieren' : 'Hinzufügen'}
                </button>
                <button 
                  type="button" 
                  onClick={() => { setShowForm(false); setEditingTeam(null); resetForm() }}
                  className="admin-btn"
                >
                  Abbrechen
                </button>
              </div>
            </form>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {sortedTeams.map((team) => (
            <div key={team.id} className="admin-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                <h3 style={{ margin: 0 }}>{team.name}</h3>
                <span className="admin-btn" style={{ 
                  padding: '4px 8px', 
                  fontSize: '12px',
                  background: team.age_group === 'Frauen' ? '#ff1493' : 'var(--viktoria-blue, #003366)',
                  color: '#fff'
                }}>
                  {team.age_group}
                </span>
              </div>
              
              <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
                {team.coach && (
                  <p><strong>Trainer:</strong> {team.coach}</p>
                )}
                {team.league && (
                  <p><strong>Liga:</strong> {team.league}</p>
                )}
                <p><strong>Spieler:</strong> {team.player_count || 0}</p>
              </div>
              
              <div className="admin-actions" style={{ marginTop: '15px' }}>
                <button 
                  onClick={() => handleEdit(team)}
                  className="admin-btn admin-btn-primary"
                  style={{ padding: '4px 8px', fontSize: '12px' }}
                >
                  Bearbeiten
                </button>
                <button 
                  onClick={() => handleDelete(team.id)}
                  className="admin-btn admin-btn-danger"
                  style={{ padding: '4px 8px', fontSize: '12px' }}
                >
                  Löschen
                </button>
              </div>
            </div>
          ))}
        </div>

        {teams.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            Noch keine Jugendmannschaften vorhanden
          </div>
        )}
      </div>
    </div>
  )
}