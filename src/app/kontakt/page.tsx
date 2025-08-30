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
  IconUser,
  IconUsers,
  IconSend,
  IconCheck
} from '@tabler/icons-react'

export default function ContactPage() {
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

  // Mock-Daten für Kontakte
  const contacts = {
    general: {
      title: 'Geschäftsstelle',
      name: 'SV Viktoria Wertheim 1921 e.V.',
      address: 'Sportplatzweg 1, 97877 Wertheim',
      phone: '+49 9342 1234',
      email: 'info@viktoria-wertheim.de',
      hours: 'Mo-Fr: 16:00-18:00 Uhr'
    },
    chairman: {
      title: '1. Vorsitzender',
      name: 'Michael Weber',
      phone: '+49 172 1234567',
      email: 'vorsitzender@viktoria-wertheim.de'
    },
    sports: {
      title: 'Sportlicher Leiter',
      name: 'Thomas Müller',
      phone: '+49 171 2345678',
      email: 'sport@viktoria-wertheim.de'
    },
    youth: {
      title: 'Jugendleiter',
      name: 'Stefan Schmidt',
      phone: '+49 173 3456789',
      email: 'jugend@viktoria-wertheim.de'
    },
    treasurer: {
      title: 'Kassenwart',
      name: 'Andreas Klein',
      phone: '+49 174 4567890',
      email: 'kasse@viktoria-wertheim.de'
    }
  }

  const socialMedia = [
    { icon: <IconBrandFacebook size={24} />, name: 'Facebook', url: '#', followers: '2.3k' },
    { icon: <IconBrandInstagram size={24} />, name: 'Instagram', url: '#', followers: '1.8k' },
    { icon: <IconBrandYoutube size={24} />, name: 'YouTube', url: '#', followers: '500' }
  ]

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
                      <option value="tickets">Tickets/Dauerkarten</option>
                      <option value="sponsoring">Sponsoring/Werbung</option>
                      <option value="youth">Jugendabteilung</option>
                      <option value="general">Allgemeine Anfrage</option>
                      <option value="feedback">Feedback/Vorschlag</option>
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
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-viktoria-dark border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-viktoria-blue dark:focus:ring-viktoria-yellow text-gray-900 dark:text-white resize-none"
                    />
                  </div>

                  <div className="flex justify-center">
                    <button
                      type="submit"
                      disabled={submitted}
                      className={`px-6 py-2 rounded-lg transition-all font-medium ${
                        submitted
                          ? 'bg-green-600 text-white'
                          : 'bg-viktoria-yellow hover:bg-yellow-500 text-viktoria-blue'
                      }`}
                    >
                      {submitted ? (
                        <>
                          <IconCheck size={20} className="mr-2" />
                          Nachricht gesendet!
                        </>
                      ) : (
                        <>
                          <IconSend size={20} className="mr-2" />
                          Nachricht senden
                        </>
                      )}
                    </button>
                  </div>
                  </form>
                </div>
              </div>
            </AnimatedSection>

            {/* Sidebar with Contact Info */}
            <div className="space-y-6">
              {/* General Contact */}
              <AnimatedSection animation="slideUp" delay={0.2} immediate={true}>
                <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden">
                  <div className="border-b-2 border-viktoria-blue dark:border-viktoria-yellow px-4 py-2 text-center">
                    <h3 className="text-gray-900 dark:text-white font-semibold text-sm">
                      {contacts.general.title}
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <IconMapPin size={20} className="text-viktoria-blue dark:text-viktoria-yellow mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white font-semibold">
                          {contacts.general.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {contacts.general.address}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <IconPhone size={20} className="text-viktoria-blue dark:text-viktoria-yellow" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {contacts.general.phone}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <IconMail size={20} className="text-viktoria-blue dark:text-viktoria-yellow" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {contacts.general.email}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <IconClock size={20} className="text-viktoria-blue dark:text-viktoria-yellow" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {contacts.general.hours}
                      </p>
                    </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* Social Media */}
              <AnimatedSection animation="slideUp" delay={0.3} immediate={true}>
                <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden">
                  <div className="border-b-2 border-viktoria-blue dark:border-viktoria-yellow px-4 py-2 text-center">
                    <h3 className="text-gray-900 dark:text-white font-semibold text-sm">
                      Folgen Sie uns
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-3">
                    {socialMedia.map((social, index) => (
                      <a
                        key={index}
                        href={social.url}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-viktoria-dark rounded-lg hover:bg-gray-100 dark:hover:bg-viktoria-dark-lighter transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="text-viktoria-blue dark:text-viktoria-yellow">
                            {social.icon}
                          </div>
                          <span className="text-gray-900 dark:text-white font-medium">
                            {social.name}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {social.followers}
                        </span>
                      </a>
                    ))}
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>

          {/* Contact Persons */}
          <AnimatedSection animation="slideUp" delay={0.4} className="mt-8" immediate={true}>
            <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden">
              <div className="border-b-2 border-viktoria-blue dark:border-viktoria-yellow px-4 py-2 text-center">
                <h2 className="text-gray-900 dark:text-white font-semibold text-sm">
                  Ihre Ansprechpartner
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(contacts).slice(1).map(([key, contact]) => (
                  <div key={key} className="bg-gray-50 dark:bg-viktoria-dark rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <IconUser size={20} className="text-viktoria-blue dark:text-viktoria-yellow" />
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {contact.title}
                      </h4>
                    </div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {contact.name}
                    </p>
                    <div className="space-y-1">
                      <a href={`tel:${contact.phone}`} className="text-xs text-gray-600 dark:text-gray-400 hover:text-viktoria-blue dark:hover:text-viktoria-yellow block">
                        {contact.phone}
                      </a>
                      <a href={`mailto:${contact.email}`} className="text-xs text-gray-600 dark:text-gray-400 hover:text-viktoria-blue dark:hover:text-viktoria-yellow block break-all">
                        {contact.email}
                      </a>
                    </div>
                  </div>
                ))}
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Map Section */}
          <AnimatedSection animation="slideUp" delay={0.5} className="mt-8" immediate={true}>
            <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden">
              <div className="border-b-2 border-viktoria-blue dark:border-viktoria-yellow px-4 py-2 text-center">
                <h2 className="text-gray-900 dark:text-white font-semibold text-sm">
                  Anfahrt
                </h2>
              </div>
              <div className="p-6">
                <p className="text-gray-600 dark:text-gray-400 text-center">
                  So finden Sie zu unserem Sportgelände:
                </p>
              </div>
              
              {/* Map Placeholder */}
              <div className="h-96 bg-gray-200 dark:bg-viktoria-dark relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <IconMapPin size={48} className="text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      Interaktive Karte
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                      Sportplatzweg 1, 97877 Wertheim
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gray-50 dark:bg-viktoria-dark">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Mit dem Auto</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      A3 Ausfahrt Wertheim, dann B27 Richtung Stadtmitte, Beschilderung "Sportplatz" folgen
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Parkplätze</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      150 kostenlose Parkplätze direkt am Sportgelände verfügbar
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Öffentliche Verkehrsmittel</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Buslinie 8 bis Haltestelle "Sportplatz", 5 Min. Fußweg
                    </p>
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