'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AuthGuard from '../AuthGuard'
import { getErrorMessage } from '../types/error.types'
import MobileNav from '../components/MobileNav'

interface Player {
  id: string
  name: string
  position: string | null
  number: number | null
  is_captain: boolean | null
}

interface Team {
  id: string
  name: string
  league: string | null
  coach: string | null
  training_schedule: string | null
  home_venue?: string | null
  founded_year?: number | null
  players: Player[]
}

export default function TeamsManager({ initialTeams }: { initialTeams: Team[] }) {
  return (
    <AuthGuard>
      <TeamsManagerContent initialTeams={initialTeams} />
    </AuthGuard>
  )
}

function TeamsManagerContent({ initialTeams }: { initialTeams: Team[] }) {
  const [teams, setTeams] = useState(initialTeams)
  const [editingTeam, setEditingTeam] = useState<Team | null>(null)
  const [showNewForm, setShowNewForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    league: '',
    coach: '',
    training_schedule: '',
    home_venue: '',
    founded_year: 1945
  })
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSaveTeam = async () => {
    try {
      if (editingTeam) {
        const { error } = await supabase
          .from('teams')
          .update(formData)
          .eq('id', editingTeam.id)
        
        if (error) throw error
        setMessage('Team erfolgreich aktualisiert!')
      } else {
        const { error } = await supabase
          .from('teams')
          .insert([formData])
        
        if (error) throw error
        setMessage('Team erfolgreich erstellt!')
      }
      
      setEditingTeam(null)
      setShowNewForm(false)
      router.refresh()
    } catch (error) {
      console.error('Fehler:', error)
      setMessage('Fehler: ' + getErrorMessage(error))
    }
  }

  const handleDeleteTeam = async (id: string) => {
    if (!confirm('Team wirklich löschen? Alle Spieler werden ebenfalls gelöscht!')) return
    
    try {
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      setMessage('Team gelöscht')
      setTeams(teams.filter(t => t.id !== id))
    } catch (error) {
      console.error('Fehler beim Löschen:', error)
      setMessage('Fehler beim Löschen: ' + getErrorMessage(error))
    }
  }

  const handleEditTeam = (team: Team) => {
    setEditingTeam(team)
    setFormData({
      name: team.name,
      league: team.league || '',
      coach: team.coach || '',
      training_schedule: team.training_schedule || '',
      home_venue: team.home_venue || '',
      founded_year: team.founded_year || 1945
    })
    setShowNewForm(true)
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div className="admin-header-content">
          <div>
            <h1>Teams-Verwaltung</h1>
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

      {/* Team Form */}
      {showNewForm && (
        <div className="admin-card" style={{ marginBottom: '20px' }}>
          <h2>{editingTeam ? 'Team bearbeiten' : 'Neues Team'}</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleSaveTeam(); }} className="admin-form">
            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label>Team-Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="z.B. Erste Mannschaft"
                />
              </div>
              
              <div className="admin-form-group">
                <label>Liga</label>
                <input
                  type="text"
                  value={formData.league}
                  onChange={(e) => setFormData({ ...formData, league: e.target.value })}
                  placeholder="z.B. Kreisliga A"
                />
              </div>
              
              <div className="admin-form-group">
                <label>Trainer</label>
                <input
                  type="text"
                  value={formData.coach}
                  onChange={(e) => setFormData({ ...formData, coach: e.target.value })}
                  placeholder="Name des Trainers"
                />
              </div>
              
              <div className="admin-form-group">
                <label>Heimstätte</label>
                <input
                  type="text"
                  value={formData.home_venue}
                  onChange={(e) => setFormData({ ...formData, home_venue: e.target.value })}
                  placeholder="z.B. Sportplatz Wertheim"
                />
              </div>
              
              <div className="admin-form-group">
                <label>Trainingszeiten</label>
                <input
                  type="text"
                  value={formData.training_schedule}
                  onChange={(e) => setFormData({ ...formData, training_schedule: e.target.value })}
                  placeholder="z.B. Di & Do 19:00"
                />
              </div>
              
              <div className="admin-form-group">
                <label>Gründungsjahr</label>
                <input
                  type="number"
                  value={formData.founded_year}
                  onChange={(e) => setFormData({ ...formData, founded_year: parseInt(e.target.value) })}
                  min="1900"
                  max="2025"
                />
              </div>
            </div>
            
            <div className="admin-actions-mobile">
              <button type="submit" className="admin-btn admin-btn-success">
                {editingTeam ? 'Änderungen speichern' : 'Team erstellen'}
              </button>
              <button 
                type="button"
                onClick={() => {
                  setShowNewForm(false)
                  setEditingTeam(null)
                }}
                className="admin-btn"
              >
                Abbrechen
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Teams List */}
      <div className="admin-card">
        <div className="admin-actions-mobile" style={{ marginBottom: '20px' }}>
          <button 
            onClick={() => {
              setShowNewForm(true)
              setEditingTeam(null)
              setFormData({
                name: '',
                league: '',
                coach: '',
                training_schedule: '',
                home_venue: '',
                founded_year: 1945
              })
            }}
            className="admin-btn admin-btn-success"
          >
            + Neues Team
          </button>
        </div>

        <div className="admin-team-grid">
          {teams.map((team) => (
            <div key={team.id} className="admin-team-card">
              <h3>{team.name}</h3>
              <p><strong>Liga:</strong> {team.league || '-'}</p>
              <p><strong>Trainer:</strong> {team.coach || '-'}</p>
              <p><strong>Training:</strong> {team.training_schedule || '-'}</p>
              <p><strong>Spieler:</strong> {team.players?.length || 0}</p>
              
              <div className="admin-actions-mobile" style={{ marginTop: '16px' }}>
                <Link href={`/admin/players?team=${team.id}`}>
                  <button className="admin-btn admin-btn-primary">
                    👥 Spieler
                  </button>
                </Link>
                <button 
                  onClick={() => handleEditTeam(team)}
                  className="admin-btn admin-btn-primary"
                >
                  ✏️ Bearbeiten
                </button>
                <button 
                  onClick={() => handleDeleteTeam(team.id)}
                  className="admin-btn admin-btn-danger"
                >
                  🗑️ Löschen
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}