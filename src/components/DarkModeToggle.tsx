'use client'

import React from 'react'
import { IconSun, IconMoon } from '@tabler/icons-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function DarkModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button
        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300"
        aria-label="Toggle dark mode"
      >
        <div className="w-5 h-5" />
      </button>
    )
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300"
      aria-label="Toggle dark mode"
    >
      {theme === 'dark' ? (
        <IconSun size={20} className="text-viktoria-yellow" />
      ) : (
        <IconMoon size={20} className="text-gray-700 dark:text-gray-300" />
      )}
    </button>
  )
}