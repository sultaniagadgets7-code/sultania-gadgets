# 🖼️ Cloudflare R2 Migration Guide

**Goal**: Move product images from Supabase Storage to Cloudflare R2  
**Benefit**: Free storage + bandwidth, faster loading, reduce Supabase load  
**Time**: 30-60 minutes  
**Cost**: $0 (R2 free tier is generous)

---

## 📊 Why Cloudflare R2?

### Cloudflare R2 Free Tier
- **Storage**: 10 GB free
- **Class A Operations**: 1 million/month (uploads)
- **Class B Operations**: 10 million/month (downloads)
- **Bandwidth**: FREE (no egress fees!)
- **Perfect for**: Product images, static assets

### vs Supabase Storage
- **Storage**: 1 GB free (then $0.021/GB)
- **Bandwidth**: 5 GB/month free (then $0.09/GB)
- **Problem**: Bandwidth limit is tight for images

### vs Vercel Blob
- **Storage**: 1 GB free (then $0.15/GB)
- **Bandwidth**: 100 GB free (then $0.15/GB)
- **Cost**: $5/month for 100 GB
- **Good but**: R2 is free!

---

## 🚀 Setup Process

### Step 1: Create Cloudflare Account (5 minutes)

1. Go to: https://dash.cloudflare.com/sign-up
2. Sign up with email
3. Verify email
4. No credit card required for free tier!

### Step 2: Create R2 Bucket (3 minutes)

1. In Cloudflare dashboard, click "R2" in sidebar
2. Click "Create bucket"
3. Bucket name: `sultania-gadgets-images`
4. Location: Automatic (closest to your users)
5. Click "Create bucket"

### Step 3: Enable Public Access (2 minutes)

1. Click on your bucket
2. Go to "Settings" tab
3. Scroll to "Public access"
4. Click "Allow Access"
5. Domain: `images.sultaniagadgets.com` (or use R2.dev subdomain)

**Option A: Use R2.dev subdomain (easiest)**
- Cloudflare provides: `pub-xxxxx.r2.dev`
- Free, instant, no setup
- Example: `https://pub-abc123.r2.dev/products/image.jpg`

**Option B: Custom domain (recommended)**
- Use your domain: `images.sultaniagadgets.com`
- Requires DNS setup (5 minutes)
- More professional

### Step 4: Get API Credentials (3 minutes)

1. In R2 dashboard, click "Manage R2 API Tokens"
2. Click "Create API Token"
3. Token name: `sultania-gadgets-upload`
4. Permissions: "Object Read & Write"
5. Bucket: Select your bucket
6. Click "Create API Token"
7. **Save these values**:
   - Access Key ID
   - Secret Access Key
   - Endpoint URL

---

## 💻 Implementation

### Step 5: Install R2 Client (2 minutes)

```bash
cd sultania-gadgets
npm install @aws-sdk/client-s3
```

R2 is S3-compatible, so we use AWS SDK.

### Step 6: Add Environment Variables (2 minutes)

Add to `.env.local`:

```env
# Cloudflare R2
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
R2_BUCKET_NAME=sultania-gadgets-images
R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
# Or if using custom domain:
# R2_PUBLIC_URL=https://images.sultaniagadgets.com
```

Also add to Vercel:
```bash
vercel env add R2_ACCOUNT_ID
vercel env add R2_ACCESS_KEY_ID
vercel env add R2_SECRET_ACCESS_KEY
vercel env add R2_BUCKET_NAME
vercel env add R2_PUBLIC_URL
```

### Step 7: Create R2 Upload Utility (5 minutes)

Create `src/lib/r2.ts`:

```typescript
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

// Initialize R2 client
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME!;
const PUBLIC_URL = process.env.R2_PUBLIC_URL!;

/**
 * Upload file to R2
 * @param file - File to upload
 * @param path - Path in bucket (e.g., 'products/image.jpg')
 * @returns Public URL of uploaded file
 */
export async function uploadToR2(
  file: File | Buffer,
  path: string,
  contentType?: string
): Promise<string> {
  const buffer = file instanceof File ? Buffer.from(await file.arrayBuffer()) : file;
  
  await r2Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: path,
      Body: buffer,
      ContentType: contentType || 'image/jpeg',
    })
  );
  
  return `${PUBLIC_URL}/${path}`;
}

/**
 * Delete file from R2
 * @param path - Path in bucket
 */
export async function deleteFromR2(path: string): Promise<void> {
  await r2Client.send(
    new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: path,
    })
  );
}

/**
 * Get public URL for R2 file
 * @param path - Path in bucket
 */
export function getR2Url(path: string): string {
  return `${PUBLIC_URL}/${path}`;
}
```

