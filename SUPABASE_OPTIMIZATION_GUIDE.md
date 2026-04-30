# 🚀 Supabase Free Tier Optimization Guide

**Current Status**: All load on Supabase (free tier)  
**Goal**: Reduce database queries by 70-80% while maintaining performance

---

## 📊 Current Situation Analysis

### Supabase Free Tier Limits
- **Database Size**: 500 MB
- **Bandwidth**: 5 GB/month
- **API Requests**: 500,000/month (~16,000/day)
- **Concurrent Connections**: 60

### Your Current Optimizations ✅
- ISR caching (5 minutes)
- Limited query results (50 products, 3 testimonials, 3 bundles)
- Selective field fetching (not using `*`)
- Next.js image optimization

### Problem Areas 🔴
- Every page load hits Supabase (even with ISR)
- No client-side caching
- Homepage fetches 10+ queries per load
- Product images stored in Supabase (bandwidth usage)

---

## 🎯 Three-Phase Optimization Strategy

### Phase 1: Aggressive Caching (Immediate - Free) ⚡
**Time**: 10 minutes  
**Savings**: 60-70% reduction in queries

### Phase 2: Static Data Generation (1 hour - Free) 📦
**Time**: 1 hour  
**Savings**: Additional 10-15% reduction

### Phase 3: Image CDN (Optional - $5/month) 🖼️
**Time**: 30 minutes  
**Savings**: 80% bandwidth reduction

---

## Phase 1: Aggressive Caching (Do This Now!)

### 1.1 Increase ISR Cache Times

**Current**: 5 minutes (300 seconds)  
**Recommended**: 1-24 hours depending on page type

#### Update Cache Times

**Homepage** (changes rarely):
```typescript
// src/app/page.tsx
export const revalidate = 3600; // 1 hour
```

**Product Pages** (prices change occasionally):
```typescript
// src/app/product/[slug]/page.tsx
export const revalidate = 1800; // 30 minutes
```

**Shop/Category Pages** (inventory changes):
```typescript
// src/app/shop/page.tsx
// src/app/category/[slug]/page.tsx
export const revalidate = 1800; // 30 minutes
```

**Static Pages** (rarely change):
```typescript
// src/app/about/page.tsx
// src/app/faq/page.tsx
export const revalidate = 86400; // 24 hours
```

**Admin Pages** (real-time data needed):
```typescript
// src/app/admin/*/page.tsx
export const revalidate = 0; // No caching (dynamic)
```

### 1.2 Add Query-Level Caching

Create a simple in-memory cache for frequently accessed data:

```typescript
// src/lib/cache.ts
const cache = new Map<string, { data: any; expires: number }>();

export function getCached<T>(key: string, ttl: number, fetcher: () => Promise<T>): Promise<T> {
  const now = Date.now();
  const cached = cache.get(key);
  
  if (cached && cached.expires > now) {
    return Promise.resolve(cached.data);
  }
  
  return fetcher().then(data => {
    cache.set(key, { data, expires: now + ttl });
    return data;
  });
}

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (value.expires < now) {
      cache.delete(key);
    }
  }
}, 5 * 60 * 1000);
```

**Usage**:
```typescript
// src/lib/queries.ts
import { getCached } from './cache';

export async function getCategories(): Promise<Category[]> {
  return getCached('categories', 3600000, async () => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });
    return data ?? [];
  });
}
```

### 1.3 Reduce Homepage Queries

**Current**: 10+ queries per homepage load  
**Optimized**: 3-4 queries

Combine related queries:

```typescript
// Instead of separate queries for featured, new, deals
// Fetch once and filter client-side

export async function getHomePageProducts() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('products')
    .select('id, slug, title, price, compare_at_price, badge, is_featured, created_at, category:categories(id, name, slug), product_images(image_url, alt_text, sort_order)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(30); // Fetch 30, filter client-side
  
  const products = data ?? [];
  
  return {
    featured: products.filter(p => p.is_featured).slice(0, 8),
    newArrivals: products.slice(0, 10),
    deals: products.filter(p => p.compare_at_price && p.compare_at_price > p.price).slice(0, 8),
  };
}
```

### 1.4 Implement Request Deduplication

