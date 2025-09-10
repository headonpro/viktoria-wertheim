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
      {/* Logo nur auf Desktop anzeigen */}
      <picture className="hidden lg:block">
        <source 
          srcSet="/optimized/SVVW-128w.avif 1x, /optimized/SVVW-256w.avif 2x"
          type="image/avif"
        />
        <source 
          srcSet="/optimized/SVVW-128w.webp 1x, /optimized/SVVW-256w.webp 2x"
          type="image/webp"
        />
        <Image 
          src="/SVVW.png"
          alt="SV Viktoria Wertheim"
          width={128}
          height={28}
          className="h-7 w-auto object-contain"
          priority
          sizes="(min-width: 1024px) 128px, 0px"
        />
      </picture>
    </Link>
  )
}