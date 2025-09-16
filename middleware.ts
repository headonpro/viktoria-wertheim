import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { isValidDomain, DOMAIN_CONFIG } from '@/config/domains'

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const hostname = request.headers.get('host') || ''

  // Validate domain and log if unknown domain is accessed
  if (!isValidDomain(hostname) && process.env.NODE_ENV === 'production') {
    console.warn(`Access from unknown domain: ${hostname}`)
  }

  // Let Supabase handle the session update first
  const response = await updateSession(request)

  // Add SEO-friendly headers for both domains
  response.headers.set('X-Robots-Tag', 'index, follow')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Add canonical link header for SEO (helps search engines identify the primary domain)
  const canonicalUrl = `${DOMAIN_CONFIG.canonical}${url.pathname}${url.search}`
  response.headers.set('Link', `<${canonicalUrl}>; rel="canonical"`)

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}