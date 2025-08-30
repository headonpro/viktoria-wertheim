import React from 'react'
import PageLayout from '@/components/PageLayout'
import AnimatedSection from '@/components/AnimatedSection'
import { Metadata } from 'next'
import { 
  IconDownload, 
  IconFileText, 
  IconFileCertificate,
  IconCalendar,
  IconUsers,
  IconBallFootball,
  IconClipboard,
  IconShieldCheck
} from '@tabler/icons-react'

export const metadata: Metadata = {
  title: 'Downloads - SV Viktoria Wertheim',
  description: 'Formulare, Dokumente und wichtige Unterlagen des SV Viktoria Wertheim'
}

export default function DownloadsPage() {
  const downloadCategories = [
    {
      title: 'Mitgliedschaft',
      icon: <IconUsers size={24} />,
      color: 'from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600',
      documents: [
        {
          name: 'Mitgliedsantrag Erwachsene',
          description: 'Antragsformular für Erwachsene ab 18 Jahren',
          size: '245 KB',
          format: 'PDF',
          available: true
        },
        {
          name: 'Mitgliedsantrag Jugend',
          description: 'Antragsformular für Kinder und Jugendliche',
          size: '238 KB',
          format: 'PDF',
          available: true
        },
        {
          name: 'SEPA-Lastschriftmandat',
          description: 'Einzugsermächtigung für Mitgliedsbeiträge',
          size: '156 KB',
          format: 'PDF',
          available: true
        },
        {
          name: 'Kündigung Mitgliedschaft',
          description: 'Formular zur Beendigung der Mitgliedschaft',
          size: '98 KB',
          format: 'PDF',
          available: true
        }
      ]
    },
    {
      title: 'Vereinsdokumente',
      icon: <IconFileCertificate size={24} />,
      color: 'from-viktoria-blue-light to-viktoria-blue dark:from-yellow-600 dark:to-viktoria-yellow',
      documents: [
        {
          name: 'Vereinssatzung',
          description: 'Aktuelle Satzung des SV Viktoria Wertheim',
          size: '456 KB',
          format: 'PDF',
          available: true
        },
        {
          name: 'Beitragsordnung',
          description: 'Übersicht der Mitgliedsbeiträge',
          size: '125 KB',
          format: 'PDF',
          available: true
        },
        {
          name: 'Jugendordnung',
          description: 'Ordnung der Jugendabteilung',
          size: '234 KB',
          format: 'PDF',
          available: true
        },
        {
          name: 'Ehrenordnung',
          description: 'Richtlinien für Ehrungen',
          size: '178 KB',
          format: 'PDF',
          available: true
        }
      ]
    },
    {
      title: 'Spielbetrieb',
      icon: <IconBallFootball size={24} />,
      color: 'from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600',
      documents: [
        {
          name: 'Spielerpass-Antrag',
          description: 'Antrag für neuen Spielerpass',
          size: '189 KB',
          format: 'PDF',
          available: true
        },
        {
          name: 'Vereinswechsel-Formular',
          description: 'Antrag für Vereinswechsel',
          size: '201 KB',
          format: 'PDF',
          available: true
        },
        {
          name: 'Schiedsrichter-Spesen',
          description: 'Abrechnungsformular für Schiedsrichter',
          size: '145 KB',
          format: 'PDF',
          available: true
        }
      ]
    },
    {
      title: 'Spielpläne & Termine',
      icon: <IconCalendar size={24} />,
      color: 'from-viktoria-blue-light to-viktoria-blue dark:from-yellow-600 dark:to-viktoria-yellow',
      documents: [
        {
          name: 'Spielplan 1. Mannschaft',
          description: 'Saison 2024/25 - Kreisliga',
          size: '234 KB',
          format: 'PDF',
          available: true
        },
        {
          name: 'Spielplan 2. Mannschaft',
          description: 'Saison 2024/25 - Kreisklasse A',
          size: '228 KB',
          format: 'PDF',
          available: true
        },
        {
          name: 'Trainingszeiten',
          description: 'Übersicht aller Trainingszeiten',
          size: '156 KB',
          format: 'PDF',
          available: true
        },
        {
          name: 'Jahreskalender 2025',
          description: 'Alle Vereinstermine und Events',
          size: '345 KB',
          format: 'PDF',
          available: true
        }
      ]
    },
    {
      title: 'Jugend',
      icon: <IconShieldCheck size={24} />,
      color: 'from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600',
      documents: [
        {
          name: 'Jugendschutzkonzept',
          description: 'Schutzkonzept für Kinder und Jugendliche',
          size: '567 KB',
          format: 'PDF',
          available: true
        },
        {
          name: 'Verhaltenskodex Trainer',
          description: 'Richtlinien für Jugendtrainer',
          size: '234 KB',
          format: 'PDF',
          available: true
        },
        {
          name: 'Elterninfo Jugendabteilung',
          description: 'Wichtige Informationen für Eltern',
          size: '189 KB',
          format: 'PDF',
          available: true
        }
      ]
    },
    {
      title: 'Sonstiges',
      icon: <IconClipboard size={24} />,
      color: 'from-viktoria-blue-light to-viktoria-blue dark:from-yellow-600 dark:to-viktoria-yellow',
      documents: [
        {
          name: 'Hallennutzungsordnung',
          description: 'Regeln für die Hallennutzung',
          size: '123 KB',
          format: 'PDF',
          available: true
        },
        {
          name: 'Platzordnung',
          description: 'Verhaltensregeln auf dem Sportgelände',
          size: '145 KB',
          format: 'PDF',
          available: true
        },
        {
          name: 'Sponsoring-Broschüre',
          description: 'Informationen für potenzielle Sponsoren',
          size: '2.3 MB',
          format: 'PDF',
          available: true
        }
      ]
    }
  ]

  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-viktoria-dark pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <AnimatedSection animation="fadeIn" className="mb-8" immediate={true}>
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-viktoria-dark-light dark:to-viktoria-dark-lighter rounded-xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 px-6 py-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-white dark:text-gray-900">
                  Downloads
                </h1>
              </div>
              <div className="p-6">
                <p className="text-gray-600 dark:text-gray-400 text-center text-lg">
                  Alle wichtigen Formulare und Dokumente zum Download
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* Download Categories */}
          <div className="space-y-8">
            {downloadCategories.map((category, index) => (
              <AnimatedSection key={index} animation="slideUp" delay={index * 0.1} immediate={true}>
                <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className={`bg-gradient-to-r ${category.color} px-4 sm:px-6 py-4`}>
                    <div className="flex items-center space-x-3">
                      <div className="text-white dark:text-gray-900 opacity-90">
                        {category.icon}
                      </div>
                      <h2 className="text-lg sm:text-xl font-bold text-white dark:text-gray-900 uppercase tracking-wider">
                        {category.title}
                      </h2>
                    </div>
                  </div>
                  <div className="p-4 sm:p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                      {category.documents.map((doc, docIndex) => (
                        <div 
                          key={docIndex}
                          className="group bg-gradient-to-br from-gray-50 to-gray-100 dark:from-viktoria-dark dark:to-viktoria-dark-lighter rounded-lg overflow-hidden hover:from-gray-100 hover:to-gray-150 dark:hover:from-viktoria-dark-lighter dark:hover:to-viktoria-dark transition-all duration-300 shadow-sm hover:shadow-md"
                        >
                          <div className="p-4 sm:p-5">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start space-x-3 mb-2">
                                  <IconFileText size={20} className="text-viktoria-blue dark:text-viktoria-yellow flex-shrink-0 mt-0.5" />
                                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base leading-tight">
                                    {doc.name}
                                  </h3>
                                </div>
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 pl-8">
                                  {doc.description}
                                </p>
                                <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-500 pl-8">
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-viktoria-blue/10 dark:bg-viktoria-yellow/20 text-viktoria-blue dark:text-viktoria-yellow font-medium">
                                    {doc.format}
                                  </span>
                                  <span className="text-gray-400">•</span>
                                  <span>{doc.size}</span>
                                </div>
                              </div>
                              <button 
                                className="flex-shrink-0 p-2.5 sm:p-3 bg-gradient-to-br from-viktoria-yellow to-yellow-500 dark:from-viktoria-yellow dark:to-yellow-600 hover:from-yellow-500 hover:to-viktoria-yellow dark:hover:from-yellow-600 dark:hover:to-viktoria-yellow text-viktoria-blue dark:text-gray-900 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg group-hover:scale-105 active:scale-95"
                                title={`Download ${doc.name}`}
                                aria-label={`Download ${doc.name}`}
                              >
                                <IconDownload size={18} className="sm:hidden" />
                                <IconDownload size={20} className="hidden sm:block" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Info Box */}
          <AnimatedSection animation="slideUp" delay={0.7} className="mt-8" immediate={true}>
            <div className="bg-gradient-to-br from-viktoria-blue/5 to-viktoria-blue/10 dark:from-viktoria-yellow/10 dark:to-viktoria-yellow/20 rounded-xl p-6 border border-viktoria-blue/20 dark:border-viktoria-yellow/30">
              <div className="flex items-start space-x-3">
                <IconFileText size={24} className="text-viktoria-blue dark:text-viktoria-yellow flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-viktoria-blue dark:text-viktoria-yellow mb-2 text-lg">
                    Hinweis
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    Alle Dokumente liegen im PDF-Format vor. Zum Öffnen benötigen Sie einen PDF-Reader 
                    wie Adobe Acrobat Reader. Bei Fragen zu den Dokumenten wenden Sie sich bitte an 
                    unsere Geschäftsstelle unter{' '}
                    <a 
                      href="mailto:info@viktoria-wertheim.de" 
                      className="font-medium text-viktoria-blue dark:text-viktoria-yellow hover:underline"
                    >
                      info@viktoria-wertheim.de
                    </a>
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