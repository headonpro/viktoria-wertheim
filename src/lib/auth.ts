import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

/**
 * Server-side authentication check
 * Use this in Server Components to protect pages
 */
export async function requireAuth() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/auth/login')
  }
  
  return user
}

/**
 * Check if the current user is an admin
 * Redirects to login if not authenticated
 * Returns false if authenticated but not admin
 */
export async function requireAdmin() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/auth/login')
  }
  
  // Get admin emails from environment variable
  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) || []
  
  if (!adminEmails.includes(user.email || '')) {
    // User is authenticated but not an admin
    return null
  }
  
  return user
}

/**
 * Get the current user without redirecting
 * Returns null if not authenticated
 */
export async function getUser() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }
  
  return user
}

/**
 * Check if an email is an admin email
 */
export function isAdminEmail(email: string): boolean {
  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) || []
  return adminEmails.includes(email)
}