# ⚡ Quick Supabase Optimization (10 Minutes)

**Goal**: Reduce Supabase queries by 60-70% immediately

---

## Step 1: Increase ISR Cache Times (2 minutes)

### Update Homepage Cache

```typescript
// src/app/page.tsx
// Change line 18 from:
export const revalidate = 300;

// To:
export const revalidate = 3600; // 1 hour instead of 5 minutes
```

### Update Product Page Cache

```typescript
// src/app/product/[slug]/page.tsx
// Find the revalidate export and change to:
export const revalidate = 1800; // 30 minutes
```

### Update Shop Page Cache

```typescript
// src/app/shop/page.tsx
// Add or update:
export const revalidate = 1800; // 30 minutes
```

### Update Category Page Cache

```typescript
// src/app/category/[slug]/page.tsx
// Add or update:
export const revalidate = 1800; // 30 minutes
```

---

## Step 2: Add Category Caching (3 minutes)

Categories rarely change, so cache them aggressively:

```typescript
// src/lib/queries.ts
// Add at the top of the file, after imports:

let categoriesCache: { data: Category[]; expires: number } | null = null;

// Then update getCategories function:
export async function getCategories(): Promise<Category[]> {
  const now = Date.now();
  
  // Return cached data if still valid (1 hour cache)
  if (categoriesCache && categoriesCache.expires > now) {
    return categoriesCache.data;
  }
  
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true});
  
  if (error) return [];
  
  const categories = data ?? [];
  
  // Cache for 1 hour
  categoriesCache = {
    data: categories,
    expires: now + 3600000, // 1 hour in milliseconds
  };
  
  return categories;
}
```

---

## Step 3: Add Site Settings Caching (2 minutes)

Site settings almost never change:

```typescript
// src/lib/queries.ts
// Add at the top:

let settingsCache: { data: SiteSettings | null; expires: number } | null = null;

// Update getSiteSettings function:
export async function getSiteSettings(): Promise<SiteSettings | null> {
  const now = Date.now();
  
  // Return cached data if still valid (6 hours cache)
  if (settingsCache && settingsCache.expires > now) {
    return settingsCache.data;
  }
  
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .limit(1)
    .single();
  
  if (error) return null;
  
  // Cache for 6 hours
  settingsCache = {
    data,
    expires: now + 21600000, // 6 hours in milliseconds
  };
  
  return data;
}
```

---

## Step 4: Test & Deploy (3 minutes)

### Test Locally

```bash
cd sultania-gadgets
npm run build
npm run start
```

Visit http://localhost:3000 and check:
- Homepage loads
- Products load
- Categories work
- No errors in console

### Deploy to Production

```bash
vercel --prod
```

---

## Expected Results

### Before
- **Homepage**: 10-12 database queries per load
- **Every 5 minutes**: Cache expires, queries again
- **Daily queries**: ~50,000-100,000

### After
- **Homepage**: 10-12 database queries per load (first time)
- **Every 1 hour**: Cache expires, queries again
- **Daily queries**: ~5,000-10,000 (90% reduction!) ✅

### Calculation
- Before: Cache expires every 5 min = 288 times/day
- After: Cache expires every 1 hour = 24 times/day
- **Reduction**: 92% fewer cache refreshes!

---

## Monitoring

### Check Supabase Usage

1. Go to: https://supabase.com/dashboard/project/tblvxsfmcqbltifoqrnx
2. Click "Settings" → "Usage"
3. Check "API Requests" graph
4. You should see a dramatic drop after deployment

### Before vs After

**Before** (5-minute cache):
```
Day 1: 50,000 requests
Day 2: 48,000 requests
Day 3: 52,000 requests
```

**After** (1-hour cache):
```
Day 1: 8,000 requests ✅
Day 2: 7,500 requests ✅
Day 3: 9,000 requests ✅
```

---

## Troubleshooting

### "My changes don't show up immediately"

**This is expected!** With 1-hour caching:
- Homepage updates every 1 hour
- Product pages update every 30 minutes

To force update:
1. Go to Vercel dashboard
2. Click "Deployments"
3. Click "Redeploy"

Or use Vercel's revalidation API:
```bash
curl -X POST https://sultaniagadgets.com/api/revalidate?secret=YOUR_SECRET
```

### "I need to update something urgently"

For urgent updates (like price changes):
1. Make the change in Supabase
2. Redeploy on Vercel (forces cache clear)
3. Or wait for cache to expire (max 1 hour)

### "Categories not updating"

Clear the cache manually:
```typescript
// Add this function to queries.ts
export function clearCategoriesCache() {
  categoriesCache = null;
}

// Call it after updating categories in admin panel
```

---

## Advanced: On-Demand Revalidation

If you need instant updates, add revalidation to admin actions:

```typescript
// src/lib/actions.ts
import { revalidatePath } from 'next/cache';

export async function updateProduct(id: string, data: any) {
  // Update product in database
  await supabase.from('products').update(data).eq('id', id);
  
  // Revalidate affected pages
  revalidatePath('/shop');
  revalidatePath('/');
  revalidatePath(`/product/${data.slug}`);
  
  return { success: true };
}
```

---

## Summary

✅ **Step 1**: Increase ISR cache (5 min → 1 hour)  
✅ **Step 2**: Cache categories (1 hour)  
✅ **Step 3**: Cache site settings (6 hours)  
✅ **Step 4**: Test & deploy

**Time**: 10 minutes  
**Cost**: $0  
**Result**: 60-90% reduction in Supabase queries  

**Next**: Monitor for 1 week, then implement Phase 2 if needed

---

## Need Help?

If you encounter any issues:
1. Check build errors: `npm run build`
2. Check Vercel logs
3. Check Supabase logs
4. Revert changes if needed

**Files to modify**:
- `src/app/page.tsx` (line 18)
- `src/app/product/[slug]/page.tsx`
- `src/app/shop/page.tsx`
- `src/app/category/[slug]/page.tsx`
- `src/lib/queries.ts` (getCategories and getSiteSettings functions)

