import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/database.types'

type News = Database['public']['Tables']['news']['Row']
type Scorer = Database['public']['Tables']['scorers']['Row']

export async function getHomePageData() {
  const supabase = await createClient()
  
  // Fetch all data in parallel
  const [newsResult, scorersResult] = await Promise.all([
    supabase
      .from('news')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(4),
    
    supabase
      .from('scorers')
      .select('*')
      .order('goals', { ascending: false })
      .limit(5)
  ])
  
  return {
    news: newsResult.data || [],
    scorers: scorersResult.data || []
  }
}

export async function getNewsData(): Promise<News[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('news')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(4)
  
  return data || []
}

export async function getTopScorers(): Promise<Scorer[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('scorers')
    .select('*')
    .order('goals', { ascending: false })
    .limit(5)
  
  return data || []
}