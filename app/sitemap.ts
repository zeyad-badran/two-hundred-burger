import { MetadataRoute } from 'next';
import { siteConfigEn } from '@/lib/site-config';

export default function sitemap(): MetadataRoute.Sitemap {
  const url = process.env.NEXT_PUBLIC_APP_URL || siteConfigEn.url;

  return [
    {
      url: `${url}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${url}/ar`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    }
  ];
}
