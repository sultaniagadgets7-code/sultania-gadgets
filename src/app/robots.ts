import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = 'https://sultaniagadgets.com';
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/account/',
          '/api/',
          '/auth/',
          '/_next/',
          '/checkout',
          '/order/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: ['/', '/blog/', '/product/', '/category/', '/shop', '/deals', '/bundles/', '/faq', '/about', '/contact'],
        disallow: ['/admin/', '/account/', '/api/', '/auth/', '/checkout', '/order/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
