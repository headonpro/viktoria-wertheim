// News Service - Business logic for news articles
import { BaseService } from './base.service'
import { NewsArticle, CreateNewsRequest, PaginationParams } from '@/lib/api/types'
import { API_ERRORS } from '@/lib/api/errors'
import { 
  validateString, 
  validateArray
} from '@/lib/api/validation'
import logger from '@/lib/logger'

class NewsService extends BaseService<NewsArticle> {
  constructor() {
    super('news')
  }

  // Validate news data
  private validateNewsData(data: CreateNewsRequest) {
    const title = validateString(data.title, 'Titel', { 
      required: true, 
      maxLength: 200,
      minLength: 5
    })
    
    const content = validateString(data.content, 'Inhalt', { 
      required: true, 
      minLength: 50
    })
    
    const summary = validateString(data.summary, 'Zusammenfassung', { 
      maxLength: 500
    })
    
    const author = validateString(data.author, 'Autor', { 
      maxLength: 100
    })
    
    const category = validateString(data.category, 'Kategorie', {
      maxLength: 50
    })

    const image_url = validateString(data.image_url, 'Bild-URL')
    
    const tags = validateArray(
      data.tags,
      'Tags',
      (tag, index) => validateString(tag, `Tag ${index + 1}`, { maxLength: 50 }),
      { maxLength: 10 }
    )

    return {
      title,
      content,
      summary,
      author,
      category,
      image_url,
      tags,
      is_featured: data.is_featured || false
    }
  }

  // Create a new news article
  async createNews(data: CreateNewsRequest): Promise<NewsArticle> {
    try {
      // Validate input
      const validatedData = this.validateNewsData(data)

      // Check if article with same title already exists
      const existingNews = await this.findByTitle(validatedData.title)
      if (existingNews) {
        throw API_ERRORS.ALREADY_EXISTS(`News-Artikel mit Titel "${validatedData.title}"`)
      }

      return await this.create({
        ...validatedData,
        is_published: false,
        views: 0
      })
    } catch (error) {
      logger.error('Error creating news article', { error, data })
      throw error
    }
  }

