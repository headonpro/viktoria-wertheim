import { createClient } from '@/lib/supabase/server'
import ScorersManager from './ScorersManager'

export default async function AdminScorersPage() {
  const supabase = await createClient()
  
  const [scorersResult, playersResult, teamsResult] = await Promise.all([
    supabase
      .from('scorers')
      .select('*')
      .order('goals', { ascending: false }),
    supabase
      .from('players')
      .select('id, name, team_id')
      .order('name'),
    supabase
      .from('teams')
      .select('id, name')
      .order('name')
  ])

  return (
    <ScorersManager 
      initialScorers={scorersResult.data || []} 
      players={playersResult.data || []}
      teams={teamsResult.data || []}
    />
  )
}