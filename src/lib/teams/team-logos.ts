/**
 * Team logo configuration with optimized WebP versions
 */

export interface LogoConfig {
  original: string
  webp?: {
    small: string  // 48w
    medium: string // 96w
    large: string  // 192w
  }
}

export const TEAM_LOGOS: Record<string, LogoConfig> = {
  '/logos/teams/Gerlachsheim.png': {
    original: '/logos/teams/Gerlachsheim.png',
    webp: {
      small: '/optimized/logos/teams/Gerlachsheim-48w.webp',
      medium: '/optimized/logos/teams/Gerlachsheim-96w.webp',
      large: '/optimized/logos/teams/Gerlachsheim-192w.webp'
    }
  },
  '/logos/teams/Kreuzwertheim.png': {
    original: '/logos/teams/Kreuzwertheim.png',
    webp: {
      small: '/optimized/logos/teams/Kreuzwertheim-48w.webp',
      medium: '/optimized/logos/teams/Kreuzwertheim-96w.webp',
      large: '/optimized/logos/teams/Kreuzwertheim-192w.webp'
    }
  },
  '/logos/teams/Großrinderfeld.png': {
    original: '/logos/teams/Großrinderfeld.png',
    webp: {
      small: '/optimized/logos/teams/Großrinderfeld-48w.webp',
      medium: '/optimized/logos/teams/Großrinderfeld-96w.webp',
      large: '/optimized/logos/teams/Großrinderfeld-192w.webp'
    }
  },
  '/logos/teams/Pülfringen.png': {
    original: '/logos/teams/Pülfringen.png',
    webp: {
      small: '/optimized/logos/teams/Pülfringen-48w.webp',
      medium: '/optimized/logos/teams/Pülfringen-96w.webp',
      large: '/optimized/logos/teams/Pülfringen-192w.webp'
    }
  },
  '/logos/teams/Umpfertal.png': {
    original: '/logos/teams/Umpfertal.png',
    webp: {
      small: '/optimized/logos/teams/Umpfertal-48w.webp',
      medium: '/optimized/logos/teams/Umpfertal-96w.webp',
      large: '/optimized/logos/teams/Umpfertal-192w.webp'
    }
  },
  '/logos/teams/Reichholzheim.png': {
    original: '/logos/teams/Reichholzheim.png',
    webp: {
      small: '/optimized/logos/teams/Reichholzheim-48w.webp',
      medium: '/optimized/logos/teams/Reichholzheim-96w.webp',
      large: '/optimized/logos/teams/Reichholzheim-192w.webp'
    }
  },
  '/logos/teams/fceichel.png': {
    original: '/logos/teams/fceichel.png',
    webp: {
      small: '/optimized/logos/teams/fceichel-48w.webp',
      medium: '/optimized/logos/teams/fceichel-96w.webp',
      large: '/optimized/logos/teams/fceichel-192w.webp'
    }
  },
  '/logos/teams/Türkgücü.png': {
    original: '/logos/teams/Türkgücü.png',
    webp: {
      small: '/optimized/logos/teams/Türkgücü-48w.webp',
      medium: '/optimized/logos/teams/Türkgücü-96w.webp',
      large: '/optimized/logos/teams/Türkgücü-192w.webp'
    }
  },
  '/logos/teams/Tauberbischofsheim.png': {
    original: '/logos/teams/Tauberbischofsheim.png',
    webp: {
      small: '/optimized/logos/teams/Tauberbischofsheim-48w.webp',
      medium: '/optimized/logos/teams/Tauberbischofsheim-96w.webp',
      large: '/optimized/logos/teams/Tauberbischofsheim-192w.webp'
    }
  },
  '/logos/teams/Hundheim.png': {
    original: '/logos/teams/Hundheim.png',
    webp: {
      small: '/optimized/logos/teams/Hundheim-48w.webp',
      medium: '/optimized/logos/teams/Hundheim-96w.webp',
      large: '/optimized/logos/teams/Hundheim-192w.webp'
    }
  },
  // Main Viktoria logos
  '/viktorialogo.png': {
    original: '/viktorialogo.png',
    webp: {
      small: '/optimized/viktorialogo-48w.webp',
      medium: '/optimized/viktorialogo-96w.webp',
      large: '/optimized/viktorialogo-256w.webp'
    }
  }
}