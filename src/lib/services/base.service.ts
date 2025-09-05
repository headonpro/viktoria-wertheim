// Base Service with common database operations
import { createClient } from '@/lib/supabase/server'
import { API_ERRORS } from '@/lib/api/errors'
import { PaginationParams } from '@/lib/api/types'
import logger from '@/lib/logger'

export abstract class BaseService<T = any> {
  protected tableName: string
  
  constructor(tableName: string) {
    this.tableName = tableName
  }

  protected async getSupabaseClient() {
    try {
      return await createClient()
    } catch (error) {
      logger.error(`Failed to create Supabase client for ${this.tableName}`, { error })
      throw API_ERRORS.DATABASE_CONNECTION_ERROR()
    }
  }

  // Generic find all with pagination
  async findAll(
    pagination: PaginationParams = {},
    filters: Record<string, any> = {}
  ): Promise<{ data: T[]; total: number }> {
    try {
      const supabase = await this.getSupabaseClient()
      const { page = 1, limit = 20, sortBy = 'created_at', sortOrder = 'desc' } = pagination

      let query = supabase.from(this.tableName as any).select('*', { count: 'exact' })

      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query = query.eq(key, value)
        }
      })

      // Apply pagination and sorting
      const from = (page - 1) * limit
      const to = from + limit - 1
      
      query = query
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range(from, to)

      const { data, error, count } = await query

      if (error) {
        logger.error(`Database query error in ${this.tableName}.findAll`, { error, filters, pagination })
        throw API_ERRORS.DATABASE_QUERY_ERROR(error)
      }

      return { data: (data as T[]) || [], total: count || 0 }
    } catch (error) {
      if (error instanceof Error && error.name === 'ApiError') throw error
      logger.error(`Unexpected error in ${this.tableName}.findAll`, { error })
      throw API_ERRORS.INTERNAL_ERROR(error)
    }
  }

  // Generic find by ID
  async findById(id: string): Promise<T> {
    try {
      const supabase = await this.getSupabaseClient()
      const { data, error } = await supabase
        .from(this.tableName as any)
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          throw API_ERRORS.NOT_FOUND(`${this.tableName} mit ID ${id}`)
        }
        logger.error(`Database query error in ${this.tableName}.findById`, { error, id })
        throw API_ERRORS.DATABASE_QUERY_ERROR(error)
      }

      return data as T
    } catch (error) {
      if (error instanceof Error && error.name === 'ApiError') throw error
      logger.error(`Unexpected error in ${this.tableName}.findById`, { error, id })
      throw API_ERRORS.INTERNAL_ERROR(error)
    }
  }

  // Generic create
  async create(data: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<T> {
    try {
      const supabase = await this.getSupabaseClient()
      const { data: result, error } = await supabase
        .from(this.tableName as any)
        .insert([data])
        .select()
        .single()

      if (error) {
        logger.error(`Database insert error in ${this.tableName}.create`, { error, data })
        throw API_ERRORS.DATABASE_QUERY_ERROR(error)
      }

      logger.info(`${this.tableName} created successfully`, { id: (result as any).id })
      return result as T
    } catch (error) {
      if (error instanceof Error && error.name === 'ApiError') throw error
      logger.error(`Unexpected error in ${this.tableName}.create`, { error, data })
      throw API_ERRORS.INTERNAL_ERROR(error)
    }
  }

  // Generic update
  async update(id: string, data: Partial<Omit<T, 'id' | 'created_at' | 'updated_at'>>): Promise<T> {
    try {
      const supabase = await this.getSupabaseClient()
      
      // First check if record exists
      await this.findById(id)

      const { data: result, error } = await supabase
        .from(this.tableName as any)
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        logger.error(`Database update error in ${this.tableName}.update`, { error, id, data })
        throw API_ERRORS.DATABASE_QUERY_ERROR(error)
      }

      logger.info(`${this.tableName} updated successfully`, { id })
      return result as T
    } catch (error) {
      if (error instanceof Error && error.name === 'ApiError') throw error
      logger.error(`Unexpected error in ${this.tableName}.update`, { error, id, data })
      throw API_ERRORS.INTERNAL_ERROR(error)
    }
  }

  // Generic delete
  async delete(id: string): Promise<void> {
    try {
      const supabase = await this.getSupabaseClient()
      
      // First check if record exists
      await this.findById(id)

      const { error } = await supabase
        .from(this.tableName as any)
        .delete()
        .eq('id', id)

      if (error) {
        logger.error(`Database delete error in ${this.tableName}.delete`, { error, id })
        throw API_ERRORS.DATABASE_QUERY_ERROR(error)
      }

      logger.info(`${this.tableName} deleted successfully`, { id })
    } catch (error) {
      if (error instanceof Error && error.name === 'ApiError') throw error
      logger.error(`Unexpected error in ${this.tableName}.delete`, { error, id })
      throw API_ERRORS.INTERNAL_ERROR(error)
    }
  }

  // Generic soft delete (if is_active column exists)
  async softDelete(id: string): Promise<T> {
    try {
      return await this.update(id, { is_active: false } as any)
    } catch (error) {
      logger.error(`Unexpected error in ${this.tableName}.softDelete`, { error, id })
      throw error
    }
  }

  // Generic count
  async count(filters: Record<string, any> = {}): Promise<number> {
    try {
      const supabase = await this.getSupabaseClient()
      let query = supabase.from(this.tableName as any).select('*', { count: 'exact', head: true })

      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query = query.eq(key, value)
        }
      })

      const { count, error } = await query

      if (error) {
        logger.error(`Database count error in ${this.tableName}.count`, { error, filters })
        throw API_ERRORS.DATABASE_QUERY_ERROR(error)
      }

      return count || 0
    } catch (error) {
      if (error instanceof Error && error.name === 'ApiError') throw error
      logger.error(`Unexpected error in ${this.tableName}.count`, { error, filters })
      throw API_ERRORS.INTERNAL_ERROR(error)
    }
  }

  // Generic exists check
  async exists(id: string): Promise<boolean> {
    try {
      const count = await this.count({ id })
      return count > 0
    } catch (error) {
      logger.error(`Unexpected error in ${this.tableName}.exists`, { error, id })
      throw error
    }
  }
}