// Domain Configuration for Multi-Domain SEO Setup
export const DOMAIN_CONFIG = {
  // Primary domain (modern, preferred for SEO)
  primary: 'https://viktoria.team',

  // All valid production domains
  production: [
    'viktoria.team',
    'www.viktoria.team',
    'viktoria-wertheim.de',
    'www.viktoria-wertheim.de',
    'viktoria.headon.pro' // Development/staging
  ],

  // Domain to use as canonical (always without www)
  canonical: 'https://viktoria.team',

  // Old domain for redirects (if needed in future)
  legacy: 'https://viktoria-wertheim.de'
} as const;

/**
 * Get the canonical URL based on the current host
 * Always returns the primary domain for consistency
 */
export function getCanonicalUrl(pathname: string = ''): string {
  // Always use primary domain for canonical to avoid duplicate content
  const cleanPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${DOMAIN_CONFIG.canonical}${cleanPath}`;
}

/**
 * Check if a hostname is a valid production domain
 */
export function isValidDomain(hostname: string): boolean {
  const cleanHost = hostname.replace(/^https?:\/\//, '').replace(/\/$/, '');
  return DOMAIN_CONFIG.production.includes(cleanHost as any);
}

/**
 * Get the appropriate site URL based on environment
 * In production, always use the primary domain for consistency
 */
export function getSiteUrl(): string {
  if (process.env.NODE_ENV === 'production') {
    return DOMAIN_CONFIG.primary;
  }

  // In development, use the configured URL or fallback
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}