'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AuthGuard from '../AuthGuard'
import { getErrorMessage } from '../types/error.types'

interface Standing {
  id: string
  team_name: string
  team_id: string | null
  position: number
  played: number | null
  won: number | null
  drawn: number | null
  lost: number | null
  goals_for: number | null
  goals_against: number | null
  goal_difference: number | null
  points: number | null
  league: string | null
  season: string | null
  trend: string | null
}


export default function StandingsManager({ 
  initialStandings
}: { 
  initialStandings: Standing[]
}) {
  return (
    <AuthGuard>
      <StandingsManagerContent initialStandings={initialStandings} />
    </AuthGuard>
  )
}

function StandingsManagerContent({ initialStandings }: { initialStandings: Standing[] }) {
  const [standings, setStandings] = useState(initialStandings)
  const [selectedLeague, setSelectedLeague] = useState('Kreisliga A')
  const [selectedSeason, setSelectedSeason] = useState('2025/26')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const filteredStandings = standings.filter(s => 
    (!selectedLeague || s.league === selectedLeague) &&
    (!selectedSeason || s.season === selectedSeason)
  ).sort((a, b) => a.position - b.position)

  const handleUpdate = async (standing: Standing) => {
    try {
      // Berechne Tordifferenz und Punkte automatisch
      const goalDiff = (standing.goals_for || 0) - (standing.goals_against || 0)
      const points = (standing.won || 0) * 3 + (standing.drawn || 0)
      
      const { error } = await supabase
        .from('league_standings')
        .update({
          ...standing,
          goal_difference: goalDiff,
          points: points
        })
        .eq('id', standing.id)
      
      if (error) throw error
      
      setMessage('Tabelle aktualisiert!')
      setEditingId(null)
      router.refresh()
    } catch (error) {
      console.error('Fehler:', error)
      setMessage('Fehler: ' + getErrorMessage(error))
    }
  }

  const handleAddTeam = async () => {
    const teamName = prompt('Team-Name eingeben:')
    if (!teamName) return

    try {
      const newStanding = {
        team_name: teamName,
        position: filteredStandings.length + 1,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goals_for: 0,
        goals_against: 0,
        goal_difference: 0,
        points: 0,
        league: selectedLeague,
        season: selectedSeason
      }

      const { error } = await supabase
        .from('league_standings')
        .insert([newStanding])
      
      if (error) throw error
      
      setMessage('Team hinzugefügt!')
      router.refresh()
    } catch (error) {
      console.error('Fehler:', error)
      setMessage('Fehler: ' + getErrorMessage(error))
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Eintrag wirklich löschen?')) return
    
    try {
      const { error } = await supabase
        .from('league_standings')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      setMessage('Eintrag gelöscht')
      setStandings(standings.filter(s => s.id !== id))
    } catch (error) {
      console.error('Fehler:', error)
      setMessage('Fehler: ' + getErrorMessage(error))
    }
  }

  const updatePositions = async () => {
    try {
      // Sortiere nach Punkten und Tordifferenz
      const sorted = [...filteredStandings].sort((a, b) => {
        if (b.points !== a.points) return (b.points || 0) - (a.points || 0)
        return (b.goal_difference || 0) - (a.goal_difference || 0)
      })

      // Update Positionen
      for (let i = 0; i < sorted.length; i++) {
        sorted[i].position = i + 1
        await supabase
          .from('league_standings')
          .update({ position: i + 1 })
          .eq('id', sorted[i].id)
      }
      
      setMessage('Positionen aktualisiert!')
      router.refresh()
    } catch (error) {
      console.error('Fehler:', error)
      setMessage('Fehler: ' + getErrorMessage(error))
    }
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Tabellenstände verwalten</h1>
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
            <select 
              value={selectedLeague} 
              onChange={(e) => setSelectedLeague(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px' }}
            >
              <option value="Kreisliga A">Kreisliga A</option>
              <option value="Kreisliga B">Kreisliga B</option>
              <option value="Bezirksliga">Bezirksliga</option>
              <option value="Landesliga">Landesliga</option>
            </select>
            
            <select 
              value={selectedSeason} 
              onChange={(e) => setSelectedSeason(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px' }}
            >
              <option value="2025/26">2025/26</option>
              <option value="2024/25">2024/25</option>
              <option value="2023/24">2023/24</option>
            </select>

            <button onClick={handleAddTeam} className="admin-btn admin-btn-success">
              + Team hinzufügen
            </button>

            <button onClick={updatePositions} className="admin-btn admin-btn-primary">
              Positionen neu berechnen
            </button>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Pos</th>
                <th>Team</th>
                <th>Sp</th>
                <th>S</th>
                <th>U</th>
                <th>N</th>
                <th>Tore</th>
                <th>TD</th>
                <th>Pkt</th>
                <th>Trend</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {filteredStandings.map((standing) => (
                <tr key={standing.id}>
                  {editingId === standing.id ? (
                    <>
                      <td>{standing.position}</td>
                      <td>{standing.team_name}</td>
                      <td>
                        <input
                          type="number"
                          value={standing.played || 0}
                          onChange={(e) => setStandings(standings.map(s => 
                            s.id === standing.id ? { ...s, played: parseInt(e.target.value) } : s
                          ))}
                          style={{ width: '50px' }}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={standing.won || 0}
                          onChange={(e) => setStandings(standings.map(s => 
                            s.id === standing.id ? { ...s, won: parseInt(e.target.value) } : s
                          ))}
                          style={{ width: '50px' }}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={standing.drawn || 0}
                          onChange={(e) => setStandings(standings.map(s => 
                            s.id === standing.id ? { ...s, drawn: parseInt(e.target.value) } : s
                          ))}
                          style={{ width: '50px' }}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={standing.lost || 0}
                          onChange={(e) => setStandings(standings.map(s => 
                            s.id === standing.id ? { ...s, lost: parseInt(e.target.value) } : s
                          ))}
                          style={{ width: '50px' }}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={standing.goals_for || 0}
                          onChange={(e) => setStandings(standings.map(s => 
                            s.id === standing.id ? { ...s, goals_for: parseInt(e.target.value) } : s
                          ))}
                          style={{ width: '40px' }}
                        />
                        :
                        <input
                          type="number"
                          value={standing.goals_against || 0}
                          onChange={(e) => setStandings(standings.map(s => 
                            s.id === standing.id ? { ...s, goals_against: parseInt(e.target.value) } : s
                          ))}
                          style={{ width: '40px' }}
                        />
                      </td>
                      <td>{(standing.goals_for || 0) - (standing.goals_against || 0)}</td>
                      <td><strong>{(standing.won || 0) * 3 + (standing.drawn || 0)}</strong></td>
                      <td>
                        <select
                          value={standing.trend || ''}
                          onChange={(e) => setStandings(standings.map(s => 
                            s.id === standing.id ? { ...s, trend: e.target.value } : s
                          ))}
                          style={{ width: '60px' }}
                        >
                          <option value="">-</option>
                          <option value="up">↑</option>
                          <option value="down">↓</option>
                          <option value="same">→</option>
                        </select>
                      </td>
                      <td>
                        <div className="admin-actions">
                          <button 
                            onClick={() => handleUpdate(standing)}
                            className="admin-btn admin-btn-success admin-btn-small"
                          >
                            Speichern
                          </button>
                          <button 
                            onClick={() => setEditingId(null)}
                            className="admin-btn admin-btn-small"
                          >
                            Abbrechen
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td><strong>{standing.position}</strong></td>
                      <td>
                        <strong style={{ color: standing.position <= 2 ? '#28a745' : standing.position >= filteredStandings.length - 1 ? '#dc3545' : 'inherit' }}>
                          {standing.team_name}
                        </strong>
                      </td>
                      <td>{standing.played || 0}</td>
                      <td>{standing.won || 0}</td>
                      <td>{standing.drawn || 0}</td>
                      <td>{standing.lost || 0}</td>
                      <td>{standing.goals_for || 0}:{standing.goals_against || 0}</td>
                      <td>{standing.goal_difference || 0}</td>
                      <td><strong>{standing.points || 0}</strong></td>
                      <td>
                        {standing.trend === 'up' && '↑'}
                        {standing.trend === 'down' && '↓'}
                        {standing.trend === 'same' && '→'}
                      </td>
                      <td>
                        <div className="admin-actions">
                          <button 
                            onClick={() => setEditingId(standing.id)}
                            className="admin-btn admin-btn-primary admin-btn-small"
                          >
                            Bearbeiten
                          </button>
                          <button 
                            onClick={() => handleDelete(standing.id)}
                            className="admin-btn admin-btn-danger admin-btn-small"
                          >
                            Löschen
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="admin-mobile-cards">
          {filteredStandings.map((standing) => (
            <div key={standing.id} className="admin-mobile-card">
              <div className="admin-mobile-card-header">
                <span style={{ color: standing.position <= 2 ? '#28a745' : standing.position >= filteredStandings.length - 1 ? '#dc3545' : '#FFD700' }}>
                  {standing.position}.
                </span>
                <strong> {standing.team_name}</strong>
                <span style={{ marginLeft: 'auto', fontWeight: 'bold', color: '#FFD700' }}>
                  {standing.points || 0} Pkt
                </span>
              </div>
              
              <div className="admin-mobile-card-row">
                <div className="admin-mobile-card-label">Spiele:</div>
                <div className="admin-mobile-card-value">{standing.played || 0}</div>
              </div>
              
              <div className="admin-mobile-card-row">
                <div className="admin-mobile-card-label">Bilanz:</div>
                <div className="admin-mobile-card-value">
                  {standing.won || 0}S-{standing.drawn || 0}U-{standing.lost || 0}N
                </div>
              </div>
              
              <div className="admin-mobile-card-row">
                <div className="admin-mobile-card-label">Tore:</div>
                <div className="admin-mobile-card-value">
                  {standing.goals_for || 0}:{standing.goals_against || 0} ({(standing.goal_difference ?? 0) >= 0 ? '+' : ''}{standing.goal_difference ?? 0})
                </div>
              </div>
              
              <div className="admin-mobile-card-row">
                <div className="admin-mobile-card-label">Aktionen:</div>
                <div className="admin-mobile-card-value">
                  <div className="admin-actions">
                    <button 
                      onClick={() => setEditingId(standing.id)}
                      className="admin-btn admin-btn-primary admin-btn-small"
                    >
                      Bearbeiten
                    </button>
                    <button 
                      onClick={() => handleDelete(standing.id)}
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
        {filteredStandings.length === 0 && (
          <div className="admin-loading">
            <p>Keine Tabellenstände gefunden</p>
          </div>
        )}
      </div>
    </div>
  )
}