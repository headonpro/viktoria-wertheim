import { LRUCache } from 'lru-cache'

type Options = {
  uniqueTokenPerInterval?: number
  interval?: number
}

type RateLimitData = {
  count: number
  resetTime: number
}

export default function rateLimit(options?: Options) {
  const tokenCache = new LRUCache<string, RateLimitData>({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000, // 1 minute default
  })

  return {
    check: (limit: number, token: string): Promise<void> =>
      new Promise((resolve, reject) => {
        const now = Date.now()
        const tokenData = tokenCache.get(token)
        
        if (!tokenData) {
          // First request from this token
          tokenCache.set(token, {
            count: 1,
            resetTime: now + (options?.interval || 60000)
          })
          resolve()
          return
        }

        // Check if we need to reset the counter
        if (now >= tokenData.resetTime) {
          tokenCache.set(token, {
            count: 1,
            resetTime: now + (options?.interval || 60000)
          })
          resolve()
          return
        }

        // Increment the counter
        if (tokenData.count >= limit) {
          const timeUntilReset = tokenData.resetTime - now
          reject(new Error(`Rate limit exceeded. Try again in ${Math.ceil(timeUntilReset / 1000)} seconds.`))
        } else {
          tokenCache.set(token, {
            ...tokenData,
            count: tokenData.count + 1
          })
          resolve()
        }
      }),
  }
}

// Helper function to get IP from request headers
export function getClientIp(headers: Headers): string {
  // Check various headers that might contain the real IP
  const forwardedFor = headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }
  
  const realIp = headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }
  
  const cfConnectingIp = headers.get('cf-connecting-ip')
  if (cfConnectingIp) {
    return cfConnectingIp
  }
  
  // Fallback to a default value if no IP found
  return 'unknown'
}