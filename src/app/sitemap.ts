import { MetadataRoute } from 'next';
import { getCanonicalUrl } from '@/config/domains';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getCanonicalUrl();

  // Static pages
  const staticPages = [
    '',
    '/news',
    '/teams',
    '/kontakt',
    '/impressum',
    '/datenschutz',
  ];

  const staticRoutes = staticPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Team pages - adjust based on your actual teams
  const teamRoutes = [
    '/teams/erste-mannschaft',
    '/teams/zweite-mannschaft',
    '/teams/frauen',
    '/teams/jugend',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...teamRoutes];
}