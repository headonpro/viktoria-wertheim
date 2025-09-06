'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import PageLayout from '@/components/PageLayout'
import AnimatedSection from '@/components/AnimatedSection'
import 'leaflet/dist/leaflet.css'
import { 
  IconMail, 
  IconMapPin,
  IconSend,
  IconCheck,
  IconUser,
  IconBuildingCommunity,
  IconMapPinFilled,
  IconClockFilled,
  IconMailFilled,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandYoutube
} from '@tabler/icons-react'

// Lazy load the map component
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-viktoria-dark dark:to-viktoria-dark-lighter h-96 rounded-xl flex items-center justify-center">
      <div className="text-center">
        <IconMapPin size={48} className="text-gray-400 dark:text-gray-600 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400 font-medium">
          Karte wird geladen...
        </p>
      </div>
    </div>
  )
})

interface Contact {
  id: string
  role: string
  title?: string
  name: string
  department: string | null
  phone: string
  email: string
  order_position: number
}

interface GeneralInfo {
  address: string
  hours: string
  mapUrl: string
}

interface SocialMedia {
  icon: string
  name: string
  url: string
  followers?: string
}

interface ContactPageClientProps {
  contacts: Contact[]
  generalInfo: GeneralInfo
  socialMedia: SocialMedia[]
}

// Utility classes for consistent styling
const inputClass = "w-full px-4 py-3 bg-gray-50 dark:bg-viktoria-dark border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-viktoria-blue dark:focus:ring-viktoria-yellow text-gray-900 dark:text-white transition-all"
const labelClass = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
const cardClass = "bg-white dark:bg-viktoria-dark-light rounded-2xl shadow-xl overflow-hidden"
const headerClass = "bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 px-6 py-4"

