/**
 * TypeScript types for team data
 */

import type { TEAM_DATA } from './team-data'

export type TeamKey = keyof typeof TEAM_DATA
export type TeamName = string
export type TeamAbbreviation = string

export interface TeamMetadata {
  key: TeamKey
  fullName: TeamName
  abbreviation: TeamAbbreviation
  logoPath?: string
  alternativeNames?: string[]
}