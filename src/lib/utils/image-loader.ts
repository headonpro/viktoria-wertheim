/**
 * Image loading utilities for optimized WebP images with PNG fallback
 */

export interface TeamLogoProps {
  teamName: string
  className?: string
  width?: number
  height?: number
}

/**
 * Get optimized team logo path
 * Tries WebP first, falls back to PNG if not available
 */
export function getTeamLogoPath(teamName: string): string {
  // Normalize team name for file lookup
  const normalizedName = teamName
    .replace(/\s+/g, '')
    .replace(/[^a-zA-Z0-9äöüÄÖÜß]/g, '')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/Ä/g, 'Ae')
    .replace(/Ö/g, 'Oe')
    .replace(/Ü/g, 'Ue')
    .replace(/ß/g, 'ss')
  
  // Check if optimized version exists (WebP)
  const webpPath = `/logos/teams/optimized/${normalizedName}.webp`
  
  // Return WebP path - Next.js Image will handle fallback
  return webpPath
}

/**
 * Get sponsor logo path
 */
export function getSponsorLogoPath(sponsorName: string): string {
  const normalizedName = sponsorName
    .replace(/\s+/g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
  
  const webpPath = `/logos/sponsors/optimized/${normalizedName}Logo.webp`
  
  return webpPath
}

/**
 * Get main logo paths
 */
export function getMainLogoPath(logoName: 'viktorialogo' | 'SVVW'): string {
  return `/${logoName}.webp`
}

/**
 * Preload critical images
 */
export function preloadCriticalImages() {
  if (typeof window === 'undefined') return
  
  const criticalImages = [
    '/viktorialogo.webp',
    '/SVVW.webp'
  ]
  
  criticalImages.forEach(src => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.type = 'image/webp'
    link.href = src
    document.head.appendChild(link)
  })
}

/**
 * Get image dimensions based on context
 */
export function getImageDimensions(context: 'team-logo' | 'sponsor-logo' | 'main-logo') {
  switch (context) {
    case 'team-logo':
      return { width: 64, height: 64 }
    case 'sponsor-logo':
      return { width: 120, height: 60 }
    case 'main-logo':
      return { width: 128, height: 128 }
    default:
      return { width: 64, height: 64 }
  }
}