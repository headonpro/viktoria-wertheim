'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '../AuthContext'

interface MobileNavProps {
  currentPath?: string
}

export default function MobileNav({ currentPath }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { logout } = useAuth()

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: '🏠' },
    { name: 'News-Artikel', path: '/admin/news', icon: '📰' },
    { name: 'Spiele', path: '/admin/matches', icon: '⚽' },
    { name: 'Tabellenstände', path: '/admin/standings', icon: '🏆' },
    { name: 'Torschützen', path: '/admin/scorers', icon: '⭐' },
    { name: 'Teams', path: '/admin/teams', icon: '👥' },
    { name: 'Spieler', path: '/admin/players', icon: '🏃' },
    { name: 'Sponsoren', path: '/admin/sponsors', icon: '🤝' },
    { name: 'Jugendteams', path: '/admin/youth-teams', icon: '👦' },
    { name: 'Newsletter', path: '/admin/newsletter', icon: '📧' },
    { name: 'Kontakte', path: '/admin/contacts', icon: '📞' }
  ]

  const handleClose = () => setIsOpen(false)

  return (
    <>
      {/* Hamburger Button - only visible on mobile */}
      <button
        className="admin-hamburger"
        onClick={() => setIsOpen(true)}
        aria-label="Menu öffnen"
      >
        ☰
      </button>

      {/* Mobile Navigation Overlay */}
      {isOpen && (
        <div className="admin-mobile-nav open">
          {/* Close Button */}
          <button
            className="admin-mobile-nav-close"
            onClick={handleClose}
            aria-label="Menu schließen"
          >
            ×
          </button>

          {/* Navigation Content */}
          <div className="admin-mobile-nav-content">
            <div style={{ 
              textAlign: 'center', 
              marginBottom: '20px', 
              paddingBottom: '15px', 
              borderBottom: '1px solid #404040' 
            }}>
              <h2 style={{ 
                color: '#FFD700', 
                margin: '0 0 5px 0', 
                fontSize: '1.2rem' 
              }}>
                Admin Menu
              </h2>
              <p style={{ 
                color: '#a0a0a0', 
                margin: 0, 
                fontSize: '0.9rem' 
              }}>
                SV Viktoria Wertheim
              </p>
            </div>

            {/* Menu Items */}
            {menuItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`admin-mobile-nav-item ${
                  currentPath === item.path ? 'active' : ''
                }`}
                onClick={handleClose}
              >
                <span style={{ marginRight: '10px' }}>{item.icon}</span>
                {item.name}
              </Link>
            ))}

            {/* Divider */}
            <div style={{ 
              height: '1px', 
              background: '#404040', 
              margin: '15px 0' 
            }} />

            {/* Website Link */}
            <Link
              href="/"
              className="admin-mobile-nav-item"
              onClick={handleClose}
            >
              <span style={{ marginRight: '10px' }}>🌐</span>
              Zur Website
            </Link>

            {/* Logout */}
            <button
              onClick={() => {
                logout()
                handleClose()
                window.location.reload()
              }}
              className="admin-mobile-nav-item"
              style={{ 
                width: '100%', 
                textAlign: 'left',
                background: 'transparent',
                border: 'none',
                color: '#f87171',
                cursor: 'pointer'
              }}
            >
              <span style={{ marginRight: '10px' }}>🚪</span>
              Abmelden
            </button>
          </div>
        </div>
      )}
    </>
  )
}