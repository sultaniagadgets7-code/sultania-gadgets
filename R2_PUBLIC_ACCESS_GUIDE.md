# 🔓 Enable Public Access on R2 Bucket

**Step-by-step guide with detailed instructions**

---

## 📍 Where You Are

You've created your R2 bucket: `sultania-gadgets-images`  
Now you need to make it publicly accessible so images can be viewed on your website.

---

## 🎯 Step-by-Step Instructions

### Step 1: Go to Your Bucket

1. In Cloudflare dashboard, click **"R2"** in the left sidebar
2. You'll see your bucket: `sultania-gadgets-images`
3. **Click on the bucket name** to open it

---

### Step 2: Go to Settings Tab

Once inside your bucket, you'll see several tabs at the top:
- Overview
- Objects
- **Settings** ← Click this one
- Metrics

**Click on "Settings"** tab

---

### Step 3: Find Public Access Section

Scroll down on the Settings page until you see a section called:

**"Public access"** or **"R2.dev subdomain"**

This section will have:
- A toggle or button
- Text explaining public access
- Information about the public URL

---

### Step 4: Enable Public Access

You'll see one of these options:

#### Option A: "Allow Access" Button
- Click the **"Allow Access"** button
- A confirmation dialog may appear
- Click **"Confirm"** or **"Enable"**

#### Option B: Toggle Switch
- Find a toggle switch labeled "Public access" or "Allow public access"
- Click the toggle to turn it **ON** (it should turn blue/green)

#### Option C: "Connect Domain" Section
- Look for **"R2.dev subdomain"** section
- Click **"Allow Access"** or **"Enable"**

---

### Step 5: Get Your Public URL

After enabling public access, you'll see:

**Public URL** or **R2.dev subdomain**:
```
https://pub-abc123xyz456.r2.dev
```

**✅ COPY THIS URL!** You'll need it for your `.env.local` file.

---

## 🖼️ Visual Guide

### What You're Looking For:

```
┌─────────────────────────────────────────────────┐
│ Settings                                         │
├─────────────────────────────────────────────────┤
│                                                  │
│ Bucket Details                                   │
│ Name: sultania-gadgets-images                    │
│ Created: ...                                     │
│                                                  │
│ ─────────────────────────────────────────────   │
│                                                  │
│ Public Access                                    │
│ ┌─────────────────────────────────────────────┐ │
│ │ R2.dev subdomain                            │ │
│ │                                             │ │
│ │ Allow public access to your bucket via     │ │
│ │ a Cloudflare-managed domain.               │ │
│ │                                             │ │
│ │ [Allow Access] ← Click this button         │ │
│ └─────────────────────────────────────────────┘ │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

## ✅ After Enabling

Once enabled, you'll see:

```
┌─────────────────────────────────────────────────┐
│ Public Access                                    │
│ ┌─────────────────────────────────────────────┐ │
│ │ ✓ Public access enabled                     │ │
│ │                                             │ │
│ │ Public URL:                                 │ │
│ │ https://pub-abc123xyz456.r2.dev            │ │
│ │                                             │ │
│ │ [Copy URL]  [Disable Access]               │ │
│ └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

**Copy the URL** - you'll need it!

---

## 🚨 Troubleshooting

### Can't Find "Public Access" Section?

**Try these locations**:

1. **Settings tab** (most common)
   - Click bucket → Settings tab → Scroll down

2. **Overview tab**
   - Click bucket → Overview tab → Look for "Public access" card

3. **R2.dev subdomain**
   - Look for section titled "R2.dev subdomain"
   - This is the same as "Public access"

### Don't See "Allow Access" Button?

**Possible reasons**:

1. **Already enabled**
   - Look for "Public access enabled" message
   - You'll see your public URL already displayed

2. **Different UI version**
   - Look for a toggle switch instead of button
   - Look for "Connect domain" or "Enable public access"

3. **Need to scroll**
   - The section might be below the fold
   - Scroll down on the Settings page

---

## 📝 Alternative Method: Custom Domain

If you can't find the R2.dev subdomain option, you can use a custom domain:

### Step 1: Go to Settings → Custom Domains

1. Click your bucket
2. Go to **Settings** tab
3. Find **"Custom Domains"** section
4. Click **"Connect Domain"**

### Step 2: Use Your Domain

1. Enter: `images.sultaniagadgets.com`
2. Click **"Connect"**
3. Add DNS record (Cloudflare will show you how)

### Step 3: Use Custom Domain

In your `.env.local`:
```env
R2_PUBLIC_URL=https://images.sultaniagadgets.com
```

---

## 🎯 What You Need

After enabling public access, you need:

1. **Public URL** (one of these):
   - R2.dev subdomain: `https://pub-abc123xyz.r2.dev`
   - Custom domain: `https://images.sultaniagadgets.com`

2. **Add to .env.local**:
   ```env
   R2_PUBLIC_URL=https://pub-abc123xyz.r2.dev
   ```

---

## ✅ Verification

### Test if Public Access Works

1. Upload a test file to your bucket
2. Get the public URL: `https://pub-abc123xyz.r2.dev/test.jpg`
3. Open URL in browser
4. If you see the image → ✅ Public access is working!
5. If you get "Access Denied" → ❌ Public access not enabled

---

## 📞 Still Stuck?

### Option 1: Check Cloudflare Docs

Go to: https://developers.cloudflare.com/r2/buckets/public-buckets/

### Option 2: Use Custom Domain Instead

Skip R2.dev subdomain and use custom domain:
1. Settings → Custom Domains
2. Connect `images.sultaniagadgets.com`
3. Add DNS record
4. Use custom domain as R2_PUBLIC_URL

### Option 3: Contact Me

Tell me what you see on the Settings page:
- Do you see "Public Access" section?
- Do you see "R2.dev subdomain" section?
- Do you see "Custom Domains" section?
- What buttons/options do you see?

I'll help you find the right option!

---

## 🎉 Once Enabled

After enabling public access:

1. ✅ Copy your public URL
2. ✅ Add to `.env.local`:
   ```env
   R2_PUBLIC_URL=https://pub-abc123xyz.r2.dev
   ```
3. ✅ Continue with Step 4 in `R2_SETUP_NOW.md`

---

## 📋 Quick Checklist

- [ ] Opened bucket in Cloudflare dashboard
- [ ] Clicked "Settings" tab
- [ ] Found "Public Access" or "R2.dev subdomain" section
- [ ] Clicked "Allow Access" button or enabled toggle
- [ ] Copied public URL
- [ ] Added to `.env.local`

---

## 💡 Pro Tip

**Bookmark your bucket URL** for easy access:
```
https://dash.cloudflare.com/YOUR_ACCOUNT_ID/r2/buckets/sultania-gadgets-images
```

This takes you directly to your bucket!

---

## 🚀 Next Steps

After enabling public access:

1. Get API credentials (Step 4 in R2_SETUP_NOW.md)
2. Add all credentials to `.env.local`
3. Test upload: `npx tsx scripts/test-r2.ts`
4. Deploy to production

You're almost there! 🎉

