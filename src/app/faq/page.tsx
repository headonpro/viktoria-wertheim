'use client'

import React, { useState } from 'react'
import PageLayout from '@/components/PageLayout'
import AnimatedSection from '@/components/AnimatedSection'
import { 
  IconChevronDown, 
  IconChevronRight,
  IconQuestionMark,
  IconUsers,
  IconBallFootball,
  IconTicket,
  IconUsersGroup,
  IconCoin,
  IconCalendarEvent,
  IconMail,
  IconPhone,
  IconClock
} from '@tabler/icons-react'

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([])
  const [openCategory, setOpenCategory] = useState<number | null>(0)

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const toggleCategory = (index: number) => {
    setOpenCategory(prev => prev === index ? null : index)
  }

  const faqCategories = [
    {
      title: 'Mitgliedschaft',
      icon: <IconUsers size={24} />,
      color: 'from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600',
      questions: [
        {
          question: 'Wie werde ich Mitglied beim SV Viktoria Wertheim?',
          answer: 'Sie können Mitglied werden, indem Sie das Mitgliedsformular auf unserer Downloads-Seite herunterladen, ausfüllen und an unsere Geschäftsstelle senden. Alternativ können Sie das Formular auch persönlich während unserer Öffnungszeiten (Mo-Fr 16:00-18:00 Uhr) abgeben.'
        },
        {
          question: 'Wie hoch sind die Mitgliedsbeiträge?',
          answer: 'Die Mitgliedsbeiträge betragen: Erwachsene 120€/Jahr, Jugendliche (14-18 Jahre) 60€/Jahr, Kinder (bis 14 Jahre) 48€/Jahr, Familienmitgliedschaft 240€/Jahr, Passive Mitglieder 60€/Jahr. Die Beiträge werden jährlich per SEPA-Lastschrift eingezogen.'
        },
        {
          question: 'Kann ich die Mitgliedschaft kündigen?',
          answer: 'Ja, die Mitgliedschaft kann mit einer Frist von 3 Monaten zum Jahresende gekündigt werden. Die Kündigung muss schriftlich erfolgen und bis spätestens 30. September bei der Geschäftsstelle eingehen.'
        },
        {
          question: 'Gibt es eine Probezeit oder Schnuppertraining?',
          answer: 'Ja, Interessierte können 3x kostenlos am Training teilnehmen, bevor sie sich für eine Mitgliedschaft entscheiden. Bitte melden Sie sich vorher beim jeweiligen Trainer oder der Geschäftsstelle an.'
        }
      ]
    },
    {
      title: 'Training & Spielbetrieb',
      icon: <IconBallFootball size={24} />,
      color: 'from-viktoria-blue-light to-viktoria-blue dark:from-yellow-600 dark:to-viktoria-yellow',
      questions: [
        {
          question: 'Wann und wo findet das Training statt?',
          answer: 'Die Trainingszeiten variieren je nach Mannschaft. Die 1. Mannschaft trainiert Di & Do 19:00-20:30 Uhr, die 2. Mannschaft Mo & Mi 19:00-20:30 Uhr. Jugendmannschaften haben individuelle Trainingszeiten. Eine vollständige Übersicht finden Sie auf unserer Teams-Seite oder als Download.'
        },
        {
          question: 'Ab welchem Alter können Kinder mit dem Fußball beginnen?',
          answer: 'Kinder können ab 4 Jahren in unserer Bambini-Gruppe mit dem Fußballspielen beginnen. Das Training ist spielerisch gestaltet und fördert Bewegung, Koordination und Teamgeist.'
        },
        {
          question: 'Wie kann ich einem Team beitreten?',
          answer: 'Neue Spieler sind in allen Mannschaften willkommen! Kommen Sie einfach zum Probetraining oder kontaktieren Sie den jeweiligen Trainer. Bei Jugendmannschaften wenden Sie sich bitte an unseren Jugendleiter Christian Först.'
        },
        {
          question: 'Was benötige ich für das Training?',
          answer: 'Für das Training benötigen Sie Sportkleidung, Fußballschuhe (Nocken für Rasen, Hallenschuhe für die Halle), Schienbeinschoner und ausreichend zu trinken. Trikots werden vom Verein gestellt.'
        }
      ]
    },
    {
      title: 'Tickets & Heimspiele',
      icon: <IconTicket size={24} />,
      color: 'from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600',
      questions: [
        {
          question: 'Wo kann ich Eintrittskarten kaufen?',
          answer: 'Eintrittskarten sind an der Tageskasse erhältlich. Die Kasse öffnet 60 Minuten vor Spielbeginn. Dauerkarten können über die Geschäftsstelle erworben werden.'
        },
        {
          question: 'Was kosten die Eintrittskarten?',
          answer: 'Erwachsene zahlen 5€, Ermäßigt (Schüler, Studenten, Rentner) 3€, Kinder bis 14 Jahre haben freien Eintritt. Dauerkarten kosten 50€ für Erwachsene und 30€ ermäßigt für die gesamte Saison.'
        },
        {
          question: 'Gibt es Parkplätze am Sportgelände?',
          answer: 'Ja, direkt am Sportgelände stehen 150 kostenlose Parkplätze zur Verfügung. Bei wichtigen Spielen empfehlen wir frühzeitige Anreise oder die Nutzung öffentlicher Verkehrsmittel (Buslinie 8, Haltestelle "Sportplatz").'
        },
        {
          question: 'Ist das Stadion barrierefrei?',
          answer: 'Ja, unser Sportgelände ist barrierefrei zugänglich. Es gibt spezielle Plätze für Rollstuhlfahrer und eine behindertengerechte Toilette.'
        }
      ]
    },
    {
      title: 'Jugendabteilung',
      icon: <IconUsersGroup size={24} />,
      color: 'from-viktoria-blue-light to-viktoria-blue dark:from-yellow-600 dark:to-viktoria-yellow',
      questions: [
        {
          question: 'Welche Jugendmannschaften gibt es?',
          answer: 'Wir haben Mannschaften in allen Altersklassen: Bambini (U7), F-Jugend (U9), E-Jugend (U11), D-Jugend (U13), C-Jugend (U15), B-Jugend (U17) und A-Jugend (U19). Insgesamt spielen über 200 Kinder und Jugendliche in unserer Jugendabteilung.'
        },
        {
          question: 'Wie werden die Trainer ausgebildet?',
          answer: 'Alle unsere Jugendtrainer haben mindestens eine C-Lizenz oder befinden sich in der Ausbildung. Der Verein übernimmt die Kosten für Trainerschulungen und legt großen Wert auf qualifizierte Betreuung.'
        },
        {
          question: 'Gibt es ein Jugendschutzkonzept?',
          answer: 'Ja, wir haben ein umfassendes Jugendschutzkonzept. Alle Trainer müssen ein erweitertes Führungszeugnis vorlegen und an Schulungen zum Kinderschutz teilnehmen. Das vollständige Konzept ist auf unserer Downloads-Seite verfügbar.'
        },
        {
          question: 'Finden Feriencamps statt?',
          answer: 'Ja, wir veranstalten in den Sommer- und Herbstferien Fußballcamps für Kinder von 6-14 Jahren. Die Anmeldung erfolgt über die Geschäftsstelle, Vereinsmitglieder erhalten einen Rabatt.'
        }
      ]
    },
    {
      title: 'Sponsoring & Werbung',
      icon: <IconCoin size={24} />,
      color: 'from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600',
      questions: [
        {
          question: 'Wie kann ich Sponsor werden?',
          answer: 'Wir bieten verschiedene Sponsoring-Pakete von 1.000€ bis 5.000€ pro Jahr an. Diese beinhalten Bandenwerbung, Trikotsponsoring, Website-Präsenz und VIP-Karten. Kontaktieren Sie uns unter sponsoring@viktoria-wertheim.de für ein individuelles Angebot.'
        },
        {
          question: 'Ist Bandenwerbung möglich?',
          answer: 'Ja, Bandenwerbung ist in verschiedenen Größen möglich. Die Preise beginnen bei 500€/Jahr für eine kleine Bande (2m) bis 2.000€/Jahr für eine große Bande (8m) an prominenter Stelle.'
        },
        {
          question: 'Kann ich eine Mannschaft sponsern?',
          answer: 'Ja, Sie können Trikotsponsor einer Mannschaft werden. Die Kosten variieren je nach Mannschaft: 1. Mannschaft 3.000€/Jahr, 2. Mannschaft 1.500€/Jahr, Jugendmannschaften ab 500€/Jahr.'
        }
      ]
    },
    {
      title: 'Vereinsleben & Events',
      icon: <IconCalendarEvent size={24} />,
      color: 'from-viktoria-blue-light to-viktoria-blue dark:from-yellow-600 dark:to-viktoria-yellow',
      questions: [
        {
          question: 'Welche Veranstaltungen organisiert der Verein?',
          answer: 'Wir organisieren jährlich: Sommerfest (Juli), Weihnachtsfeier (Dezember), Jugendturnier (Mai), Altherren-Turnier (September), Vereinsausflug und verschiedene Feiern nach Saisonende. Alle Termine finden Sie in unserem Veranstaltungskalender.'
        },
        {
          question: 'Kann ich die Vereinsräume mieten?',
          answer: 'Vereinsmitglieder können unseren Vereinsraum für private Feiern mieten. Die Kosten betragen 100€ plus Kaution. Anfragen richten Sie bitte an die Geschäftsstelle.'
        },
        {
          question: 'Wie kann ich mich ehrenamtlich engagieren?',
          answer: 'Wir freuen uns über jede Unterstützung! Ob als Trainer, Betreuer, Schiedsrichter, bei der Platzpflege oder bei Veranstaltungen - es gibt viele Möglichkeiten. Sprechen Sie uns einfach an!'
        },
        {
          question: 'Gibt es eine Vereinszeitung?',
          answer: 'Ja, unser Vereinsmagazin "Viktoria Aktuell" erscheint 4x jährlich und wird an alle Mitglieder verschickt. Zusätzlich informieren wir über Newsletter, Website und Social Media über aktuelle Ereignisse.'
        }
      ]
    }
  ]

  let globalIndex = 0

  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-viktoria-dark pt-20 pb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <AnimatedSection animation="fadeIn" className="mb-8" immediate={true}>
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-viktoria-dark-light dark:to-viktoria-dark-lighter rounded-xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 px-6 py-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-white dark:text-gray-900">
                  Häufig gestellte Fragen
                </h1>
              </div>
              <div className="p-6">
                <p className="text-gray-600 dark:text-gray-400 text-center text-lg">
                  Finden Sie schnell Antworten auf Ihre Fragen rund um den SV Viktoria Wertheim
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* Quick Navigation for Desktop */}
          <AnimatedSection animation="slideUp" delay={0.1} className="mb-6 hidden lg:block" immediate={true}>
            <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg p-4">
              <div className="flex flex-wrap gap-2 justify-center">
                {faqCategories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => setOpenCategory(index)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                      openCategory === index
                        ? 'bg-viktoria-blue dark:bg-viktoria-yellow text-white dark:text-gray-900 shadow-md'
                        : 'bg-gray-100 dark:bg-viktoria-dark hover:bg-gray-200 dark:hover:bg-viktoria-dark-lighter text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {category.title}
                  </button>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* FAQ Categories */}
          <div className="space-y-6">
            {faqCategories.map((category, catIndex) => {
              const isExpanded = openCategory === catIndex || openCategory === null
              
              return (
                <AnimatedSection key={catIndex} animation="slideUp" delay={catIndex * 0.1} immediate={true}>
                  <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                    <button
                      onClick={() => toggleCategory(catIndex)}
                      className={`w-full bg-gradient-to-r ${category.color} px-4 sm:px-6 py-4 transition-all duration-300`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="text-white dark:text-gray-900 opacity-90">
                            {category.icon}
                          </div>
                          <h2 className="text-lg sm:text-xl font-bold text-white dark:text-gray-900 uppercase tracking-wider">
                            {category.title}
                          </h2>
                          <span className="hidden sm:inline-block px-2 py-1 bg-white/20 dark:bg-gray-900/20 rounded-full text-xs text-white dark:text-gray-900 font-medium">
                            {category.questions.length} Fragen
                          </span>
                        </div>
                        <div className={`text-white dark:text-gray-900 transform transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}>
                          <IconChevronRight size={24} />
                        </div>
                      </div>
                    </button>
                    
                    {isExpanded && (
                      <div className="p-4 sm:p-6 space-y-3">
                        {category.questions.map((item, itemIndex) => {
                          const currentIndex = globalIndex++
                          const isOpen = openItems.includes(currentIndex)
                          
                          return (
                            <div 
                              key={itemIndex}
                              className="group bg-gradient-to-br from-gray-50 to-gray-100 dark:from-viktoria-dark dark:to-viktoria-dark-lighter rounded-lg overflow-hidden hover:from-gray-100 hover:to-gray-150 dark:hover:from-viktoria-dark-lighter dark:hover:to-viktoria-dark transition-all duration-300 shadow-sm hover:shadow-md"
                            >
                              <button
                                onClick={() => toggleItem(currentIndex)}
                                className="w-full px-4 py-4 flex items-start justify-between text-left transition-all duration-300"
                              >
                                <div className="flex items-start space-x-3 flex-1 min-w-0">
                                  <div className={`mt-0.5 flex-shrink-0 transition-all duration-300 ${
                                    isOpen ? 'text-viktoria-blue dark:text-viktoria-yellow scale-110' : 'text-gray-400 dark:text-gray-500'
                                  }`}>
                                    <IconQuestionMark size={20} />
                                  </div>
                                  <span className={`font-semibold text-sm sm:text-base transition-colors duration-300 ${
                                    isOpen ? 'text-viktoria-blue dark:text-viktoria-yellow' : 'text-gray-900 dark:text-white'
                                  }`}>
                                    {item.question}
                                  </span>
                                </div>
                                <div className={`flex-shrink-0 ml-2 transition-all duration-300 ${
                                  isOpen ? 'rotate-180 text-viktoria-blue dark:text-viktoria-yellow' : 'text-gray-400'
                                }`}>
                                  <IconChevronDown size={20} />
                                </div>
                              </button>
                              
                              <div className={`overflow-hidden transition-all duration-300 ${
                                isOpen ? 'max-h-96' : 'max-h-0'
                              }`}>
                                <div className="px-4 pb-4 pt-0">
                                  <div className="pl-8 pr-2">
                                    <div className="border-l-2 border-viktoria-blue/20 dark:border-viktoria-yellow/20 pl-4">
                                      <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                                        {item.answer}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </AnimatedSection>
              )
            })}
          </div>

          {/* Contact Info */}
          <AnimatedSection animation="slideUp" delay={0.7} className="mt-8" immediate={true}>
            <div className="bg-gradient-to-br from-viktoria-blue/5 to-viktoria-blue/10 dark:from-viktoria-yellow/10 dark:to-viktoria-yellow/20 rounded-xl p-6 sm:p-8 border border-viktoria-blue/20 dark:border-viktoria-yellow/30">
              <div className="flex items-start space-x-4">
                <IconQuestionMark size={32} className="text-viktoria-blue dark:text-viktoria-yellow flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-bold text-viktoria-blue dark:text-viktoria-yellow mb-3 text-xl">
                    Ihre Frage war nicht dabei?
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-6">
                    Kein Problem! Unser Team hilft Ihnen gerne weiter. Kontaktieren Sie uns über einen der folgenden Wege:
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <a 
                      href="mailto:info@viktoria-wertheim.de"
                      className="group flex items-center space-x-3 p-3 bg-white dark:bg-viktoria-dark rounded-lg hover:shadow-md transition-all duration-300"
                    >
                      <IconMail size={20} className="text-viktoria-blue dark:text-viktoria-yellow" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">E-Mail</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-viktoria-blue dark:group-hover:text-viktoria-yellow transition-colors">
                          info@viktoria-wertheim.de
                        </p>
                      </div>
                    </a>
                    
                    <a 
                      href="tel:+4993421234"
                      className="group flex items-center space-x-3 p-3 bg-white dark:bg-viktoria-dark rounded-lg hover:shadow-md transition-all duration-300"
                    >
                      <IconPhone size={20} className="text-viktoria-blue dark:text-viktoria-yellow" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Telefon</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-viktoria-blue dark:group-hover:text-viktoria-yellow transition-colors">
                          +49 9342 1234
                        </p>
                      </div>
                    </a>
                    
                    <div className="flex items-center space-x-3 p-3 bg-white dark:bg-viktoria-dark rounded-lg">
                      <IconClock size={20} className="text-viktoria-blue dark:text-viktoria-yellow" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Öffnungszeiten</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Mo-Fr 16:00-18:00
                        </p>
                      </div>
                    </div>
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