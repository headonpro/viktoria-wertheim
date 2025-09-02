import { createClient } from '@/lib/supabase/server'
import StandingsManager from './StandingsManager'

export default async function AdminStandingsPage() {
  const supabase = await createClient()
  
  const { data: standings } = await supabase
    .from('league_standings')
    .select('*')
    .order('position')

  return (
    <StandingsManager 
      initialStandings={standings || []}
    />
  )
}