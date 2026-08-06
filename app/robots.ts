import { MetadataRoute } from 'next';
import { siteConfigEn } from '@/lib/site-config';

export default function robots(): MetadataRoute.Robots {
  const url = process.env.NEXT_PUBLIC_APP_URL || siteConfigEn.url;

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/ar', '/checkout', '/ar/checkout'],
      disallow: ['/admin/', '/kitchen/', '/api/'],
    },
    sitemap: `${url}/sitemap.xml`,
  };
}
