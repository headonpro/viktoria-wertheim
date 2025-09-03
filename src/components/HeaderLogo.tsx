'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function HeaderLogo() {
  return (
    <Link href="/" className="flex items-center space-x-3">
      <Image 
        src="/viktorialogo.png"
        alt="SV Viktoria Wertheim Logo"
        width={48}
        height={48}
        className="object-contain"
        priority
      />
      {/* Logo nur auf Desktop anzeigen */}
      <Image 
        src="/SVVW.png"
        alt="SV Viktoria Wertheim"
        width={100}
        height={24}
        className="hidden lg:block object-contain h-6 w-auto"
        priority
      />
    </Link>
  )
}