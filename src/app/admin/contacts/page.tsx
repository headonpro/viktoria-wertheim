import { createClient } from '@/lib/supabase/server'
import ContactsManager from './ContactsManager'

export default async function AdminContactsPage() {
  const supabase = await createClient()
  
  const { data: contacts } = await supabase
    .from('contacts')
    .select('*')
    .order('order_position')

  return <ContactsManager initialContacts={contacts || []} />
}