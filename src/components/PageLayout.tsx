import React from 'react'
import Header from './Header'
import Footer from './Footer'

interface PageLayoutProps {
  children: React.ReactNode
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-viktoria-dark flex flex-col">
      <Header />
      {/* Spacer for fixed header - reduced spacing for better visual flow */}
      <div className="h-[90px] lg:h-[70px]" aria-hidden="true" />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  )
}