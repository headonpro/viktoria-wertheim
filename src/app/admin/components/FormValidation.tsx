'use client'

import { useState, useEffect } from 'react'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

interface ValidationRule {
  test: (value: string) => boolean
  message: string
}

interface ValidatedInputProps {
  type?: string
  value: string
  onChange: (value: string) => void
  onValidityChange?: (isValid: boolean) => void
  rules?: ValidationRule[]
  placeholder?: string
  required?: boolean
  label?: string
  showValidation?: boolean
}

export function ValidatedInput({
  type = 'text',
  value,
  onChange,
  onValidityChange,
  rules = [],
  placeholder,
  required = false,
  label,
  showValidation = true
}: ValidatedInputProps) {
  const [errors, setErrors] = useState<string[]>([])
  const [touched, setTouched] = useState(false)
  const [, setIsValid] = useState(true)

  const validateField = (inputValue: string) => {
    const newErrors: string[] = []

    // Required validation
    if (required && !inputValue.trim()) {
      newErrors.push('Dieses Feld ist erforderlich')
    }

    // Custom rules validation
    if (inputValue.trim()) {
      rules.forEach(rule => {
        if (!rule.test(inputValue)) {
          newErrors.push(rule.message)
        }
      })
    }

    setErrors(newErrors)
    const valid = newErrors.length === 0
    setIsValid(valid)
    
    if (onValidityChange) {
      onValidityChange(valid)
    }
  }

  const handleBlur = () => {
    setTouched(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
    if (touched) {
      validateField(e.target.value)
    }
  }

  const showErrors = touched && errors.length > 0 && showValidation
  const showSuccess = touched && errors.length === 0 && value.trim() && showValidation

  return (
    <div className="admin-form-group">
      {label && <label>{label} {required && <span className="required">*</span>}</label>}
      
      <div className="validated-input-wrapper">
        <input
          type={type}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`validated-input ${showErrors ? 'error' : ''} ${showSuccess ? 'success' : ''}`}
        />
        
        {showValidation && (
          <div className="validation-icon">
            {showErrors && <AlertCircle className="error-icon" />}
            {showSuccess && <CheckCircle2 className="success-icon" />}
          </div>
        )}
      </div>
      
      {showErrors && (
        <div className="validation-errors">
          {errors.map((error, index) => (
            <div key={index} className="validation-error">
              {error}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

interface ValidatedTextareaProps {
  value: string
  onChange: (value: string) => void
  onValidityChange?: (isValid: boolean) => void
  rules?: ValidationRule[]
  placeholder?: string
  required?: boolean
  label?: string
  showValidation?: boolean
  minHeight?: string
}

export function ValidatedTextarea({
  value,
  onChange,
  onValidityChange,
  rules = [],
  placeholder,
  required = false,
  label,
  showValidation = true,
  minHeight = '120px'
}: ValidatedTextareaProps) {
  const [errors, setErrors] = useState<string[]>([])
  const [touched, setTouched] = useState(false)
  const [, setIsValid] = useState(true)

  const validateField = (inputValue: string) => {
    const newErrors: string[] = []

    // Required validation
    if (required && !inputValue.trim()) {
      newErrors.push('Dieses Feld ist erforderlich')
    }

    // Custom rules validation
    if (inputValue.trim()) {
      rules.forEach(rule => {
        if (!rule.test(inputValue)) {
          newErrors.push(rule.message)
        }
      })
    }

    setErrors(newErrors)
    const valid = newErrors.length === 0
    setIsValid(valid)
    
    if (onValidityChange) {
      onValidityChange(valid)
    }
  }

  useEffect(() => {
    validateField(value)
  }, [value, rules, required])

  const handleBlur = () => {
    setTouched(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
    if (touched) {
      validateField(e.target.value)
    }
  }

  const showErrors = touched && errors.length > 0 && showValidation
  const showSuccess = touched && errors.length === 0 && value.trim() && showValidation

  return (
    <div className="admin-form-group">
      {label && <label>{label} {required && <span className="required">*</span>}</label>}
      
      <div className="validated-input-wrapper">
        <textarea
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`validated-textarea ${showErrors ? 'error' : ''} ${showSuccess ? 'success' : ''}`}
          style={{ minHeight }}
        />
        
        {showValidation && (
          <div className="validation-icon textarea-icon">
            {showErrors && <AlertCircle className="error-icon" />}
            {showSuccess && <CheckCircle2 className="success-icon" />}
          </div>
        )}
      </div>
      
      {showErrors && (
        <div className="validation-errors">
          {errors.map((error, index) => (
            <div key={index} className="validation-error">
              {error}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Common validation rules
export const ValidationRules = {
  minLength: (min: number): ValidationRule => ({
    test: (value: string) => value.length >= min,
    message: `Mindestens ${min} Zeichen erforderlich`
  }),
  
  maxLength: (max: number): ValidationRule => ({
    test: (value: string) => value.length <= max,
    message: `Maximal ${max} Zeichen erlaubt`
  }),
  
  email: (): ValidationRule => ({
    test: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: 'Ungültige E-Mail-Adresse'
  }),
  
  phone: (): ValidationRule => ({
    test: (value: string) => /^[\d\s\-\+\(\)]+$/.test(value),
    message: 'Nur Ziffern, Leerzeichen und die Zeichen +, -, (, ) sind erlaubt'
  }),
  
  url: (): ValidationRule => ({
    test: (value: string) => {
      try {
        new URL(value)
        return true
      } catch {
        return false
      }
    },
    message: 'Ungültige URL'
  }),
  
  noSpecialChars: (): ValidationRule => ({
    test: (value: string) => /^[a-zA-ZäöüÄÖÜß\s\-]+$/.test(value),
    message: 'Nur Buchstaben, Leerzeichen und Bindestriche erlaubt'
  }),

  titleLength: (): ValidationRule => ({
    test: (value: string) => value.trim().length >= 5 && value.trim().length <= 100,
    message: 'Titel muss zwischen 5 und 100 Zeichen lang sein'
  })
}