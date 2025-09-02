'use client'

import { useState, useEffect } from 'react'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if already authenticated in session
    const auth = sessionStorage.getItem('admin-auth')
    const adminSecret = process.env.NEXT_PUBLIC_ADMIN_SECRET || 'temp-secret-2025'
    if (auth === adminSecret) {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Replace with Supabase Auth in production
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'temp-password-2025'
    const adminSecret = process.env.NEXT_PUBLIC_ADMIN_SECRET || 'temp-secret-2025'
    if (password === adminPassword) {
      setIsAuthenticated(true)
      sessionStorage.setItem('admin-auth', adminSecret)
      setError('')
    } else {
      setError('Falsches Passwort')
    }
  }

  if (isLoading) {
    return (
      <div className="admin-container">
        <div className="admin-card" style={{ textAlign: 'center', padding: '40px' }}>
          Lädt...
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-container">
        <div className="admin-card" style={{ maxWidth: '400px', margin: '100px auto' }}>
          <h1 style={{ marginBottom: '20px', textAlign: 'center' }}>🔐 Admin Login</h1>
          <form onSubmit={handleLogin} className="admin-form">
            <div className="admin-form-group">
              <label>Passwort</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin-Passwort eingeben"
                autoFocus
              />
            </div>
            {error && <div className="admin-alert admin-alert-error">{error}</div>}
            <button type="submit" className="admin-btn admin-btn-primary" style={{ width: '100%' }}>
              Anmelden
            </button>
          </form>
          <small style={{ display: 'block', marginTop: '20px', color: '#a0a0a0', textAlign: 'center' }}>
            {/* Password is set via environment variable */}
          </small>
        </div>
      </div>
    )
  }

  return <>{children}</>
}