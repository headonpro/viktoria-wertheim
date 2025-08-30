'use client'

import React, { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { LoadingSpinner } from './LoadingSkeleton'

export default function PageLoadingIndicator() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    // Start loading when route changes
    setLoading(true)
    
    // Stop loading after a short delay
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [pathname, searchParams])
  
  if (!loading) return null
  
  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-gray-200 dark:bg-viktoria-dark">
      <div className="h-full bg-viktoria-blue dark:bg-viktoria-yellow animate-pulse" 
           style={{ width: '60%', animation: 'progress 1s ease-in-out infinite' }}>
      </div>
      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 60%; }
          100% { width: 85%; }
        }
      `}</style>
    </div>
  )
}

// Alternative full-page loading overlay
export function PageLoadingOverlay({ isLoading }: { isLoading: boolean }) {
  if (!isLoading) return null
  
  return (
    <div className="fixed inset-0 bg-white/80 dark:bg-viktoria-dark/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600 dark:text-gray-400">Lade Daten...</p>
      </div>
    </div>
  )
}