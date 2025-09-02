'use client'

import { IconMenu2, IconX } from '@tabler/icons-react'

interface MobileMenuButtonProps {
  isMenuOpen: boolean
  onClick: () => void
}

export default function MobileMenuButton({ isMenuOpen, onClick }: MobileMenuButtonProps) {
  return (
    <div className="flex justify-end lg:hidden">
      <button
        onClick={onClick}
        className="text-white hover:text-viktoria-yellow transition-colors p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-viktoria-yellow focus:ring-offset-2 focus:ring-offset-viktoria-blue"
        aria-label={isMenuOpen ? "Menü schließen" : "Menü öffnen"}
        aria-expanded={isMenuOpen}
        aria-controls="mobile-sidebar"
      >
        {isMenuOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
      </button>
    </div>
  )
}