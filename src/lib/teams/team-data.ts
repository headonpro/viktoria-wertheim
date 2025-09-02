/**
 * Centralized team data configuration
 * Single source of truth for all team abbreviations and logos
 */

export interface TeamData {
  fullName: string
  abbreviation: string
  logoPath?: string
  alternativeNames?: string[]
}

// Team data with consistent abbreviations and logo paths
export const TEAM_DATA: Record<string, TeamData> = {
  // Viktoria Wertheim Teams
  'sv-viktoria-wertheim': {
    fullName: 'SV Viktoria Wertheim',
    abbreviation: 'SV VW',
    logoPath: '/viktorialogo.png',
    alternativeNames: ['Vikt. Wertheim', 'Viktoria Wertheim']
  },
  'sv-viktoria-wertheim-ii': {
    fullName: 'SV Viktoria Wertheim II',
    abbreviation: 'SV VW II',
    logoPath: '/viktorialogo.png',
    alternativeNames: ['Viktoria Wertheim II', 'SV Viktoria Wertheim 2']
  },
  'spg-viktoria-wertheim-3': {
    fullName: 'SpG Vikt. Wertheim 3/Grünenwört',
    abbreviation: 'SpG VW3/GW',
    logoPath: '/viktorialogo.png',
    alternativeNames: ['SpG Viktoria Wertheim 3/Grünenwört']
  },

  // Kreisliga Teams
  'vfr-gerlachsheim': {
    fullName: 'VfR Gerlachsheim',
    abbreviation: 'VfR GER',
    logoPath: '/logos/teams/Gerlachsheim.png'
  },
  'tsv-kreuzwertheim': {
    fullName: 'TSV Kreuzwertheim',
    abbreviation: 'TSV KWH',
    logoPath: '/logos/teams/Kreuzwertheim.png'
  },
  'tus-grossrinderfeld': {
    fullName: 'TuS Großrinderfeld',
    abbreviation: 'TuS GRO',
    logoPath: '/logos/teams/Großrinderfeld.png',
    alternativeNames: ['TSV Großrinderfeld']
  },
  'sv-puelfringen': {
    fullName: 'SV Pülfringen',
    abbreviation: 'SV PÜL',
    logoPath: '/logos/teams/Pülfringen.png'
  },
  'fc-umpfertal': {
    fullName: 'FC Umpfertal',
    abbreviation: 'FC UMP',
    logoPath: '/logos/teams/Umpfertal.png'
  },
  'spg-umpfertal': {
    fullName: 'SpG Umpfertal',
    abbreviation: 'SpG UMP',
    logoPath: '/logos/teams/Umpfertal.png'
  },
  'vfb-reicholzheim': {
    fullName: 'VfB Reicholzheim',
    abbreviation: 'VfB REI',
    alternativeNames: ['VfB Reicholzheim/Dörlesberg']
  },
  'tsv-reicholzheim': {
    fullName: 'TSV Reicholzheim',
    abbreviation: 'TSV REI',
    logoPath: '/logos/teams/Reichholzheim.png' // Note: File might be misspelled
  },

  // Kreisklasse A Teams
  'spg-oberlauda-gerlachsheim-2': {
    fullName: 'SpG FV Oberlauda/VfR Gerlachsheim 2',
    abbreviation: 'SpG OLA/GER II',
    alternativeNames: ['FV Oberlauda/VfR Gerlachsheim 2']
  },
  'fv-oberlauda': {
    fullName: 'FV Oberlauda',
    abbreviation: 'FV OLA'
  },
  'spg-welzbachtal': {
    fullName: 'SpG Welzbachtal',
    abbreviation: 'SpG WEL'
  },
  'spg-distelhausen-lauda-2': {
    fullName: 'SpG Distelhausen/Lauda 2',
    abbreviation: 'SpG DIS/LAU II'
  },
  'sv-distelhausen': {
    fullName: 'SV Distelhausen',
    abbreviation: 'SV DIS'
  },

  // Kreisklasse B Teams
  'fc-wertheim-eichel-2': {
    fullName: 'FC Wertheim-Eichel 2',
    abbreviation: 'FC WER-E II',
    alternativeNames: ['FC Eichel 2']
  },
  'fc-eichel': {
    fullName: 'FC Eichel',
    abbreviation: 'FC EIC',
    logoPath: '/logos/teams/fceichel.png'
  },
  'fv-wertheim-eichel': {
    fullName: 'FV Wertheim-Eichel',
    abbreviation: 'FV WER'
  },
  'sg-rambo-2': {
    fullName: 'SG RaMBo 2',
    abbreviation: 'SG RMB II'
  },
  'tuerkguecue-wertheim-2': {
    fullName: 'Türkgücü Wertheim 2',
    abbreviation: 'TG WER II'
  },
  'tuerkguecue-wertheim': {
    fullName: 'Türkgücü Wertheim',
    abbreviation: 'TG WER',
    logoPath: '/logos/teams/Türkgücü.png'
  },
  'tuerkguecue-gerlachsheim': {
    fullName: 'Türkgücü Gerlachsheim',
    abbreviation: 'TG GER',
    logoPath: '/logos/teams/Gerlachsheim.png'
  },

  // Other Teams
  'fc-gruensfeld': {
    fullName: 'FC Grünsfeld',
    abbreviation: 'FC GRÜ',
    alternativeNames: ['FC Grünsfeld']
  },
  'tsv-tauberbischofsheim': {
    fullName: 'TSV Tauberbischofsheim',
    abbreviation: 'TSV TBB',
    logoPath: '/logos/teams/Tauberbischofsheim.png'
  },
  'fc-hundheim-steinbach': {
    fullName: 'FC Hundheim-Steinbach',
    abbreviation: 'FC HUN',
    logoPath: '/logos/teams/Hundheim.png'
  },
  'tsv-assamstadt': {
    fullName: 'TSV Assamstadt',
    abbreviation: 'TSV ASS',
    logoPath: '/logos/teams/Assamstadt.png'
  },
  'spg-assamstadt-neunkirchen': {
    fullName: 'SpG Assamstadt/Neunkirchen',
    abbreviation: 'SpG ASS/NEU'
  },
  'spg-rauenberg-boxtal': {
    fullName: 'SpG Rauenberg/Boxtal',
    abbreviation: 'SpG RAU/BOX'
  },
  'tsv-gerchsheim': {
    fullName: 'TSV Gerchsheim',
    abbreviation: 'TSV GER'
  },
  'tsg-impfingen': {
    fullName: 'TSG Impfingen',
    abbreviation: 'TSG IMP'
  },
  'sv-koenigshofen': {
    fullName: 'SV Königshofen',
    abbreviation: 'SV KÖN'
  },
  'fc-kuelsheim': {
    fullName: 'FC Külsheim',
    abbreviation: 'FC KÜL'
  },
  'tsv-mudau': {
    fullName: 'TSV Mudau',
    abbreviation: 'TSV MUD'
  },
  'sv-seckach': {
    fullName: 'SV Seckach',
    abbreviation: 'SV SEC'
  },
  'spg-brehmbachtal': {
    fullName: 'SpG Brehmbachtal',
    abbreviation: 'SpG BBT',
    logoPath: '/logos/teams/Brehmbachtal.png'
  },
  'fv-brehmbachtal': {
    fullName: 'FV Brehmbachtal',
    abbreviation: 'FV BBT',
    logoPath: '/logos/teams/Brehmbachtal.png'
  },
  'fv-schoenfeld': {
    fullName: 'FV Schönfeld',
    abbreviation: 'FV SCH',
    logoPath: '/logos/teams/Schönfeld.png'
  },
  'sv-schoenfeld': {
    fullName: 'SV Schönfeld',
    abbreviation: 'SV SCH'
  },
  'tsv-schwabhausen': {
    fullName: 'TSV Schwabhausen',
    abbreviation: 'TSV SWH',
    logoPath: '/logos/teams/Schwabhausen.png', // Fixed typo from Scwabhausen
    alternativeNames: ['TSV Schwabhausen/Windischbuch']
  },
  'tsv-hoechberg': {
    fullName: 'TSV Höchberg',
    abbreviation: 'TSV HÖC'
  },
  'sv-nassig': {
    fullName: 'SV Nassig',
    abbreviation: 'SV NAS'
  },
  'spg-nassig-sonderriet': {
    fullName: 'SpG Nassig/Sonderriet',
    abbreviation: 'SpG NAS/SON'
  },
  'sg-unterschuepf-kupprichhausen': {
    fullName: 'SG Unterschüpf/Kupprichhausen',
    abbreviation: 'SG UN/KUP'
  },
  'sg-zimmern-wachbach': {
    fullName: 'SG Zimmern/Wachbach',
    abbreviation: 'SG ZIM/WA'
  },
  'sv-anadolu-lauda': {
    fullName: 'SV Anadolu Lauda',
    abbreviation: 'SV LAU'
  },
  'spg-beckstein-koenigshofen': {
    fullName: 'SpG Beckstein/Königshofen',
    abbreviation: 'SpG BEC/KÖN'
  },
  'spg-dittwar-heckfeld': {
    fullName: 'SpG Dittwar/Heckfeld',
    abbreviation: 'SpG DIT/HEC'
  },
  'spg-grossrinderfeld-gerchsheim': {
    fullName: 'SpG Großrinderfeld/Gerchsheim',
    abbreviation: 'SpG GRO/GER'
  },
  'spg-loeffelstelzen-uissigheim': {
    fullName: 'SpG Löffelstelzen/Uissigheim',
    abbreviation: 'SpG LÖF/UIS'
  },
  'spg-messelhausen-schweinberg': {
    fullName: 'SpG Messelhausen/Schweinberg',
    abbreviation: 'SpG MES/SCH'
  },
  'spg-poppenhausen-maisenbach': {
    fullName: 'SpG Poppenhausen/Maisenbach',
    abbreviation: 'SpG POP/MAI'
  },
  'spg-sachsenflur': {
    fullName: 'SpG Sachsenflur',
    abbreviation: 'SpG SAC'
  },
  'spg-oberbalbach-unterbalbach': {
    fullName: 'SpG Oberbalbach/Unterbalbach',
    abbreviation: 'SpG OB/UB'
  },
  'spg-uiffingen-boxtal': {
    fullName: 'SpG Uiffingen/Boxtal',
    abbreviation: 'SpG UIF/BOX'
  },
  'spvgg-hainstadt': {
    fullName: 'SpVgg Hainstadt',
    abbreviation: 'SpVgg HAI'
  },
  'kickers-dhk-wertheim': {
    fullName: 'Kickers DHK Wertheim',
    abbreviation: 'DHK WER'
  },
  'fv-kickers': {
    fullName: 'FV Kickers',
    abbreviation: 'FV KIC',
    logoPath: '/logos/teams/Kickers.png'
  },
  'sc-freudenberg': {
    fullName: 'SC Freudenberg',
    abbreviation: 'SC FRE'
  }
}