export default function ContactPageClient({ contacts, generalInfo, socialMedia }: ContactPageClientProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [successMessage, setSuccessMessage] = useState('')
  const [activeContactTab, setActiveContactTab] = useState('vorstand')

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (formData.name.length < 2) {
      newErrors.name = 'Name muss mindestens 2 Zeichen lang sein'
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Bitte geben Sie eine gültige E-Mail-Adresse ein'
    }
    
    if (!formData.subject) {
      newErrors.subject = 'Bitte wählen Sie einen Betreff'
    }
    
    if (formData.message.length < 10) {
      newErrors.message = 'Nachricht muss mindestens 10 Zeichen lang sein'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    setErrors({})
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitted(true)
        setSuccessMessage('Ihre Nachricht wurde erfolgreich gesendet! Wir werden uns in Kürze bei Ihnen melden.')
        setFormData({ name: '', email: '', subject: '', message: '' })
        
        setTimeout(() => {
          setSubmitted(false)
          setSuccessMessage('')
        }, 5000)
      } else {
        if (result.error?.message) {
          setErrors({ form: result.error.message })
        } else {
          setErrors({ form: 'Fehler beim Senden der Nachricht. Bitte versuchen Sie es später erneut.' })
        }
      }
    } catch (error) {
      console.error('Netzwerkfehler:', error)
      setErrors({ form: 'Netzwerkfehler. Bitte überprüfen Sie Ihre Internetverbindung.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    // Clear field-specific error when user starts typing
    if (errors[e.target.name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[e.target.name]
        return newErrors
      })
    }
  }

  const getSocialIcon = (icon: string) => {
    const icons: Record<string, React.ReactElement> = {
      'facebook': <IconBrandFacebook size={24} />,
      'instagram': <IconBrandInstagram size={24} />,
      'youtube': <IconBrandYoutube size={24} />
    }
    return icons[icon] || null
  }

  const groupedContacts = {
    vorstand: contacts.filter(c => c.department === 'board' || c.role?.includes('Vorsitzender')),
    sport: contacts.filter(c => c.department === 'sports' || c.role?.includes('Trainer')),
    jugend: contacts.filter(c => c.department === 'youth')
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-viktoria-dark dark:to-viktoria-dark-light pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Hero Section - Simplified */}
          <AnimatedSection animation="fadeIn" immediate={true}>
            <div className="bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 rounded-3xl shadow-2xl mb-12 p-8">
              <h1 className="text-3xl sm:text-5xl font-bold text-white dark:text-gray-900 mb-2">
                Kontakt
              </h1>
              <p className="text-lg text-white/90 dark:text-gray-800 mb-6">
                Wir sind für Sie da - persönlich und digital
              </p>
              
              {/* Quick Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white/20 dark:bg-black/20 backdrop-blur rounded-xl p-4">
                  <IconBuildingCommunity size={20} className="text-white dark:text-gray-900 mb-2" />
                  <p className="text-sm text-white dark:text-gray-900 font-semibold">Geschäftsstelle</p>
                  <p className="text-xs text-white/90 dark:text-gray-800">{generalInfo.address}</p>
                </div>
                <div className="bg-white/20 dark:bg-black/20 backdrop-blur rounded-xl p-4">
                  <IconClockFilled size={20} className="text-white dark:text-gray-900 mb-2" />
                  <p className="text-sm text-white dark:text-gray-900 font-semibold">Öffnungszeiten</p>
                  <p className="text-xs text-white/90 dark:text-gray-800">{generalInfo.hours}</p>
                </div>
                <div className="bg-white/20 dark:bg-black/20 backdrop-blur rounded-xl p-4">
                  <IconMailFilled size={20} className="text-white dark:text-gray-900 mb-2" />
                  <p className="text-sm text-white dark:text-gray-900 font-semibold">E-Mail</p>
                  <a href="mailto:info@viktoria-wertheim.de" className="text-xs text-white/90 dark:text-gray-800 hover:underline">
                    info@viktoria-wertheim.de
                  </a>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Contact Form */}
            <AnimatedSection animation="slideUp" immediate={true} className="lg:col-span-2">
              <div className={cardClass}>
                <div className={headerClass}>
                  <h2 className="text-xl font-bold text-white dark:text-gray-900">
                    Nachricht senden
                  </h2>
                </div>
                <div className="p-6">
                  {/* Success Message */}
                  {successMessage && (
                    <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-xl">
                      <div className="flex items-start">
                        <IconCheck size={20} className="text-green-600 dark:text-green-400 mr-2 mt-0.5" />
                        <p className="text-green-800 dark:text-green-300 text-sm">{successMessage}</p>
                      </div>
                    </div>
                  )}

                  {/* General Form Error */}
                  {errors.form && (
                    <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-xl">
                      <p className="text-red-800 dark:text-red-300 text-sm">{errors.form}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Ihr Name *</label>
                        <div className="relative">
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className={`${inputClass} pl-10 ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                            placeholder="Max Mustermann"
                          />
                          <IconUser size={18} className="absolute left-3 top-3.5 text-gray-400" />
                        </div>
                        {errors.name && (
                          <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.name}</p>
                        )}
                      </div>
                      <div>
                        <label className={labelClass}>E-Mail-Adresse *</label>
                        <div className="relative">
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className={`${inputClass} pl-10 ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                            placeholder="max@beispiel.de"
                          />
                          <IconMailFilled size={18} className="absolute left-3 top-3.5 text-gray-400" />
                        </div>
                        {errors.email && (
                          <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Betreff *</label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className={`${inputClass} ${errors.subject ? 'border-red-500 focus:ring-red-500' : ''}`}
                      >
                        <option value="">Bitte wählen Sie ein Thema...</option>
                        <option value="membership">🎫 Mitgliedschaft</option>
                        <option value="training">⚽ Training & Spielbetrieb</option>
                        <option value="youth">👦 Jugendabteilung</option>
                        <option value="sponsors">🤝 Sponsoring & Partner</option>
                        <option value="events">🎉 Veranstaltungen</option>
                        <option value="general">💬 Allgemeine Anfrage</option>
                      </select>
                      {errors.subject && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.subject}</p>
                      )}
                    </div>

                    <div>
                      <label className={labelClass}>
                        Ihre Nachricht * 
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                          (mindestens 10 Zeichen)
                        </span>
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className={`${inputClass} resize-none ${errors.message ? 'border-red-500 focus:ring-red-500' : ''}`}
                        placeholder="Ihre Nachricht an uns..."
                      />
                      {errors.message && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.message}</p>
                      )}
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {formData.message.length}/2000 Zeichen
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || submitted}
                      className="w-full py-4 px-6 rounded-xl font-bold text-lg bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 text-white dark:text-gray-900 hover:shadow-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      <span className="flex items-center justify-center">
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white dark:border-gray-900 mr-2"></div>
                            Wird gesendet...
                          </>
                        ) : submitted ? (
                          <>
                            <IconCheck size={24} className="mr-2" />
                            Nachricht wurde gesendet!
                          </>
                        ) : (
                          <>
                            <IconSend size={24} className="mr-2" />
                            Nachricht absenden
                          </>
                        )}
                      </span>
                    </button>
                  </form>
                </div>
              </div>
            </AnimatedSection>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Persons */}
              {contacts && contacts.length > 0 && (
                <AnimatedSection animation="slideUp" immediate={true}>
                  <div className={cardClass}>
                    <div className={headerClass}>
                      <h3 className="text-lg font-bold text-white dark:text-gray-900">
                        Ansprechpartner
                      </h3>
                    </div>
                    
                    <div className="border-b border-gray-200 dark:border-gray-700">
                      <div className="flex overflow-x-auto">
                        {Object.keys(groupedContacts).map((key) => (
                          <button
                            key={key}
                            onClick={() => setActiveContactTab(key)}
                            className={`px-4 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                              activeContactTab === key
                                ? 'border-b-2 border-viktoria-blue dark:border-viktoria-yellow text-viktoria-blue dark:text-viktoria-yellow'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                          >
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 max-h-96 overflow-y-auto">
                      <div className="space-y-3">
                        {groupedContacts[activeContactTab as keyof typeof groupedContacts]?.map((contact) => (
                          <div key={contact.id} className="bg-gray-50 dark:bg-viktoria-dark rounded-lg p-3 hover:shadow-md transition-all">
                            <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-1">
                              {contact.role || contact.title}
                            </h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-2">
                              {contact.name}
                            </p>
                            <div className="space-y-1">
                              {contact.email && (
                                <a href={`mailto:${contact.email}`} className="flex items-center space-x-2 text-xs text-viktoria-blue dark:text-viktoria-yellow hover:underline break-all">
                                  <IconMail size={14} />
                                  <span>{contact.email}</span>
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                        {(!groupedContacts[activeContactTab as keyof typeof groupedContacts] || 
                          groupedContacts[activeContactTab as keyof typeof groupedContacts].length === 0) && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                            Keine Kontakte verfügbar
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              )}

              {/* Social Media */}
              {socialMedia && socialMedia.length > 0 && (
                <AnimatedSection animation="slideUp" immediate={true}>
                  <div className={cardClass}>
                    <div className={headerClass}>
                      <h3 className="text-lg font-bold text-white dark:text-gray-900">
                        Folge uns
                      </h3>
                    </div>
                    <div className="p-4 space-y-2">
                      {socialMedia.map((platform) => (
                        <a
                          key={platform.name}
                          href={platform.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between bg-gray-50 dark:bg-viktoria-dark hover:bg-gray-100 dark:hover:bg-viktoria-dark-lighter p-3 rounded-xl transition-all group"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-viktoria-blue/10 dark:bg-viktoria-yellow/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                              <span className="text-viktoria-blue dark:text-viktoria-yellow">
                                {getSocialIcon(platform.icon)}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900 dark:text-white">
                                {platform.name}
                              </p>
                              {platform.followers && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {platform.followers} Follower
                                </p>
                              )}
                            </div>
                          </div>
                          <span className="text-viktoria-blue dark:text-viktoria-yellow">→</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </AnimatedSection>
              )}
            </div>
          </div>

          {/* Map Section */}
          <AnimatedSection animation="fadeIn" immediate={true} className="mt-8">
            <div className={cardClass}>
              <div className={headerClass}>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white dark:text-gray-900">
                    So finden Sie uns
                  </h3>
                  <div className="flex items-center space-x-2">
                    <IconMapPinFilled size={20} className="text-white dark:text-gray-900" />
                    <span className="text-sm text-white/90 dark:text-gray-800">Sportplatz Wertheim</span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <MapComponent 
                  latitude={49.782061720014944} 
                  longitude={9.503044869865722}
                  title="SV Viktoria Wertheim - Sportplatz"
                  address="Haslocher Weg 85, 97877 Wertheim"
                />
                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                  <a 
                    href={`https://maps.google.com/?q=49.782061720014944,9.503044869865722`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-viktoria-blue dark:bg-viktoria-yellow text-white dark:text-gray-900 rounded-lg hover:shadow-lg transition-all text-sm font-medium"
                  >
                    <IconMapPin size={18} className="mr-2" />
                    In Google Maps öffnen
                  </a>
                  <a 
                    href={`https://www.google.com/maps/dir/?api=1&destination=49.782061720014944,9.503044869865722`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gray-600 dark:bg-gray-700 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
                  >
                    Route planen →
                  </a>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </PageLayout>
  )
}