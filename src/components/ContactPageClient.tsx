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
  IconCheck
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

  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-viktoria-dark pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <AnimatedSection animation="fadeIn" className="mb-8" immediate={true}>
            <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden">
              <div className="border-b-2 border-viktoria-blue dark:border-viktoria-yellow px-4 py-2 text-center">
                <h1 className="text-gray-900 dark:text-white font-semibold text-sm">
                  Kontakt
                </h1>
              </div>
              <div className="p-6">
                <p className="text-gray-600 dark:text-gray-400 text-center">
                  Nehmen Sie Kontakt mit uns auf - wir freuen uns auf Ihre Nachricht!
                </p>
              </div>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Contact Form */}
            <AnimatedSection animation="slideUp" delay={0.1} className="lg:col-span-2" immediate={true}>
              <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden">
                <div className="border-b-2 border-viktoria-blue dark:border-viktoria-yellow px-4 py-2 text-center">
                  <h2 className="text-gray-900 dark:text-white font-semibold text-sm">
                    Nachricht senden
                  </h2>
                </div>
                <div className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 bg-gray-50 dark:bg-viktoria-dark border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-viktoria-blue dark:focus:ring-viktoria-yellow text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          E-Mail *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 bg-gray-50 dark:bg-viktoria-dark border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-viktoria-blue dark:focus:ring-viktoria-yellow text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Betreff *
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-viktoria-dark border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-viktoria-blue dark:focus:ring-viktoria-yellow text-gray-900 dark:text-white"
                      >
                        <option value="">Bitte wählen...</option>
                        <option value="membership">Mitgliedschaft</option>
                        <option value="training">Training</option>
                        <option value="youth">Jugend</option>
                        <option value="sponsors">Sponsoring</option>
                        <option value="general">Allgemeine Anfrage</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nachricht *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-viktoria-dark border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-viktoria-blue dark:focus:ring-viktoria-yellow text-gray-900 dark:text-white"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitted}
                      className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                        submitted
                          ? 'bg-green-500 text-white'
                          : 'bg-viktoria-yellow hover:bg-yellow-500 text-viktoria-blue'
                      }`}
                    >
                      {submitted ? (
                        <span className="flex items-center justify-center">
                          <IconCheck size={20} className="mr-2" />
                          Nachricht gesendet!
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <IconSend size={20} className="mr-2" />
                          Nachricht senden
                        </span>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </AnimatedSection>

            {/* Contact Info Sidebar */}
            <div className="space-y-6">
              {/* General Info */}
              <AnimatedSection animation="slideUp" delay={0.2}>
                <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden">
                  <div className="border-b-2 border-viktoria-blue dark:border-viktoria-yellow px-4 py-2 text-center">
                    <h3 className="text-gray-900 dark:text-white font-semibold text-sm">
                      Geschäftsstelle
                    </h3>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-start space-x-3">
                      <IconMapPin size={20} className="text-viktoria-blue dark:text-viktoria-yellow mt-1" />
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white">
                          SV Viktoria Wertheim 1921 e.V.
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {generalInfo.address}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <IconClock size={20} className="text-viktoria-blue dark:text-viktoria-yellow mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Öffnungszeiten
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {generalInfo.hours}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* Contact Persons */}
              <AnimatedSection animation="slideUp" delay={0.3}>
                <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden">
                  <div className="border-b-2 border-viktoria-blue dark:border-viktoria-yellow px-4 py-2 text-center">
                    <h3 className="text-gray-900 dark:text-white font-semibold text-sm">
                      Ansprechpartner
                    </h3>
                  </div>
                  <div className="p-4 space-y-4">
                    {contacts.map((contact) => (
                      <div key={contact.id} className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-3 last:pb-0">
                        <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
                          {contact.title}
                        </h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {contact.name}
                        </p>
                        {contact.phone && (
                          <a href={`tel:${contact.phone}`} className="flex items-center space-x-1 text-sm text-viktoria-blue dark:text-viktoria-yellow hover:underline">
                            <IconPhone size={14} />
                            <span>{contact.phone}</span>
                          </a>
                        )}
                        {contact.email && (
                          <a href={`mailto:${contact.email}`} className="flex items-center space-x-1 text-sm text-viktoria-blue dark:text-viktoria-yellow hover:underline">
                            <IconMail size={14} />
                            <span>{contact.email}</span>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>

              {/* Social Media */}
              <AnimatedSection animation="slideUp" delay={0.4}>
                <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden">
                  <div className="border-b-2 border-viktoria-blue dark:border-viktoria-yellow px-4 py-2 text-center">
                    <h3 className="text-gray-900 dark:text-white font-semibold text-sm">
                      Soziale Medien
                    </h3>
                  </div>
                  <div className="p-4 space-y-3">
                    {socialMedia.map((platform) => (
                      <a
                        key={platform.name}
                        href={platform.url}
                        className="flex items-center justify-between hover:bg-gray-50 dark:hover:bg-viktoria-dark p-2 rounded-lg transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-viktoria-blue dark:text-viktoria-yellow">
                            {getSocialIcon(platform.icon)}
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {platform.name}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {platform.followers} Follower
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>

          {/* Map Section */}
          <AnimatedSection animation="fadeIn" delay={0.5} className="mt-8">
            <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden">
              <div className="border-b-2 border-viktoria-blue dark:border-viktoria-yellow px-4 py-2 text-center">
                <h3 className="text-gray-900 dark:text-white font-semibold text-sm">
                  Anfahrt
                </h3>
              </div>
              <div className="p-4">
                <div className="bg-gray-200 dark:bg-viktoria-dark h-96 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    Karte wird hier angezeigt
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </PageLayout>
  )
}