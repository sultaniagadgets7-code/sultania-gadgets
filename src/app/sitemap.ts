import type { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

const SITE = 'https://sultaniagadgets.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  // Fetch all dynamic data — each wrapped to fail gracefully
  const [categoriesRes, productsRes, bundlesRes, blogRes] = await Promise.allSettled([
    supabase.from('categories').select('slug, created_at').order('sort_order'),
    supabase.from('products').select('slug, updated_at').eq('is_active', true).limit(500),
    supabase.from('bundles').select('slug, created_at').eq('is_active', true),
    supabase.from('blog_posts').select('slug, published_at, updated_at').eq('published', true),
  ]);

  const categories = categoriesRes.status === 'fulfilled' ? (categoriesRes.value.data ?? []) : [];
  const products   = productsRes.status   === 'fulfilled' ? (productsRes.value.data   ?? []) : [];
  const bundles    = bundlesRes.status    === 'fulfilled' ? (bundlesRes.value.data    ?? []) : [];
  const blogPosts  = blogRes.status       === 'fulfilled' ? (blogRes.value.data       ?? []) : [];

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE,                              lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
    { url: `${SITE}/shop`,                    lastModified: new Date(), changeFrequency: 'daily',   priority: 0.95 },
    { url: `${SITE}/deals`,                   lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${SITE}/bundles`,                 lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.85 },
    { url: `${SITE}/blog`,                    lastModified: new Date(), changeFrequency: 'daily',   priority: 0.8 },
    { url: `${SITE}/search`,                  lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${SITE}/compare`,                 lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.6 },
    { url: `${SITE}/about`,                   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE}/contact`,                 lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE}/faq`,                     lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.65 },
    { url: `${SITE}/track-order`,             lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE}/exchange-request`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE}/shipping-policy`,         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE}/exchange-policy`,         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE}/privacy-policy`,          lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE}/terms`,                   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${SITE}/category/${c.slug}`,
    lastModified: new Date(c.created_at),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE}/product/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  const bundleRoutes: MetadataRoute.Sitemap = bundles.map((b) => ({
    url: `${SITE}/bundles/${b.slug}`,
    lastModified: new Date(b.created_at),
    changeFrequency: 'weekly',
    priority: 0.75,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((p) => ({
    url: `${SITE}/blog/${p.slug}`,
    lastModified: new Date(p.updated_at || p.published_at),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...productRoutes,
    ...bundleRoutes,
    ...blogRoutes,
  ];
}
