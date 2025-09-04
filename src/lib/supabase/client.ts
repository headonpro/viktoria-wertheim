import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import logger from '@/lib/logger'

// Retry configuration
const MAX_RETRIES = 3
const INITIAL_DELAY = 1000 // 1 second

// Helper function to create delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Wrap Supabase client with retry logic
function withRetry<T>(
  fn: () => Promise<T>,
  context: string
): Promise<T> {
  return async function retry(attempt: number = 1): Promise<T> {
    try {
      return await fn()
    } catch (error: any) {
      // Don't retry on client errors (4xx)
      if (error?.status >= 400 && error?.status < 500) {
        throw error
      }

      // Check if we should retry
      if (attempt >= MAX_RETRIES) {
        logger.error(`${context} failed after ${MAX_RETRIES} attempts`, {
          error: error?.message,
          attempt,
          status: error?.status
        })
        throw error
      }

      // Calculate exponential backoff delay
      const waitTime = INITIAL_DELAY * Math.pow(2, attempt - 1)
      
      logger.warn(`${context} failed, retrying...`, {
        attempt,
        nextAttemptIn: waitTime,
        error: error?.message
      })

      // Wait before retrying
      await delay(waitTime)
      
      // Recursive retry
      return retry(attempt + 1)
    }
  }()
}

// Extend Supabase client with retry wrapper
function createClientWithRetry(): SupabaseClient {
  const client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    }
  )

  // Create a proxy to intercept and wrap database operations with retry logic
  return new Proxy(client, {
    get(target, prop) {
      // For .from() calls, we need to wrap the query methods
      if (prop === 'from') {
        return function(table: string) {
          const query = target.from(table)
          
          // Wrap common query methods with retry logic
          const wrappedQuery = new Proxy(query, {
            get(queryTarget, queryProp) {
              // Methods that should have retry logic
              const retryMethods = ['select', 'insert', 'update', 'delete', 'upsert']
              
              if (retryMethods.includes(queryProp as string)) {
                return function(...args: any[]) {
                  const originalMethod = (queryTarget as any)[queryProp]
                  if (typeof originalMethod === 'function') {
                    const result = originalMethod.apply(queryTarget, args)
                    
                    // Wrap the promise chain methods
                    const wrapPromiseChain = (promiseObj: any): any => {
                      return new Proxy(promiseObj, {
                        get(promiseTarget, promiseProp) {
                          // Execute methods should have retry logic
                          if (promiseProp === 'single' || promiseProp === 'maybeSingle') {
                            return function() {
                              return withRetry(
                                () => promiseTarget[promiseProp](),
                                `Supabase ${table}.${String(queryProp)}`
                              )
                            }
                          }
                          
                          // For chaining methods, continue wrapping
                          const value = promiseTarget[promiseProp]
                          if (typeof value === 'function') {
                            return function(...chainArgs: any[]) {
                              const chainResult = value.apply(promiseTarget, chainArgs)
                              if (chainResult && typeof chainResult.then === 'function') {
                                // This is the final execution, wrap with retry
                                return withRetry(
                                  () => Promise.resolve(chainResult),
                                  `Supabase ${table}.${String(queryProp)}`
                                )
                              }
                              // Continue chaining
                              return wrapPromiseChain(chainResult)
                            }
                          }
                          return value
                        }
                      })
                    }
                    
                    return wrapPromiseChain(result)
                  }
                  return originalMethod
                }
              }
              
              return queryTarget[queryProp as keyof typeof queryTarget]
            }
          })
          
          return wrappedQuery
        }
      }
      
      // Return other properties as-is
      return target[prop as keyof typeof target]
    }
  })
}

export function createClient() {
  return createClientWithRetry()
}