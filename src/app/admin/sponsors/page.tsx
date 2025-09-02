import { createClient } from '@/lib/supabase/server'
import SponsorsManager from './SponsorsManager'

export default async function AdminSponsorsPage() {
  const supabase = await createClient()
  
  const { data: sponsors } = await supabase
    .from('sponsors')
    .select('*')
    .order('category')

  return <SponsorsManager initialSponsors={sponsors || []} />
}