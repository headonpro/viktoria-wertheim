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
            <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden">
              <div className="border-b-2 border-viktoria-blue dark:border-viktoria-yellow px-4 py-2 text-center">
                <h1 className="text-gray-900 dark:text-white font-semibold text-sm">
                  Downloads
                </h1>
              </div>
              <div className="p-6">
                <p className="text-gray-600 dark:text-gray-400 text-center">
                  Hier finden Sie alle wichtigen Formulare und Dokumente zum Download
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* Download Categories */}
          <div className="space-y-6">
            {downloadCategories.map((category, index) => (
              <AnimatedSection key={index} animation="slideUp" delay={index * 0.1} immediate={true}>
                <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden">
                  <div className="border-b-2 border-viktoria-blue dark:border-viktoria-yellow px-6 py-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-viktoria-blue dark:text-viktoria-yellow">
                        {category.icon}
                      </div>
                      <h2 className="text-gray-900 dark:text-white font-semibold">
                        {category.title}
                      </h2>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {category.documents.map((doc, docIndex) => (
                        <div 
                          key={docIndex}
                          className="bg-gray-50 dark:bg-viktoria-dark rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-viktoria-dark-lighter transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <IconFileText size={20} className="text-viktoria-blue dark:text-viktoria-yellow" />
                                <h3 className="font-medium text-gray-900 dark:text-white">
                                  {doc.name}
                                </h3>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {doc.description}
                              </p>
                              <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-500">
                                <span>{doc.format}</span>
                                <span>•</span>
                                <span>{doc.size}</span>
                              </div>
                            </div>
                            <button 
                              className="ml-4 p-2 bg-viktoria-yellow hover:bg-yellow-500 text-viktoria-blue rounded-lg transition-colors"
                              title="Download"
                            >
                              <IconDownload size={20} />
                            </button>
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
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
              <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                Hinweis
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Alle Dokumente liegen im PDF-Format vor. Zum Öffnen benötigen Sie einen PDF-Reader 
                wie Adobe Acrobat Reader. Bei Fragen zu den Dokumenten wenden Sie sich bitte an 
                unsere Geschäftsstelle unter info@viktoria-wertheim.de
              </p>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </PageLayout>
  )
}