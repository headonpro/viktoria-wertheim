'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { IconBallFootball, IconNews, IconUsers, IconShirt, IconMail } from '@tabler/icons-react'

const navigationItems = [
  { href: '/', label: 'Home', icon: IconBallFootball },
  { href: '/news', label: 'News', icon: IconNews },
  { href: '/teams', label: 'Teams', icon: IconUsers },
  { href: '/shop', label: 'Shop', icon: IconShirt },
  { href: '/kontakt', label: 'Kontakt', icon: IconMail },
]

export default function DesktopNavigation() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center justify-end space-x-1" aria-label="Hauptnavigation">
      {navigationItems.map((item) => {
        const isActive = pathname === item.href
        const Icon = item.icon
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`group flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-viktoria-yellow focus:ring-offset-2 focus:ring-offset-viktoria-blue ${
              isActive
                ? 'text-viktoria-yellow bg-white/10'
                : 'text-white hover:bg-white/10 hover:text-viktoria-yellow'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon 
              size={20} 
              className={`transition-colors duration-300 ${
                isActive
                  ? 'text-viktoria-yellow'
                  : 'text-white group-hover:text-viktoria-yellow'
              }`}
              aria-hidden="true"
            />
            <span 
              className={`font-medium text-sm transition-colors duration-300 ${
                isActive
                  ? 'text-viktoria-yellow'
                  : 'text-white group-hover:text-viktoria-yellow'
              }`}
            >
              {item.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}