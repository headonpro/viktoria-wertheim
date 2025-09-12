import React from 'react'
import Link from 'next/link'
import { IconMail, IconMapPin, IconBrandInstagram, IconBrandFacebook } from '@tabler/icons-react'
import NewsletterSubscribe from '@/components/NewsletterSubscribe'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-dark dark:to-viktoria-dark-light text-white">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Quick Links */}
          <div className="flex flex-col items-center text-center">
            <h4 className="font-semibold text-lg mb-4 text-viktoria-yellow">Schnellzugriff</h4>
            <ul className="space-y-2">
              <li><Link href="/news" className="text-sm hover:text-viktoria-yellow transition-colors">Aktuelles</Link></li>
              <li><Link href="/teams" className="text-sm hover:text-viktoria-yellow transition-colors">Mannschaften</Link></li>
              <li><Link href="/shop" className="text-sm hover:text-viktoria-yellow transition-colors">Fanshop</Link></li>
              <li><Link href="/downloads" className="text-sm hover:text-viktoria-yellow transition-colors">Downloads</Link></li>
              <li><Link href="/faq" className="text-sm hover:text-viktoria-yellow transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col items-center text-center">
            <h4 className="font-semibold text-lg mb-4 text-viktoria-yellow">Kontakt</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2 justify-center">
                <IconMapPin size={16} className="text-viktoria-yellow mt-0.5 flex-shrink-0" />
                <span className="text-sm text-left">
                  Haslocher Weg 85<br />
                  97877 Wertheim
                </span>
              </li>
              <li className="flex items-center space-x-2 justify-center">
                <IconMail size={16} className="text-viktoria-yellow flex-shrink-0" />
                <span className="text-sm">info@viktoria-wertheim.de</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="max-w-xs mx-auto">
            <NewsletterSubscribe variant="footer" />
          </div>

          {/* Social Media */}
          <div className="flex flex-col items-center text-center">
            <h4 className="font-semibold text-lg mb-4 text-viktoria-yellow">Folge uns</h4>
            <div className="flex justify-center space-x-2">
              <a 
                href="https://de-de.facebook.com/SvViktoriaWertheim2000/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                aria-label="SV Viktoria Wertheim auf Facebook"
              >
                <IconBrandFacebook size={20} />
              </a>
              <a 
                href="https://www.instagram.com/svviktoriawertheim/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                aria-label="SV Viktoria Wertheim auf Instagram"
              >
                <IconBrandInstagram size={20} />
              </a>
            </div>
            <p className="text-xs text-gray-300 mt-4">
              Folge uns auf Social Media
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-xs text-gray-300">
              © 2025 SV Viktoria Wertheim. Alle Rechte vorbehalten.
            </p>
            <div className="flex space-x-4">
              <Link href="/impressum" className="text-xs hover:text-viktoria-yellow transition-colors">Impressum</Link>
              <Link href="/datenschutz" className="text-xs hover:text-viktoria-yellow transition-colors">Datenschutz</Link>
              <Link href="/kontakt" className="text-xs hover:text-viktoria-yellow transition-colors">Kontakt</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}