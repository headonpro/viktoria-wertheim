'use client'

import React from 'react'

// Generic Skeleton Component
export function Skeleton({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}
      {...props}
    />
  )
}

// Team Statistics Skeleton
export function TeamStatisticsSkeleton() {
  return (
    <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gray-300 dark:bg-gray-700 h-12 animate-pulse"></div>
      
      <div className="p-4 sm:p-5 space-y-4">
        {/* Main Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="text-center bg-gray-50 dark:bg-viktoria-dark rounded-lg p-3 border border-gray-100 dark:border-gray-700">
              <Skeleton className="h-8 w-12 mx-auto mb-2" />
              <Skeleton className="h-3 w-16 mx-auto" />
            </div>
          ))}
        </div>
        
        {/* Goal Statistics */}
        <div className="bg-gray-50 dark:bg-viktoria-dark rounded-lg p-3 border border-gray-100 dark:border-gray-700">
          <Skeleton className="h-4 w-24 mb-2" />
          <div className="flex items-center justify-around">
            <div className="text-center">
              <Skeleton className="h-6 w-8 mx-auto mb-1" />
              <Skeleton className="h-3 w-12 mx-auto" />
            </div>
            <Skeleton className="h-4 w-2" />
            <div className="text-center">
              <Skeleton className="h-6 w-8 mx-auto mb-1" />
              <Skeleton className="h-3 w-12 mx-auto" />
            </div>
            <div className="text-center border-l border-gray-200 dark:border-gray-700 pl-3">
              <Skeleton className="h-6 w-8 mx-auto mb-1" />
              <Skeleton className="h-3 w-16 mx-auto" />
            </div>
          </div>
        </div>
        
        {/* Performance Metrics */}
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-viktoria-dark rounded-lg border border-gray-100 dark:border-gray-700">
              <Skeleton className="h-3 w-16" />
              <div className="flex items-center">
                <Skeleton className="w-20 h-2 rounded-full mr-3" />
                <Skeleton className="h-4 w-8" />
              </div>
            </div>
          ))}
        </div>
        
        {/* Season Progress */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="w-full h-2 rounded-full" />
        </div>
      </div>
    </div>
  )
}

// News Carousel Skeleton
export function NewsCarouselSkeleton() {
  return (
    <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gray-300 dark:bg-gray-700 h-12 animate-pulse"></div>
      
      <div className="p-4 sm:p-5">
        {/* Desktop View */}
        <div className="hidden lg:block space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-viktoria-dark rounded-lg border border-gray-100 dark:border-gray-700">
              <Skeleton className="w-20 h-20 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
        
        {/* Mobile View */}
        <div className="lg:hidden">
          <Skeleton className="w-full h-48 rounded-lg mb-4" />
          <div className="space-y-3">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-20" />
          </div>
          
          {/* Navigation dots */}
          <div className="flex justify-center mt-4 space-x-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="w-2 h-2 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// League Table Skeleton
export function LeagueTableSkeleton() {
  return (
    <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gray-300 dark:bg-gray-700 h-12 animate-pulse"></div>
      
      <div className="p-4 sm:p-5">
        <div className="space-y-2">
          {/* Table Header */}
          <div className="grid grid-cols-6 gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
            <Skeleton className="h-3 w-6" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-3 w-8" />
          </div>
          
          {/* Table Rows */}
          {[...Array(8)].map((_, i) => (
            <div key={i} className="grid grid-cols-6 gap-2 py-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-6" />
              <Skeleton className="h-4 w-6" />
              <Skeleton className="h-4 w-6" />
              <Skeleton className="h-4 w-6" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Game Cards Skeleton
export function GameCardsSkeleton() {
  return (
    <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gray-300 dark:bg-gray-700 h-12 animate-pulse"></div>
      
      <div className="p-4 sm:p-5">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-50 dark:bg-viktoria-dark rounded-lg p-4 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-8 h-8 rounded" />
                  <Skeleton className="h-4 w-24" />
                </div>
                
                <div className="text-center">
                  <Skeleton className="h-6 w-12 mx-auto mb-1" />
                  <Skeleton className="h-3 w-16 mx-auto" />
                </div>
                
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="w-8 h-8 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Loading Spinner
export function LoadingSpinner({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-viktoria-blue dark:border-t-viktoria-yellow ${className}`}></div>
  )
}

// Full Page Loading
export function PageLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-viktoria-dark pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <TeamStatisticsSkeleton />
            <NewsCarouselSkeleton />
            <GameCardsSkeleton />
          </div>
          
          {/* Sidebar */}
          <div className="space-y-8">
            <LeagueTableSkeleton />
            <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gray-300 dark:bg-gray-700 h-12 animate-pulse"></div>
              <div className="p-4 sm:p-5 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <Skeleton className="w-12 h-12 rounded" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-3/4 mb-1" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}