### Step 8: Update Product Form (10 minutes)

Update `src/app/admin/products/ProductForm.tsx` to upload to R2:

```typescript
// Add import
import { uploadToR2 } from '@/lib/r2';

// In handleImageUpload function:
async function handleImageUpload(file: File) {
  try {
    setUploading(true);
    
    // Generate unique filename
    const timestamp = Date.now();
    const filename = `products/${timestamp}-${file.name}`;
    
    // Upload to R2
    const url = await uploadToR2(file, filename, file.type);
    
    // Add to images array
    setImages([...images, { url, alt: '', sort_order: images.length }]);
    
    setUploading(false);
  } catch (error) {
    console.error('Upload failed:', error);
    setUploading(false);
  }
}
```

---

## 📦 Migration Strategy

### Option A: Gradual Migration (Recommended)

**New products**: Upload to R2  
**Existing products**: Keep on Supabase for now  
**Migrate later**: When you have time

**Pros**:
- No downtime
- Test R2 first
- Migrate at your pace

**Cons**:
- Images in two places temporarily

### Option B: Full Migration

**Migrate all images at once**

**Pros**:
- Clean, everything in one place
- Maximum bandwidth savings

**Cons**:
- Takes time (if you have many images)
- Need migration script

---

## 🔄 Migration Script (Option B)

If you want to migrate all existing images:

Create `scripts/migrate-to-r2.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';
import { uploadToR2 } from '../src/lib/r2';
import fetch from 'node-fetch';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Need service role key
);

async function migrateImages() {
  console.log('Starting migration...');
  
  // Get all product images
  const { data: images } = await supabase
    .from('product_images')
    .select('id, image_url');
  
  if (!images) {
    console.log('No images found');
    return;
  }
  
  console.log(`Found ${images.length} images to migrate`);
  
  for (const image of images) {
    try {
      console.log(`Migrating: ${image.image_url}`);
      
      // Download from Supabase
      const response = await fetch(image.image_url);
      const buffer = Buffer.from(await response.arrayBuffer());
      
      // Extract filename
      const filename = image.image_url.split('/').pop() || 'image.jpg';
      const path = `products/${filename}`;
      
      // Upload to R2
      const newUrl = await uploadToR2(buffer, path, 'image/jpeg');
      
      // Update database
      await supabase
        .from('product_images')
        .update({ image_url: newUrl })
        .eq('id', image.id);
      
      console.log(`✓ Migrated: ${filename}`);
    } catch (error) {
      console.error(`✗ Failed: ${image.image_url}`, error);
    }
  }
  
  console.log('Migration complete!');
}

migrateImages();
```

Run migration:
```bash
npx tsx scripts/migrate-to-r2.ts
```

---

## 🎯 Custom Domain Setup (Optional)

### Step 1: Add DNS Record

In Cloudflare DNS (or your DNS provider):

```
Type: CNAME
Name: images
Target: sultania-gadgets-images.r2.cloudflarestorage.com
Proxy: Yes (orange cloud)
```

### Step 2: Connect to R2 Bucket

1. In R2 bucket settings
2. Go to "Custom Domains"
3. Click "Connect Domain"
4. Enter: `images.sultaniagadgets.com`
5. Click "Connect"

### Step 3: Update Environment Variable

```env
R2_PUBLIC_URL=https://images.sultaniagadgets.com
```

---

## 📊 Expected Results

### Before (Supabase Storage)
- **Bandwidth**: 5 GB/month limit
- **Cost**: $0 (until limit)
- **Speed**: Good
- **Problem**: Bandwidth limit

### After (Cloudflare R2)
- **Bandwidth**: Unlimited (free!)
- **Cost**: $0 (10 GB storage free)
- **Speed**: Faster (Cloudflare CDN)
- **Benefit**: No bandwidth worries ✅

