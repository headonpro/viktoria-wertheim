// News API Routes
import { NextRequest } from 'next/server'
import { newsService } from '@/lib/services/news.service'
import { CreateNewsRequest } from '@/lib/api/types'
import { formatSuccessResponse } from '@/lib/api/errors'
import { 
  createApiHandler, 
  parseRequest, 
  parsePaginationParams 
} from '@/lib/api/middleware'
import { validateString } from '@/lib/api/validation'

// GET /api/news - List news articles
export const GET = createApiHandler(async (request: NextRequest) => {
  const { searchParams } = await parseRequest(request)
  const pagination = parsePaginationParams(searchParams)
  
  // Optional filters
  const category = validateString(searchParams.category, 'Kategorie')
  const search = validateString(searchParams.search, 'Suchbegriff')
  const featured = searchParams.featured === 'true'
  const latest = searchParams.latest === 'true'
  
  let result
  
  if (search) {
    // Search functionality
    result = await newsService.searchNews(search, pagination)
  } else if (category) {
    // Filter by category
    result = await newsService.getNewsByCategory(category, pagination)
  } else if (featured) {
    // Get featured articles
    const data = await newsService.getFeaturedNews(pagination.limit)
    result = { data, total: data.length }
  } else if (latest) {
    // Get latest articles for homepage
    const data = await newsService.getLatestNews(pagination.limit)
    result = { data, total: data.length }
  } else {
    // Get all published news
    result = await newsService.getPublishedNews(pagination)
  }

  return formatSuccessResponse(result.data, {
    page: pagination.page,
    limit: pagination.limit,
    total: result.total
  })
}, {
  rateLimit: { requests: 60, window: 60000 }
})

// POST /api/news - Create new news article
export const POST = createApiHandler(async (request: NextRequest) => {
  const { body } = await parseRequest(request)
  
  const article = await newsService.createNews(body as CreateNewsRequest)
  
  return formatSuccessResponse(article)
}, {
  requireAdmin: true,
  rateLimit: { requests: 10, window: 60000 }
})