Prevent duplicate queries in the same request:

```typescript
// src/lib/dedupe.ts
const pending = new Map<string, Promise<any>>();

export function dedupe<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  if (pending.has(key)) {
    return pending.get(key)!;
  }
  
  const promise = fetcher().finally(() => {
    pending.delete(key);
  });
  
  pending.set(key, promise);
  return promise;
}
```

---

## Phase 2: Static Data Generation

### 2.1 Generate Static Sitemap

Instead of querying database for sitemap, generate it at build time:

```typescript
// src/app/sitemap.ts
import { getProducts, getCategories, getActiveBundles } from '@/lib/queries';

export const revalidate = 86400; // 24 hours

export default async function sitemap() {
  const [products, categories, bundles] = await Promise.all([
    getProducts(),
    getCategories(),
    getActiveBundles(),
  ]);
  
  // Cache this in a JSON file for faster access
  return [
    // ... sitemap entries
  ];
}
```

### 2.2 Pre-generate Popular Pages

Use `generateStaticParams` for popular products:

```typescript
// src/app/product/[slug]/page.tsx
export async function generateStaticParams() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('products')
    .select('slug')
    .eq('is_featured', true) // Only featured products
    .limit(20);
  
  return (data ?? []).map(p => ({ slug: p.slug }));
}
```

### 2.3 Static JSON API

Create static JSON files for frequently accessed data:

```bash
# Generate at build time
npm run build
```

```typescript
// scripts/generate-static-data.ts
import fs from 'fs';
import { getCategories, getSiteSettings } from '@/lib/queries';

async function generateStaticData() {
  const categories = await getCategories();
  const settings = await getSiteSettings();
  
  fs.writeFileSync(
    'public/api/categories.json',
    JSON.stringify(categories)
  );
  
  fs.writeFileSync(
    'public/api/settings.json',
    JSON.stringify(settings)
  );
}

generateStaticData();
```

Then fetch from static files:

```typescript
// Client-side
const categories = await fetch('/api/categories.json').then(r => r.json());
```

---

## Phase 3: Image CDN (Optional)

### 3.1 Move Images to Vercel Blob Storage

**Cost**: $5/month for 100 GB bandwidth  
**Savings**: 80% reduction in Supabase bandwidth

```bash
npm install @vercel/blob
```

```typescript
// Upload images to Vercel Blob
import { put } from '@vercel/blob';

const blob = await put('product-image.jpg', file, {
  access: 'public',
});

// Use blob.url in database instead of Supabase storage URL
```

### 3.2 Use Cloudflare R2 (Free Tier)

**Cost**: Free for 10 GB storage + 10 million requests/month  
**Better than**: Supabase storage

1. Create Cloudflare account
2. Set up R2 bucket
3. Upload images
4. Update image URLs in database

---

## 📈 Expected Results

### Before Optimization
- **Homepage**: 10-12 database queries
- **Product Page**: 4-5 database queries
- **Shop Page**: 3-4 database queries
- **Total**: ~500,000 queries/month (near limit)

### After Phase 1 (Aggressive Caching)
- **Homepage**: 1-2 database queries (cached for 1 hour)
- **Product Page**: 1 database query (cached for 30 min)
- **Shop Page**: 1 database query (cached for 30 min)
- **Total**: ~150,000 queries/month (70% reduction) ✅

### After Phase 2 (Static Generation)
- **Homepage**: 0-1 database queries (mostly static)
- **Product Page**: 0-1 database queries (pre-generated)
- **Shop Page**: 1 database query
- **Total**: ~100,000 queries/month (80% reduction) ✅

### After Phase 3 (Image CDN)
- **Bandwidth**: 1 GB/month (80% reduction) ✅
- **Cost**: $5/month for Vercel Blob or $0 for Cloudflare R2

---

## 🛠️ Implementation Checklist

### Immediate (10 minutes)
- [ ] Increase ISR cache times (1 hour for homepage)
- [ ] Add query-level caching for categories
- [ ] Combine homepage queries
- [ ] Test with `npm run build`

### Short-term (1 hour)
- [ ] Implement request deduplication
- [ ] Generate static sitemap
- [ ] Pre-generate popular product pages
- [ ] Create static JSON API for categories

