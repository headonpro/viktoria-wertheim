// Individual News Article API Routes
import { NextRequest } from 'next/server'
import { newsService } from '@/lib/services/news.service'
import { CreateNewsRequest } from '@/lib/api/types'
import { formatSuccessResponse } from '@/lib/api/errors'
import { 
  createApiHandler, 
  parseRequest 
} from '@/lib/api/middleware'
import { validateUUID } from '@/lib/api/validation'

// GET /api/news/[id] - Get news article by ID
export const GET = createApiHandler(async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id: rawId } = await params
  const id = validateUUID(rawId, 'News-ID', true)
  
  const article = await newsService.findById(id)
  
  return formatSuccessResponse(article)
}, {
  rateLimit: { requests: 100, window: 60000 }
})

// PUT /api/news/[id] - Update news article
export const PUT = createApiHandler(async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id: rawId } = await params
  const id = validateUUID(rawId, 'News-ID', true)
  const { body } = await parseRequest(request)
  
  const article = await newsService.updateNews(id, body as Partial<CreateNewsRequest>)
  
  return formatSuccessResponse(article)
}, {
  requireAdmin: true,
  rateLimit: { requests: 20, window: 60000 }
})

// DELETE /api/news/[id] - Delete news article
export const DELETE = createApiHandler(async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id: rawId } = await params
  const id = validateUUID(rawId, 'News-ID', true)
  
  await newsService.delete(id)
  
  return formatSuccessResponse({ 
    message: 'News-Artikel wurde gelöscht' 
  })
}, {
  requireAdmin: true,
  rateLimit: { requests: 10, window: 60000 }
})