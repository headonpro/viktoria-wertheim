import { MetadataRoute } from 'next';
import { getCanonicalUrl } from '@/config/domains';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getCanonicalUrl();

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/_next/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}