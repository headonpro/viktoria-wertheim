'use client'

import { useState } from 'react'
import { IconMenu2, IconX, IconBallFootball, IconNews, IconUsers, IconShirt, IconMail, IconTrophy, IconInfoCircle, IconHistory, IconUserCheck, IconHeart, IconBuilding, IconScale, IconShield, IconFileText } from '@tabler/icons-react'
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
    { href: '/', label: 'Home', icon: IconBallFootball, description: 'Zur Startseite' },
    { href: '/news', label: 'News', icon: IconNews, description: 'Aktuelle Nachrichten' },
    { href: '/teams', label: 'Teams', icon: IconUsers, description: 'Unsere Mannschaften' },
    { href: '/shop', label: 'Shop', icon: IconShirt, description: 'Fanartikel & Mehr' },
    { href: '/kontakt', label: 'Kontakt', icon: IconMail, description: 'Kontaktiere uns' },
  ]

  // Sekundärnavigation
  const secondaryNavigationItems = [
    { href: '/ueber-uns', label: 'Über uns', icon: IconInfoCircle },
    { href: '/geschichte', label: 'Geschichte', icon: IconHistory },
    { href: '/vorstand', label: 'Vorstand', icon: IconUserCheck },
    { href: '/mitgliedschaft', label: 'Mitgliedschaft', icon: IconHeart },
    { href: '/sponsoren', label: 'Sponsoren', icon: IconBuilding },
    { href: '/impressum', label: 'Impressum', icon: IconScale },
    { href: '/datenschutz', label: 'Datenschutz', icon: IconShield },
    { href: '/agb', label: 'AGB', icon: IconFileText },
    { href: '/satzung', label: 'Satzung', icon: IconFileText },
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
              transition={{ duration: 0.4, ease: "easeOut" }}
              onClick={toggleMenu}
              className="fixed inset-0 bg-black/30 backdrop-blur-md z-40"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ 
                type: 'spring',
                stiffness: 300,
                damping: 30,
                duration: 0.6
              }}
              className="fixed top-0 right-0 bottom-0 w-80 z-50"
            >
              <div className="h-full bg-white/95 dark:bg-viktoria-dark-light/95 backdrop-blur-xl border-l border-white/20 dark:border-viktoria-dark-lighter/50 shadow-2xl">
                
                {/* Header Section */}
                <div className="relative p-4 border-b border-gray-100/50 dark:border-viktoria-dark-lighter/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-viktoria-yellow rounded-lg flex items-center justify-center">
                        <IconTrophy size={16} className="text-viktoria-yellow dark:text-viktoria-dark" />
                      </div>
                      <div>
                        <h2 className="text-base font-semibold text-gray-800 dark:text-white">Navigation</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400">SV Viktoria Wertheim</p>
                      </div>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={toggleMenu}
                      className="w-8 h-8 bg-gray-100/80 hover:bg-gray-200/80 dark:bg-viktoria-dark-lighter/80 dark:hover:bg-viktoria-dark-lighter rounded-lg flex items-center justify-center transition-all duration-200"
                      aria-label="Menü schließen"
                    >
                      <IconX size={16} className="text-gray-600 dark:text-gray-300" />
                    </motion.button>
                  </div>
                </div>

                {/* Hauptnavigation */}
                <div className="p-4 pt-4">
                  <nav className="space-y-0.5">
                    {mainNavigationItems.map((item, index) => {
                      const isActive = pathname === item.href
                      const Icon = item.icon
                      
                      return (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ 
                            delay: index * 0.1 + 0.2,
                            duration: 0.5,
                            ease: "easeOut"
                          }}
                        >
                          <Link
                            href={item.href}
                            onClick={toggleMenu}
                            className={`group relative flex items-center p-2.5 rounded-xl transition-all duration-300 ${
                              isActive
                                ? 'bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-viktoria-yellow text-white dark:text-viktoria-dark shadow-lg'
                                : 'hover:bg-gray-100/80 dark:hover:bg-viktoria-dark-lighter/80 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                              isActive
                                ? 'bg-white/20 backdrop-blur-sm'
                                : 'bg-gray-100/80 dark:bg-viktoria-dark-lighter/80'
                            }`}>
                              <Icon size={16} />
                            </div>

                            <div className="flex-1 min-w-0">
                              <h3 className={`font-semibold text-sm ${
                                isActive ? 'text-white dark:text-viktoria-dark' : ''
                              }`}>
                                {item.label}
                              </h3>
                              <p className={`text-xs ${
                                isActive ? 'text-white/80 dark:text-viktoria-dark/80' : 'text-gray-500 dark:text-gray-400'
                              }`}>
                                {item.description}
                              </p>
                            </div>
                          </Link>
                        </motion.div>
                      )
                    })}
                  </nav>
                </div>

                {/* Sekundärnavigation */}
                <div className="px-4 pb-16">
                  <div className="border-t border-gray-200/50 dark:border-viktoria-dark-lighter/50 pt-3">
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      Vereinsinformationen
                    </h3>
                    <div className="grid grid-cols-2 gap-1">
                      {secondaryNavigationItems.map((item, index) => {
                        const isActive = pathname === item.href
                        
                        return (
                          <motion.div
                            key={item.href}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ 
                              delay: (mainNavigationItems.length * 0.1) + (index * 0.05) + 0.4,
                              duration: 0.3,
                              ease: "easeOut"
                            }}
                          >
                            <Link
                              href={item.href}
                              onClick={toggleMenu}
                              className={`block px-2 py-1.5 text-xs rounded-lg transition-all duration-200 ${
                                isActive
                                  ? 'text-viktoria-blue dark:text-viktoria-yellow font-medium bg-viktoria-blue/10 dark:bg-viktoria-yellow/10'
                                  : 'text-gray-600 dark:text-gray-400 hover:text-viktoria-blue dark:hover:text-viktoria-yellow hover:bg-gray-100/80 dark:hover:bg-viktoria-dark-lighter/80'
                              }`}
                            >
                              {item.label}
                            </Link>
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Footer Section */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100/50">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="text-center"
                  >
                    <div className="flex items-center justify-center space-x-2 mb-1">
                      <div className="w-5 h-5 bg-gradient-to-br from-viktoria-blue to-viktoria-blue-light rounded-lg flex items-center justify-center">
                        <IconTrophy size={10} className="text-viktoria-yellow" />
                      </div>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Seit 1945</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Tradition • Leidenschaft • Gemeinschaft</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}