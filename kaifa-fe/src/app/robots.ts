import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/seo/site-config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/learn', '/learning-path', '/modules', '/syllabi', '/assessment', '/grade', '/languages'],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
