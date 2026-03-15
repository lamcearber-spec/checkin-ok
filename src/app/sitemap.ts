import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://checkin-ok.be',
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://checkin-ok.be/impressum',
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: 'https://checkin-ok.be/privacy',
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: 'https://checkin-ok.be/terms',
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];
}
