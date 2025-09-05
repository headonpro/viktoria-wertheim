import { NextRequest } from 'next/server'
import { contentGenerationService } from '@/lib/services/content-generation.service'
import { createApiHandler } from '@/lib/api/middleware'
import { formatSuccessResponse, formatErrorResponse, API_ERRORS } from '@/lib/api/errors'
import logger from '@/lib/logger'

// GET /api/admin/content-generation - Process pending content generation
export const GET = createApiHandler(async (_request: NextRequest) => {
    logger.info('Processing pending content generation requests')
    
    // Process pending content generation
    await contentGenerationService.processPendingContentGeneration()
    
    return formatSuccessResponse({
      message: 'Content generation processing completed'
    })
  }, { requireAdmin: true })

// POST /api/admin/content-generation - Manual content generation for specific match
export const POST = createApiHandler(async (request: NextRequest) => {
    const body = await request.json()
    const { matchId, action } = body
    
    if (action === 'test') {
      // Test content generation system
      const testResult = await contentGenerationService.testContentGeneration()
      
      return formatSuccessResponse({
        message: testResult ? 'Content generation test passed' : 'Content generation test failed',
        testResult
      })
    }
    
    if (action === 'generate' && matchId) {
      // Generate content for specific match
      await contentGenerationService.generateContentForMatch(matchId)
      
      return formatSuccessResponse({
        message: `Content generation triggered for match ${matchId}`
      })
    }
    
    return formatErrorResponse(API_ERRORS.VALIDATION_ERROR('Invalid action or missing matchId'))
  }, { requireAdmin: true })