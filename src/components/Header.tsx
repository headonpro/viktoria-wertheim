'use client'

import { useState } from 'react'
import { IconMenu2, IconX, IconBallFootball, IconNews, IconUsers, IconShirt, IconMail } from '@tabler/icons-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from "next/image"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  // Hauptnavigation
  const mainNavigationItems = [
    { href: '/', label: 'Home', icon: IconBallFootball },
    { href: '/news', label: 'News', icon: IconNews },
    { href: '/teams', label: 'Teams', icon: IconUsers },
    { href: '/shop', label: 'Shop', icon: IconShirt },
    { href: '/kontakt', label: 'Kontakt', icon: IconMail },
  ]

  // Footer Links
  const footerLinks = [
    { href: '/impressum', label: 'Impressum' },
    { href: '/datenschutz', label: 'Datenschutz' },
  ]

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light dark:from-transparent dark:to-transparent dark:bg-white/[0.02] backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Layout */}
          <div className="grid grid-cols-3 items-center lg:hidden h-[70px]">
            {/* Logo - Links */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Image 
                  src="/viktorialogo.png"
                  alt="SV Viktoria Wertheim Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                  priority
                />
              </Link>
            </div>

            {/* Titel - Mitte */}
            <div className="flex justify-center">
              <Link href="/" className="flex items-stretch gap-1.5">
                <span className="font-bold text-viktoria-yellow text-[2.5rem] md:text-[3rem] leading-none flex items-center font-[family-name:var(--font-goldman)]">SV</span>
                <div className="flex flex-col justify-center">
                  <span className="font-semibold text-white text-base md:text-lg leading-none font-[family-name:var(--font-goldman)]">VIKTORIA</span>
                  <span className="font-semibold text-white text-base md:text-lg leading-none md:-mt-1 font-[family-name:var(--font-goldman)]">WERTHEIM</span>
                </div>
              </Link>
            </div>

            {/* Navigation - Rechts */}
            <div className="flex justify-end">
              <button
                onClick={toggleMenu}
                className="text-white hover:text-viktoria-yellow transition-colors p-2"
                aria-label="Menü öffnen"
              >
                {isMenuOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
              </button>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid grid-cols-3 items-center h-[70px]">
            {/* Logo + Brand Text - Left */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3">
                <Image 
                  src="/viktorialogo.png"
                  alt="SV Viktoria Wertheim Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                  priority
                />
                <div className="flex items-stretch gap-1.5">
                  <span className="font-bold text-viktoria-yellow text-[2.25rem] leading-none flex items-center font-[family-name:var(--font-goldman)]">SV</span>
                  <div className="flex flex-col justify-center">
                    <span className="font-semibold text-white text-base leading-tight font-[family-name:var(--font-goldman)]">VIKTORIA</span>
                    <span className="font-semibold text-white text-base leading-tight font-[family-name:var(--font-goldman)]">WERTHEIM</span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Center Section - Empty */}
            <div></div>

            {/* Desktop Navigation - Right */}
            <div className="flex items-center justify-end space-x-4">
              <nav className="flex items-center space-x-1">
                {mainNavigationItems.map((item) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                        isActive
                          ? 'text-viktoria-yellow'
                          : 'text-white hover:bg-white/10 hover:text-viktoria-yellow'
                      }`}
                    >
                      <Icon 
                        size={20} 
                        className={`transition-colors duration-300 ${
                          isActive
                            ? 'text-viktoria-yellow'
                            : 'text-white group-hover:text-viktoria-yellow'
                        }`}
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
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={toggleMenu}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
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
            >
              <div className="h-full bg-gradient-to-br from-white to-gray-50 dark:from-viktoria-dark dark:to-viktoria-dark-light shadow-2xl">
                
                {/* Header Section */}
                <div className="bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 flex justify-center">
                      <Image 
                        src="/viktorialogo.png"
                        alt="SV Viktoria Wertheim Logo"
                        width={128}
                        height={128}
                        className="object-contain"
                        priority
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={toggleMenu}
                      className="w-10 h-10 bg-white/20 hover:bg-white/30 dark:bg-gray-900/20 dark:hover:bg-gray-900/30 rounded-full flex items-center justify-center transition-colors duration-200 absolute right-6"
                      aria-label="Menü schließen"
                    >
                      <IconX size={20} className="text-white dark:text-gray-900" />
                    </motion.button>
                  </div>
                </div>

                {/* Main Navigation */}
                <div className="px-6 pt-6">
                  <nav className="space-y-3">
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
                            onClick={toggleMenu}
                            className={`group flex items-center justify-center p-4 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md ${
                              isActive
                                ? 'bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 text-white dark:text-gray-900 shadow-lg'
                                : 'bg-white dark:bg-viktoria-dark-light hover:bg-gray-50 dark:hover:bg-viktoria-dark-lighter text-gray-700 dark:text-gray-300 hover:text-viktoria-blue dark:hover:text-viktoria-yellow'
                            }`}
                          >
                            <Icon size={28} className="flex-shrink-0 mr-4" />
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
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Rechtliches</h4>
                    <div className="space-y-2">
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
                              onClick={toggleMenu}
                              className={`block px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                                isActive
                                  ? 'text-viktoria-blue dark:text-viktoria-yellow font-medium bg-viktoria-blue/5 dark:bg-viktoria-yellow/10'
                                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-white dark:hover:bg-viktoria-dark'
                              }`}
                            >
                              {item.label}
                            </Link>
                          </motion.div>
                        )
                      })}
                    </div>
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
    </>
  )
}