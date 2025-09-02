import { createClient } from '@/lib/supabase/server'
import MatchesManager from './MatchesManager'

export default async function AdminMatchesPage() {
  const supabase = await createClient()
  
  const [matchesResult, teamsResult] = await Promise.all([
    supabase
      .from('matches')
      .select('*')
      .order('match_date', { ascending: false }),
    supabase
      .from('teams')
      .select('id, name')
      .order('name')
  ])

  return (
    <MatchesManager 
      initialMatches={matchesResult.data || []} 
      teams={teamsResult.data || []}
    />
  )
}