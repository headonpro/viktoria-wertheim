import React from 'react'
import PageLayout from '@/components/PageLayout'
import AnimatedSection from '@/components/AnimatedSection'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Datenschutz - SV Viktoria Wertheim',
  description: 'Datenschutzerklärung des SV Viktoria Wertheim 1921 e.V.'
}

export default function DatenschutzPage() {
  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-viktoria-dark pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <AnimatedSection animation="fadeIn" className="mb-8" immediate={true}>
            <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden">
              <div className="border-b-2 border-viktoria-blue dark:border-viktoria-yellow px-4 py-2 text-center">
                <h1 className="text-gray-900 dark:text-white font-semibold text-sm">
                  Datenschutzerklärung
                </h1>
              </div>
            </div>
          </AnimatedSection>

          {/* Content */}
          <AnimatedSection animation="slideUp" delay={0.1} immediate={true}>
            <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 space-y-6">
                {/* Einleitung */}
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    1. Datenschutz auf einen Blick
                  </h2>
                  <div className="text-gray-700 dark:text-gray-300 space-y-3">
                    <p className="text-sm">
                      Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit 
                      Ihren personenbezogenen Daten passiert, wenn Sie unsere Website besuchen. 
                      Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert 
                      werden können.
                    </p>
                  </div>
                </section>

                {/* Verantwortlicher */}
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    2. Verantwortlicher
                  </h2>
                  <div className="text-gray-700 dark:text-gray-300 space-y-1">
                    <p className="font-semibold">Verantwortlich für die Datenverarbeitung:</p>
                    <p>SV Viktoria Wertheim 1921 e.V.</p>
                    <p>Ingrid Scheurich</p>
                    <p>Haslocher Weg 85</p>
                    <p>97877 Wertheim</p>
                    <p>E-Mail: ingrid-s@web.de</p>
                  </div>
                </section>

                {/* Datenerfassung */}
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    3. Datenerfassung auf unserer Website
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Welche Daten werden erfasst?
                      </h3>
                      <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                        <li>Personenstammdaten (Namen, Adressen)</li>
                        <li>Kontaktdaten</li>
                        <li>Inhaltsdaten (Texte, Fotografien, Videos)</li>
                        <li>Nutzungsdaten</li>
                        <li>Meta-/Kommunikationsdaten</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Wie erfassen wir Ihre Daten?
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. 
                        Hierbei kann es sich z.B. um Daten handeln, die Sie in ein Kontaktformular eingeben. 
                        Andere Daten werden automatisch beim Besuch der Website durch unsere IT-Systeme erfasst.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Wofür nutzen wir Ihre Daten?
                      </h3>
                      <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                        <li>Bereitstellung unseres Online-Angebotes</li>
                        <li>Beantwortung von Kontaktanfragen</li>
                        <li>Sicherheitsmaßnahmen</li>
                        <li>Reichweitenmessung/Marketing</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Rechtsgrundlagen */}
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    4. Rechtsgrundlagen
                  </h2>
                  <div className="text-gray-700 dark:text-gray-300 space-y-2">
                    <p className="text-sm">
                      Die Verarbeitung personenbezogener Daten erfolgt auf Basis der folgenden Rechtsgrundlagen:
                    </p>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      <li>Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)</li>
                      <li>Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)</li>
                      <li>Art. 6 Abs. 1 lit. f DSGVO (Berechtigte Interessen)</li>
                      <li>Art. 6 Abs. 1 lit. c DSGVO (Rechtliche Verpflichtung)</li>
                    </ul>
                  </div>
                </section>

                {/* Ihre Rechte */}
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    5. Ihre Rechte als Betroffener
                  </h2>
                  <div className="text-gray-700 dark:text-gray-300 space-y-2">
                    <p className="text-sm font-semibold">Sie haben folgende Rechte:</p>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      <li>Recht auf Auskunft über Ihre gespeicherten Daten</li>
                      <li>Recht auf Berichtigung unrichtiger Daten</li>
                      <li>Recht auf Löschung Ihrer Daten</li>
                      <li>Recht auf Einschränkung der Verarbeitung</li>
                      <li>Recht auf Datenübertragbarkeit</li>
                      <li>Recht auf Widerspruch gegen die Verarbeitung</li>
                      <li>Recht auf Widerruf erteilter Einwilligungen</li>
                    </ul>
                    <p className="text-sm mt-3">
                      Sie haben zudem das Recht, sich bei einer Datenschutz-Aufsichtsbehörde 
                      über die Verarbeitung Ihrer personenbezogenen Daten durch uns zu beschweren.
                    </p>
                  </div>
                </section>

                {/* Cookies */}
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    6. Cookies
                  </h2>
                  <div className="text-gray-700 dark:text-gray-300 space-y-3">
                    <p className="text-sm">
                      Unsere Website verwendet Cookies. Das sind kleine Textdateien, die Ihr 
                      Webbrowser auf Ihrem Endgerät speichert. Cookies helfen uns dabei, unser 
                      Angebot nutzerfreundlicher, effektiver und sicherer zu machen.
                    </p>
                    <p className="text-sm">
                      Einige Cookies sind "Session-Cookies", die nach Ende Ihrer Browser-Sitzung 
                      automatisch gelöscht werden. Hingegen bleiben andere Cookies auf Ihrem 
                      Endgerät bestehen, bis Sie diese selbst löschen.
                    </p>
                    <p className="text-sm">
                      Sie können Ihren Browser so einstellen, dass Sie über das Setzen von 
                      Cookies informiert werden und Cookies nur im Einzelfall erlauben, die 
                      Annahme von Cookies für bestimmte Fälle oder generell ausschließen.
                    </p>
                  </div>
                </section>

                {/* Datenlöschung */}
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    7. Speicherdauer und Datenlöschung
                  </h2>
                  <div className="text-gray-700 dark:text-gray-300 space-y-2">
                    <p className="text-sm">
                      Wir verarbeiten und speichern Ihre personenbezogenen Daten nur für den 
                      Zeitraum, der zur Erreichung des Speicherungszwecks erforderlich ist oder 
                      sofern dies durch den Europäischen Richtlinien- und Verordnungsgeber oder 
                      einen anderen Gesetzgeber in Gesetzen oder Vorschriften vorgesehen wurde.
                    </p>
                    <p className="text-sm">
                      Entfällt der Speicherungszweck oder läuft eine vorgeschriebene Speicherfrist 
                      ab, werden die personenbezogenen Daten routinemäßig und entsprechend den 
                      gesetzlichen Vorschriften gesperrt oder gelöscht.
                    </p>
                    <p className="text-sm">
                      Die Überprüfung erfolgt alle 3 Jahre.
                    </p>
                  </div>
                </section>

                {/* Kontaktaufnahme */}
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    8. Kontaktaufnahme
                  </h2>
                  <div className="text-gray-700 dark:text-gray-300 space-y-2">
                    <p className="text-sm">
                      Bei Ihrer Kontaktaufnahme mit uns per E-Mail oder über ein Kontaktformular 
                      werden die von Ihnen mitgeteilten Daten (Ihre E-Mail-Adresse, ggf. Ihr Name 
                      und Ihre Telefonnummer) von uns gespeichert, um Ihre Fragen zu beantworten.
                    </p>
                    <p className="text-sm">
                      Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, 
                      sofern Ihre Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder 
                      zur Durchführung vorvertraglicher Maßnahmen erforderlich ist.
                    </p>
                    <p className="text-sm">
                      Die in diesem Zusammenhang anfallenden Daten löschen wir, nachdem die 
                      Speicherung nicht mehr erforderlich ist, oder schränken die Verarbeitung 
                      ein, falls gesetzliche Aufbewahrungspflichten bestehen.
                    </p>
                    <p className="text-sm">
                      Anfragen werden alle 2 Jahre überprüft.
                    </p>
                  </div>
                </section>

                {/* Drittländer */}
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    9. Übermittlung in Drittländer
                  </h2>
                  <div className="text-gray-700 dark:text-gray-300 space-y-2">
                    <p className="text-sm">
                      Eine Übermittlung von Daten in Drittländer erfolgt nur mit entsprechender 
                      Erlaubnis und unter Beachtung strenger Datenschutzrichtlinien. Sollte eine 
                      Übermittlung stattfinden, stellen wir sicher, dass ein angemessenes 
                      Datenschutzniveau gewährleistet ist.
                    </p>
                  </div>
                </section>

                {/* Änderungen */}
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    10. Änderung der Datenschutzerklärung
                  </h2>
                  <div className="text-gray-700 dark:text-gray-300 space-y-2">
                    <p className="text-sm">
                      Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie 
                      stets den aktuellen rechtlichen Anforderungen entspricht oder um Änderungen 
                      unserer Leistungen in der Datenschutzerklärung umzusetzen. Für Ihren 
                      erneuten Besuch gilt dann die neue Datenschutzerklärung.
                    </p>
                  </div>
                </section>

                {/* Stand */}
                <section className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Stand: Januar 2025
                  </p>
                </section>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </PageLayout>
  )
}