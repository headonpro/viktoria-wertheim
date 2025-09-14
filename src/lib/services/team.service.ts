// Team Service - Business logic for teams
import { BaseService } from './base.service'
import { Team, CreateTeamRequest, PaginationParams } from '@/lib/api/types'
import { API_ERRORS } from '@/lib/api/errors'
import { 
  validateString, 
  validateNumber
} from '@/lib/api/validation'
import logger from '@/lib/logger'

class TeamService extends BaseService<Team> {
  constructor() {
    super('teams')
  }

  // Validate team data
  private validateTeamData(data: CreateTeamRequest) {
    const name = validateString(data.name, 'Name', { 
      required: true, 
      maxLength: 100,
      minLength: 2
    })
    
    const short_name = validateString(data.short_name, 'Kurzname', { 
      required: true, 
      maxLength: 10,
      minLength: 2
    })
    
    const category = validateString(data.category, 'Kategorie', { 
      required: true,
      maxLength: 50
    })
    
    const league = validateString(data.league, 'Liga', { 
      maxLength: 100
    })
    
    const description = validateString(data.description, 'Beschreibung', {
      maxLength: 500
    })

    const logo_url = validateString(data.logo_url, 'Logo-URL')
    
    const founded_year = validateNumber(data.founded_year, 'Gründungsjahr', {
      min: 1800,
      max: new Date().getFullYear(),
      integer: true
    })

    return {
      name,
      short_name,
      category,
      league,
      description,
      logo_url,
      founded_year
    }
  }

  // Create a new team
  async createTeam(data: CreateTeamRequest): Promise<Team> {
    try {
      // Validate input
      const validatedData = this.validateTeamData(data)

      // Check if team with same name already exists
      const existingTeam = await this.findByName(validatedData.name)
      if (existingTeam) {
        throw API_ERRORS.ALREADY_EXISTS(`Team mit Namen "${validatedData.name}"`)
      }

      // Check if short name is unique
      const existingShortName = await this.findByShortName(validatedData.short_name)
      if (existingShortName) {
        throw API_ERRORS.ALREADY_EXISTS(`Team mit Kurzname "${validatedData.short_name}"`)
      }

      return await this.create({
        ...validatedData,
        is_active: true
      })
    } catch (error) {
      logger.error('Error creating team', { error, data })
      throw error
    }
  }

