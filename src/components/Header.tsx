'use client'

import { useState } from 'react'
import HeaderLogo from './HeaderLogo'
import DesktopNavigation from './DesktopNavigation'
import MobileNavigation from './MobileNavigation'
import MobileMenuButton from './MobileMenuButton'
import MobileSidebar from './MobileSidebar'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light dark:from-transparent dark:to-transparent dark:bg-white/[0.02] backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Mobile Layout */}
          <div className="grid grid-cols-3 items-center lg:hidden h-[70px]">
            {/* Logo - Left */}
            <div className="flex items-center">
              <HeaderLogo />
            </div>

            {/* Title - Center (Mobile Only) */}
            <div className="flex justify-center lg:hidden">
              <div className="flex items-stretch gap-1.5">
                <span className="font-bold text-viktoria-yellow text-[2.5rem] md:text-[3rem] leading-none flex items-center font-[family-name:var(--font-goldman)]">
                  SV
                </span>
                <div className="flex flex-col justify-center">
                  <span className="font-semibold text-white text-base md:text-lg leading-none font-[family-name:var(--font-goldman)]">
                    VIKTORIA
                  </span>
                  <span className="font-semibold text-white text-base md:text-lg leading-none md:-mt-1 font-[family-name:var(--font-goldman)]">
                    WERTHEIM
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Menu Button - Right */}
            <MobileMenuButton isMenuOpen={isMenuOpen} onClick={toggleMenu} />
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid grid-cols-3 items-center h-[70px]">
            {/* Logo + Brand - Left */}
            <div className="flex items-center">
              <HeaderLogo />
            </div>

            {/* Center - Empty */}
            <div></div>

            {/* Navigation - Right */}
            <div className="flex items-center">
              <DesktopNavigation />
            </div>
          </div>
        </div>
        
        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden">
          <MobileNavigation />
        </div>
      </header>

      {/* Mobile Sidebar */}
      <MobileSidebar isOpen={isMenuOpen} onClose={toggleMenu} />
    </>
  )
}