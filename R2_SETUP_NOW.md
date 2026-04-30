# 🚀 R2 Setup - Do This Now!

**Time**: 30 minutes  
**Cost**: $0  
**Result**: Unlimited image bandwidth

---

## ✅ What I've Done For You

- ✅ Installed `@aws-sdk/client-s3`
- ✅ Created `src/lib/r2.ts` (upload utility)
- ✅ Updated `next.config.ts` (allow R2 images)
- ✅ Created test script

**You're 80% done! Just need to set up Cloudflare account.**

---

## 🎯 What You Need To Do

### Step 1: Create Cloudflare Account (5 min)

1. Go to: **https://dash.cloudflare.com/sign-up**
2. Sign up with email
3. Verify email
4. ✅ No credit card needed!

---

### Step 2: Create R2 Bucket (3 min)

1. In Cloudflare dashboard, click **"R2"** in left sidebar
2. Click **"Create bucket"**
3. Bucket name: `sultania-gadgets-images`
4. Location: **Automatic**
5. Click **"Create bucket"**

---

### Step 3: Enable Public Access (2 min)

1. Click on your bucket (`sultania-gadgets-images`)
2. Go to **"Settings"** tab
3. Scroll down to **"Public access"**
4. Click **"Allow Access"**
5. You'll see a URL like: `https://pub-abc123xyz.r2.dev`

**✅ COPY THIS URL** - You'll need it in Step 5!

---

### Step 4: Get API Credentials (5 min)

1. In R2 dashboard, click **"Manage R2 API Tokens"** (top right)
2. Click **"Create API Token"**
3. Fill in:
   - Token name: `sultania-gadgets-upload`
   - Permissions: **"Object Read & Write"**
   - Bucket: Select `sultania-gadgets-images`
4. Click **"Create API Token"**

**⚠️ IMPORTANT**: You'll see these values ONCE. Copy them now!

```
Access Key ID: xxxxxxxxxxxxxxxx
Secret Access Key: yyyyyyyyyyyyyyyy
```

**How to get Account ID**:
- Look at your browser URL
- It's in: `dash.cloudflare.com/YOUR_ACCOUNT_ID/r2`
- Copy the account ID from URL

---

### Step 5: Add to .env.local (3 min)

Open `sultania-gadgets/.env.local` and add:

```env
# Cloudflare R2 Storage
R2_ACCOUNT_ID=your_account_id_here
R2_ACCESS_KEY_ID=your_access_key_id_here
R2_SECRET_ACCESS_KEY=your_secret_access_key_here
R2_BUCKET_NAME=sultania-gadgets-images
R2_PUBLIC_URL=https://pub-abc123xyz.r2.dev
```

**Replace**:
- `your_account_id_here` with your account ID
- `your_access_key_id_here` with Access Key ID from Step 4
- `your_secret_access_key_here` with Secret Access Key from Step 4
- `https://pub-abc123xyz.r2.dev` with your public URL from Step 3

---

### Step 6: Test Upload (2 min)

```bash
cd sultania-gadgets
npx tsx scripts/test-r2.ts
```

**Expected output**:
```
🧪 Testing Cloudflare R2 Setup...

1️⃣ Checking environment variables...
✅ All environment variables present

2️⃣ Testing file upload...
✅ Upload successful!
   URL: https://pub-abc123xyz.r2.dev/test/logo.svg

📸 Visit this URL to see your image:
   https://pub-abc123xyz.r2.dev/test/logo.svg

3️⃣ Testing file listing...
✅ Found 1 file(s) in test/ folder
   Files:
   - test/logo.svg

✅ R2 Setup Complete!
```

**Visit the URL** in your browser - you should see your logo! ✅

---

### Step 7: Add to Vercel (5 min)

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
# Paste your R2 public URL, press Enter
```

---

### Step 8: Deploy (3 min)

```bash
vercel --prod
```

Wait 2-3 minutes for deployment.

---

## ✅ Verification Checklist

- [ ] Created Cloudflare account
- [ ] Created R2 bucket: `sultania-gadgets-images`
- [ ] Enabled public access
- [ ] Got API credentials (saved them!)
- [ ] Added to `.env.local`
- [ ] Test script passed ✅
- [ ] Added to Vercel env vars
- [ ] Deployed to production

---

## 🎉 You're Done!

**What happens now**:
- New product images will use R2 (unlimited bandwidth!)
- Existing images stay on Supabase (no migration needed yet)
- Images load faster (Cloudflare CDN)
- No bandwidth limits ever!

---

## 📊 Expected Results

### Before (Supabase Storage)
- Bandwidth: 5 GB/month limit
- Cost: $0 (until limit)
- Risk: Will hit limit as traffic grows

### After (R2)
- Bandwidth: Unlimited (FREE!)
- Storage: 10 GB free
- Speed: Faster (Cloudflare CDN)
- Cost: $0/month ✅

---

## 🚨 Troubleshooting

### Test script fails with "Missing environment variables"

**Solution**: Check `.env.local` has all 5 R2 variables

### Test script fails with "Access Denied"

**Solution**: 
1. Check API credentials are correct
2. Verify bucket name is exactly: `sultania-gadgets-images`
3. Check permissions are "Object Read & Write"

### Test script fails with "Bucket not found"

**Solution**: Check `R2_BUCKET_NAME` matches your bucket name exactly

### Images not loading after deployment

**Solution**:
1. Check Vercel env vars are set
2. Redeploy: `vercel --prod`
3. Check browser console for errors

---

## 💡 Next Steps (Optional)

### 1. Custom Domain (Recommended)

Instead of `pub-abc123.r2.dev`, use `images.sultaniagadgets.com`

**Setup**:
1. In Cloudflare DNS, add CNAME:
   - Name: `images`
   - Target: `sultania-gadgets-images.r2.cloudflarestorage.com`
2. In R2 bucket settings, connect custom domain
3. Update `.env.local`:
   ```env
   R2_PUBLIC_URL=https://images.sultaniagadgets.com
   ```

### 2. Migrate Existing Images

See `R2_MIGRATION_GUIDE.md` for migration script.

### 3. Image Optimization

Install Sharp for automatic optimization:
```bash
npm install sharp
```

---

## 📚 Resources

- **R2 Dashboard**: https://dash.cloudflare.com/r2
- **R2 Docs**: https://developers.cloudflare.com/r2/
- **Complete Guide**: `R2_MIGRATION_GUIDE.md`

---

## ❓ Need Help?

If you get stuck:
1. Check the error message
2. Verify all credentials are correct
3. Try test script again
4. Check Cloudflare dashboard

Let me know which step you're on and I can help! 🚀

---

## 🎯 Summary

**Time**: 30 minutes  
**Cost**: $0  
**Benefit**: Unlimited bandwidth forever  

**Current Status**: Ready to set up! Follow steps 1-8 above.

**After setup**: New products will automatically use R2 for images.

