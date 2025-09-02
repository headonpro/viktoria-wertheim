import { createClient } from '@/lib/supabase/server'
import NewsletterManager from './NewsletterManager'

export default async function AdminNewsletterPage() {
  const supabase = await createClient()
  
  const { data: subscribers } = await supabase
    .from('newsletter_subscribers')
    .select('*')
    .order('subscribed_at', { ascending: false })

  return <NewsletterManager initialSubscribers={subscribers || []} />
}