### Bandwidth Savings

With 100 products, 3 images each:
- **Images**: 300 images × 200 KB = 60 MB
- **Monthly views**: 10,000 page views
- **Bandwidth**: 60 MB × 10,000 = 600 GB

**On Supabase**: Would cost ~$54/month (over free tier)  
**On R2**: $0/month ✅

---

## 🔧 Testing

### Test Upload

1. Go to admin panel
2. Create new product
3. Upload image
4. Check it uploads to R2
5. Verify image displays correctly

### Test URL

Visit your R2 URL:
```
https://pub-xxxxx.r2.dev/products/test.jpg
```

Should display image.

---

## 🚨 Important Notes

### 1. Keep Supabase for Database

R2 is ONLY for images. Keep using Supabase for:
- Product data
- Orders
- Users
- Everything except images

### 2. Image URLs in Database

Store R2 URLs in `product_images` table:
```
Before: https://tblvxsfmcqbltifoqrnx.supabase.co/storage/v1/object/public/...
After: https://pub-xxxxx.r2.dev/products/image.jpg
```

### 3. Next.js Image Optimization

Update `next.config.ts`:

```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'pub-*.r2.dev', // R2.dev subdomain
    },
    {
      protocol: 'https',
      hostname: 'images.sultaniagadgets.com', // Custom domain
    },
    // Keep Supabase for existing images
    {
      protocol: 'https',
      hostname: '*.supabase.co',
    },
  ],
}
```

---

## ✅ Checklist

### Setup
- [ ] Create Cloudflare account
- [ ] Create R2 bucket
- [ ] Enable public access
- [ ] Get API credentials
- [ ] Add environment variables

### Implementation
- [ ] Install @aws-sdk/client-s3
- [ ] Create src/lib/r2.ts
- [ ] Update ProductForm.tsx
- [ ] Update next.config.ts
- [ ] Test upload

### Migration (Optional)
- [ ] Create migration script
- [ ] Run migration
- [ ] Verify all images work
- [ ] Delete old Supabase images

### Custom Domain (Optional)
- [ ] Add DNS record
- [ ] Connect to R2 bucket
- [ ] Update R2_PUBLIC_URL
- [ ] Test custom domain

---

## 💰 Cost Comparison

### Scenario: 1,000 products, 3 images each

**Supabase Storage**:
- Storage: 600 MB (within 1 GB free)
- Bandwidth: 600 GB/month
- Cost: ~$54/month ❌

**Cloudflare R2**:
- Storage: 600 MB (within 10 GB free)
- Bandwidth: Unlimited (free!)
- Cost: $0/month ✅

**Savings**: $54/month = $648/year! 💰

---

## 🎯 Recommendation

### Phase 1: Start with New Products (Today)
1. Set up R2 (30 minutes)
2. Update ProductForm to upload to R2
3. New products use R2
4. Existing products stay on Supabase

### Phase 2: Migrate Existing (Next Week)
1. Create migration script
2. Run during low-traffic time
3. Migrate all images to R2
4. Delete from Supabase

### Phase 3: Custom Domain (Optional)
1. Set up images.sultaniagadgets.com
2. Update R2_PUBLIC_URL
3. More professional URLs

---

## 📚 Resources

- **R2 Docs**: https://developers.cloudflare.com/r2/
- **R2 Pricing**: https://developers.cloudflare.com/r2/pricing/
- **AWS SDK Docs**: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/

---

## 🚀 Quick Start

**Want to start now?**

1. Create Cloudflare account: https://dash.cloudflare.com/sign-up
2. Create R2 bucket: `sultania-gadgets-images`
3. Get API credentials
4. Add to `.env.local`
5. Install: `npm install @aws-sdk/client-s3`
6. Create `src/lib/r2.ts` (code above)
7. Test with one image upload

**Total time**: 30 minutes  
**Cost**: $0  
**Benefit**: Unlimited bandwidth, faster images ✅

---

## ❓ Questions?

Let me know if you want help with:
1. Setting up R2 bucket
2. Creating the upload utility
3. Migration script
4. Custom domain setup
5. Testing

I can guide you through each step! 🚀

