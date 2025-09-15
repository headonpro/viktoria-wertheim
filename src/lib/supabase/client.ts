import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/lib/database.types'

// Simple, docs-compliant Supabase client
// Following official Supabase Next.js documentation pattern
// No proxy, no retry logic - clean and simple
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}