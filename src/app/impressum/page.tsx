import React from 'react'
import PageLayout from '@/components/PageLayout'
import AnimatedSection from '@/components/AnimatedSection'
import { Metadata } from 'next'
import { 
  IconBuilding,
  IconUsers,
  IconMail,
  IconPhone,
  IconScale,
  IconFileText,
  IconShieldCheck,
  IconMapPin,
  IconUserCheck,
  IconRegistered,
  IconChevronRight
} from '@tabler/icons-react'

export const metadata: Metadata = {
  title: 'Impressum - SV Viktoria Wertheim',
  description: 'Impressum und rechtliche Angaben des SV Viktoria Wertheim 2000 e.V.'
}

export default function ImpressumPage() {
  const vorstandsmitglieder = [
    { rolle: '1. Vorsitzender', name: 'Fabian Väthröder', icon: <IconUserCheck size={20} /> },
    { rolle: '2. Vorsitzender', name: 'Christian Först', icon: <IconUsers size={20} /> },
    { rolle: 'Schatzmeister', name: 'Thomas Merlein', icon: <IconScale size={20} /> },
    { rolle: 'Spielausschußvorsitzender', name: 'Kevin Niedens', icon: <IconUsers size={20} /> },
    { rolle: 'Jugendleiter', name: 'Christian Först', icon: <IconUsers size={20} /> },
    { rolle: 'Schriftführer', name: 'Eduard Helfenstein', icon: <IconFileText size={20} /> }
  ]

  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-viktoria-dark pt-20 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <AnimatedSection animation="fadeIn" className="mb-8" immediate={true}>
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-viktoria-dark-light dark:to-viktoria-dark-lighter rounded-xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 px-6 py-4">
                <div className="flex items-center space-x-3">
                  <IconScale size={28} className="text-white dark:text-gray-900" />
                  <h1 className="text-2xl sm:text-3xl font-bold text-white dark:text-gray-900">
                    Impressum
                  </h1>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 dark:text-gray-400 text-center text-lg">
                  Rechtliche Angaben gemäß § 5 TMG
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Angaben gemäß § 5 TMG */}
            <AnimatedSection animation="slideUp" delay={0.1} immediate={true}>
              <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
                <div className="bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <IconBuilding size={20} className="text-white dark:text-gray-900" />
                    <h2 className="text-lg font-bold text-white dark:text-gray-900 uppercase tracking-wider">
                      Vereinsangaben
                    </h2>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-viktoria-dark rounded-lg p-4">
                      <p className="font-bold text-viktoria-blue dark:text-viktoria-yellow text-lg mb-2">
                        SV Viktoria Wertheim 2000 e.V.
                      </p>
                      <div className="flex items-start space-x-2 text-gray-700 dark:text-gray-300">
                        <IconMapPin size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p>Haslocher Weg 85</p>
                          <p>97877 Wertheim</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-viktoria-dark rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <IconRegistered size={18} className="text-viktoria-blue dark:text-viktoria-yellow" />
                        <h3 className="font-semibold text-gray-900 dark:text-white">Registereintrag</h3>
                      </div>
                      <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1 pl-6">
                        <p>Vereinsregister beim Amtsgericht Wertheim</p>
                        <p className="font-medium">Registernummer: 306</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Kontakt */}
            <AnimatedSection animation="slideUp" delay={0.2} immediate={true}>
              <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
                <div className="bg-gradient-to-r from-viktoria-blue-light to-viktoria-blue dark:from-yellow-600 dark:to-viktoria-yellow px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <IconPhone size={20} className="text-white dark:text-gray-900" />
                    <h2 className="text-lg font-bold text-white dark:text-gray-900 uppercase tracking-wider">
                      Kontakt
                    </h2>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <a 
                      href="mailto:info@viktoria-wertheim.de"
                      className="group block bg-gray-50 dark:bg-viktoria-dark rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-viktoria-dark-lighter transition-all duration-300"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-viktoria-blue/10 dark:bg-viktoria-yellow/20 rounded-lg group-hover:scale-110 transition-transform">
                          <IconMail size={20} className="text-viktoria-blue dark:text-viktoria-yellow" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">E-Mail</p>
                          <p className="font-medium text-gray-900 dark:text-white group-hover:text-viktoria-blue dark:group-hover:text-viktoria-yellow transition-colors">
                            info@viktoria-wertheim.de
                          </p>
                        </div>
                      </div>
                    </a>
                    
                    <div className="block bg-gray-50 dark:bg-viktoria-dark rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-viktoria-blue/10 dark:bg-viktoria-yellow/20 rounded-lg">
                          <IconPhone size={20} className="text-viktoria-blue dark:text-viktoria-yellow" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Telefon</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            -
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-viktoria-blue/5 dark:bg-viktoria-yellow/10 rounded-lg p-4 border border-viktoria-blue/20 dark:border-viktoria-yellow/30">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Geschäftsstelle</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Mo-Fr 16:00-18:00 Uhr
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Vorstand */}
            <AnimatedSection animation="slideUp" delay={0.3} immediate={true} className="lg:col-span-2">
              <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <IconUsers size={20} className="text-white dark:text-gray-900" />
                    <h2 className="text-lg font-bold text-white dark:text-gray-900 uppercase tracking-wider">
                      Vorstand
                    </h2>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {vorstandsmitglieder.map((mitglied, index) => (
                      <div 
                        key={index}
                        className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-viktoria-dark dark:to-viktoria-dark-lighter rounded-lg p-4 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="text-viktoria-blue dark:text-viktoria-yellow mt-0.5">
                            {mitglied.icon}
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium uppercase tracking-wider mb-1">
                              {mitglied.rolle}
                            </p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {mitglied.name}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Verantwortlich für Spielberichte */}
            <AnimatedSection animation="slideUp" delay={0.4} immediate={true}>
              <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="bg-gradient-to-r from-viktoria-blue-light to-viktoria-blue dark:from-yellow-600 dark:to-viktoria-yellow px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <IconFileText size={20} className="text-white dark:text-gray-900" />
                    <h2 className="text-lg font-bold text-white dark:text-gray-900 uppercase tracking-wider">
                      Spielberichte
                    </h2>
                  </div>
                </div>
                <div className="p-6">
                  <div className="bg-gray-50 dark:bg-viktoria-dark rounded-lg p-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-medium uppercase tracking-wider mb-2">
                      Verantwortlich für den Inhalt
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white mb-2">
                      Christian Först
                    </p>
                    <div className="flex items-start space-x-2 text-sm text-gray-700 dark:text-gray-300">
                      <IconMapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p>Haslocher Weg 85</p>
                        <p>97877 Wertheim</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Haftungsausschluss */}
            <AnimatedSection animation="slideUp" delay={0.5} immediate={true} className="lg:col-span-1">
              <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <IconShieldCheck size={20} className="text-white dark:text-gray-900" />
                    <h2 className="text-lg font-bold text-white dark:text-gray-900 uppercase tracking-wider">
                      Rechtliches
                    </h2>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <details className="group">
                      <summary className="cursor-pointer list-none">
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-viktoria-dark rounded-lg hover:bg-gray-100 dark:hover:bg-viktoria-dark-lighter transition-colors">
                          <span className="font-medium text-gray-900 dark:text-white text-sm">
                            Haftung für Inhalte
                          </span>
                          <IconChevronRight size={16} className="text-gray-400 group-open:rotate-90 transition-transform" />
                        </div>
                      </summary>
                      <div className="mt-2 p-3 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                        Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. 
                        Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte 
                        können wir jedoch keine Gewähr übernehmen.
                      </div>
                    </details>
                    
                    <details className="group">
                      <summary className="cursor-pointer list-none">
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-viktoria-dark rounded-lg hover:bg-gray-100 dark:hover:bg-viktoria-dark-lighter transition-colors">
                          <span className="font-medium text-gray-900 dark:text-white text-sm">
                            Haftung für Links
                          </span>
                          <IconChevronRight size={16} className="text-gray-400 group-open:rotate-90 transition-transform" />
                        </div>
                      </summary>
                      <div className="mt-2 p-3 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                        Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren 
                        Inhalte wir keinen Einfluss haben. Für die Inhalte der verlinkten 
                        Seiten ist stets der jeweilige Anbieter verantwortlich.
                      </div>
                    </details>
                    
                    <details className="group">
                      <summary className="cursor-pointer list-none">
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-viktoria-dark rounded-lg hover:bg-gray-100 dark:hover:bg-viktoria-dark-lighter transition-colors">
                          <span className="font-medium text-gray-900 dark:text-white text-sm">
                            Urheberrecht
                          </span>
                          <IconChevronRight size={16} className="text-gray-400 group-open:rotate-90 transition-transform" />
                        </div>
                      </summary>
                      <div className="mt-2 p-3 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                        Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen 
                        Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung 
                        bedarf der schriftlichen Zustimmung.
                      </div>
                    </details>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Footer Note */}
          <AnimatedSection animation="slideUp" delay={0.6} className="mt-8" immediate={true}>
            <div className="bg-gradient-to-br from-viktoria-blue/5 to-viktoria-blue/10 dark:from-viktoria-yellow/10 dark:to-viktoria-yellow/20 rounded-xl p-6 border border-viktoria-blue/20 dark:border-viktoria-yellow/30">
              <div className="flex items-start space-x-3">
                <IconScale size={24} className="text-viktoria-blue dark:text-viktoria-yellow flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-viktoria-blue dark:text-viktoria-yellow mb-2">
                    Stand der Angaben
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Alle Angaben entsprechen dem Stand vom Januar 2025. Änderungen vorbehalten.
                    Bei Fragen zu diesen rechtlichen Angaben kontaktieren Sie uns bitte über die angegebenen Kontaktdaten.
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