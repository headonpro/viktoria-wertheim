// API Middleware
import { NextRequest } from 'next/server'
import { API_ERRORS, formatErrorResponse } from './errors'
import { validatePaginationParams } from './validation'
import rateLimit, { getClientIp } from '@/lib/rate-limit'
import logger from '@/lib/logger'

// Rate limiting middleware
export function createRateLimiter(config: {
  requests: number
  window: number // in milliseconds
  identifier?: string
}) {
  const limiter = rateLimit({
    interval: config.window,
    uniqueTokenPerInterval: 500,
  })

  return async (request: NextRequest) => {
    const ip = getClientIp(request.headers)
    const identifier = config.identifier || ip
    
    try {
      await limiter.check(config.requests, identifier)
    } catch (error) {
      logger.warn(`Rate limit exceeded`, {
        ip,
        identifier,
        requests: config.requests,
        window: config.window,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      throw API_ERRORS.RATE_LIMITED(
        `Zu viele Anfragen. Maximal ${config.requests} Anfragen pro ${Math.round(config.window / 1000)} Sekunden.`
      )
    }
  }
}

// Request parsing middleware
export async function parseRequest(request: NextRequest) {
  const url = new URL(request.url)
  const searchParams = Object.fromEntries(url.searchParams)
  
  let body = null
  if (request.method !== 'GET' && request.method !== 'DELETE') {
    try {
      const contentType = request.headers.get('content-type')
      if (contentType?.includes('application/json')) {
        body = await request.json()
      }
    } catch (_error) {
      throw API_ERRORS.VALIDATION_ERROR('Ungültiger JSON im Request Body')
    }
  }

  return {
    method: request.method,
    url: request.url,
    searchParams,
    body,
    headers: request.headers,
    ip: getClientIp(request.headers),
  }
}

// Pagination middleware
export function parsePaginationParams(searchParams: Record<string, string>) {
  return validatePaginationParams({
    page: searchParams.page,
    limit: searchParams.limit,
    sortBy: searchParams.sortBy,
    sortOrder: searchParams.sortOrder,
  })
}

// Authentication middleware (placeholder)
export async function validateAuth(request: NextRequest, requireAdmin = false) {
  // TODO: Implement proper authentication
  // For now, just check for admin routes
  if (requireAdmin) {
    const adminPassword = request.headers.get('x-admin-password')
    const expectedPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD
    
    if (!adminPassword || !expectedPassword) {
      throw API_ERRORS.UNAUTHORIZED('Admin-Authentifizierung erforderlich')
    }
    
    if (adminPassword !== expectedPassword) {
      throw API_ERRORS.UNAUTHORIZED('Ungültige Admin-Credentials')
    }
  }
  
  return { isAdmin: requireAdmin }
}

// Error handling wrapper
export function withErrorHandling<T extends unknown[], R>(
  handler: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<Response> => {
    try {
      const result = await handler(...args)
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    } catch (error) {
      logger.error('API Error', {
        error: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: error.stack
        } : error,
        timestamp: new Date().toISOString()
      })

      const errorResponse = formatErrorResponse(error)
      const statusCode = error instanceof Error && 'statusCode' in error 
        ? (error as any).statusCode 
        : 500

      return new Response(JSON.stringify(errorResponse), {
        status: statusCode,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  }
}

// Request logging middleware
export function logRequest(
  method: string, 
  url: string, 
  ip: string, 
  startTime: number,
  statusCode?: number,
  error?: unknown
) {
  const duration = Date.now() - startTime
  const logData = {
    method,
    url,
    ip,
    duration: `${duration}ms`,
    statusCode,
    timestamp: new Date().toISOString(),
  }

  if (error) {
    logger.error('API Request Failed', { ...logData, error })
  } else {
    logger.info('API Request', logData)
  }
}

// CORS middleware
export function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' 
      ? 'https://viktoria-wertheim.de' 
      : '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Admin-Password',
    'Access-Control-Max-Age': '86400',
  }
}

// Complete API handler wrapper
export function createApiHandler<T extends unknown[]>(
  handler: (request: NextRequest, ...args: T) => Promise<unknown>,
  options: {
    rateLimit?: { requests: number; window: number }
    requireAuth?: boolean
    requireAdmin?: boolean
  } = {}
) {
  return withErrorHandling(async (request: NextRequest, ..._args: T) => {
    const startTime = Date.now()
    const { method, url, ip } = await parseRequest(request)

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: corsHeaders(),
      })
    }

    try {
      // Apply rate limiting
      if (options.rateLimit) {
        const rateLimiter = createRateLimiter(options.rateLimit)
        await rateLimiter(request)
      }

      // Apply authentication
      if (options.requireAuth || options.requireAdmin) {
        await validateAuth(request, options.requireAdmin)
      }

      // Execute handler
      const result = await handler(request, ..._args)
      
      logRequest(method, url, ip, startTime, 200)
      
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(),
        }
      })
    } catch (error) {
      logRequest(method, url, ip, startTime, 
        error instanceof Error && 'statusCode' in error 
          ? (error as any).statusCode 
          : 500, 
        error
      )
      throw error
    }
  })
}