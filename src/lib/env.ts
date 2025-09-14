/**
 * Environment Variable Validation and Type-Safe Access
 * 
 * This module provides centralized, type-safe access to environment variables
 * with proper validation and error handling.
 */

// Define the shape of our environment variables
interface EnvVars {
  NEXT_PUBLIC_SUPABASE_URL: string
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string
  DATABASE_URL?: string // Optional as it's only needed server-side
  NODE_ENV: 'development' | 'production' | 'test'
}

class EnvironmentError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'EnvironmentError'
  }
}

/**
 * Validates and returns a required environment variable
 */
function getRequiredEnvVar(key: string): string {
  const value = typeof window !== 'undefined' 
    ? (window as any).__ENV?.[key] || process.env[key]
    : process.env[key]
  
  if (!value || value.trim() === '') {
    // In development, provide helpful error message
    if (process.env.NODE_ENV === 'development') {
      console.error(`Missing environment variable: ${key}`)
      // Return a placeholder in development to prevent app crash
      if (key === 'NEXT_PUBLIC_SUPABASE_URL') return 'http://localhost:8000'
      if (key === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE'
    }
    
    throw new EnvironmentError(
      `Missing required environment variable: ${key}. ` +
      `Please check your .env.local file and ensure ${key} is set.`
    )
  }
  
  return value
}

/**
 * Validates and returns an optional environment variable
 */
function getOptionalEnvVar(key: string): string | undefined {
  const value = process.env[key]
  return value?.trim() || undefined
}

/**
 * Cached environment variables to avoid repeated validation
 */
let cachedEnv: EnvVars | null = null

/**
 * Get validated environment variables
 * Throws an error if required variables are missing
 */
export function getEnv(): EnvVars {
  // Return cached env in production for performance
  if (cachedEnv && process.env.NODE_ENV === 'production') {
    return cachedEnv
  }

  try {
    const env: EnvVars = {
      NEXT_PUBLIC_SUPABASE_URL: getRequiredEnvVar('NEXT_PUBLIC_SUPABASE_URL'),
      NEXT_PUBLIC_SUPABASE_ANON_KEY: getRequiredEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
      DATABASE_URL: getOptionalEnvVar('DATABASE_URL'),
      NODE_ENV: (process.env.NODE_ENV || 'development') as EnvVars['NODE_ENV']
    }

    // Validate Supabase URL format
    try {
      new URL(env.NEXT_PUBLIC_SUPABASE_URL)
    } catch {
      throw new EnvironmentError(
        `Invalid NEXT_PUBLIC_SUPABASE_URL format. Expected a valid URL, got: ${env.NEXT_PUBLIC_SUPABASE_URL}`
      )
    }

    // Validate Supabase Anon Key format (should be a JWT)
    if (!env.NEXT_PUBLIC_SUPABASE_ANON_KEY.startsWith('eyJ')) {
      throw new EnvironmentError(
        'Invalid NEXT_PUBLIC_SUPABASE_ANON_KEY format. Expected a JWT token starting with "eyJ"'
      )
    }

    // Cache the validated environment
    cachedEnv = env

    return env
  } catch (error) {
    // In development, log the error and provide helpful guidance
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Environment Configuration Error:', error)
      console.error('\n📝 Please ensure your .env.local file contains:')
      console.error('NEXT_PUBLIC_SUPABASE_URL=http://localhost:8000')
      console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here')
      console.error('DATABASE_URL=postgresql://postgres:password@localhost:5432/postgres\n')
    }
    
    throw error
  }
}

/**
 * Safe access to individual environment variables
 */
export const env = {
  get supabaseUrl(): string {
    return getEnv().NEXT_PUBLIC_SUPABASE_URL
  },
  
  get supabaseAnonKey(): string {
    return getEnv().NEXT_PUBLIC_SUPABASE_ANON_KEY
  },
  
  get databaseUrl(): string | undefined {
    return getEnv().DATABASE_URL
  },
  
  get nodeEnv(): EnvVars['NODE_ENV'] {
    return getEnv().NODE_ENV
  },
  
  get isDevelopment(): boolean {
    return getEnv().NODE_ENV === 'development'
  },
  
  get isProduction(): boolean {
    return getEnv().NODE_ENV === 'production'
  },
  
  get isTest(): boolean {
    return getEnv().NODE_ENV === 'test'
  }
}

/**
 * Validate environment on module load in development
 * This ensures early detection of configuration issues
 */
if (typeof window === 'undefined' && process.env.NODE_ENV === 'development') {
  try {
    getEnv()
    // Environment variables validated successfully
  } catch {
    // Error will be logged by getEnv() in development
  }
}