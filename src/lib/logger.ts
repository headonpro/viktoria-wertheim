// Simple logger utility with structured logging
// Provides different log levels and formats for development vs production

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogContext {
  [key: string]: any
}

class Logger {
  private isDevelopment: boolean
  private logLevel: LogLevel

  constructor() {
    this.isDevelopment = process.env.NODE_ENV !== 'production'
    // Set log level based on environment
    this.logLevel = this.isDevelopment ? 'debug' : 'info'
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error']
    const currentLevelIndex = levels.indexOf(this.logLevel)
    const messageLevelIndex = levels.indexOf(level)
    return messageLevelIndex >= currentLevelIndex
  }

  private formatMessage(
    level: LogLevel,
    message: string,
    context?: LogContext
  ): string {
    const timestamp = new Date().toISOString()
    
    if (this.isDevelopment) {
      // Pretty print for development
      const colorMap = {
        debug: '\x1b[36m', // Cyan
        info: '\x1b[32m',  // Green
        warn: '\x1b[33m',  // Yellow
        error: '\x1b[31m', // Red
      }
      const reset = '\x1b[0m'
      const color = colorMap[level]
      
      let output = `${color}[${timestamp}] [${level.toUpperCase()}]${reset} ${message}`
      
      if (context && Object.keys(context).length > 0) {
        output += '\n' + JSON.stringify(context, null, 2)
      }
      
      return output
    } else {
      // JSON format for production
      const logEntry = {
        timestamp,
        level,
        message,
        ...context,
      }
      return JSON.stringify(logEntry)
    }
  }

  debug(message: string, context?: LogContext): void {
    if (this.shouldLog('debug')) {
      console.log(this.formatMessage('debug', message, context))
    }
  }

  info(message: string, context?: LogContext): void {
    if (this.shouldLog('info')) {
      console.log(this.formatMessage('info', message, context))
    }
  }

  warn(message: string, context?: LogContext): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message, context))
    }
  }

  error(message: string, context?: LogContext | Error): void {
    if (this.shouldLog('error')) {
      // Handle Error objects specially
      if (context instanceof Error) {
        const errorContext: LogContext = {
          error: {
            name: context.name,
            message: context.message,
            stack: context.stack,
          },
        }
        console.error(this.formatMessage('error', message, errorContext))
      } else {
        console.error(this.formatMessage('error', message, context))
      }
    }
  }

  // Log with request context (useful for API routes)
  logRequest(
    level: LogLevel,
    message: string,
    request: Request,
    context?: LogContext
  ): void {
    const requestContext = {
      method: request.method,
      url: request.url,
      headers: {
        'user-agent': request.headers.get('user-agent'),
        'x-forwarded-for': request.headers.get('x-forwarded-for'),
        'x-real-ip': request.headers.get('x-real-ip'),
      },
      ...context,
    }

    switch (level) {
      case 'debug':
        this.debug(message, requestContext)
        break
      case 'info':
        this.info(message, requestContext)
        break
      case 'warn':
        this.warn(message, requestContext)
        break
      case 'error':
        this.error(message, requestContext)
        break
    }
  }

  // Create a child logger with additional context
  child(context: LogContext): ChildLogger {
    return new ChildLogger(this, context)
  }
}

// Child logger that includes additional context in all logs
class ChildLogger {
  constructor(
    private parent: Logger,
    private context: LogContext
  ) {}

  private mergeContext(additionalContext?: LogContext): LogContext {
    return { ...this.context, ...additionalContext }
  }

  debug(message: string, context?: LogContext): void {
    this.parent.debug(message, this.mergeContext(context))
  }

  info(message: string, context?: LogContext): void {
    this.parent.info(message, this.mergeContext(context))
  }

  warn(message: string, context?: LogContext): void {
    this.parent.warn(message, this.mergeContext(context))
  }

  error(message: string, context?: LogContext | Error): void {
    if (context instanceof Error) {
      this.parent.error(message, context)
    } else {
      this.parent.error(message, this.mergeContext(context))
    }
  }
}

// Export singleton logger instance
const logger = new Logger()

export default logger

// Export convenience methods
export const debug = logger.debug.bind(logger)
export const info = logger.info.bind(logger)
export const warn = logger.warn.bind(logger)
export const error = logger.error.bind(logger)