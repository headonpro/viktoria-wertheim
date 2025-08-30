'use client'

import React, { useState } from 'react'
import PageLayout from '@/components/PageLayout'
import AnimatedSection from '@/components/AnimatedSection'
import { 
  IconPhone, 
  IconMail, 
  IconMapPin, 
  IconClock,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandYoutube,
  IconSend,
  IconCheck,
  IconUser,
  IconUsers,
  IconBuildingCommunity,
  IconMapPinFilled,
  IconClockFilled,
  IconMailFilled,
  IconPhoneFilled
} from '@tabler/icons-react'

interface Contact {
  id: string
  role: string
  title: string
  name: string
  department: string | null
  phone: string
  email: string
  order: number
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
  followers: string
}

interface ContactPageClientProps {
  contacts: Contact[]
  generalInfo: GeneralInfo
  socialMedia: SocialMedia[]
}

export default function ContactPageClient({ contacts, generalInfo, socialMedia }: ContactPageClientProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [activeContactTab, setActiveContactTab] = useState('vorstand')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const getSocialIcon = (icon: string) => {
    switch(icon) {
      case 'facebook': return <IconBrandFacebook size={24} />
      case 'instagram': return <IconBrandInstagram size={24} />
      case 'youtube': return <IconBrandYoutube size={24} />
      default: return null
    }
  }

  // Group contacts by department
  const groupedContacts = {
    vorstand: contacts.filter(c => c.department === 'Vorstand' || c.title.includes('Vorsitzender') || c.title.includes('Kassenwart') || c.title.includes('Schriftführer')),
    sport: contacts.filter(c => c.department === 'Sport' || c.title.includes('Trainer') || c.title.includes('Sportlich')),
    jugend: contacts.filter(c => c.department === 'Jugend' || c.title.includes('Jugend')),
    verwaltung: contacts.filter(c => c.department === 'Verwaltung' || c.title.includes('Platzwart') || c.title.includes('Pressewart') || c.title === 'Geschäftsstelle')
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-viktoria-dark dark:to-viktoria-dark-light pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Hero Section */}
          <AnimatedSection animation="fadeIn" immediate={true}>
            <div className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-viktoria-dark-light dark:to-viktoria-dark-lighter rounded-3xl shadow-2xl mb-12">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5 dark:opacity-10">
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-viktoria-blue dark:bg-viktoria-yellow"></div>
                <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full bg-viktoria-blue-light dark:bg-yellow-600"></div>
              </div>
              
              {/* Header */}
              <div className="relative bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 p-8 sm:p-12">
                <div className="flex flex-col sm:flex-row items-center justify-between">
                  <div className="text-center sm:text-left mb-4 sm:mb-0">
                    <h1 className="text-3xl sm:text-5xl font-bold text-white dark:text-gray-900 mb-2">
                      Kontakt
                    </h1>
                    <p className="text-lg text-white/90 dark:text-gray-800">
                      Wir sind für Sie da - persönlich und digital
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white/20 dark:bg-black/20 backdrop-blur rounded-xl p-3 text-center">
                      <IconPhone size={24} className="text-white dark:text-gray-900 mx-auto mb-1" />
                      <p className="text-xs text-white/90 dark:text-gray-800">Telefon</p>
                    </div>
                    <div className="bg-white/20 dark:bg-black/20 backdrop-blur rounded-xl p-3 text-center">
                      <IconMail size={24} className="text-white dark:text-gray-900 mx-auto mb-1" />
                      <p className="text-xs text-white/90 dark:text-gray-800">E-Mail</p>
                    </div>
                    <div className="bg-white/20 dark:bg-black/20 backdrop-blur rounded-xl p-3 text-center">
                      <IconMapPin size={24} className="text-white dark:text-gray-900 mx-auto mb-1" />
                      <p className="text-xs text-white/90 dark:text-gray-800">Vor Ort</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Contact Info */}
              <div className="relative p-6 sm:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  <div className="bg-white dark:bg-viktoria-dark-lighter rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-viktoria-blue/10 dark:bg-viktoria-yellow/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconBuildingCommunity size={20} className="text-viktoria-blue dark:text-viktoria-yellow" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">Geschäftsstelle</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          SV Viktoria Wertheim<br />
                          {generalInfo.address}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-viktoria-dark-lighter rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-viktoria-blue/10 dark:bg-viktoria-yellow/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconClockFilled size={20} className="text-viktoria-blue dark:text-viktoria-yellow" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">Öffnungszeiten</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {generalInfo.hours}<br />
                          Sa: Nach Vereinbarung
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-viktoria-dark-lighter rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-viktoria-blue/10 dark:bg-viktoria-yellow/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconPhoneFilled size={20} className="text-viktoria-blue dark:text-viktoria-yellow" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">Hotline</h3>
                        <a href="tel:+49 9342 1234" className="text-xs text-viktoria-blue dark:text-viktoria-yellow hover:underline">
                          +49 9342 1234
                        </a>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Mo-Fr: 16-18 Uhr</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Contact Form - Takes 2 columns on desktop */}
            <AnimatedSection animation="slideUp" immediate={true} className="lg:col-span-2">
              <div className="bg-white dark:bg-viktoria-dark-light rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 px-6 py-4">
                  <h2 className="text-xl font-bold text-white dark:text-gray-900">
                    Nachricht senden
                  </h2>
                </div>
                <div className="p-6 sm:p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Ihr Name *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-viktoria-dark border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-viktoria-blue dark:focus:ring-viktoria-yellow text-gray-900 dark:text-white transition-all"
                            placeholder="Max Mustermann"
                          />
                          <IconUser size={18} className="absolute left-3 top-3.5 text-gray-400" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          E-Mail-Adresse *
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-viktoria-dark border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-viktoria-blue dark:focus:ring-viktoria-yellow text-gray-900 dark:text-white transition-all"
                            placeholder="max@beispiel.de"
                          />
                          <IconMailFilled size={18} className="absolute left-3 top-3.5 text-gray-400" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Betreff *
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-viktoria-dark border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-viktoria-blue dark:focus:ring-viktoria-yellow text-gray-900 dark:text-white transition-all"
                      >
                        <option value="">Bitte wählen Sie ein Thema...</option>
                        <option value="membership">🎫 Mitgliedschaft</option>
                        <option value="training">⚽ Training & Spielbetrieb</option>
                        <option value="youth">👦 Jugendabteilung</option>
                        <option value="sponsors">🤝 Sponsoring & Partner</option>
                        <option value="events">🎉 Veranstaltungen</option>
                        <option value="general">💬 Allgemeine Anfrage</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Ihre Nachricht *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-viktoria-dark border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-viktoria-blue dark:focus:ring-viktoria-yellow text-gray-900 dark:text-white transition-all resize-none"
                        placeholder="Ihre Nachricht an uns..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitted}
                      className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] ${
                        submitted
                          ? 'bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 text-white dark:text-gray-900'
                          : 'bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 hover:shadow-lg text-white dark:text-gray-900'
                      }`}
                    >
                      {submitted ? (
                        <span className="flex items-center justify-center">
                          <IconCheck size={24} className="mr-2" />
                          Nachricht wurde gesendet!
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <IconSend size={24} className="mr-2" />
                          Nachricht absenden
                        </span>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </AnimatedSection>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Persons */}
              <AnimatedSection animation="slideUp" immediate={true}>
                <div className="bg-white dark:bg-viktoria-dark-light rounded-2xl shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 px-6 py-4">
                    <h3 className="text-lg font-bold text-white dark:text-gray-900">
                      Ansprechpartner
                    </h3>
                  </div>
                  
                  {/* Tabs */}
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
                          {key === 'vorstand' && 'Vorstand'}
                          {key === 'sport' && 'Sport'}
                          {key === 'jugend' && 'Jugend'}
                          {key === 'verwaltung' && 'Verwaltung'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 max-h-96 overflow-y-auto">
                    <div className="space-y-3">
                      {groupedContacts[activeContactTab as keyof typeof groupedContacts]?.map((contact) => (
                        <div key={contact.id} className="bg-gray-50 dark:bg-viktoria-dark rounded-lg p-3 hover:shadow-md transition-all">
                          <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-1">
                            {contact.title}
                          </h4>
                          <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-2">
                            {contact.name}
                          </p>
                          <div className="space-y-1">
                            {contact.phone && (
                              <a href={`tel:${contact.phone}`} className="flex items-center space-x-2 text-xs text-viktoria-blue dark:text-viktoria-yellow hover:underline">
                                <IconPhone size={14} />
                                <span>{contact.phone}</span>
                              </a>
                            )}
                            {contact.email && (
                              <a href={`mailto:${contact.email}`} className="flex items-center space-x-2 text-xs text-viktoria-blue dark:text-viktoria-yellow hover:underline break-all">
                                <IconMail size={14} />
                                <span>{contact.email}</span>
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* Social Media */}
              <AnimatedSection animation="slideUp" immediate={true}>
                <div className="bg-white dark:bg-viktoria-dark-light rounded-2xl shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 px-6 py-4">
                    <h3 className="text-lg font-bold text-white dark:text-gray-900">
                      Folge uns
                    </h3>
                  </div>
                  <div className="p-4 space-y-2">
                    {socialMedia.map((platform) => (
                      <a
                        key={platform.name}
                        href={platform.url}
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
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {platform.followers} Follower
                            </p>
                          </div>
                        </div>
                        <span className="text-viktoria-blue dark:text-viktoria-yellow">→</span>
                      </a>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>

          {/* Map Section */}
          <AnimatedSection animation="fadeIn" immediate={true} className="mt-8">
            <div className="bg-white dark:bg-viktoria-dark-light rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 px-6 py-4">
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
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-viktoria-dark dark:to-viktoria-dark-lighter h-96 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <IconMapPin size={48} className="text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 font-medium">
                      Interaktive Karte wird geladen...
                    </p>
                    <a 
                      href={`https://maps.google.com/?q=${encodeURIComponent('SV Viktoria Wertheim Sportplatz')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center mt-4 px-4 py-2 bg-viktoria-blue dark:bg-viktoria-yellow text-white dark:text-gray-900 rounded-lg hover:shadow-lg transition-all"
                    >
                      In Google Maps öffnen →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </PageLayout>
  )
}