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

export default function MobileNavigation() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center justify-around py-2" aria-label="Mobile Navigation">
      {navigationItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href || 
                        (item.href !== '/' && pathname.startsWith(item.href))
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center px-3 py-1 flex-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-viktoria-yellow focus:ring-offset-2 focus:ring-offset-viktoria-blue rounded-lg ${
              isActive 
                ? 'text-viktoria-yellow' 
                : 'text-white/80 hover:text-viktoria-yellow'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon 
              size={22} 
              strokeWidth={isActive ? 2.5 : 2}
              className="mb-0.5"
              aria-hidden="true"
            />
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}