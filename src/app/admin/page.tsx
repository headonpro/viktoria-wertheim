import { requireAdmin } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import AdminDashboard from './AdminDashboard'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
  // Require admin authentication
  const user = await requireAdmin()
  
  if (!user) {
    // User is authenticated but not an admin
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Zugriff verweigert</h1>
          <p className="text-gray-700 mb-4">
            Sie haben keine Berechtigung für den Admin-Bereich.
          </p>
          <a 
            href="/"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Zurück zur Startseite
          </a>
        </div>
      </div>
    )
  }
  
  const supabase = await createClient()
  
  // Load all data for extended statistics
  const [
    newsResult, 
    teamsResult, 
    playersResult,
    matchesResult,
    sponsorsResult,
    contactsResult,
    newsletterResult,
    youthTeamsResult,
    standingsResult,
    scorersResult
  ] = await Promise.all([
    supabase.from('news').select('*').order('published_at', { ascending: false }),
    supabase.from('teams').select('*').order('name'),
    supabase.from('players').select('*').order('name'),
    supabase.from('matches').select('*').order('match_date', { ascending: false }),
    supabase.from('sponsors').select('*'),
    supabase.from('contacts').select('*'),
    supabase.from('newsletter_subscribers').select('*').eq('is_active', true),
    supabase.from('youth_teams').select('*'),
    supabase.from('league_standings').select('*').eq('season', '2025/26'),
    supabase.from('scorers').select('*').eq('season', '2025/26').order('goals', { ascending: false })
  ])

  const stats = {
    newsCount: newsResult.data?.length || 0,
    teamsCount: teamsResult.data?.length || 0,
    playersCount: playersResult.data?.length || 0,
    matchesCount: matchesResult.data?.length || 0,
    upcomingMatches: matchesResult.data?.filter(m => !m.home_score && !m.away_score).length || 0,
    sponsorsCount: sponsorsResult.data?.length || 0,
    activeSponsors: sponsorsResult.data?.filter(s => s.is_active).length || 0,
    contactsCount: contactsResult.data?.length || 0,
    newsletterCount: newsletterResult.data?.length || 0,
    youthTeamsCount: youthTeamsResult.data?.length || 0,
    youthPlayersCount: youthTeamsResult.data?.reduce((sum, t) => sum + (t.player_count || 0), 0) || 0,
    leaguePosition: standingsResult.data?.find(s => s.team_name.includes('Viktoria'))?.position || 0,
    topScorer: scorersResult.data?.[0]?.player_name || 'N/A',
    topScorerGoals: scorersResult.data?.[0]?.goals || 0,
    currentUser: user.email || 'Unknown'
  }

  return <AdminDashboard initialStats={stats} />
}