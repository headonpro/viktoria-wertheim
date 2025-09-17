import { createClient, createServiceClient } from '@/lib/supabase/server'
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
 * Check if user has a specific role in the database
 */
async function hasUserRole(userId: string, role: string): Promise<boolean> {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('user_roles')
    .select('id')
    .eq('user_id', userId)
    .eq('role', role)
    .single()

  return !error && !!data
}

/**
 * Check if the current user is an admin
 * Redirects to login if not authenticated
 * Returns null if authenticated but not admin
 */
export async function requireAdmin() {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/auth/login')
  }

  // Check database role first
  const isDbAdmin = await hasUserRole(user.id, 'admin')
  if (isDbAdmin) {
    return user
  }

  // Fallback to environment variable (for backwards compatibility)
  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) || []
  if (adminEmails.includes(user.email || '')) {
    return user
  }

  // User is authenticated but not an admin
  return null
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
 * Check if user has specific role
 */
export async function checkUserRole(role: string, userId?: string): Promise<boolean> {
  if (!userId) {
    const user = await getUser()
    if (!user) return false
    userId = user.id
  }

  return hasUserRole(userId, role)
}

/**
 * Get all roles for a user
 */
export async function getUserRoles(userId?: string): Promise<string[]> {
  if (!userId) {
    const user = await getUser()
    if (!user) return []
    userId = user.id
  }

  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)

  if (error || !data) return []

  return data.map(row => row.role)
}

/**
 * Check if an email is an admin email (legacy function for backwards compatibility)
 */
export function isAdminEmail(email: string): boolean {
  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) || []
  return adminEmails.includes(email)
}