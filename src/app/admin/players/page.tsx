import { createClient } from '@/lib/supabase/server'
import PlayersManager from './PlayersManager'

export default async function AdminPlayersPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ team?: string }> 
}) {
  const supabase = await createClient()
  const params = await searchParams
  
  let query = supabase.from('players').select('*, teams(name)')
  
  if (params.team) {
    query = query.eq('team_id', params.team)
  }
  
  const { data: players } = await query.order('name')
  const { data: teams } = await supabase.from('teams').select('id, name').order('name')

  return <PlayersManager 
    initialPlayers={players || []} 
    teams={teams || []}
    selectedTeamId={params.team}
  />
}