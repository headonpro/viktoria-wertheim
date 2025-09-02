'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from './AuthContext'
import MobileNav from './components/MobileNav'
import { 
  Newspaper, 
  Calendar, 
  Trophy, 
  Star, 
  Users, 
  UserIcon, 
  Handshake, 
  Baby, 
  Mail, 
  Phone,
  Plus,
  LogOut,
  ArrowRight
} from 'lucide-react'

interface AdminDashboardProps {
  initialStats: {
    newsCount: number
    teamsCount: number
    playersCount: number
    matchesCount: number
    upcomingMatches: number
    sponsorsCount: number
    activeSponsors: number
    contactsCount: number
    newsletterCount: number
    youthTeamsCount: number
    youthPlayersCount: number
    leaguePosition: number
    topScorer: string
    topScorerGoals: number
  }
}

export default function AdminDashboard({ initialStats }: AdminDashboardProps) {
  const { logout } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }



  return (
    <div className="admin-container">
      <div className="admin-header">
        <div className="admin-header-content">
          <div>
            <h1>SV Viktoria Wertheim - Admin Dashboard</h1>
            <p>Verwaltungsbereich für Website-Inhalte</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Mobile Navigation */}
            <MobileNav currentPath="/admin" />
            
            {/* Desktop Logout Button */}
            <button 
              onClick={() => {
                logout()
                window.location.reload()
              }} 
              className="admin-btn admin-btn-danger"
              style={{ display: 'none' }}
              id="desktop-logout"
            >
              Abmelden
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Statistics Cards - Mobile Optimized */}
      <div className="admin-dashboard-grid">
          <div className="admin-card">
            <div className="admin-card-header">
              <Newspaper className="admin-card-icon" />
              <h3>News-Artikel</h3>
            </div>
            <p style={{ fontSize: '2em', margin: '10px 0' }}>{initialStats.newsCount}</p>
            <Link href="/admin/news">
              <button className="admin-btn admin-btn-primary">Verwalten</button>
            </Link>
          </div>
          
          <div className="admin-card">
            <div className="admin-card-header">
              <Calendar className="admin-card-icon" />
              <h3>Spiele</h3>
            </div>
            <p style={{ fontSize: '2em', margin: '10px 0' }}>{initialStats.matchesCount}</p>
            <p style={{ fontSize: '12px', color: '#666' }}>{initialStats.upcomingMatches} kommend</p>
            <Link href="/admin/matches">
              <button className="admin-btn admin-btn-primary">Verwalten</button>
            </Link>
          </div>
          
          <div className="admin-card">
            <div className="admin-card-header">
              <Trophy className="admin-card-icon" />
              <h3>Tabellenplatz</h3>
            </div>
            <p style={{ fontSize: '2em', margin: '10px 0' }}>
              {initialStats.leaguePosition > 0 ? `${initialStats.leaguePosition}.` : '-'}
            </p>
            <Link href="/admin/standings">
              <button className="admin-btn admin-btn-primary">Tabelle</button>
            </Link>
          </div>
          
          <div className="admin-card">
            <div className="admin-card-header">
              <Star className="admin-card-icon" />
              <h3>Top-Torschütze</h3>
            </div>
            <p style={{ fontSize: '1.2em', margin: '10px 0' }}>{initialStats.topScorer}</p>
            <p style={{ fontSize: '1.5em', color: '#28a745' }}>{initialStats.topScorerGoals} Tore</p>
            <Link href="/admin/scorers">
              <button className="admin-btn admin-btn-primary">Torschützen</button>
            </Link>
          </div>
          
          <div className="admin-card">
            <div className="admin-card-header">
              <Users className="admin-card-icon" />
              <h3>Teams</h3>
            </div>
            <p style={{ fontSize: '2em', margin: '10px 0' }}>{initialStats.teamsCount}</p>
            <Link href="/admin/teams">
              <button className="admin-btn admin-btn-primary">Verwalten</button>
            </Link>
          </div>
          
          <div className="admin-card">
            <div className="admin-card-header">
              <UserIcon className="admin-card-icon" />
              <h3>Spieler</h3>
            </div>
            <p style={{ fontSize: '2em', margin: '10px 0' }}>{initialStats.playersCount}</p>
            <Link href="/admin/players">
              <button className="admin-btn admin-btn-primary">Verwalten</button>
            </Link>
          </div>
          
          <div className="admin-card">
            <div className="admin-card-header">
              <Handshake className="admin-card-icon" />
              <h3>Sponsoren</h3>
            </div>
            <p style={{ fontSize: '2em', margin: '10px 0' }}>{initialStats.sponsorsCount}</p>
            <p style={{ fontSize: '12px', color: '#666' }}>{initialStats.activeSponsors} aktiv</p>
            <Link href="/admin/sponsors">
              <button className="admin-btn admin-btn-primary">Verwalten</button>
            </Link>
          </div>
          
          <div className="admin-card">
            <div className="admin-card-header">
              <Baby className="admin-card-icon" />
              <h3>Jugend</h3>
            </div>
            <p style={{ fontSize: '2em', margin: '10px 0' }}>{initialStats.youthTeamsCount}</p>
            <p style={{ fontSize: '12px', color: '#666' }}>{initialStats.youthPlayersCount} Spieler</p>
            <Link href="/admin/youth-teams">
              <button className="admin-btn admin-btn-primary">Verwalten</button>
            </Link>
          </div>
          
          <div className="admin-card">
            <div className="admin-card-header">
              <Mail className="admin-card-icon" />
              <h3>Newsletter</h3>
            </div>
            <p style={{ fontSize: '2em', margin: '10px 0' }}>{initialStats.newsletterCount}</p>
            <p style={{ fontSize: '12px', color: '#666' }}>Abonnenten</p>
            <Link href="/admin/newsletter">
              <button className="admin-btn admin-btn-primary">Verwalten</button>
            </Link>
          </div>
          
          <div className="admin-card">
            <div className="admin-card-header">
              <Phone className="admin-card-icon" />
              <h3>Kontakte</h3>
            </div>
            <p style={{ fontSize: '2em', margin: '10px 0' }}>{initialStats.contactsCount}</p>
            <Link href="/admin/contacts">
              <button className="admin-btn admin-btn-primary">Verwalten</button>
            </Link>
          </div>
        </div>
      
      {/* Quick Actions Section - Mobile Optimized */}
      <div className="admin-card" style={{ marginTop: '20px' }}>
        <h2>Schnellzugriff</h2>
        <div className="admin-actions-mobile">
            <Link href="/admin/news/new">
              <button className="admin-btn admin-btn-success">
                <Plus className="admin-btn-icon" />
                Neuer Artikel
              </button>
            </Link>
            <Link href="/admin/matches">
              <button className="admin-btn admin-btn-primary">Spielplan</button>
            </Link>
            <Link href="/admin/standings">
              <button className="admin-btn admin-btn-primary">Tabellenstände</button>
            </Link>
            <Link href="/admin/scorers">
              <button className="admin-btn admin-btn-primary">Torschützen</button>
            </Link>
            <Link href="/admin/sponsors">
              <button className="admin-btn admin-btn-primary">Sponsoren</button>
            </Link>
            <Link href="/admin/newsletter">
              <button className="admin-btn admin-btn-primary">Newsletter</button>
            </Link>
            <Link href="/admin/youth-teams">
              <button className="admin-btn admin-btn-primary">Jugendteams</button>
            </Link>
            <Link href="/admin/contacts">
              <button className="admin-btn admin-btn-primary">Kontakte</button>
            </Link>
            <button 
              onClick={logout}
              className="admin-btn admin-btn-danger"
            >
              <LogOut className="admin-btn-icon" />
              Abmelden
            </button>
            <Link href="/">
              <button className="admin-btn admin-btn-secondary">
                Zur Website
                <ArrowRight className="admin-btn-icon" />
              </button>
            </Link>
          </div>
        </div>
    </div>
  )
}