### Optional (30 minutes + $5/month)
- [ ] Set up Vercel Blob storage
- [ ] Migrate product images
- [ ] Update image URLs in database
- [ ] Test image loading

---

## 💡 Quick Wins (Do These First)

### 1. Increase Cache Times (2 minutes)

```typescript
// src/app/page.tsx
export const revalidate = 3600; // Change from 300 to 3600

// src/app/product/[slug]/page.tsx
export const revalidate = 1800; // Change from 600 to 1800

// src/app/shop/page.tsx
export const revalidate = 1800; // Add if missing
```

### 2. Cache Categories (5 minutes)

Categories rarely change, cache them aggressively:

```typescript
// src/lib/queries.ts
let categoriesCache: { data: Category[]; expires: number } | null = null;

export async function getCategories(): Promise<Category[]> {
  const now = Date.now();
  
  if (categoriesCache && categoriesCache.expires > now) {
    return categoriesCache.data;
  }
  
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });
  
  const categories = data ?? [];
  categoriesCache = {
    data: categories,
    expires: now + 3600000, // 1 hour
  };
  
  return categories;
}
```

### 3. Reduce Homepage Queries (3 minutes)

```typescript
// src/app/page.tsx
// Instead of calling getProducts() 3 times for different filters
// Call once and filter client-side

const allProducts = await getProducts({ sort: 'newest' });
const featured = allProducts.filter(p => p.is_featured).slice(0, 8);
const deals = allProducts.filter(p => p.compare_at_price && p.compare_at_price > p.price).slice(0, 8);
```

---

## 📊 Monitoring

### Check Supabase Usage

1. Go to: https://supabase.com/dashboard/project/tblvxsfmcqbltifoqrnx
2. Click "Settings" → "Usage"
3. Monitor:
   - API requests per day
   - Bandwidth usage
   - Database size

### Set Up Alerts

Create alerts when you reach:
- 80% of API request limit (400,000/month)
- 80% of bandwidth limit (4 GB/month)

---

## 🎯 Recommended Approach

### Week 1: Quick Wins (Free)
1. Increase ISR cache times to 1 hour
2. Add category caching
3. Reduce homepage queries
4. **Expected**: 60-70% reduction in queries

### Week 2: Static Generation (Free)
1. Generate static sitemap
2. Pre-generate popular pages
3. Create static JSON API
4. **Expected**: Additional 10-15% reduction

### Week 3: Image CDN (Optional - $5/month)
1. Set up Cloudflare R2 (free) or Vercel Blob ($5)
2. Migrate images
3. Update database URLs
4. **Expected**: 80% bandwidth reduction

---

## 💰 Cost Comparison

### Current (Free Tier)
- Supabase: $0/month
- Risk: Hitting limits, slow performance
- **Total**: $0/month

### Optimized (Free Tier + Caching)
- Supabase: $0/month
- 70-80% less load
- **Total**: $0/month ✅

### With Image CDN
- Supabase: $0/month
- Cloudflare R2: $0/month (free tier)
- OR Vercel Blob: $5/month
- **Total**: $0-5/month ✅

### Alternative: Upgrade Supabase
- Supabase Pro: $25/month
- More limits, better performance
- **Total**: $25/month ❌ (not recommended yet)

---

## 🚀 Next Steps

1. **Start with Phase 1** (10 minutes, free, 60-70% improvement)
2. **Monitor for 1 week** (check Supabase usage)
3. **If still hitting limits**, implement Phase 2
4. **If bandwidth is issue**, add Image CDN (Phase 3)

---

## 📝 Code Examples

I can help you implement any of these optimizations. Just let me know which phase you want to start with:

1. **Phase 1**: Increase cache times + add query caching (10 min)
2. **Phase 2**: Static generation + JSON API (1 hour)
3. **Phase 3**: Image CDN setup (30 min + $5/month)

---

## ✅ Summary

**Problem**: All load on Supabase free tier  
**Solution**: Aggressive caching + static generation  
**Result**: 70-80% reduction in database queries  
**Cost**: $0 (or $5/month for image CDN)  
**Time**: 10 minutes to 1 hour

**Recommendation**: Start with Phase 1 (10 minutes, free, huge impact)

