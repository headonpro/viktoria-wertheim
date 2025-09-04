'use client'

import { useEffect } from 'react'

export default function ClearAuth() {
  useEffect(() => {
    // Clear all localStorage items related to Supabase
    if (typeof window !== 'undefined') {
      const keysToRemove: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && (key.includes('supabase') || key.includes('auth'))) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key))
      
      // Clear all cookies
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")
      })
      
      // Clear sessionStorage
      sessionStorage.clear()
      
      // Redirect after clearing
      setTimeout(() => {
        window.location.href = '/'
      }, 1000)
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">✓ Clearing authentication...</h1>
        <p>Redirecting to homepage...</p>
      </div>
    </div>
  )
}
