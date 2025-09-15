import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/lib/database.types'

// Simple browser client - cookies are handled automatically by @supabase/ssr
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}