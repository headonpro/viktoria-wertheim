// Rate limit configuration for different routes
// Defines limits per minute for each route pattern

export interface RateLimitConfig {
  pattern: string | RegExp
  limit: number
  interval?: number // Optional custom interval (default: 60000ms = 1 minute)
  skipForAdmin?: boolean // Skip rate limit for admin users
}

// Route-specific rate limits (checked in order)
export const rateLimits: RateLimitConfig[] = [
  // Critical API endpoints - very restrictive
  {
    pattern: '/api/contact',
    limit: 3, // 3 requests per minute for contact form
    skipForAdmin: false, // Apply to everyone including admins
  },
  {
    pattern: '/api/auth/signup',
    limit: 5, // 5 signup attempts per minute
    skipForAdmin: false,
  },
  {
    pattern: '/api/auth/login',
    limit: 10, // 10 login attempts per minute
    skipForAdmin: false,
  },
  
  // Admin API routes - more lenient for authenticated admins
  {
    pattern: /^\/api\/admin\/.*/,
    limit: 100, // 100 requests per minute for admin API
    skipForAdmin: true,
  },
  
  // General API routes
  {
    pattern: /^\/api\/.*/,
    limit: 30, // 30 requests per minute for general API
    skipForAdmin: false,
  },
  
  // Health check - very lenient
  {
    pattern: '/api/health',
    limit: 120, // 120 requests per minute (2 per second)
    skipForAdmin: false,
  },
  
  // Static assets and Next.js internals - no limit
  {
    pattern: /^\/_next\/.*/,
    limit: 1000, // Effectively unlimited
    skipForAdmin: false,
  },
  
  // Default for all other routes
  {
    pattern: /.*/, // Matches everything
    limit: 60, // 60 requests per minute default
    skipForAdmin: false,
  },
]

// Helper function to get rate limit for a given path
export function getRateLimit(path: string, isAdmin: boolean = false): number {
  for (const config of rateLimits) {
    const matches = typeof config.pattern === 'string' 
      ? path === config.pattern
      : config.pattern.test(path)
    
    if (matches) {
      // Skip rate limit for admin if configured
      if (isAdmin && config.skipForAdmin) {
        return 1000 // Effectively unlimited for admins
      }
      return config.limit
    }
  }
  
  // Default fallback (should never reach here due to catch-all pattern)
  return 60
}

// Get all rate limit configurations for documentation/monitoring
export function getAllRateLimits(): Array<{
  pattern: string
  limit: number
  description: string
}> {
  return [
    { pattern: '/api/contact', limit: 3, description: 'Contact form submission' },
    { pattern: '/api/auth/signup', limit: 5, description: 'User registration' },
    { pattern: '/api/auth/login', limit: 10, description: 'User login' },
    { pattern: '/api/admin/*', limit: 100, description: 'Admin API endpoints' },
    { pattern: '/api/*', limit: 30, description: 'General API endpoints' },
    { pattern: '/api/health', limit: 120, description: 'Health check endpoint' },
    { pattern: '/*', limit: 60, description: 'All other routes' },
  ]
}