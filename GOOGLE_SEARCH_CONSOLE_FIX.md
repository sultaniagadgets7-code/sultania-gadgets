# Google Search Console Issues - Fix Guide

## Issues Reported

1. **Not found (404)** - Pages that don't exist
2. **Page with redirect** - Pages that redirect elsewhere

## Common Causes

### 1. Missing Pages in Sitemap
Your sitemap includes these pages that might not exist:
- `/shipping-policy`
- `/exchange-policy`

### 2. Old URLs Being Crawled
Google might be crawling old URLs from:
- Previous versions of your site
- External links
- Cached pages

### 3. Dynamic Pages Without Data
- Product pages for deleted products
- Category pages for deleted categories
- Blog posts that were unpublished

## How to Fix

### Step 1: Check Which Pages Are 404

1. Go to Google Search Console
2. Click "Pages" in left sidebar
3. Scroll to "Why pages aren't indexed"
4. Click "Not found (404)"
5. See the list of URLs

### Step 2: Decide What to Do

For each 404 URL, choose one:

#### Option A: Create the Page (if it should exist)
Example: `/shipping-policy` should exist

#### Option B: Remove from Sitemap (if it shouldn't exist)
Example: Old product that was deleted

#### Option C: Add Redirect (if URL changed)
Example: `/old-url` → `/new-url`

#### Option D: Mark as Intentional (if it's okay)
Example: `/admin/` should be 404 for public

### Step 3: Fix Missing Pages

Create these pages if they don't exist:

1. **Shipping Policy** - `/shipping-policy`
2. **Exchange Policy** - `/exchange-policy`

I'll create these for you below.

### Step 4: Remove Invalid URLs from Sitemap

Edit `src/app/sitemap.ts` and remove any pages that don't exist.

### Step 5: Request Re-indexing

1. Go to Google Search Console
2. Use URL Inspection tool
3. Enter the fixed URL
4. Click "Request Indexing"

## Creating Missing Pages

### Shipping Policy Page

Create: `src/app/shipping-policy/page.tsx`

```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping Policy',
  description: 'Learn about our shipping policy, delivery times, and shipping charges.',
};

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-16">
      <h1 className="font-black text-3xl text-gray-950 mb-8">Shipping Policy</h1>
      
      <div className="prose prose-gray max-w-none">
        <h2>Delivery Areas</h2>
        <p>We deliver to all major cities across Pakistan including Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, and more.</p>

        <h2>Delivery Time</h2>
        <p>Standard delivery takes 2-4 business days for major cities. Remote areas may take 5-7 business days.</p>

        <h2>Shipping Charges</h2>
        <p>Flat shipping fee of Rs. 200 applies to all orders across Pakistan.</p>

        <h2>Order Tracking</h2>
        <p>Once your order is dispatched, you'll receive a tracking number via SMS and email.</p>

        <h2>Cash on Delivery</h2>
        <p>We offer Cash on Delivery (COD) for all orders. Pay when you receive your product.</p>

        <h2>Contact Us</h2>
        <p>For shipping inquiries, contact us via WhatsApp or email.</p>
      </div>
    </div>
  );
}
```

### Exchange Policy Page

Create: `src/app/exchange-policy/page.tsx`

```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Exchange Policy',
  description: 'Learn about our exchange policy and how to request an exchange.',
};

export default function ExchangePolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-16">
      <h1 className="font-black text-3xl text-gray-950 mb-8">Exchange Policy</h1>
      
      <div className="prose prose-gray max-w-none">
        <h2>Exchange Eligibility</h2>
        <p>Products can be exchanged within 7 days of delivery if:</p>
        <ul>
          <li>Product is defective or damaged</li>
          <li>Wrong product was delivered</li>
          <li>Product doesn't match description</li>
        </ul>

        <h2>Exchange Process</h2>
        <ol>
          <li>Submit exchange request through our website</li>
          <li>Our team will review your request</li>
          <li>If approved, we'll arrange pickup</li>
          <li>Replacement will be sent after inspection</li>
        </ol>

        <h2>Non-Exchangeable Items</h2>
        <ul>
          <li>Products with physical damage caused by customer</li>
          <li>Products with missing accessories or packaging</li>
          <li>Products used beyond testing</li>
        </ul>

        <h2>Exchange Charges</h2>
        <p>No charges for defective products. Customer pays shipping for change of mind.</p>

        <h2>Request Exchange</h2>
        <p>Visit your order details page and click "Request Exchange" or contact us via WhatsApp.</p>
      </div>
    </div>
  );
}
```

## Handling Redirects

If Google reports "Page with redirect", check:

### 1. Intentional Redirects (Good)
- `/checkout` → `/auth/login` (if not logged in) ✅
- `/admin` → `/admin/dashboard` ✅
- Old URLs → New URLs ✅

### 2. Redirect Loops (Bad)
- Page A → Page B → Page A ❌
- Check your auth flow for loops

### 3. Too Many Redirects (Bad)
- Page A → Page B → Page C → Page D ❌
- Simplify redirect chain

## Robots.txt Check

Your current robots.txt blocks:
- `/admin/` ✅ (correct)
- `/account/` ✅ (correct)
- `/api/` ✅ (correct)
- `/auth/` ✅ (correct)
- `/checkout` ✅ (correct)
- `/order/` ✅ (correct)

These are intentionally blocked and should show as "Blocked by robots.txt" not "404".

## Sitemap Cleanup

Remove these from sitemap if pages don't exist:
- `/shipping-policy` (create page or remove)
- `/exchange-policy` (create page or remove)
- `/track-order` (verify exists)
- `/exchange-request` (verify exists)

## Action Plan

### Immediate Actions:
1. ✅ Create shipping-policy page
2. ✅ Create exchange-policy page
3. ✅ Verify all sitemap URLs exist
4. ✅ Request re-indexing in Search Console

### Monitor:
1. Check Search Console weekly
2. Fix new 404s as they appear
3. Monitor redirect issues
4. Track indexing progress

## Expected Results

After fixes:
- 404 errors should decrease
- More pages indexed
- Better search visibility
- Improved SEO

## Timeline

- **Immediate**: Create missing pages
- **1-2 days**: Google crawls new pages
- **1 week**: Indexing status updates
- **2-4 weeks**: Full indexing complete

## Notes

- Some 404s are normal (old URLs, typos)
- Don't worry about 404s on `/admin/`, `/api/`, etc.
- Focus on fixing 404s for public pages
- Redirects are okay if intentional

## Need Help?

If you see specific URLs with issues:
1. Share the URL
2. I'll check if it should exist
3. We'll fix or remove from sitemap
