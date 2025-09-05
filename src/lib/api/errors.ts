// API Error Handling
export class ApiError extends Error {
  constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly statusCode: number = 500,
    public readonly details?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details,
    }
  }
}

// Pre-defined error types
export const API_ERRORS = {
  // Generic
  INTERNAL_ERROR: (details?: unknown) => 
    new ApiError('INTERNAL_ERROR', 'Ein interner Serverfehler ist aufgetreten', 500, details),
  
  VALIDATION_ERROR: (message: string, details?: unknown) => 
    new ApiError('VALIDATION_ERROR', message, 400, details),
  
  NOT_FOUND: (resource: string) => 
    new ApiError('NOT_FOUND', `${resource} wurde nicht gefunden`, 404),
  
  ALREADY_EXISTS: (resource: string) => 
    new ApiError('ALREADY_EXISTS', `${resource} existiert bereits`, 409),
  
  UNAUTHORIZED: (message = 'Nicht autorisiert') => 
    new ApiError('UNAUTHORIZED', message, 401),
  
  FORBIDDEN: (message = 'Zugriff verweigert') => 
    new ApiError('FORBIDDEN', message, 403),
  
  RATE_LIMITED: (message = 'Zu viele Anfragen') => 
    new ApiError('RATE_LIMITED', message, 429),

  // Database specific
  DATABASE_CONNECTION_ERROR: () => 
    new ApiError('DATABASE_ERROR', 'Datenbankverbindung fehlgeschlagen', 503),
  
  DATABASE_QUERY_ERROR: (details?: unknown) => 
    new ApiError('DATABASE_QUERY_ERROR', 'Datenbankfehler', 500, details),

  // Business logic specific
  TEAM_NOT_FOUND: () => API_ERRORS.NOT_FOUND('Team'),
  PLAYER_NOT_FOUND: () => API_ERRORS.NOT_FOUND('Spieler'),
  MATCH_NOT_FOUND: () => API_ERRORS.NOT_FOUND('Spiel'),
  NEWS_NOT_FOUND: () => API_ERRORS.NOT_FOUND('News-Artikel'),
  
  DUPLICATE_PLAYER_NUMBER: (number: number, team: string) => 
    new ApiError('DUPLICATE_PLAYER_NUMBER', `Rückennummer ${number} ist bereits in Team ${team} vergeben`, 409),
  
  MATCH_ALREADY_STARTED: () => 
    new ApiError('MATCH_ALREADY_STARTED', 'Spiel kann nicht mehr bearbeitet werden, da es bereits begonnen hat', 400),
  
  INVALID_MATCH_DATE: () => 
    new ApiError('INVALID_MATCH_DATE', 'Ungültiges Spieldatum', 400),

  // Email specific
  EMAIL_CONFIG_MISSING: () => 
    new ApiError('EMAIL_CONFIG_MISSING', 'E-Mail-Konfiguration fehlt', 500),
  
  EMAIL_SEND_FAILED: (details?: unknown) => 
    new ApiError('EMAIL_SEND_FAILED', 'E-Mail konnte nicht gesendet werden', 500, details),

} as const

// Error response formatter
export function formatErrorResponse(error: unknown) {
  if (error instanceof ApiError) {
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
      meta: {
        timestamp: new Date().toISOString(),
      }
    }
  }

  // Handle unexpected errors
  const message = error instanceof Error ? error.message : 'Unbekannter Fehler'
  return {
    success: false,
    error: {
      code: 'UNKNOWN_ERROR',
      message: 'Ein unerwarteter Fehler ist aufgetreten',
      details: process.env.NODE_ENV === 'development' ? message : undefined,
    },
    meta: {
      timestamp: new Date().toISOString(),
    }
  }
}

// Success response formatter
export function formatSuccessResponse<T>(
  data: T,
  meta?: {
    page?: number
    limit?: number
    total?: number
  }
) {
  return {
    success: true,
    data,
    meta: {
      ...meta,
      timestamp: new Date().toISOString(),
    }
  }
}