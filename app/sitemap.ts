import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://www.axonesim.com', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://www.axonesim.com/plans', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: 'https://www.axonesim.com/setup-guide', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://www.axonesim.com/activate', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://www.axonesim.com/order', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]
}
