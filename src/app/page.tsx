import React from 'react'
import PageLayout from '@/components/PageLayout'
import HomePage from '@/components/HomePage'

// Enable ISR (Incremental Static Regeneration)
// Revalidate every 60 seconds for fresh data
export const revalidate = 60

// Generate metadata for better SEO
export const metadata = {
  title: 'SV Viktoria Wertheim - Offizielle Website',
  description: 'Offizielle Website des SV Viktoria Wertheim. Aktuelle News, Spielpläne, Ergebnisse und Tabellen.',
  openGraph: {
    title: 'SV Viktoria Wertheim',
    description: 'Offizielle Website des SV Viktoria Wertheim',
    images: ['/viktorialogo.webp'],
  },
}

export default function Home() {
  return (
    <PageLayout>
      <HomePage />
    </PageLayout>
  )
}