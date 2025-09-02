'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  IconX, 
  IconPhone, 
  IconMail, 
  IconBriefcase,
  IconCurrencyEuro,
  IconStar,
  IconCheck,
  IconSend
} from '@tabler/icons-react'

interface SponsorModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SponsorModal({ isOpen, onClose }: SponsorModalProps) {
  const [formData, setFormData] = useState({
    company: '',
    contactPerson: '',
    email: '',
    phone: '',
    packageType: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  
  // TODO: Sponsorenpakete sind gerade in Entwicklung - Modal temporär deaktiviert
  // Frühzeitiges Return um Modal komplett auszublenden
  if (true) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ company: '', contactPerson: '', email: '', phone: '', packageType: '', message: '' })
      onClose()
    }, 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const sponsorPackages = [
    {
      name: 'Premium Partner',
      price: 'ab 5.000€/Jahr',
      benefits: [
        'Logo auf allen Trikots der 1. Mannschaft',
        'Große Bandenwerbung am Hauptplatz',
        'Logo auf Website und allen Drucksachen',
        'VIP-Karten für alle Heimspiele',
        'Exklusive Sponsoren-Events'
      ],
      icon: <IconStar className="text-viktoria-yellow" size={24} />
    },
    {
      name: 'Gold Partner',
      price: 'ab 2.500€/Jahr',
      benefits: [
        'Logo auf Trainingsanzügen',
        'Mittlere Bandenwerbung',
        'Logo auf Website',
        'Dauerkarten für 2 Personen',
        'Einladung zu Vereinsveranstaltungen'
      ],
      icon: <IconCurrencyEuro className="text-yellow-600" size={24} />
    },
    {
      name: 'Silber Partner',
      price: 'ab 1.000€/Jahr',
      benefits: [
        'Kleine Bandenwerbung',
        'Logo auf Website',
        'Dauerkarte für 1 Person',
        'Vereinszeitschrift-Anzeige'
      ],
      icon: <IconBriefcase className="text-gray-400" size={24} />
    }
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-4xl md:w-full md:max-h-[90vh] bg-white dark:bg-viktoria-dark-light rounded-xl shadow-2xl overflow-hidden z-50"
          >
            {/* Header */}
            <div className="bg-white dark:bg-viktoria-dark-light">
              <div className="border-b-2 border-viktoria-blue dark:border-viktoria-yellow px-6 py-4 flex items-center justify-between">
                <h2 className="text-gray-900 dark:text-white font-semibold text-lg">Sponsor werden</h2>
                <button
                  onClick={onClose}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  aria-label="Schließen"
                >
                  <IconX size={24} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="p-6">
                {/* Intro Text */}
                <div className="mb-6">
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Werden Sie Teil der SV Viktoria Wertheim Familie! Als Sponsor unterstützen Sie nicht nur unseren Verein, 
                    sondern profitieren auch von attraktiven Werbemöglichkeiten und einem starken Netzwerk in der Region.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    Mit über 500 aktiven Mitgliedern und durchschnittlich 300 Zuschauern bei Heimspielen erreichen Sie 
                    eine breite Zielgruppe in Wertheim und Umgebung.
                  </p>
                </div>

                {/* Sponsor Packages */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Unsere Sponsoring-Pakete</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {sponsorPackages.map((pkg, index) => (
                      <div key={index} className="bg-gray-50 dark:bg-viktoria-dark rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-900 dark:text-white">{pkg.name}</h4>
                          {pkg.icon}
                        </div>
                        <p className="text-viktoria-blue dark:text-viktoria-yellow font-bold mb-3">{pkg.price}</p>
                        <ul className="space-y-2">
                          {pkg.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                              <IconCheck size={16} className="text-green-600 dark:text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Form */}
                <div className="bg-gray-50 dark:bg-viktoria-dark rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Kontaktieren Sie uns</h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Firma *
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 bg-white dark:bg-viktoria-dark-light border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-viktoria-blue dark:focus:ring-viktoria-yellow text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Ansprechpartner *
                        </label>
                        <input
                          type="text"
                          name="contactPerson"
                          value={formData.contactPerson}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 bg-white dark:bg-viktoria-dark-light border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-viktoria-blue dark:focus:ring-viktoria-yellow text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          className="w-full px-4 py-2 bg-white dark:bg-viktoria-dark-light border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-viktoria-blue dark:focus:ring-viktoria-yellow text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Telefon
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-2 bg-white dark:bg-viktoria-dark-light border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-viktoria-blue dark:focus:ring-viktoria-yellow text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Interesse an Paket
                      </label>
                      <select
                        name="packageType"
                        value={formData.packageType}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-white dark:bg-viktoria-dark-light border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-viktoria-blue dark:focus:ring-viktoria-yellow text-gray-900 dark:text-white"
                      >
                        <option value="">Bitte wählen...</option>
                        <option value="premium">Premium Partner (ab 5.000€/Jahr)</option>
                        <option value="gold">Gold Partner (ab 2.500€/Jahr)</option>
                        <option value="silber">Silber Partner (ab 1.000€/Jahr)</option>
                        <option value="individual">Individuelles Angebot</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nachricht
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-2 bg-white dark:bg-viktoria-dark-light border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-viktoria-blue dark:focus:ring-viktoria-yellow text-gray-900 dark:text-white resize-none"
                        placeholder="Teilen Sie uns Ihre Vorstellungen oder Fragen mit..."
                      />
                    </div>

                    <div className="flex justify-between items-center pt-4">
                      {/* Direct Contact Info */}
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <p className="font-medium mb-1">Oder kontaktieren Sie uns direkt:</p>
                        <div className="flex items-center space-x-1">
                          <IconPhone size={16} />
                          <span>+49 9342 1234</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <IconMail size={16} />
                          <span>sponsoring@viktoria-wertheim.de</span>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={submitted}
                        className={`px-6 py-2 rounded-lg transition-all font-medium flex items-center ${
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
                            Anfrage senden
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Additional Info */}
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-900 dark:text-blue-300">
                    <strong>Hinweis:</strong> Alle Sponsoring-Beiträge sind als Spende steuerlich absetzbar. 
                    Gerne stellen wir Ihnen eine entsprechende Spendenquittung aus.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}