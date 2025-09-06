'use client'

import React from 'react'
import PageLayout from '@/components/PageLayout'
import AnimatedSection from '@/components/AnimatedSection'
import { 
  IconShoppingCart, 
  IconShirt, 
  IconBallFootball, 
  IconBell, 
  IconMail,
  IconClock,
  IconMapPin,
  IconPhone,
  IconStar,
  IconHeart
} from '@tabler/icons-react'

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

  const comingProducts = [
    { 
      icon: <IconShirt size={32} />, 
      name: 'Trikots', 
      description: 'Original Spielertrikots in allen Größen',
      highlight: 'NEU: Heim & Auswärts',
      available: 'Ab 49,90 €'
    },
    { 
      icon: <IconBallFootball size={32} />, 
      name: 'Fanartikel', 
      description: 'Schals, Mützen, Fahnen und mehr',
      highlight: 'Limitierte Edition',
      available: 'Ab 14,90 €'
    },
    { 
      icon: <IconHeart size={32} />, 
      name: 'Merchandise', 
      description: 'T-Shirts, Hoodies, Taschen',
      highlight: 'Exklusive Designs',
      available: 'Ab 19,90 €'
    },
  ]

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-viktoria-dark dark:to-viktoria-dark-light pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Hero Section */}
          <AnimatedSection animation="fadeIn" immediate={true}>
            <div className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-viktoria-dark-light dark:to-viktoria-dark-lighter rounded-3xl shadow-2xl mb-12">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5 dark:opacity-10">
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-viktoria-blue dark:bg-viktoria-yellow"></div>
                <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full bg-viktoria-blue-light dark:bg-yellow-600"></div>
              </div>
              
              {/* Content */}
              <div className="relative">
                <div className="bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 p-6 sm:p-10">
                  <div className="flex flex-col sm:flex-row items-center justify-between">
                    <div className="text-center sm:text-left mb-4 sm:mb-0">
                      <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/20 dark:bg-black/20 backdrop-blur rounded-full mb-4">
                        <IconShoppingCart size={40} className="text-white dark:text-gray-900" />
                      </div>
                      <h1 className="text-3xl sm:text-5xl font-bold text-white dark:text-gray-900 mb-2">
                        SV Viktoria Fanshop
                      </h1>
                      <p className="text-lg sm:text-xl text-white/90 dark:text-gray-800">
                        Demnächst für Sie verfügbar!
                      </p>
                    </div>
                    <div className="bg-white/20 dark:bg-black/20 backdrop-blur rounded-2xl p-4 sm:p-6">
                      <div className="text-center">
                        <p className="text-white dark:text-gray-900 font-bold text-2xl sm:text-3xl">2026</p>
                        <p className="text-white/80 dark:text-gray-800 text-sm">Launch Jahr</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-10">
                  {/* Status Message */}
                  <AnimatedSection animation="slideUp" delay={0.1}>
                    <div className="bg-viktoria-blue/5 dark:bg-viktoria-yellow/10 rounded-2xl p-6 sm:p-8 mb-8">
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                        🚀 Wir arbeiten mit Hochdruck am neuen Shop!
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 text-center max-w-3xl mx-auto text-sm sm:text-base">
                        Unser Team entwickelt gerade einen modernen Online-Shop, in dem Sie bald alle offiziellen 
                        Vereinsartikel, Trikots und exklusive Fanartikel des SV Viktoria Wertheim bequem von zu Hause 
                        aus bestellen können.
                      </p>
                    </div>
                  </AnimatedSection>

                  {/* Product Preview Cards */}
                  <AnimatedSection animation="slideUp" delay={0.2}>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                      Was Sie im Shop erwarten können
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10">
                      {comingProducts.map((product, index) => (
                        <AnimatedSection
                          key={index}
                          animation="fadeIn"
                          delay={0.1 * (index + 3)}
                        >
                          <div className="group bg-white dark:bg-viktoria-dark-lighter rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 hover:border-viktoria-blue/30 dark:hover:border-viktoria-yellow/30">
                            <div className="flex items-start justify-between mb-4">
                              <div className="w-14 h-14 bg-gradient-to-br from-viktoria-blue/10 to-viktoria-blue-light/10 dark:from-viktoria-yellow/20 dark:to-yellow-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <div className="text-viktoria-blue dark:text-viktoria-yellow">
                                  {product.icon}
                                </div>
                              </div>
                              <span className="text-xs font-bold text-viktoria-blue dark:text-viktoria-yellow bg-viktoria-blue/10 dark:bg-viktoria-yellow/20 px-2 py-1 rounded-full">
                                {product.highlight}
                              </span>
                            </div>
                            <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                              {product.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              {product.description}
                            </p>
                            <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                              <p className="text-sm font-semibold text-viktoria-blue dark:text-viktoria-yellow">
                                {product.available}
                              </p>
                            </div>
                          </div>
                        </AnimatedSection>
                      ))}
                    </div>
                  </AnimatedSection>

                  {/* Newsletter Signup */}
                  <AnimatedSection animation="slideUp" delay={0.5}>
                    <div className="bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 rounded-2xl p-6 sm:p-8 mb-8">
                      <div className="max-w-2xl mx-auto">
                        <div className="text-center mb-6">
                          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 dark:bg-black/20 backdrop-blur rounded-full mb-4">
                            <IconBell size={32} className="text-white dark:text-gray-900" />
                          </div>
                          <h3 className="text-2xl font-bold text-white dark:text-gray-900 mb-2">
                            Als Erster informiert werden!
                          </h3>
                          <p className="text-white/90 dark:text-gray-800">
                            Tragen Sie sich ein und erhalten Sie exklusive Angebote zum Shop-Launch
                          </p>
                        </div>
                        
                        <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
                          <div className="flex flex-col sm:flex-row gap-3">
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="Ihre E-Mail-Adresse"
                              className="flex-1 px-4 py-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur rounded-xl focus:outline-none focus:ring-2 focus:ring-white dark:focus:ring-gray-900 text-gray-900 dark:text-white placeholder-gray-500"
                              required
                            />
                            <button
                              type="submit"
                              className="px-6 py-3 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 text-viktoria-blue dark:text-viktoria-yellow rounded-xl transition-all font-bold flex items-center justify-center shadow-lg hover:shadow-xl"
                            >
                              <IconMail size={20} className="mr-2" />
                              Anmelden
                            </button>
                          </div>
                          {subscribed && (
                            <div className="mt-4 p-3 bg-white/20 dark:bg-black/20 backdrop-blur rounded-xl">
                              <p className="text-white dark:text-gray-900 text-sm text-center font-semibold">
                                ✓ Vielen Dank! Sie werden benachrichtigt, sobald der Shop online ist.
                              </p>
                            </div>
                          )}
                        </form>
                      </div>
                    </div>
                  </AnimatedSection>

                  {/* Contact Cards */}
                  <AnimatedSection animation="fadeIn" delay={0.6}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
                      <div className="bg-white dark:bg-viktoria-dark-lighter rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-viktoria-blue/10 dark:bg-viktoria-yellow/20 rounded-xl flex items-center justify-center flex-shrink-0">
                            <IconMapPin size={24} className="text-viktoria-blue dark:text-viktoria-yellow" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                              Bald im Vereinsheim erhältlich
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              Ab Shop-Launch auch vor Ort verfügbar
                            </p>
                            <div className="space-y-1">
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                <IconClock size={16} className="inline mr-1 text-viktoria-blue dark:text-viktoria-yellow" />
                                Di & Do: 19:00 - 22:00 Uhr
                              </p>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                <IconClock size={16} className="inline mr-1 text-viktoria-blue dark:text-viktoria-yellow" />
                                Sa: 14:00 - 18:00 Uhr
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-viktoria-dark-lighter rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-viktoria-blue/10 dark:bg-viktoria-yellow/20 rounded-xl flex items-center justify-center flex-shrink-0">
                            <IconPhone size={24} className="text-viktoria-blue dark:text-viktoria-yellow" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                              Persönliche Beratung
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              Rufen Sie uns an für Sonderbestellungen
                            </p>
                            <a
                              href="/kontakt"
                              className="inline-flex items-center text-sm font-bold text-viktoria-blue dark:text-viktoria-yellow hover:underline"
                            >
                              Kontakt aufnehmen →
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AnimatedSection>

                  {/* Progress Bar */}
                  <AnimatedSection animation="slideUp" delay={0.7}>
                    <div className="bg-gray-50 dark:bg-viktoria-dark rounded-2xl p-6 text-center">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                        Shop-Entwicklung Fortschritt
                      </h3>
                      <div className="relative">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 rounded-full transition-all duration-1000" style={{ width: '65%' }}></div>
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-gray-600 dark:text-gray-400">
                          <span>Start</span>
                          <span className="font-bold text-viktoria-blue dark:text-viktoria-yellow">65% Complete</span>
                          <span>Launch: Frühjahr 2026</span>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-center space-x-2">
                        <IconStar size={16} className="text-viktoria-yellow" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Premium Qualität • Faire Preise • Schnelle Lieferung
                        </p>
                        <IconStar size={16} className="text-viktoria-yellow" />
                      </div>
                    </div>
                  </AnimatedSection>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </PageLayout>
  )
}