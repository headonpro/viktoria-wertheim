'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  delay?: number
  animation?: 'fadeIn' | 'slideUp' | 'slideDown' | 'none'
  immediate?: boolean // Neue Option für sofortiges Laden
}

export default function AnimatedSection({ 
  children, 
  className = '', 
  delay = 0,
  animation = 'slideUp',
  immediate = false 
}: AnimatedSectionProps) {
  
  // Wenn immediate = true, verwende animate statt whileInView
  if (immediate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: animation === 'slideUp' ? 20 : 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.6, 
          delay,
          ease: 'easeOut'
        }}
        className={className}
      >
        {children}
      </motion.div>
    )
  }

  // Standard: Animation beim Scrollen
  return (
    <motion.div
      initial={{ opacity: 0, y: animation === 'slideUp' ? 20 : 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: 'easeOut'
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedDiv({ children, className = '', delay = 0 }: AnimatedSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: 'easeOut'
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}