import { createClient } from '@/lib/supabase/server'
import TeamsManager from './TeamsManager'

export default async function AdminTeamsPage() {
  const supabase = await createClient()
  
  const { data: teams } = await supabase
    .from('teams')
    .select('*, players(*)')
    .order('name')

  return <TeamsManager initialTeams={teams || []} />
}