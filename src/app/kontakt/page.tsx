import React from 'react'
import { createClient } from '@/lib/supabase/server'
import ContactPageClient from '@/components/ContactPageClient'
import { Metadata } from 'next'
import type { Database } from '@/lib/database.types'

type Contact = Database['public']['Tables']['contacts']['Row']

export const metadata: Metadata = {
  title: 'Kontakt - SV Viktoria Wertheim',
  description: 'Kontaktieren Sie den SV Viktoria Wertheim - Geschäftsstelle, Vorstand und Ansprechpartner'
}

export default async function ContactPage() {
  const supabase = await createClient()
  
  let contacts: Contact[] = []
  
  try {
    // Fetch contacts from database ordered by order_position
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('is_active', true)
      .order('order_position')
    
    if (error) {
      console.error('Error fetching contacts:', error)
      contacts = []
    } else {
      contacts = data || []
    }
  } catch (error) {
    console.error('Critical error in ContactPage:', error)
    contacts = []
  }
  
  // Transform contacts to match client expectations
  const contactsData = (contacts || []).map(contact => ({
    id: contact.id,
    role: contact.role,
    title: contact.role, // Use role as title for display
    name: contact.name,
    department: contact.department,
    phone: contact.phone || '',
    email: contact.email || '',
    order: contact.order_position
  }))
  
  // Static data for general contact info (could be moved to DB later)
  const generalInfo = {
    address: 'Sportplatzweg 1, 97877 Wertheim',
    hours: 'Mo-Fr: 16:00-18:00 Uhr',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2573.5!2d9.5!3d49.75!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDnCsDQ1JzAwLjAiTiA5wrAzMCcwMC4wIkU!5e0!3m2!1sde!2sde!4v1234567890'
  }
  
  // Social media links (could be moved to DB later)
  const socialMedia = [
    { icon: 'facebook', name: 'Facebook', url: '#', followers: '2.3k' },
    { icon: 'instagram', name: 'Instagram', url: '#', followers: '1.8k' },
    { icon: 'youtube', name: 'YouTube', url: '#', followers: '500' }
  ]
  
  return <ContactPageClient 
    contacts={contactsData}
    generalInfo={generalInfo}
    socialMedia={socialMedia}
  />
}