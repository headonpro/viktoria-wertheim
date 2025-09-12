'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IconMail, IconLoader2, IconCheck, IconX } from '@tabler/icons-react'
import { createClient } from '@/lib/supabase/client'

interface NewsletterSubscribeProps {
  variant?: 'inline' | 'footer' | 'modal'
  className?: string
}

export default function NewsletterSubscribe({ 
  variant = 'inline',
  className = '' 
}: NewsletterSubscribeProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setMessage('Bitte geben Sie eine E-Mail-Adresse ein')
      setStatus('error')
      return
    }

    setStatus('loading')
    setMessage('')

    try {
      const supabase = createClient()
      
      // Check if already subscribed
      const { data: existing } = await supabase
        .from('newsletter_subscribers')
        .select('id, is_active')
        .eq('email', email)
        .single()

      if (existing) {
        if (existing.is_active) {
          setStatus('error')
          setMessage('Diese E-Mail-Adresse ist bereits angemeldet')
        } else {
          // Reactivate subscription
          const { error } = await supabase
            .from('newsletter_subscribers')
            .update({ 
              is_active: true,
              subscribed_at: new Date().toISOString(),
              unsubscribed_at: null
            })
            .eq('id', existing.id)

          if (error) throw error

          setStatus('success')
          setMessage('Willkommen zurück! Ihre Anmeldung wurde reaktiviert.')
          setEmail('')
        }
      } else {
        // Add new subscriber
        const { error } = await supabase
          .from('newsletter_subscribers')
          .insert({
            email,
            is_active: true,
            subscribed_at: new Date().toISOString()
          })

        if (error) throw error

        setStatus('success')
        setMessage('Vielen Dank für Ihre Anmeldung!')
        setEmail('')
      }

      // Reset after 5 seconds
      setTimeout(() => {
        setStatus('idle')
        setMessage('')
      }, 5000)

    } catch (error) {
      console.error('Newsletter subscription error:', error)
      setStatus('error')
      setMessage('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.')
    }
  }

  // Footer variant - compact for footer
  if (variant === 'footer') {
    return (
      <div className={`newsletter-footer ${className}`}>
        <h3 className="text-lg font-semibold text-viktoria-yellow mb-3 text-center">
          Newsletter
        </h3>
        <p className="text-sm text-gray-300 mb-4 text-center">
          Bleiben Sie auf dem Laufenden
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ihre E-Mail-Adresse"
              disabled={status === 'loading'}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg 
                       text-white placeholder-gray-400 focus:outline-none 
                       focus:border-viktoria-yellow transition-colors pr-10"
            />
            <IconMail 
              size={18} 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full px-4 py-2 bg-viktoria-yellow hover:bg-yellow-600 
                     text-gray-900 font-medium rounded-lg transition-all 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2"
          >
            {status === 'loading' ? (
              <>
                <IconLoader2 size={18} className="animate-spin" />
                <span>Wird gesendet...</span>
              </>
            ) : (
              'Abonnieren'
            )}
          </button>
        </form>
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <p className={`mt-3 text-sm flex items-center gap-1 ${
                status === 'success' ? 'text-green-400' : 'text-red-400'
              }`}>
                {status === 'success' ? <IconCheck size={16} /> : <IconX size={16} />}
                {message}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // Modal variant - for popups
  if (variant === 'modal') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`newsletter-modal bg-white dark:bg-viktoria-dark-light rounded-xl 
                   shadow-2xl p-8 max-w-md ${className}`}
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-viktoria-blue/10 dark:bg-viktoria-yellow/20 
                        rounded-full flex items-center justify-center mx-auto mb-4">
            <IconMail size={32} className="text-viktoria-blue dark:text-viktoria-yellow" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Newsletter abonnieren
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Keine Neuigkeiten mehr verpassen
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@beispiel.de"
            disabled={status === 'loading'}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 
                     rounded-lg focus:ring-2 focus:ring-viktoria-blue dark:focus:ring-viktoria-yellow 
                     focus:border-transparent transition-all disabled:bg-gray-100 
                     dark:disabled:bg-gray-700 bg-white dark:bg-viktoria-dark 
                     text-gray-900 dark:text-white"
          />
          
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-3 bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light 
                     dark:from-viktoria-yellow dark:to-yellow-600 text-white dark:text-gray-900 
                     font-semibold rounded-lg transition-all transform hover:scale-[1.02] 
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                     flex items-center justify-center gap-2"
          >
            {status === 'loading' ? (
              <>
                <IconLoader2 size={20} className="animate-spin" />
                <span>Wird verarbeitet...</span>
              </>
            ) : (
              'Jetzt abonnieren'
            )}
          </button>
        </form>
        
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={`mt-4 p-3 rounded-lg text-center flex items-center justify-center gap-2 ${
                status === 'success' 
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800' 
                  : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-800'
              }`}
            >
              {status === 'success' ? <IconCheck size={20} /> : <IconX size={20} />}
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        <p className="mt-6 text-xs text-center text-gray-500 dark:text-gray-400">
          Mit der Anmeldung stimmen Sie unseren{' '}
          <a href="/datenschutz" className="text-viktoria-blue dark:text-viktoria-yellow hover:underline">
            Datenschutzbestimmungen
          </a>{' '}
          zu.
        </p>
      </motion.div>
    )
  }

  // Default inline variant
  return (
    <div className={`newsletter-inline ${className}`}>
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-viktoria-dark-light 
                    dark:to-viktoria-dark-lighter rounded-2xl p-6 border border-gray-200 
                    dark:border-gray-700 shadow-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 
                         flex items-center gap-2 justify-center md:justify-start">
              <IconMail size={20} className="text-viktoria-blue dark:text-viktoria-yellow" />
              Newsletter abonnieren
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Keine Neuigkeiten mehr verpassen
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="flex-1 w-full md:max-w-md">
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ihre E-Mail-Adresse"
                disabled={status === 'loading'}
                className="flex-1 px-4 py-2.5 bg-white dark:bg-viktoria-dark border 
                         border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none 
                         focus:ring-2 focus:ring-viktoria-blue dark:focus:ring-viktoria-yellow 
                         focus:border-transparent transition-all disabled:bg-gray-100 
                         dark:disabled:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-6 py-2.5 bg-viktoria-blue dark:bg-viktoria-yellow 
                         hover:bg-viktoria-blue-light dark:hover:bg-yellow-600 
                         text-white dark:text-gray-900 font-medium rounded-xl 
                         transition-all whitespace-nowrap disabled:opacity-50 
                         disabled:cursor-not-allowed flex items-center gap-2
                         transform hover:scale-105 active:scale-95"
              >
                {status === 'loading' ? (
                  <IconLoader2 size={18} className="animate-spin" />
                ) : status === 'success' ? (
                  <IconCheck size={18} />
                ) : (
                  'Anmelden'
                )}
              </button>
            </div>
          </form>
        </div>
        
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className={`flex items-center gap-2 p-3 rounded-lg ${
                status === 'success' 
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                  : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
              }`}>
                {status === 'success' ? (
                  <IconCheck size={18} className="flex-shrink-0" />
                ) : (
                  <IconX size={18} className="flex-shrink-0" />
                )}
                <p className="text-sm font-medium">{message}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}