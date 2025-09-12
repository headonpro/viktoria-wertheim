'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function HeaderLogo() {
  return (
    <Link href="/" className="flex items-center space-x-3">
      <picture>
        <source 
          srcSet="/optimized/viktorialogo-48w.avif 1x, /optimized/viktorialogo-96w.avif 2x"
          type="image/avif"
        />
        <source 
          srcSet="/optimized/viktorialogo-48w.webp 1x, /optimized/viktorialogo-96w.webp 2x"
          type="image/webp"
        />
        <Image 
          src="/viktorialogo.png"
          alt="SV Viktoria Wertheim Logo"
          width={48}
          height={48}
          className="object-contain"
          priority
          sizes="48px"
        />
      </picture>
    </Link>
  )
}