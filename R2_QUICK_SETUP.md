# ⚡ R2 Quick Setup (30 Minutes)

**Goal**: Move product images to Cloudflare R2 (free, unlimited bandwidth)

---

## Why R2?

**Current (Supabase Storage)**:
- 5 GB bandwidth/month limit
- Will hit limit as traffic grows
- Costs $0.09/GB after limit

**With R2**:
- Unlimited bandwidth (FREE!)
- 10 GB storage free
- Faster (Cloudflare CDN)
- $0/month ✅

---

## Step 1: Create Cloudflare Account (5 min)

1. Go to: https://dash.cloudflare.com/sign-up
2. Sign up with email
3. Verify email
4. ✅ No credit card needed!

---

## Step 2: Create R2 Bucket (3 min)

1. In Cloudflare dashboard, click **"R2"** in left sidebar
2. Click **"Create bucket"**
3. Bucket name: `sultania-gadgets-images`
4. Location: **Automatic**
5. Click **"Create bucket"**

---

## Step 3: Enable Public Access (2 min)

1. Click on your bucket
2. Go to **"Settings"** tab
3. Scroll to **"Public access"**
4. Click **"Allow Access"**
5. You'll get a URL like: `https://pub-abc123xyz.r2.dev`
6. ✅ Copy this URL (you'll need it!)

---

## Step 4: Get API Credentials (3 min)

1. In R2 dashboard, click **"Manage R2 API Tokens"**
2. Click **"Create API Token"**
3. Token name: `sultania-gadgets-upload`
4. Permissions: **"Object Read & Write"**
5. Bucket: Select `sultania-gadgets-images`
6. Click **"Create API Token"**

7. ✅ **SAVE THESE VALUES**:
   ```
   Access Key ID: xxxxxxxxxxxxxxxx
   Secret Access Key: yyyyyyyyyyyyyyyy
   Endpoint: https://xxxxx.r2.cloudflarestorage.com
   ```

8. ⚠️ **Important**: You can only see these once! Save them now.

---

## Step 5: Add to Environment Variables (5 min)

### Local (.env.local)

Add to `sultania-gadgets/.env.local`:

```env
# Cloudflare R2 Storage
R2_ACCOUNT_ID=your_account_id_here
R2_ACCESS_KEY_ID=your_access_key_id_here
R2_SECRET_ACCESS_KEY=your_secret_access_key_here
R2_BUCKET_NAME=sultania-gadgets-images
R2_PUBLIC_URL=https://pub-abc123xyz.r2.dev
```

**How to get Account ID**:
1. In Cloudflare dashboard
2. Click "R2" in sidebar
3. Look at the URL: `dash.cloudflare.com/YOUR_ACCOUNT_ID/r2`
4. Copy the account ID from URL

### Production (Vercel)

```bash
cd sultania-gadgets

vercel env add R2_ACCOUNT_ID
# Paste your account ID, press Enter

vercel env add R2_ACCESS_KEY_ID
# Paste your access key ID, press Enter

vercel env add R2_SECRET_ACCESS_KEY
# Paste your secret access key, press Enter

vercel env add R2_BUCKET_NAME
# Type: sultania-gadgets-images, press Enter

vercel env add R2_PUBLIC_URL
# Paste your R2 public URL (https://pub-xxx.r2.dev), press Enter
```

---

## Step 6: Install Dependencies (2 min)

```bash
cd sultania-gadgets
npm install @aws-sdk/client-s3
```

---

## Step 7: Files Already Created ✅

I've already created these files for you:
- ✅ `src/lib/r2.ts` - R2 upload utility
- ✅ `R2_MIGRATION_GUIDE.md` - Complete guide

---

## Step 8: Update Next.js Config (2 min)

Add R2 domain to `next.config.ts`:

```typescript
// next.config.ts
images: {
  remotePatterns: [
    // Add this for R2
    {
      protocol: 'https',
      hostname: 'pub-*.r2.dev',
    },
    // Keep existing patterns
    {
      protocol: 'https',
      hostname: '**',
    },
  ],
}
```

---

## Step 9: Test Upload (5 min)

Create a test script `scripts/test-r2.ts`:

```typescript
import { uploadToR2, getR2Url } from '../src/lib/r2';
import fs from 'fs';

async function testR2() {
  console.log('Testing R2 upload...');
  
  // Read a test image
  const testImage = fs.readFileSync('public/logo.svg');
  
  // Upload to R2
  const url = await uploadToR2(
    testImage,
    'test/logo.svg',
    'image/svg+xml'
  );
  
  console.log('✅ Upload successful!');
  console.log('URL:', url);
  console.log('Visit this URL to see your image');
}

testR2();
```

Run test:
```bash
npx tsx scripts/test-r2.ts
```

If successful, you'll see:
```
Testing R2 upload...
✅ Upload successful!
URL: https://pub-abc123xyz.r2.dev/test/logo.svg
Visit this URL to see your image
```

Visit the URL in browser - you should see your logo! ✅

---

## Step 10: Deploy (3 min)

```bash
vercel --prod
```

---

## ✅ Checklist

- [ ] Created Cloudflare account
- [ ] Created R2 bucket: `sultania-gadgets-images`
- [ ] Enabled public access
- [ ] Got API credentials (saved them!)
- [ ] Added to `.env.local`
- [ ] Added to Vercel env vars
- [ ] Installed `@aws-sdk/client-s3`
- [ ] Updated `next.config.ts`
- [ ] Tested upload (optional)
- [ ] Deployed to production

---

## 🎯 What's Next?

### Option A: Gradual Migration (Recommended)

**New products**: Will automatically use R2 (after you update ProductForm)  
**Existing products**: Keep on Supabase for now  
**Migrate later**: When you have time

### Option B: Full Migration

Run migration script to move all existing images to R2.

See `R2_MIGRATION_GUIDE.md` for details.

---

## 📊 Expected Results

### Before (Supabase)
- Bandwidth: 5 GB/month limit
- Risk: Hit limit as traffic grows
- Cost: $0 (until limit)

### After (R2)
- Bandwidth: Unlimited (FREE!)
- Storage: 10 GB free
- Speed: Faster (Cloudflare CDN)
- Cost: $0/month ✅

---

## 🚨 Troubleshooting

### "Access Denied" error

**Solution**: Check your API credentials in `.env.local`

### "Bucket not found" error

**Solution**: Check `R2_BUCKET_NAME` matches your bucket name exactly

### "Invalid endpoint" error

**Solution**: Check `R2_ACCOUNT_ID` is correct

### Images not loading

**Solution**: 
1. Check public access is enabled on bucket
2. Check `R2_PUBLIC_URL` is correct
3. Check `next.config.ts` has R2 domain

---

## 💡 Pro Tips

### 1. Use Custom Domain (Optional)

Instead of `pub-abc123.r2.dev`, use `images.sultaniagadgets.com`

See `R2_MIGRATION_GUIDE.md` for setup.

### 2. Organize by Folder

```
products/
  chargers/
  earbuds/
  cables/
logos/
banners/
```

### 3. Optimize Images Before Upload

```bash
npm install sharp
```

```typescript
import sharp from 'sharp';

// Resize and optimize
const optimized = await sharp(buffer)
  .resize(1200, 1200, { fit: 'inside' })
  .jpeg({ quality: 85 })
  .toBuffer();

await uploadToR2(optimized, path, 'image/jpeg');
```

---

## 📚 Resources

- **R2 Dashboard**: https://dash.cloudflare.com/r2
- **R2 Docs**: https://developers.cloudflare.com/r2/
- **Complete Guide**: `R2_MIGRATION_GUIDE.md`

---

## ❓ Need Help?

Let me know if you need help with:
1. Getting API credentials
2. Testing upload
3. Updating ProductForm
4. Migration script
5. Custom domain setup

I can guide you through each step! 🚀

---

## 🎉 Summary

**Time**: 30 minutes  
**Cost**: $0  
**Benefit**: Unlimited bandwidth, faster images  
**Next**: Update ProductForm to use R2 for new uploads

**You're now ready to use R2!** 🚀

