# 🔓 Enable Public Access - Quick Guide

**Goal**: Make your R2 bucket publicly accessible

---

## 🎯 Quick Steps

### 1. Open Your Bucket
- Go to Cloudflare dashboard
- Click **"R2"** in sidebar
- Click on **"sultania-gadgets-images"** bucket

### 2. Go to Settings
- Click **"Settings"** tab at the top

### 3. Find Public Access
- Scroll down to **"Public access"** section
- OR look for **"R2.dev subdomain"** section

### 4. Enable It
- Click **"Allow Access"** button
- OR toggle the switch to **ON**

### 5. Copy URL
- You'll see: `https://pub-abc123xyz.r2.dev`
- **Copy this URL!**

---

## 🖼️ What It Looks Like

### Before Enabling:
```
┌──────────────────────────────────┐
│ Public Access                     │
│                                   │
│ Your bucket is private            │
│                                   │
│ [Allow Access] ← Click here       │
└──────────────────────────────────┘
```

### After Enabling:
```
┌──────────────────────────────────┐
│ Public Access                     │
│                                   │
│ ✓ Enabled                         │
│                                   │
│ Public URL:                       │
│ https://pub-abc123xyz.r2.dev     │
│                                   │
│ [Copy URL] [Disable]              │
└──────────────────────────────────┘
```

---

## 📍 Where to Find It

### Location 1: Settings Tab (Most Common)
```
Bucket → Settings → Scroll down → "Public Access"
```

### Location 2: R2.dev Subdomain
```
Bucket → Settings → "R2.dev subdomain" → "Allow Access"
```

### Location 3: Custom Domains (Alternative)
```
Bucket → Settings → "Custom Domains" → "Connect Domain"
```

---

## ✅ Verification

### Test if it worked:

1. After enabling, you should see a URL like:
   ```
   https://pub-abc123xyz456.r2.dev
   ```

2. Copy this URL

3. Add to `.env.local`:
   ```env
   R2_PUBLIC_URL=https://pub-abc123xyz456.r2.dev
   ```

4. Test it:
   ```bash
   npx tsx scripts/test-r2.ts
   ```

---

## 🚨 Common Issues

### Issue 1: Can't Find "Public Access"

**Solution**: Look for these alternative names:
- "R2.dev subdomain"
- "Public bucket"
- "Allow public access"
- "Connect domain"

### Issue 2: No "Allow Access" Button

**Solution**: 
- Look for a toggle switch instead
- Or it might already be enabled (check for existing URL)

### Issue 3: Button is Grayed Out

**Solution**:
- Make sure you're on the Settings tab
- Try refreshing the page
- Check you have permission to modify bucket

---

## 💡 Alternative: Custom Domain

If you can't enable R2.dev subdomain:

### Use Your Own Domain

1. Go to Settings → Custom Domains
2. Click "Connect Domain"
3. Enter: `images.sultaniagadgets.com`
4. Add DNS record (CNAME):
   ```
   Name: images
   Target: sultania-gadgets-images.r2.cloudflarestorage.com
   ```
5. Use in `.env.local`:
   ```env
   R2_PUBLIC_URL=https://images.sultaniagadgets.com
   ```

---

## 📞 Need Help?

### Tell me what you see:

1. Are you on the Settings tab? (Yes/No)
2. Do you see "Public Access" section? (Yes/No)
3. Do you see "R2.dev subdomain" section? (Yes/No)
4. What buttons do you see?

I'll help you find it!

---

## 🎉 Once Done

After enabling public access:

✅ You have a public URL  
✅ Add it to `.env.local`  
✅ Continue with API credentials (Step 4)  
✅ Test upload  
✅ Deploy!  

---

## 🚀 Next Step

After getting your public URL, go back to **`R2_SETUP_NOW.md`** and continue with **Step 4: Get API Credentials**.

You're doing great! 🎉