  // Find team by name
  async findByName(name: string): Promise<Team | null> {
    try {
      const supabase = await this.getSupabaseClient()
      const { data, error } = await supabase
        .from(this.tableName as any)
        .select('*')
        .ilike('name', name)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw API_ERRORS.DATABASE_QUERY_ERROR(error)
      }

      return (data as unknown as Team) || null
    } catch (error) {
      if (error instanceof Error && error.name === 'ApiError') throw error
      logger.error('Error finding team by name', { error, name })
      throw API_ERRORS.INTERNAL_ERROR(error)
    }
  }

  // Find team by short name
  async findByShortName(shortName: string): Promise<Team | null> {
    try {
      const supabase = await this.getSupabaseClient()
      const { data, error } = await supabase
        .from(this.tableName as any)
        .select('*')
        .ilike('short_name', shortName)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw API_ERRORS.DATABASE_QUERY_ERROR(error)
      }

      return (data as unknown as Team) || null
    } catch (error) {
      if (error instanceof Error && error.name === 'ApiError') throw error
      logger.error('Error finding team by short name', { error, shortName })
      throw API_ERRORS.INTERNAL_ERROR(error)
    }
  }

  // Get teams by category
  async getTeamsByCategory(category: string, pagination: PaginationParams = {}): Promise<{ data: Team[]; total: number }> {
    try {
      return await this.findAll(pagination, { category, is_active: true })
    } catch (error) {
      logger.error('Error getting teams by category', { error, category })
      throw error
    }
  }

  // Get all active teams
  async getActiveTeams(pagination: PaginationParams = {}): Promise<{ data: Team[]; total: number }> {
    try {
      // Note: is_active column doesn't exist in production DB yet
      // Return all teams for now
      return await this.findAll(pagination)
    } catch (error) {
      logger.error('Error getting active teams', { error })
      throw error
    }
  }

  // Update team
  async updateTeam(id: string, data: Partial<CreateTeamRequest>): Promise<Team> {
    try {
      // If updating name or short_name, check for duplicates
      if (data.name) {
        const existing = await this.findByName(data.name)
        if (existing && existing.id !== id) {
          throw API_ERRORS.ALREADY_EXISTS(`Team mit Namen "${data.name}"`)
        }
      }

      if (data.short_name) {
        const existing = await this.findByShortName(data.short_name)
        if (existing && existing.id !== id) {
          throw API_ERRORS.ALREADY_EXISTS(`Team mit Kurzname "${data.short_name}"`)
        }
      }

      // Validate partial data
      const updateData: Partial<Team> = {}
      
      if (data.name !== undefined) {
        updateData.name = validateString(data.name, 'Name', { maxLength: 100, minLength: 2 })
      }
      
      if (data.short_name !== undefined) {
        updateData.short_name = validateString(data.short_name, 'Kurzname', { maxLength: 10, minLength: 2 })
      }
      
      if (data.category !== undefined) {
        updateData.category = validateString(data.category, 'Kategorie', { maxLength: 50 })
      }
      
      if (data.league !== undefined) {
        updateData.league = validateString(data.league, 'Liga', { maxLength: 100 })
      }
      
      if (data.description !== undefined) {
        updateData.description = validateString(data.description, 'Beschreibung', { maxLength: 500 })
      }
      
      if (data.logo_url !== undefined) {
        updateData.logo_url = validateString(data.logo_url, 'Logo-URL')
      }
      
      if (data.founded_year !== undefined) {
        updateData.founded_year = validateNumber(data.founded_year, 'Gründungsjahr', {
          min: 1800,
          max: new Date().getFullYear(),
          integer: true
        })
      }

      return await this.update(id, updateData)
    } catch (error) {
      logger.error('Error updating team', { error, id, data })
      throw error
    }
  }

  // Deactivate team (soft delete)
  async deactivateTeam(id: string): Promise<Team> {
    try {
      return await this.softDelete(id)
    } catch (error) {
      logger.error('Error deactivating team', { error, id })
      throw error
    }
  }

  // Get team statistics
  async getTeamStats(id: string): Promise<{
    playerCount: number
    matchesPlayed: number
    matchesUpcoming: number
  }> {
    try {
      const supabase = await this.getSupabaseClient()

      // Get player count
      const { count: playerCount, error: playerError } = await supabase
        .from('players')
        .select('*', { count: 'exact', head: true })
        .eq('team_id', id)
        .eq('is_active', true)

      if (playerError) {
        throw API_ERRORS.DATABASE_QUERY_ERROR(playerError)
      }

      // Get matches played count
      const { count: matchesPlayed, error: playedError } = await supabase
        .from('matches')
        .select('*', { count: 'exact', head: true })
        .or(`home_team_id.eq.${id},away_team_id.eq.${id}`)
        .eq('status', 'completed')

      if (playedError) {
        throw API_ERRORS.DATABASE_QUERY_ERROR(playedError)
      }

      // Get upcoming matches count
      const { count: matchesUpcoming, error: upcomingError } = await supabase
        .from('matches')
        .select('*', { count: 'exact', head: true })
        .or(`home_team_id.eq.${id},away_team_id.eq.${id}`)
        .in('status', ['scheduled', 'live'])

      if (upcomingError) {
        throw API_ERRORS.DATABASE_QUERY_ERROR(upcomingError)
      }

      return {
        playerCount: playerCount || 0,
        matchesPlayed: matchesPlayed || 0,
        matchesUpcoming: matchesUpcoming || 0
      }
    } catch (error) {
      logger.error('Error getting team stats', { error, id })
      throw error
    }
  }
}

// Singleton instance
export const teamService = new TeamService()