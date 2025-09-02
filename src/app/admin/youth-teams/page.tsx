import { createClient } from '@/lib/supabase/server'
import YouthTeamsManager from './YouthTeamsManager'

export default async function AdminYouthTeamsPage() {
  const supabase = await createClient()
  
  const { data: youthTeams } = await supabase
    .from('youth_teams')
    .select('*')
    .order('age_group')

  return <YouthTeamsManager initialTeams={youthTeams || []} />
}