  // Find news by title
  async findByTitle(title: string): Promise<NewsArticle | null> {
    try {
      const supabase = await this.getSupabaseClient()
      const { data, error } = await supabase
        .from(this.tableName as any)
        .select('*')
        .ilike('title', title)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw API_ERRORS.DATABASE_QUERY_ERROR(error)
      }

      return (data as unknown as NewsArticle) || null
    } catch (error) {
      if (error instanceof Error && error.name === 'ApiError') throw error
      logger.error('Error finding news by title', { error, title })
      throw API_ERRORS.INTERNAL_ERROR(error)
    }
  }

  // Get published news articles
  async getPublishedNews(pagination: PaginationParams = {}): Promise<{ data: NewsArticle[]; total: number }> {
    try {
      return await this.findAll(
        { ...pagination, sortBy: 'published_at' },
        { is_published: true }
      )
    } catch (error) {
      logger.error('Error getting published news', { error })
      throw error
    }
  }

  // Get featured news articles
  async getFeaturedNews(limit = 5): Promise<NewsArticle[]> {
    try {
      const { data } = await this.findAll(
        { limit, sortBy: 'published_at', sortOrder: 'desc' },
        { is_published: true, is_featured: true }
      )
      return data
    } catch (error) {
      logger.error('Error getting featured news', { error })
      throw error
    }
  }

  // Get news by category
  async getNewsByCategory(category: string, pagination: PaginationParams = {}): Promise<{ data: NewsArticle[]; total: number }> {
    try {
      return await this.findAll(
        { ...pagination, sortBy: 'published_at' },
        { category, is_published: true }
      )
    } catch (error) {
      logger.error('Error getting news by category', { error, category })
      throw error
    }
  }

  // Search news articles
  async searchNews(query: string, pagination: PaginationParams = {}): Promise<{ data: NewsArticle[]; total: number }> {
    try {
      const supabase = await this.getSupabaseClient()
      const { page = 1, limit = 20, sortBy = 'published_at', sortOrder = 'desc' } = pagination

      const from = (page - 1) * limit
      const to = from + limit - 1

      const { data, error, count } = await supabase
        .from(this.tableName as any)
        .select('*', { count: 'exact' })
        .or(`title.ilike.%${query}%,content.ilike.%${query}%,summary.ilike.%${query}%`)
        .eq('is_published', true)
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range(from, to)

      if (error) {
        logger.error('Database query error in news search', { error, query })
        throw API_ERRORS.DATABASE_QUERY_ERROR(error)
      }

      return { data: (data as unknown as NewsArticle[]) || [], total: count || 0 }
    } catch (error) {
      if (error instanceof Error && error.name === 'ApiError') throw error
      logger.error('Error searching news', { error, query })
      throw API_ERRORS.INTERNAL_ERROR(error)
    }
  }

  // Update news article
  async updateNews(id: string, data: Partial<CreateNewsRequest>): Promise<NewsArticle> {
    try {
      // If updating title, check for duplicates
      if (data.title) {
        const existing = await this.findByTitle(data.title)
        if (existing && existing.id !== id) {
          throw API_ERRORS.ALREADY_EXISTS(`News-Artikel mit Titel "${data.title}"`)
        }
      }

      // Validate partial data
      const updateData: Partial<NewsArticle> = {}
      
      if (data.title !== undefined) {
        updateData.title = validateString(data.title, 'Titel', { maxLength: 200, minLength: 5 })
      }
      
      if (data.content !== undefined) {
        updateData.content = validateString(data.content, 'Inhalt', { minLength: 50 })
      }
      
      if (data.summary !== undefined) {
        updateData.summary = validateString(data.summary, 'Zusammenfassung', { maxLength: 500 })
      }
      
      if (data.author !== undefined) {
        updateData.author = validateString(data.author, 'Autor', { maxLength: 100 })
      }
      
      if (data.category !== undefined) {
        updateData.category = validateString(data.category, 'Kategorie', { maxLength: 50 })
      }
      
      if (data.image_url !== undefined) {
        updateData.image_url = validateString(data.image_url, 'Bild-URL')
      }
      
      if (data.tags !== undefined) {
        updateData.tags = validateArray(
          data.tags,
          'Tags',
          (tag, index) => validateString(tag, `Tag ${index + 1}`, { maxLength: 50 }),
          { maxLength: 10 }
        )
      }
      
      if (data.is_featured !== undefined) {
        updateData.is_featured = Boolean(data.is_featured)
      }

      return await this.update(id, updateData)
    } catch (error) {
      logger.error('Error updating news article', { error, id, data })
      throw error
    }
  }

  // Publish news article
  async publishNews(id: string): Promise<NewsArticle> {
    try {
      return await this.update(id, {
        is_published: true,
        published_at: new Date().toISOString()
      })
    } catch (error) {
      logger.error('Error publishing news article', { error, id })
      throw error
    }
  }

  // Unpublish news article
  async unpublishNews(id: string): Promise<NewsArticle> {
    try {
      return await this.update(id, {
        is_published: false,
        published_at: undefined
      })
    } catch (error) {
      logger.error('Error unpublishing news article', { error, id })
      throw error
    }
  }

  // Increment view count
  async incrementViews(id: string): Promise<void> {
    try {
      const supabase = await this.getSupabaseClient()
      
      // First get current views
      const { data: current, error: fetchError } = await supabase
        .from(this.tableName as any)
        .select('views')
        .eq('id', id)
        .single()

      if (fetchError) {
        logger.error('Error fetching current views for increment', { error: fetchError, id })
        throw API_ERRORS.DATABASE_QUERY_ERROR(fetchError)
      }

      const newViews = ((current as any)?.views || 0) + 1

      const { error } = await supabase
        .from(this.tableName as any)
        .update({ 
          views: newViews,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) {
        logger.error('Database update error incrementing views', { error, id })
        throw API_ERRORS.DATABASE_QUERY_ERROR(error)
      }

      logger.info('News article view count incremented', { id, newViews })
    } catch (error) {
      if (error instanceof Error && error.name === 'ApiError') throw error
      logger.error('Error incrementing news views', { error, id })
      throw API_ERRORS.INTERNAL_ERROR(error)
    }
  }

  // Get latest news (for homepage)
  async getLatestNews(limit = 3): Promise<NewsArticle[]> {
    try {
      const { data } = await this.findAll(
        { limit, sortBy: 'published_at', sortOrder: 'desc' },
        { is_published: true }
      )
      return data
    } catch (error) {
      logger.error('Error getting latest news', { error })
      throw error
    }
  }

  // Get news statistics
  async getNewsStats(): Promise<{
    totalPublished: number
    totalDrafts: number
    totalViews: number
    featuredCount: number
  }> {
    try {
      const supabase = await this.getSupabaseClient()

      // Get published count
      const publishedCount = await this.count({ is_published: true })
      
      // Get drafts count
      const draftsCount = await this.count({ is_published: false })
      
      // Get featured count
      const featuredCount = await this.count({ is_published: true, is_featured: true })

      // Get total views
      const { data: viewsData, error: viewsError } = await supabase
        .from(this.tableName as any)
        .select('views')
        
      if (viewsError) {
        throw API_ERRORS.DATABASE_QUERY_ERROR(viewsError)
      }

      const totalViews = viewsData?.reduce((sum: number, item: any) => sum + (item.views || 0), 0) || 0

      return {
        totalPublished: publishedCount,
        totalDrafts: draftsCount,
        totalViews,
        featuredCount
      }
    } catch (error) {
      logger.error('Error getting news stats', { error })
      throw error
    }
  }
}

// Singleton instance
export const newsService = new NewsService()