/**
 * Get team abbreviation by full name
 * @param teamName Full team name
 * @returns Team abbreviation or generated fallback
 */
export function getTeamAbbreviation(teamName: string | null | undefined): string {
  if (!teamName) return '???'
  
  // Try to find team by exact match or alternative names
  const team = findTeamByName(teamName)
  if (team) {
    return team.abbreviation
  }
  
  // Generate fallback abbreviation
  return generateFallbackAbbreviation(teamName)
}

/**
 * Get team logo path by full name
 * @param teamName Full team name
 * @returns Logo path or null if not found
 */
export function getTeamLogo(teamName: string | null | undefined): string | null {
  if (!teamName) return null
  
  const team = findTeamByName(teamName)
  return team?.logoPath || null
}

/**
 * Find team data by name (including alternative names)
 */
function findTeamByName(name: string): TeamData | undefined {
  // First try exact match
  for (const team of Object.values(TEAM_DATA)) {
    if (team.fullName === name) {
      return team
    }
  }
  
  // Then try alternative names
  for (const team of Object.values(TEAM_DATA)) {
    if (team.alternativeNames?.includes(name)) {
      return team
    }
  }
  
  // Try partial matches for common variations
  for (const team of Object.values(TEAM_DATA)) {
    if (name.includes(team.fullName) || team.fullName.includes(name)) {
      return team
    }
    // Check alternative names for partial matches
    if (team.alternativeNames?.some(alt => name.includes(alt) || alt.includes(name))) {
      return team
    }
  }
  
  return undefined
}

