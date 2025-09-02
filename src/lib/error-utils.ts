/**
 * Type-safe error handling utilities
 */

/**
 * Type guard to check if a value is an Error instance
 */
export function isError(error: unknown): error is Error {
  return error instanceof Error
}

/**
 * Type guard to check if an error has a message property
 */
export function hasErrorMessage(error: unknown): error is { message: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  )
}

/**
 * Safely extract an error message from an unknown error
 */
export function getErrorMessage(error: unknown): string {
  if (isError(error)) {
    return error.message
  }
  
  if (hasErrorMessage(error)) {
    return error.message
  }
  
  if (typeof error === 'string') {
    return error
  }
  
  // Fallback for unknown error types
  return 'Ein unbekannter Fehler ist aufgetreten'
}

/**
 * Create a standardized error response
 */
export function createErrorResponse(error: unknown, context?: string): {
  message: string
  context?: string
  details?: string
} {
  const message = getErrorMessage(error)
  
  const response: {
    message: string
    context?: string
    details?: string
  } = { message }
  
  if (context) {
    response.context = context
  }
  
  // In development, include more details
  if (process.env.NODE_ENV === 'development' && isError(error)) {
    response.details = error.stack
  }
  
  return response
}

/**
 * Log error safely based on environment
 */
export function logError(error: unknown, context?: string): void {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${context || 'Error'}]:`, error)
    
    if (isError(error) && error.stack) {
      console.error('Stack trace:', error.stack)
    }
  }
  
  // In production, you might want to send to a logging service
  // Example: sendToLoggingService(error, context)
}

/**
 * Handle async operations with proper error handling
 */
export async function safeAsync<T>(
  fn: () => Promise<T>,
  context?: string
): Promise<{ data: T | null; error: string | null }> {
  try {
    const data = await fn()
    return { data, error: null }
  } catch (error) {
    logError(error, context)
    return { data: null, error: getErrorMessage(error) }
  }
}