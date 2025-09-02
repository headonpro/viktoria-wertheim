'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { IconX, IconBallFootball, IconNews, IconUsers, IconShirt, IconMail } from '@tabler/icons-react'

interface MobileSidebarProps {
  isOpen: boolean
  onClose: () => void
}

const mainNavigationItems = [
  { href: '/', label: 'Home', icon: IconBallFootball },
  { href: '/news', label: 'News', icon: IconNews },
  { href: '/teams', label: 'Teams', icon: IconUsers },
  { href: '/shop', label: 'Shop', icon: IconShirt },
  { href: '/kontakt', label: 'Kontakt', icon: IconMail },
]

const footerLinks = [
  { href: '/impressum', label: 'Impressum' },
  { href: '/datenschutz', label: 'Datenschutz' },
]

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const pathname = usePathname()

  // Handle keyboard navigation
  useEffect(() => {
    if (isOpen) {
      // Focus first navigation item
      const firstLink = document.querySelector('[data-mobile-nav="first"]') as HTMLElement
      if (firstLink) {
        firstLink.focus()
      }
      
      // Handle Escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose()
        }
      }
      
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden' // Prevent background scroll
      
      return () => {
        document.removeEventListener('keydown', handleEscape)
        document.body.style.overflow = ''
      }
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            aria-hidden="true"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ 
              type: 'spring',
              stiffness: 400,
              damping: 40,
              duration: 0.4
            }}
            className="fixed top-0 right-0 bottom-0 w-80 z-50"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Menu"
          >
            <div className="h-full bg-gradient-to-br from-white to-gray-50 dark:from-viktoria-dark dark:to-viktoria-dark-light shadow-2xl">
              
              {/* Header Section */}
              <div className="bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 flex justify-center">
                    <Image 
                      src="/viktorialogo.png"
                      alt="SV Viktoria Wertheim Logo"
                      width={72}
                      height={72}
                      className="object-contain"
                      priority
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 dark:bg-gray-900/20 dark:hover:bg-gray-900/30 rounded-full flex items-center justify-center transition-colors duration-200 absolute right-6 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-viktoria-blue"
                    aria-label="Menü schließen"
                  >
                    <IconX size={20} className="text-white dark:text-gray-900" />
                  </motion.button>
                </div>
              </div>

              {/* Main Navigation */}
              <div className="px-6 pt-6">
                <nav className="space-y-3" aria-label="Hauptnavigation">
                  {mainNavigationItems.map((item, index) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon
                    
                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ 
                          delay: index * 0.08 + 0.15,
                          duration: 0.4,
                          ease: "easeOut"
                        }}
                      >
                        <Link
                          href={item.href}
                          onClick={onClose}
                          data-mobile-nav={index === 0 ? "first" : undefined}
                          className={`group flex items-center justify-center p-4 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-viktoria-blue focus:ring-offset-2 ${
                            isActive
                              ? 'bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 text-white dark:text-gray-900 shadow-lg'
                              : 'bg-white dark:bg-viktoria-dark-light hover:bg-gray-50 dark:hover:bg-viktoria-dark-lighter text-gray-700 dark:text-gray-300 hover:text-viktoria-blue dark:hover:text-viktoria-yellow'
                          }`}
                          aria-current={isActive ? 'page' : undefined}
                        >
                          <Icon size={28} className="flex-shrink-0 mr-4" aria-hidden="true" />
                          <div>
                            <span className="font-semibold text-xl">{item.label}</span>
                          </div>
                        </Link>
                      </motion.div>
                    )
                  })}
                </nav>
              </div>

              {/* Footer Section */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gray-50 dark:bg-viktoria-dark-light border-t border-gray-200 dark:border-viktoria-dark-lighter">
                <div className="mb-4 text-center">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Rechtliches
                  </h4>
                  <nav className="space-y-2" aria-label="Footer Navigation">
                    {footerLinks.map((item, index) => {
                      const isActive = pathname === item.href
                      
                      return (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ 
                            delay: (mainNavigationItems.length * 0.08) + (index * 0.05) + 0.35,
                            duration: 0.3,
                            ease: "easeOut"
                          }}
                        >
                          <Link
                            href={item.href}
                            onClick={onClose}
                            className={`block px-3 py-2 rounded-lg transition-all duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-viktoria-blue focus:ring-offset-2 ${
                              isActive
                                ? 'text-viktoria-blue dark:text-viktoria-yellow font-medium bg-viktoria-blue/5 dark:bg-viktoria-yellow/10'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-white dark:hover:bg-viktoria-dark'
                            }`}
                            aria-current={isActive ? 'page' : undefined}
                          >
                            {item.label}
                          </Link>
                        </motion.div>
                      )
                    })}
                  </nav>
                </div>
                
                {/* Version Info */}
                <div className="pt-3 border-t border-gray-200 dark:border-viktoria-dark-lighter">
                  <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
                    © 2025 SV Viktoria Wertheim
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}