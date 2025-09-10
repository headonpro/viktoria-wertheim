'use client'

import dynamic from 'next/dynamic'
import React from 'react'
import type { ComponentType } from 'react'

/**
 * Dynamic import wrapper for heavy components
 * Reduces initial bundle size by lazy loading components
 */

// Loading placeholder component
const LoadingPlaceholder = () => (
  <div className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
  </div>
)

// Export dynamic versions of heavy components
export const DynamicLeagueTableModal = dynamic(
  () => import('@/components/LeagueTableModal'),
  { 
    loading: LoadingPlaceholder,
    ssr: true // Keep SSR for SEO
  }
)

export const DynamicNewsModal = dynamic(
  () => import('@/components/NewsModal'),
  { 
    loading: LoadingPlaceholder,
    ssr: true
  }
)

export const DynamicSponsorModal = dynamic(
  () => import('@/components/SponsorModal'),
  { 
    loading: LoadingPlaceholder,
    ssr: true
  }
)

// Framer Motion components - no SSR needed for animations
export const DynamicAnimatedSection = dynamic(
  () => import('@/components/AnimatedSection'),
  { 
    ssr: false,
    loading: () => null // No placeholder for animation wrapper
  }
)

// Mobile sidebar - only loaded on mobile
export const DynamicMobileSidebar = dynamic(
  () => import('@/components/MobileSidebar'),
  { 
    ssr: false,
    loading: LoadingPlaceholder
  }
)

// Map component - already optimized but export for consistency
export const DynamicMapComponent = dynamic(
  () => import('@/components/MapComponent'),
  { 
    ssr: false,
    loading: () => (
      <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-viktoria-dark dark:to-viktoria-dark-lighter h-96 rounded-xl flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400 font-medium">
          Karte wird geladen...
        </p>
      </div>
    )
  }
)

/**
 * Helper to create dynamic imports with custom loading states
 */
export function createDynamicComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options?: {
    ssr?: boolean
    loading?: () => React.ReactElement | null
  }
) {
  return dynamic(importFn, {
    ssr: options?.ssr ?? true,
    loading: options?.loading ?? LoadingPlaceholder
  })
}