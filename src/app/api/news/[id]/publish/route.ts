// News Publish/Unpublish API Routes
import { NextRequest } from 'next/server'
import { newsService } from '@/lib/services/news.service'
import { formatSuccessResponse } from '@/lib/api/errors'
import { createApiHandler } from '@/lib/api/middleware'
import { validateUUID } from '@/lib/api/validation'

// POST /api/news/[id]/publish - Publish news article
export const POST = createApiHandler(async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id: rawId } = await params
  const id = validateUUID(rawId, 'News-ID', true)
  
  const article = await newsService.publishNews(id)
  
  return formatSuccessResponse({
    message: 'News-Artikel wurde veröffentlicht',
    article
  })
}, {
  requireAdmin: true,
  rateLimit: { requests: 20, window: 60000 }
})

// DELETE /api/news/[id]/publish - Unpublish news article
export const DELETE = createApiHandler(async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id: rawId } = await params
  const id = validateUUID(rawId, 'News-ID', true)
  
  const article = await newsService.unpublishNews(id)
  
  return formatSuccessResponse({
    message: 'News-Artikel wurde zurückgezogen',
    article
  })
}, {
  requireAdmin: true,
  rateLimit: { requests: 20, window: 60000 }
})