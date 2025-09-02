'use client'

import React, { Component, ReactNode } from 'react'
import { IconAlertTriangle, IconRefresh } from '@tabler/icons-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  showDetails?: boolean
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // TODO: In production, send error to logging service
    // Example: logErrorToService(error, errorInfo)
    
    this.setState({
      error,
      errorInfo
    })
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden border border-red-200 dark:border-red-800">
          <div className="bg-gradient-to-r from-red-500 to-red-600 px-4 py-3">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider flex items-center">
              <IconAlertTriangle size={18} className="mr-2" />
              Fehler aufgetreten
            </h3>
          </div>
          
          <div className="p-4 sm:p-5 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
              <IconAlertTriangle size={32} className="text-red-500 dark:text-red-400" />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Etwas ist schiefgelaufen
            </h3>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-sm mx-auto">
              Beim Laden dieses Inhalts ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.
            </p>
            
            {this.props.showDetails && this.state.error && (
              <details className="text-left bg-gray-50 dark:bg-viktoria-dark rounded-lg p-3 mb-4">
                <summary className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                  Fehlerdetails anzeigen
                </summary>
                <div className="mt-2 text-xs font-mono text-gray-600 dark:text-gray-400 overflow-auto max-h-32">
                  <div className="mb-2">
                    <strong>Fehler:</strong> {this.state.error.message}
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong>Stack:</strong>
                      <pre className="whitespace-pre-wrap mt-1">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}
            
            <button
              onClick={this.handleRetry}
              className="inline-flex items-center px-4 py-2 bg-viktoria-blue hover:bg-viktoria-blue-light text-white rounded-lg transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-viktoria-blue focus:ring-offset-2"
            >
              <IconRefresh size={16} className="mr-2" />
              Erneut versuchen
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook-based Error Boundary für funktionale Komponenten
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null)

  const resetError = React.useCallback(() => {
    setError(null)
  }, [])

  const handleError = React.useCallback((error: Error) => {
    // Log error to console
    console.error('Error caught by useErrorHandler:', error)
    setError(error)
  }, [])

  React.useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])

  return { handleError, resetError, hasError: !!error }
}

// Spezifische Error Boundaries für verschiedene Bereiche
export function NewsErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden border border-orange-200 dark:border-orange-800">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider flex items-center">
              <IconAlertTriangle size={18} className="mr-2" />
              News nicht verfügbar
            </h3>
          </div>
          <div className="p-4 sm:p-5 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Die Nachrichten können derzeit nicht geladen werden. Bitte versuchen Sie es später erneut.
            </p>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}

export function TeamStatsErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden border border-blue-200 dark:border-blue-800">
          <div className="bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light px-4 py-3">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider flex items-center">
              <IconAlertTriangle size={18} className="mr-2" />
              Statistiken nicht verfügbar
            </h3>
          </div>
          <div className="p-4 sm:p-5 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Die Team-Statistiken können derzeit nicht angezeigt werden.
            </p>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}