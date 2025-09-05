// API Validation Utilities
import { API_ERRORS } from './errors'
import { VALIDATION } from './types'

// Generic validation helpers
export function validateRequired(value: unknown, fieldName: string): void {
  if (value === undefined || value === null || value === '') {
    throw API_ERRORS.VALIDATION_ERROR(`${fieldName} ist erforderlich`)
  }
}

export function validateString(
  value: unknown, 
  fieldName: string, 
  options: { 
    required?: boolean
    minLength?: number
    maxLength?: number
    pattern?: RegExp
  } = {}
): string {
  const { required = false, minLength, maxLength, pattern } = options

  if (required && (value === undefined || value === null || value === '')) {
    throw API_ERRORS.VALIDATION_ERROR(`${fieldName} ist erforderlich`)
  }

  if (value !== undefined && value !== null && value !== '') {
    if (typeof value !== 'string') {
      throw API_ERRORS.VALIDATION_ERROR(`${fieldName} muss ein Text sein`)
    }

    if (minLength && value.length < minLength) {
      throw API_ERRORS.VALIDATION_ERROR(`${fieldName} muss mindestens ${minLength} Zeichen haben`)
    }

    if (maxLength && value.length > maxLength) {
      throw API_ERRORS.VALIDATION_ERROR(`${fieldName} darf maximal ${maxLength} Zeichen haben`)
    }

    if (pattern && !pattern.test(value)) {
      throw API_ERRORS.VALIDATION_ERROR(`${fieldName} hat ein ungültiges Format`)
    }

    return value
  }

  return ''
}

export function validateNumber(
  value: unknown, 
  fieldName: string, 
  options: { 
    required?: boolean
    min?: number
    max?: number
    integer?: boolean
  } = {}
): number | undefined {
  const { required = false, min, max, integer = false } = options

  if (required && (value === undefined || value === null)) {
    throw API_ERRORS.VALIDATION_ERROR(`${fieldName} ist erforderlich`)
  }

  if (value !== undefined && value !== null) {
    const num = Number(value)
    
    if (isNaN(num)) {
      throw API_ERRORS.VALIDATION_ERROR(`${fieldName} muss eine Zahl sein`)
    }

    if (integer && !Number.isInteger(num)) {
      throw API_ERRORS.VALIDATION_ERROR(`${fieldName} muss eine ganze Zahl sein`)
    }

    if (min !== undefined && num < min) {
      throw API_ERRORS.VALIDATION_ERROR(`${fieldName} muss mindestens ${min} sein`)
    }

    if (max !== undefined && num > max) {
      throw API_ERRORS.VALIDATION_ERROR(`${fieldName} darf maximal ${max} sein`)
    }

    return num
  }

  return undefined
}

export function validateEmail(value: unknown, fieldName: string, required = false): string {
  const email = validateString(value, fieldName, { required })
  
  if (email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(email)) {
      throw API_ERRORS.VALIDATION_ERROR(`${fieldName} muss eine gültige E-Mail-Adresse sein`)
    }
  }
  
  return email
}

export function validateDate(value: unknown, fieldName: string, required = false): string {
  const dateStr = validateString(value, fieldName, { required })
  
  if (dateStr) {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) {
      throw API_ERRORS.VALIDATION_ERROR(`${fieldName} muss ein gültiges Datum sein (YYYY-MM-DD)`)
    }
    
    // Return normalized ISO date string
    return date.toISOString().split('T')[0]
  }
  
  return dateStr
}

export function validateEnum<T extends string>(
  value: unknown, 
  fieldName: string, 
  allowedValues: readonly T[],
  required = false
): T | undefined {
  if (required && (value === undefined || value === null || value === '')) {
    throw API_ERRORS.VALIDATION_ERROR(`${fieldName} ist erforderlich`)
  }

  if (value !== undefined && value !== null && value !== '') {
    if (typeof value !== 'string') {
      throw API_ERRORS.VALIDATION_ERROR(`${fieldName} muss ein Text sein`)
    }

    if (!allowedValues.includes(value as T)) {
      throw API_ERRORS.VALIDATION_ERROR(
        `${fieldName} muss einer der folgenden Werte sein: ${allowedValues.join(', ')}`
      )
    }

    return value as T
  }

  return undefined
}

export function validateArray<T>(
  value: unknown,
  fieldName: string,
  validator: (item: unknown, index: number) => T,
  options: { required?: boolean; minLength?: number; maxLength?: number } = {}
): T[] {
  const { required = false, minLength, maxLength } = options

  if (required && (value === undefined || value === null)) {
    throw API_ERRORS.VALIDATION_ERROR(`${fieldName} ist erforderlich`)
  }

  if (value !== undefined && value !== null) {
    if (!Array.isArray(value)) {
      throw API_ERRORS.VALIDATION_ERROR(`${fieldName} muss ein Array sein`)
    }

    if (minLength !== undefined && value.length < minLength) {
      throw API_ERRORS.VALIDATION_ERROR(`${fieldName} muss mindestens ${minLength} Elemente haben`)
    }

    if (maxLength !== undefined && value.length > maxLength) {
      throw API_ERRORS.VALIDATION_ERROR(`${fieldName} darf maximal ${maxLength} Elemente haben`)
    }

    return value.map(validator)
  }

  return []
}

// Specific validation functions
export function validatePaginationParams(params: {
  page?: unknown
  limit?: unknown
  sortBy?: unknown
  sortOrder?: unknown
}) {
  const page = validateNumber(params.page, 'page', { min: 1, integer: true }) || 1
  const limit = validateNumber(params.limit, 'limit', { 
    min: 1, 
    max: VALIDATION.MAX_PAGE_SIZE, 
    integer: true 
  }) || VALIDATION.DEFAULT_PAGE_SIZE
  
  const sortBy = validateString(params.sortBy, 'sortBy')
  const sortOrder = validateEnum(params.sortOrder, 'sortOrder', ['asc', 'desc'] as const) || 'desc'

  return { page, limit, sortBy, sortOrder }
}

export function validateUUID(value: unknown, fieldName: string, required = false): string {
  const uuid = validateString(value, fieldName, { required })
  
  if (uuid) {
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidPattern.test(uuid)) {
      throw API_ERRORS.VALIDATION_ERROR(`${fieldName} muss eine gültige UUID sein`)
    }
  }
  
  return uuid
}