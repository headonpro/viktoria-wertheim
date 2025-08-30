import React from 'react'

interface LoadingSkeletonProps {
  className?: string
  variant?: 'text' | 'card' | 'table' | 'list'
  count?: number
}

export default function LoadingSkeleton({ 
  className = '', 
  variant = 'text',
  count = 1 
}: LoadingSkeletonProps) {
  const baseClass = 'animate-pulse bg-gray-200 dark:bg-viktoria-dark-lighter rounded'
  
  const getSkeletonContent = () => {
    switch(variant) {
      case 'card':
        return (
          <div className={`${baseClass} ${className}`}>
            <div className="h-48 w-full bg-gray-300 dark:bg-viktoria-dark rounded-t-lg"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-300 dark:bg-viktoria-dark rounded w-3/4"></div>
              <div className="h-3 bg-gray-300 dark:bg-viktoria-dark rounded"></div>
              <div className="h-3 bg-gray-300 dark:bg-viktoria-dark rounded w-5/6"></div>
            </div>
          </div>
        )
      
      case 'table':
        return (
          <div className={`${baseClass} ${className}`}>
            <div className="p-4">
              <div className="h-4 bg-gray-300 dark:bg-viktoria-dark rounded w-full mb-3"></div>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex space-x-4 mb-2">
                  <div className="h-3 bg-gray-300 dark:bg-viktoria-dark rounded w-1/4"></div>
                  <div className="h-3 bg-gray-300 dark:bg-viktoria-dark rounded w-1/4"></div>
                  <div className="h-3 bg-gray-300 dark:bg-viktoria-dark rounded w-1/4"></div>
                  <div className="h-3 bg-gray-300 dark:bg-viktoria-dark rounded w-1/4"></div>
                </div>
              ))}
            </div>
          </div>
        )
      
      case 'list':
        return (
          <div className={`${baseClass} ${className} p-4 space-y-4`}>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex space-x-4">
                <div className="h-12 w-12 bg-gray-300 dark:bg-viktoria-dark rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 dark:bg-viktoria-dark rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 dark:bg-viktoria-dark rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        )
      
      default: // text
        return (
          <div className={`${baseClass} ${className} space-y-2`}>
            <div className="h-4 bg-gray-300 dark:bg-viktoria-dark rounded"></div>
            <div className="h-4 bg-gray-300 dark:bg-viktoria-dark rounded w-5/6"></div>
            <div className="h-4 bg-gray-300 dark:bg-viktoria-dark rounded w-3/4"></div>
          </div>
        )
    }
  }
  
  if (count > 1) {
    return (
      <>
        {[...Array(count)].map((_, i) => (
          <div key={i}>
            {getSkeletonContent()}
          </div>
        ))}
      </>
    )
  }
  
  return getSkeletonContent()
}

export function LoadingSpinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg', className?: string }) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3'
  }
  
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`animate-spin rounded-full border-viktoria-blue dark:border-viktoria-yellow border-t-transparent ${sizeClasses[size]}`}></div>
    </div>
  )
}