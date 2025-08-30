'use client'

import React, { useState } from 'react'
import PageLayout from '@/components/PageLayout'
import AnimatedSection from '@/components/AnimatedSection'
import { IconChevronDown, IconChevronUp, IconQuestionMark } from '@tabler/icons-react'

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const faqCategories = [
    {
      title: 'Mitgliedschaft',
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <AnimatedSection animation="fadeIn" className="mb-8" immediate={true}>
            <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden">
              <div className="border-b-2 border-viktoria-blue dark:border-viktoria-yellow px-4 py-2 text-center">
                <h1 className="text-gray-900 dark:text-white font-semibold text-sm">
                  Häufig gestellte Fragen (FAQ)
                </h1>
              </div>
              <div className="p-6">
                <p className="text-gray-600 dark:text-gray-400 text-center">
                  Hier finden Sie Antworten auf die wichtigsten Fragen rund um den SV Viktoria Wertheim
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* FAQ Categories */}
          <div className="space-y-6">
            {faqCategories.map((category, catIndex) => (
              <AnimatedSection key={catIndex} animation="slideUp" delay={catIndex * 0.1} immediate={true}>
                <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden">
                  <div className="border-b-2 border-viktoria-blue dark:border-viktoria-yellow px-6 py-3">
                    <h2 className="text-gray-900 dark:text-white font-semibold">
                      {category.title}
                    </h2>
                  </div>
                  <div className="p-6 space-y-4">
                    {category.questions.map((item, itemIndex) => {
                      const currentIndex = globalIndex++
                      const isOpen = openItems.includes(currentIndex)
                      
                      return (
                        <div 
                          key={itemIndex}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                        >
                          <button
                            onClick={() => toggleItem(currentIndex)}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-viktoria-dark hover:bg-gray-100 dark:hover:bg-viktoria-dark-lighter transition-colors flex items-center justify-between text-left"
                          >
                            <div className="flex items-start space-x-3 flex-1">
                              <IconQuestionMark size={20} className="text-viktoria-blue dark:text-viktoria-yellow mt-0.5 flex-shrink-0" />
                              <span className="text-gray-900 dark:text-white font-medium text-sm">
                                {item.question}
                              </span>
                            </div>
                            {isOpen ? (
                              <IconChevronUp size={20} className="text-gray-500 flex-shrink-0" />
                            ) : (
                              <IconChevronDown size={20} className="text-gray-500 flex-shrink-0" />
                            )}
                          </button>
                          {isOpen && (
                            <div className="px-4 py-3 bg-white dark:bg-viktoria-dark-light border-t border-gray-200 dark:border-gray-700">
                              <p className="text-sm text-gray-700 dark:text-gray-300 pl-8">
                                {item.answer}
                              </p>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Contact Info */}
          <AnimatedSection animation="slideUp" delay={0.7} className="mt-8" immediate={true}>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
              <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                Ihre Frage war nicht dabei?
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
                Kein Problem! Kontaktieren Sie uns gerne direkt:
              </p>
              <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                <p>📧 E-Mail: info@viktoria-wertheim.de</p>
                <p>📞 Telefon: +49 9342 1234</p>
                <p>🕐 Öffnungszeiten: Mo-Fr 16:00-18:00 Uhr</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </PageLayout>
  )
}