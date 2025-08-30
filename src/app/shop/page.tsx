'use client'

import React from 'react'
import PageLayout from '@/components/PageLayout'
import AnimatedSection from '@/components/AnimatedSection'
import { IconShoppingCart, IconShirt, IconBallFootball, IconBell, IconMail } from '@tabler/icons-react'

export default function ShopPage() {
  const [email, setEmail] = React.useState('')
  const [subscribed, setSubscribed] = React.useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setTimeout(() => setSubscribed(false), 3000)
      setEmail('')
    }
  }

  // Mock-Daten für kommende Produkte
  const comingProducts = [
    { icon: <IconShirt size={40} />, name: 'Trikots', description: 'Original Spielertrikots in allen Größen' },
    { icon: <IconBallFootball size={40} />, name: 'Fanartikel', description: 'Schals, Mützen, Fahnen und mehr' },
    { icon: <IconShoppingCart size={40} />, name: 'Merchandise', description: 'T-Shirts, Hoodies, Taschen' },
  ]

  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-viktoria-dark pt-20 pb-8 flex items-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {/* Coming Soon Card */}
          <AnimatedSection animation="fadeIn" className="mb-8" immediate={true}>
            <div className="bg-white dark:bg-viktoria-dark-light rounded-2xl shadow-2xl overflow-hidden">
              {/* Header with Gradient */}
              <div className="bg-gradient-to-r from-viktoria-blue via-viktoria-blue-light to-viktoria-blue dark:from-viktoria-yellow dark:via-yellow-500 dark:to-yellow-600 p-8 text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-white dark:bg-viktoria-dark rounded-full mb-4">
                  <IconShoppingCart size={48} className="text-viktoria-blue dark:text-viktoria-yellow" />
                </div>
                <h1 className="text-4xl font-bold text-white dark:text-viktoria-blue mb-2">
                  Fanshop
                </h1>
                <p className="text-xl text-white/90 dark:text-viktoria-blue/90">
                  Bald verfügbar!
                </p>
              </div>

              {/* Content */}
              <div className="p-8">
                {/* Coming Soon Message */}
                <AnimatedSection animation="slideUp" delay={0.1} className="text-center mb-8" immediate={true}>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Unser Online-Shop wird gerade entwickelt
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Schon bald können Sie hier offizielle Vereinsartikel, Trikots und Fanartikel 
                    des SV Viktoria Wertheim bequem online bestellen. Wir arbeiten mit Hochdruck 
                    an unserem neuen Fanshop!
                  </p>
                </AnimatedSection>

                {/* Product Preview */}
                <AnimatedSection animation="slideUp" delay={0.2} className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
                    Was Sie erwarten können:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {comingProducts.map((product, index) => (
                      <AnimatedSection
                        key={index}
                        animation="slideUp"
                        delay={0.1 * (index + 3)}
                        className="text-center"
                      >
                        <div className="bg-gray-50 dark:bg-viktoria-dark rounded-xl p-6 hover:shadow-lg transition-shadow">
                          <div className="inline-flex items-center justify-center w-16 h-16 bg-viktoria-blue/10 dark:bg-viktoria-yellow/10 rounded-full mb-4">
                            <div className="text-viktoria-blue dark:text-viktoria-yellow">
                              {product.icon}
                            </div>
                          </div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                            {product.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {product.description}
                          </p>
                        </div>
                      </AnimatedSection>
                    ))}
                  </div>
                </AnimatedSection>

                {/* Newsletter Signup */}
                <AnimatedSection animation="slideUp" delay={0.5}>
                  <div className="bg-gradient-to-r from-viktoria-blue/5 to-viktoria-blue-light/5 dark:from-viktoria-yellow/5 dark:to-yellow-600/5 rounded-xl p-6">
                    <div className="text-center mb-4">
                      <IconBell size={32} className="inline text-viktoria-blue dark:text-viktoria-yellow mb-2" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Benachrichtigung erhalten
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Seien Sie die Ersten, die erfahren, wenn unser Shop online geht!
                      </p>
                    </div>
                    
                    <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
                      <div className="flex gap-2">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Ihre E-Mail-Adresse"
                          className="flex-1 px-4 py-3 bg-white dark:bg-viktoria-dark border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-viktoria-blue dark:focus:ring-viktoria-yellow text-gray-900 dark:text-white"
                          required
                        />
                        <button
                          type="submit"
                          className="px-6 py-3 bg-viktoria-blue hover:bg-viktoria-blue-light dark:bg-viktoria-yellow dark:hover:bg-yellow-600 text-white dark:text-viktoria-blue rounded-lg transition-colors font-semibold flex items-center"
                        >
                          <IconMail size={20} className="mr-2" />
                          Anmelden
                        </button>
                      </div>
                      {subscribed && (
                        <p className="text-green-600 dark:text-green-400 text-sm mt-2 text-center">
                          ✓ Vielen Dank! Sie werden benachrichtigt, sobald der Shop online ist.
                        </p>
                      )}
                    </form>
                  </div>
                </AnimatedSection>

                {/* Contact Alternative */}
                <AnimatedSection animation="fadeIn" delay={0.6} className="mt-8 text-center">
                  <div className="p-6 bg-gray-50 dark:bg-viktoria-dark rounded-xl">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Sie möchten jetzt schon Fanartikel kaufen?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Besuchen Sie uns im Vereinsheim oder kontaktieren Sie uns direkt!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <a
                        href="/contact"
                        className="px-6 py-3 bg-viktoria-blue hover:bg-viktoria-blue-light dark:bg-viktoria-yellow dark:hover:bg-yellow-600 text-white dark:text-viktoria-blue rounded-lg transition-colors font-semibold inline-block"
                      >
                        Kontakt aufnehmen
                      </a>
                      <div className="px-6 py-3 bg-white dark:bg-viktoria-dark-lighter rounded-lg border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Vereinsheim:</p>
                        <p className="font-semibold text-gray-900 dark:text-white">Di & Do, 19:00-22:00</p>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>

                {/* Launch Timeline */}
                <AnimatedSection animation="slideUp" delay={0.7} className="mt-8">
                  <h3 className="text-center font-semibold text-gray-900 dark:text-white mb-4">
                    Geplanter Launch: Frühjahr 2024
                  </h3>
                  <div className="flex justify-center space-x-2">
                    <div className="w-16 h-2 bg-viktoria-blue dark:bg-viktoria-yellow rounded-full"></div>
                    <div className="w-16 h-2 bg-viktoria-blue dark:bg-viktoria-yellow rounded-full"></div>
                    <div className="w-16 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    <div className="w-16 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                  </div>
                  <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                    50% Fertiggestellt
                  </p>
                </AnimatedSection>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </PageLayout>
  )
}