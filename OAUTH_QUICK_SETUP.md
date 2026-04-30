# Quick OAuth Setup Guide - Connect Google & Apple Login

## ⚠️ Important: You're Using Supabase, Not Firebase

Your app uses **Supabase** for authentication. The OAuth buttons are already coded and ready - you just need to enable them in your Supabase dashboard.

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Go to Supabase Dashboard

1. Open: https://supabase.com/dashboard
2. Log in to your account
3. Select your project: **sultania-gadgets**

### Step 2: Enable Google Login

1. In the left sidebar, click **Authentication**
2. Click **Providers** tab
3. Find **Google** in the list
4. Click to expand it
5. Toggle **Enable Sign in with Google** to ON
6. You'll see it needs:
   - Client ID
   - Client Secret

**Getting Google Credentials:**

1. Go to: https://console.cloud.google.com/
2. Create a new project or select existing
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Choose **Web application**
6. Add this redirect URI:
   ```
   https://tblvxsfmcqbltifoqrnx.supabase.co/auth/v1/callback
   ```
7. Copy the **Client ID** and **Client Secret**
8. Paste them into Supabase
9. Click **Save**

### Step 3: Enable Apple Login

1. In Supabase, find **Apple** in the Providers list
2. Toggle **Enable Sign in with Apple** to ON
3. You'll need:
   - Services ID
   - Team ID
   - Key ID
   - Private Key (.p8 file)

**Getting Apple Credentials:**

1. Go to: https://developer.apple.com/account/
2. Navigate to **Certificates, Identifiers & Profiles**
3. Create a **Service ID**:
   - Click **Identifiers** → **+**
   - Select **Services IDs**
   - Register with identifier like: `com.sultaniagadgets.auth`
   - Enable **Sign in with Apple**
   - Add domain: `sultaniagadgets.com`
   - Add return URL:
     ```
     https://tblvxsfmcqbltifoqrnx.supabase.co/auth/v1/callback
     ```

4. Create a **Key**:
   - Go to **Keys** → **+**
   - Enable **Sign in with Apple**
   - Download the `.p8` file
   - Note the **Key ID**

5. Get your **Team ID**:
   - Click your name in top right
   - Copy the 10-character Team ID

6. Paste all credentials into Supabase
7. Click **Save**

---

## ✅ Testing

1. Go to: https://sultaniagadgets.com
2. Click the account icon (top right)
3. You'll see:
   - **Continue with Google** button
   - **Continue with Apple** button
4. Click either button
5. Complete authentication
6. You should be logged in!

---

## 🔧 Current Status

✅ **Code Implementation**: Complete
✅ **UI Buttons**: Added to login/signup
✅ **OAuth Handler**: Implemented
✅ **Redirect URLs**: Configured

⏳ **Supabase Configuration**: You need to do this
⏳ **Google Credentials**: You need to add
⏳ **Apple Credentials**: You need to add

---

## 📝 Quick Checklist

### Google OAuth
- [ ] Go to Google Cloud Console
- [ ] Create OAuth credentials
- [ ] Add redirect URI: `https://tblvxsfmcqbltifoqrnx.supabase.co/auth/v1/callback`
- [ ] Copy Client ID and Secret
- [ ] Paste into Supabase → Authentication → Providers → Google
- [ ] Save

### Apple OAuth
- [ ] Go to Apple Developer Portal
- [ ] Create Service ID
- [ ] Create Key (.p8 file)
- [ ] Get Team ID
- [ ] Add redirect URI: `https://tblvxsfmcqbltifoqrnx.supabase.co/auth/v1/callback`
- [ ] Paste all credentials into Supabase → Authentication → Providers → Apple
- [ ] Save

---

## 🆘 Need Help?

### Google OAuth Not Working?
- Make sure redirect URI matches exactly
- Check Client ID and Secret are correct
- Verify Google provider is enabled in Supabase

### Apple OAuth Not Working?
- Verify Service ID is correct
- Check Team ID and Key ID match
- Ensure private key (.p8) is pasted correctly
- Verify return URL in Apple Developer Portal

### Still Having Issues?
1. Check browser console for errors
2. Verify Supabase project URL is correct
3. Make sure providers are enabled (toggle is ON)
4. Test with a different browser

---

## 🎯 What Happens After Setup?

Once configured:
1. Users can sign in with Google/Apple
2. Account is automatically created in Supabase
3. User is redirected to their profile
4. They can start shopping immediately

**Note**: OAuth users won't have delivery details initially. They'll need to complete their profile before checkout.

---

## 📚 More Details

For detailed instructions with screenshots, see: `OAUTH_SETUP_GUIDE.md`

---

## Summary

Your OAuth buttons are **already connected to Supabase** in the code. You just need to:
1. Enable Google provider in Supabase dashboard
2. Enable Apple provider in Supabase dashboard
3. Add the credentials from Google Cloud Console and Apple Developer Portal

That's it! No Firebase needed - you're using Supabase! 🎉
