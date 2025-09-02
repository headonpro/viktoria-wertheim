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
      {/* Text nur auf Desktop anzeigen, da auf Mobile der zentrierte Titel verwendet wird */}
      <div className="hidden lg:flex items-stretch gap-1.5">
        <span className="font-bold text-viktoria-yellow text-[2.25rem] leading-none flex items-center font-[family-name:var(--font-goldman)]">
          SV
        </span>
        <div className="flex flex-col justify-center">
          <span className="font-semibold text-white text-base leading-tight font-[family-name:var(--font-goldman)]">
            VIKTORIA
          </span>
          <span className="font-semibold text-white text-base leading-tight font-[family-name:var(--font-goldman)]">
            WERTHEIM
          </span>
        </div>
      </div>
    </Link>
  )
}