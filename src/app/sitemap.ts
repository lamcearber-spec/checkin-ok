import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://checkin-ok.be',
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: 'https://checkin-ok.be/pricing',
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://checkin-ok.be/contact',
      changeFrequency: 'monthly',
      priority: 0.6,
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
