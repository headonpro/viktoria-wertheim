import React from 'react'
import PageLayout from '@/components/PageLayout'
import AnimatedSection from '@/components/AnimatedSection'
import { Metadata } from 'next'
import { 
  IconShield, 
  IconUser, 
  IconDatabase, 
  IconScale, 
  IconUserCheck, 
  IconCookie, 
  IconTrash, 
  IconMail, 
  IconGlobe, 
  IconEdit,
  IconFileText,
  IconChevronRight
} from '@tabler/icons-react'

export const metadata: Metadata = {
  title: 'Datenschutz - SV Viktoria Wertheim',
  description: 'Datenschutzerklärung des SV Viktoria Wertheim 1921 e.V.'
}

export default function DatenschutzPage() {
  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-viktoria-dark pt-20 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Page Header */}
          <AnimatedSection animation="fadeIn" className="mb-8" immediate={true}>
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-viktoria-dark-light dark:to-viktoria-dark-lighter rounded-xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 px-6 py-4">
                <div className="flex items-center space-x-3">
                  <IconShield size={28} className="text-white dark:text-gray-900" />
                  <h1 className="text-2xl sm:text-3xl font-bold text-white dark:text-gray-900">
                    Datenschutzerklärung
                  </h1>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 dark:text-gray-400 text-center text-lg">
                  Informationen zur Verarbeitung Ihrer personenbezogenen Daten
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Datenschutz Überblick */}
            <AnimatedSection animation="slideUp" delay={0.1} immediate={true}>
              <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
                <div className="bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <IconShield size={20} className="text-white dark:text-gray-900" />
                    <h2 className="text-lg font-bold text-white dark:text-gray-900 uppercase tracking-wider">
                      Datenschutz auf einen Blick
                    </h2>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit 
                    Ihren personenbezogenen Daten passiert, wenn Sie unsere Website besuchen. 
                    Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert 
                    werden können.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            {/* Verantwortlicher */}
            <AnimatedSection animation="slideUp" delay={0.2} immediate={true}>
              <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
                <div className="bg-gradient-to-r from-viktoria-blue-light to-viktoria-blue dark:from-yellow-600 dark:to-viktoria-yellow px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <IconUser size={20} className="text-white dark:text-gray-900" />
                    <h2 className="text-lg font-bold text-white dark:text-gray-900 uppercase tracking-wider">
                      Verantwortlicher
                    </h2>
                  </div>
                </div>
                <div className="p-6">
                  <div className="bg-viktoria-blue/5 dark:bg-viktoria-yellow/10 rounded-lg p-4">
                    <p className="font-semibold text-viktoria-blue dark:text-viktoria-yellow text-sm mb-2">
                      Verantwortlich für die Datenverarbeitung:
                    </p>
                    <div className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
                      <p className="font-medium">SV Viktoria Wertheim 1921 e.V.</p>
                      <p>Ingrid Scheurich</p>
                      <p>Haslocher Weg 85</p>
                      <p>97877 Wertheim</p>
                      <div className="pt-2">
                        <a 
                          href="mailto:ingrid-s@web.de" 
                          className="inline-flex items-center space-x-2 text-viktoria-blue dark:text-viktoria-yellow hover:underline"
                        >
                          <IconMail size={16} />
                          <span className="font-medium">ingrid-s@web.de</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Datenerfassung */}
            <AnimatedSection animation="slideUp" delay={0.3} immediate={true} className="lg:col-span-2">
              <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <IconDatabase size={20} className="text-white dark:text-gray-900" />
                    <h2 className="text-lg font-bold text-white dark:text-gray-900 uppercase tracking-wider">
                      Datenerfassung auf unserer Website
                    </h2>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 dark:bg-viktoria-dark rounded-lg p-4">
                      <h3 className="font-semibold text-viktoria-blue dark:text-viktoria-yellow mb-3 text-sm">
                        Welche Daten werden erfasst?
                      </h3>
                      <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                        <li>Personenstammdaten</li>
                        <li>Kontaktdaten</li>
                        <li>Inhaltsdaten</li>
                        <li>Nutzungsdaten</li>
                        <li>Meta-/Kommunikationsdaten</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 dark:bg-viktoria-dark rounded-lg p-4">
                      <h3 className="font-semibold text-viktoria-blue dark:text-viktoria-yellow mb-3 text-sm">
                        Wie erfassen wir Ihre Daten?
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        Durch Ihre Mitteilung (z.B. Kontaktformular) oder automatisch beim Website-Besuch 
                        durch unsere IT-Systeme.
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-viktoria-dark rounded-lg p-4">
                      <h3 className="font-semibold text-viktoria-blue dark:text-viktoria-yellow mb-3 text-sm">
                        Wofür nutzen wir Ihre Daten?
                      </h3>
                      <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                        <li>Online-Angebot bereitstellen</li>
                        <li>Kontaktanfragen beantworten</li>
                        <li>Sicherheitsmaßnahmen</li>
                        <li>Reichweitenmessung</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Rechtsgrundlagen */}
            <AnimatedSection animation="slideUp" delay={0.4} immediate={true}>
              <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="bg-gradient-to-r from-viktoria-blue-light to-viktoria-blue dark:from-yellow-600 dark:to-viktoria-yellow px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <IconScale size={20} className="text-white dark:text-gray-900" />
                    <h2 className="text-lg font-bold text-white dark:text-gray-900 uppercase tracking-wider">
                      Rechtsgrundlagen
                    </h2>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                    Die Verarbeitung personenbezogener Daten erfolgt auf Basis folgender Rechtsgrundlagen:
                  </p>
                  <div className="bg-viktoria-blue/5 dark:bg-viktoria-yellow/10 rounded-lg p-4">
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-viktoria-blue dark:bg-viktoria-yellow rounded-full"></div>
                        <span>Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-viktoria-blue dark:bg-viktoria-yellow rounded-full"></div>
                        <span>Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-viktoria-blue dark:bg-viktoria-yellow rounded-full"></div>
                        <span>Art. 6 Abs. 1 lit. f DSGVO (Berechtigte Interessen)</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-viktoria-blue dark:bg-viktoria-yellow rounded-full"></div>
                        <span>Art. 6 Abs. 1 lit. c DSGVO (Rechtliche Verpflichtung)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Ihre Rechte */}
            <AnimatedSection animation="slideUp" delay={0.5} immediate={true}>
              <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <IconUserCheck size={20} className="text-white dark:text-gray-900" />
                    <h2 className="text-lg font-bold text-white dark:text-gray-900 uppercase tracking-wider">
                      Ihre Rechte
                    </h2>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm font-semibold text-viktoria-blue dark:text-viktoria-yellow mb-4">
                    Sie haben folgende Rechte:
                  </p>
                  <div className="space-y-2">
                    {[
                      'Recht auf Auskunft',
                      'Recht auf Berichtigung',
                      'Recht auf Löschung',
                      'Recht auf Einschränkung',
                      'Recht auf Datenübertragbarkeit',
                      'Recht auf Widerspruch',
                      'Recht auf Widerruf'
                    ].map((recht, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                        <IconChevronRight size={14} className="text-viktoria-blue dark:text-viktoria-yellow" />
                        <span>{recht}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 bg-viktoria-blue/5 dark:bg-viktoria-yellow/10 rounded-lg p-3">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Detaillierte Themen - Kollabierbar */}
            <AnimatedSection animation="slideUp" delay={0.6} immediate={true} className="lg:col-span-2">
              <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="bg-gradient-to-r from-viktoria-blue-light to-viktoria-blue dark:from-yellow-600 dark:to-viktoria-yellow px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <IconFileText size={20} className="text-white dark:text-gray-900" />
                    <h2 className="text-lg font-bold text-white dark:text-gray-900 uppercase tracking-wider">
                      Detaillierte Informationen
                    </h2>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    
                    {/* Cookies */}
                    <details className="group">
                      <summary className="cursor-pointer list-none">
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-viktoria-dark rounded-lg hover:bg-gray-100 dark:hover:bg-viktoria-dark-lighter transition-colors">
                          <div className="flex items-center space-x-3">
                            <IconCookie size={18} className="text-viktoria-blue dark:text-viktoria-yellow" />
                            <span className="font-medium text-gray-900 dark:text-white">
                              Cookies
                            </span>
                          </div>
                          <IconChevronRight size={16} className="text-gray-400 group-open:rotate-90 transition-transform" />
                        </div>
                      </summary>
                      <div className="mt-2 p-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed space-y-2">
                        <p>Unsere Website verwendet Cookies - kleine Textdateien, die Ihr Browser speichert.</p>
                        <p>Einige Cookies sind &quot;Session-Cookies&quot;, die nach Ende Ihrer Browser-Sitzung automatisch gelöscht werden.</p>
                        <p>Sie können Ihren Browser entsprechend konfigurieren, um Cookies zu kontrollieren.</p>
                      </div>
                    </details>

                    {/* Speicherdauer */}
                    <details className="group">
                      <summary className="cursor-pointer list-none">
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-viktoria-dark rounded-lg hover:bg-gray-100 dark:hover:bg-viktoria-dark-lighter transition-colors">
                          <div className="flex items-center space-x-3">
                            <IconTrash size={18} className="text-viktoria-blue dark:text-viktoria-yellow" />
                            <span className="font-medium text-gray-900 dark:text-white">
                              Speicherdauer und Datenlöschung
                            </span>
                          </div>
                          <IconChevronRight size={16} className="text-gray-400 group-open:rotate-90 transition-transform" />
                        </div>
                      </summary>
                      <div className="mt-2 p-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed space-y-2">
                        <p>Wir speichern Ihre Daten nur so lange wie erforderlich oder gesetzlich vorgeschrieben.</p>
                        <p>Nach Wegfall des Speicherungszwecks werden Daten routinemäßig gelöscht oder gesperrt.</p>
                        <div className="bg-viktoria-blue/10 dark:bg-viktoria-yellow/20 rounded p-2 mt-3">
                          <p className="font-medium text-viktoria-blue dark:text-viktoria-yellow text-xs">
                            Überprüfung erfolgt alle 3 Jahre
                          </p>
                        </div>
                      </div>
                    </details>

                    {/* Kontaktaufnahme */}
                    <details className="group">
                      <summary className="cursor-pointer list-none">
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-viktoria-dark rounded-lg hover:bg-gray-100 dark:hover:bg-viktoria-dark-lighter transition-colors">
                          <div className="flex items-center space-x-3">
                            <IconMail size={18} className="text-viktoria-blue dark:text-viktoria-yellow" />
                            <span className="font-medium text-gray-900 dark:text-white">
                              Kontaktaufnahme
                            </span>
                          </div>
                          <IconChevronRight size={16} className="text-gray-400 group-open:rotate-90 transition-transform" />
                        </div>
                      </summary>
                      <div className="mt-2 p-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed space-y-2">
                        <p>Bei Kontakt per E-Mail oder Formular speichern wir Ihre Daten zur Bearbeitung Ihrer Anfrage.</p>
                        <p>Verarbeitung erfolgt auf Basis von Art. 6 Abs. 1 lit. b DSGVO bei vertraglichen Anfragen.</p>
                        <div className="bg-viktoria-blue/10 dark:bg-viktoria-yellow/20 rounded p-2 mt-3">
                          <p className="font-medium text-viktoria-blue dark:text-viktoria-yellow text-xs">
                            Anfragen werden alle 2 Jahre überprüft
                          </p>
                        </div>
                      </div>
                    </details>

                    {/* Drittländer */}
                    <details className="group">
                      <summary className="cursor-pointer list-none">
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-viktoria-dark rounded-lg hover:bg-gray-100 dark:hover:bg-viktoria-dark-lighter transition-colors">
                          <div className="flex items-center space-x-3">
                            <IconGlobe size={18} className="text-viktoria-blue dark:text-viktoria-yellow" />
                            <span className="font-medium text-gray-900 dark:text-white">
                              Übermittlung in Drittländer
                            </span>
                          </div>
                          <IconChevronRight size={16} className="text-gray-400 group-open:rotate-90 transition-transform" />
                        </div>
                      </summary>
                      <div className="mt-2 p-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        <p>Übermittlung in Drittländer erfolgt nur mit entsprechender Erlaubnis und unter Beachtung strenger Datenschutzrichtlinien. Wir stellen ein angemessenes Datenschutzniveau sicher.</p>
                      </div>
                    </details>

                    {/* Änderungen */}
                    <details className="group">
                      <summary className="cursor-pointer list-none">
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-viktoria-dark rounded-lg hover:bg-gray-100 dark:hover:bg-viktoria-dark-lighter transition-colors">
                          <div className="flex items-center space-x-3">
                            <IconEdit size={18} className="text-viktoria-blue dark:text-viktoria-yellow" />
                            <span className="font-medium text-gray-900 dark:text-white">
                              Änderung der Datenschutzerklärung
                            </span>
                          </div>
                          <IconChevronRight size={16} className="text-gray-400 group-open:rotate-90 transition-transform" />
                        </div>
                      </summary>
                      <div className="mt-2 p-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        <p>Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den aktuellen rechtlichen Anforderungen entspricht. Für Ihren erneuten Besuch gilt dann die neue Datenschutzerklärung.</p>
                      </div>
                    </details>

                  </div>
                </div>
              </div>
            </AnimatedSection>
            
          </div>

          {/* Footer Note */}
          <AnimatedSection animation="slideUp" delay={0.7} className="mt-8" immediate={true}>
            <div className="bg-gradient-to-br from-viktoria-blue/5 to-viktoria-blue/10 dark:from-viktoria-yellow/10 dark:to-viktoria-yellow/20 rounded-xl p-6 border border-viktoria-blue/20 dark:border-viktoria-yellow/30">
              <div className="flex items-start space-x-3">
                <IconEdit size={24} className="text-viktoria-blue dark:text-viktoria-yellow flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-viktoria-blue dark:text-viktoria-yellow mb-2">
                    Stand der Datenschutzerklärung
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Diese Datenschutzerklärung entspricht dem Stand vom Januar 2025. Änderungen vorbehalten.
                    Bei Fragen kontaktieren Sie uns bitte über die angegebenen Kontaktdaten.
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