/**
 * Generate fallback abbreviation for unknown teams
 */
function generateFallbackAbbreviation(teamName: string): string {
  // Handle SpG (Spielgemeinschaft) specially
  if (teamName.startsWith('SpG ')) {
    const parts = teamName.substring(4).split('/')
    if (parts.length > 1) {
      return 'SpG ' + parts.map(p => p.substring(0, 3).toUpperCase()).join('/')
    }
    return 'SpG ' + parts[0].substring(0, 3).toUpperCase()
  }
  
  // Handle other club types
  const prefixes = ['SV ', 'FC ', 'TSV ', 'VfR ', 'VfB ', 'TuS ', 'FV ', 'SC ', 'SG ', 'SpVgg ', 'TSG ']
  for (const prefix of prefixes) {
    if (teamName.startsWith(prefix)) {
      const mainPart = teamName.substring(prefix.length).split(' ')[0]
      const abbr = mainPart.substring(0, 3).toUpperCase()
      return prefix.trim() + ' ' + abbr
    }
  }
  
  // Special cases
  if (teamName.includes('Kickers')) {
    const parts = teamName.split(' ')
    const lastPart = parts[parts.length - 1]
    return 'KIC ' + lastPart.substring(0, 3).toUpperCase()
  }
  
  if (teamName.includes('Türkgücü')) {
    const parts = teamName.split(' ')
    const lastPart = parts[parts.length - 1]
    return 'TG ' + lastPart.substring(0, 3).toUpperCase()
  }
  
  // Default fallback: first 3 letters
  const words = teamName.split(/[\s/\-]+/)
  if (words.length === 1) {
    return words[0].substring(0, 3).toUpperCase()
  } else if (words.length === 2) {
    return words.map(w => w[0]).join('').toUpperCase()
  } else {
    const ignore = ['1', '2', '3', 'II', 'III', 'e.V.', 'e.V', 'FC', 'SV', 'TSV', 'VfB', 'SG', 'SpG', 'TSG']
    const meaningful = words.filter(w => !ignore.includes(w))
    if (meaningful.length > 0) {
      return meaningful.slice(0, 3).map(w => w[0]).join('').toUpperCase()
    }
    return words.slice(0, 3).map(w => w[0]).join('').toUpperCase()
  }
}

/**
 * Get all team data (for admin purposes)
 */
export function getAllTeams(): TeamData[] {
  return Object.values(TEAM_DATA)
}

/**
 * Get team by key
 */
export function getTeamByKey(key: string): TeamData | undefined {
  return TEAM_DATA[key]
}