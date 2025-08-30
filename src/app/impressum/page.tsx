import React from 'react'
import PageLayout from '@/components/PageLayout'
import AnimatedSection from '@/components/AnimatedSection'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Impressum - SV Viktoria Wertheim',
  description: 'Impressum und rechtliche Angaben des SV Viktoria Wertheim 1921 e.V.'
}

export default function ImpressumPage() {
  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-viktoria-dark pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <AnimatedSection animation="fadeIn" className="mb-8" immediate={true}>
            <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden">
              <div className="border-b-2 border-viktoria-blue dark:border-viktoria-yellow px-4 py-2 text-center">
                <h1 className="text-gray-900 dark:text-white font-semibold text-sm">
                  Impressum
                </h1>
              </div>
            </div>
          </AnimatedSection>

          {/* Content */}
          <AnimatedSection animation="slideUp" delay={0.1} immediate={true}>
            <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 space-y-6">
                {/* Angaben gemäß § 5 TMG */}
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    Angaben gemäß § 5 TMG
                  </h2>
                  <div className="text-gray-700 dark:text-gray-300 space-y-1">
                    <p className="font-semibold">SV Viktoria Wertheim 1921 e.V.</p>
                    <p>Haslocher Weg 85</p>
                    <p>97877 Wertheim</p>
                  </div>
                </section>

                {/* Vertreten durch */}
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    Vertreten durch den Vorstand
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
                    <div>
                      <p className="font-medium">1. Vorsitzender:</p>
                      <p>Fabian Väthröder</p>
                    </div>
                    <div>
                      <p className="font-medium">2. Vorsitzender:</p>
                      <p>Christian Först</p>
                    </div>
                    <div>
                      <p className="font-medium">Kassenwart:</p>
                      <p>Tobias Mittag</p>
                    </div>
                    <div>
                      <p className="font-medium">Spielausschussvorsitzender:</p>
                      <p>Kevin Niedens</p>
                    </div>
                    <div>
                      <p className="font-medium">Jugendleiter:</p>
                      <p>Christian Först</p>
                    </div>
                    <div>
                      <p className="font-medium">Schriftführer:</p>
                      <p>Eduard Helfenstein</p>
                    </div>
                  </div>
                </section>

                {/* Kontakt */}
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    Kontakt
                  </h2>
                  <div className="text-gray-700 dark:text-gray-300 space-y-1">
                    <p>E-Mail: info@viktoria-wertheim.de</p>
                    <p>Telefon: +49 9342 1234</p>
                  </div>
                </section>

                {/* Registereintrag */}
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    Registereintrag
                  </h2>
                  <div className="text-gray-700 dark:text-gray-300 space-y-1">
                    <p>Eingetragen im Vereinsregister</p>
                    <p>Registergericht: Amtsgericht Wertheim</p>
                    <p>Registernummer: 306</p>
                  </div>
                </section>

                {/* Verantwortlich für den Inhalt */}
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    Verantwortlich für den Inhalt der Spielberichte
                  </h2>
                  <div className="text-gray-700 dark:text-gray-300 space-y-1">
                    <p>Gregor Scheurich</p>
                    <p>Lange Str. 44</p>
                    <p>97877 Wertheim</p>
                  </div>
                </section>

                {/* Haftungsausschluss */}
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    Haftungsausschluss
                  </h2>
                  <div className="text-gray-700 dark:text-gray-300 space-y-3">
                    <div>
                      <h3 className="font-semibold mb-1">Haftung für Inhalte</h3>
                      <p className="text-sm">
                        Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. 
                        Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte 
                        können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind 
                        wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach 
                        den allgemeinen Gesetzen verantwortlich.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-1">Haftung für Links</h3>
                      <p className="text-sm">
                        Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren 
                        Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden 
                        Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten 
                        Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten 
                        verantwortlich.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-1">Urheberrecht</h3>
                      <p className="text-sm">
                        Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen 
                        Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, 
                        Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der 
                        Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des 
                        jeweiligen Autors bzw. Erstellers.
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </PageLayout>
  )
}