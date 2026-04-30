# Fix OAuth Redirect Issue - "localhost:3000 cannot be reached"

## 🔴 Problem
After clicking "Continue with Google", you're redirected to `localhost:3000` instead of your production site.

## ✅ Solution

### Step 1: Update Supabase Site URL

1. Go to: **https://supabase.com/dashboard**
2. Select your project
3. Click **Settings** (gear icon in left sidebar)
4. Click **General** or **API**
5. Find **Site URL** or **Redirect URLs**
6. Make sure it's set to:
   ```
   https://sultaniagadgets.com
   ```
7. Click **Save**

### Step 2: Add Redirect URLs in Supabase

1. In Supabase, go to **Authentication** → **URL Configuration**
2. Find **Redirect URLs** section
3. Add these URLs:
   ```
   https://sultaniagadgets.com/**
   https://sultaniagadgets.com/auth/confirm
   ```
4. Remove any `localhost` URLs if present
5. Click **Save**

### Step 3: Update Google OAuth Redirect URI

1. Go to: **https://console.cloud.google.com/**
2. Go to **APIs & Services** → **Credentials**
3. Click on your OAuth client: **"Sultania Gadgets Web"**
4. Under **Authorized redirect URIs**, make sure you have:
   ```
   https://tblvxsfmcqbltifoqrnx.supabase.co/auth/v1/callback
   ```
5. Also add (if not present):
   ```
   https://sultaniagadgets.com/auth/confirm
   ```
6. Click **Save**

### Step 4: Clear Browser Cache

1. Close all browser tabs
2. Clear browser cache (Ctrl+Shift+Delete)
3. Or use Incognito/Private mode

### Step 5: Test Again

1. Go to: **https://sultaniagadgets.com**
2. Click account icon
3. Click "Continue with Google"
4. Sign in
5. Should redirect back to your site ✅

---

## 🔍 Where to Check in Supabase

### Option A: Authentication Settings
1. **Authentication** → **URL Configuration**
2. Look for:
   - **Site URL**: `https://sultaniagadgets.com`
   - **Redirect URLs**: Add your production URLs

### Option B: Project Settings
1. **Settings** → **API**
2. Look for:
   - **Project URL**: Should be your Supabase URL
   - **Site URL**: Should be `https://sultaniagadgets.com`

---

## 📝 Correct Configuration

### Supabase Settings:
```
Site URL: https://sultaniagadgets.com
Redirect URLs:
  - https://sultaniagadgets.com/**
  - https://sultaniagadgets.com/auth/confirm
```

### Google OAuth Settings:
```
Authorized redirect URIs:
  - https://tblvxsfmcqbltifoqrnx.supabase.co/auth/v1/callback
```

---

## ⚠️ Common Mistakes

❌ Site URL still set to `http://localhost:3000`
❌ Redirect URLs not added in Supabase
❌ Browser cache showing old redirect
❌ Wrong redirect URI in Google Console

✅ Site URL is production domain
✅ Redirect URLs include production URLs
✅ Browser cache cleared
✅ Correct Supabase callback URL in Google

---

## 🆘 Still Not Working?

### Check These:

1. **Supabase Site URL**:
   - Settings → API → Site URL
   - Should be: `https://sultaniagadgets.com`

2. **Supabase Redirect URLs**:
   - Authentication → URL Configuration
   - Add: `https://sultaniagadgets.com/**`

3. **Google Redirect URI**:
   - Must be: `https://tblvxsfmcqbltifoqrnx.supabase.co/auth/v1/callback`
   - NOT your website URL

4. **Clear Everything**:
   - Clear browser cache
   - Try incognito mode
   - Try different browser

---

## 🎯 Quick Fix Checklist

- [ ] Supabase Site URL = `https://sultaniagadgets.com`
- [ ] Supabase Redirect URLs include production domain
- [ ] Google OAuth redirect URI = Supabase callback URL
- [ ] Browser cache cleared
- [ ] Test in incognito mode

---

## 💡 Why This Happens

The redirect to `localhost:3000` means:
- Supabase Site URL is still set to localhost (from development)
- OR browser cached the old redirect
- OR redirect URLs not configured in Supabase

The fix is to update Supabase settings to use your production domain.

---

After making these changes, Google OAuth should redirect back to your production site! 🎉
