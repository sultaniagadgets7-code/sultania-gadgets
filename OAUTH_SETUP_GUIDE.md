# OAuth Setup Guide - Google & Apple Sign-In

## Overview
Google and Apple OAuth buttons have been added to the login and signup forms. To enable them, you need to configure the providers in your Supabase dashboard.

## Current Implementation

### UI Changes
✅ Google OAuth button added to login form
✅ Apple OAuth button added to login form
✅ Google OAuth button added to signup form (step 1)
✅ Apple OAuth button added to signup form (step 1)
✅ OAuth handler function implemented
✅ Proper redirect URLs configured

### User Flow
1. User clicks "Continue with Google" or "Continue with Apple"
2. Redirected to provider's authentication page
3. After authentication, redirected back to `/auth/confirm?next=/account/profile`
4. User is logged in and redirected to their profile

---

## Setup Instructions

### 1. Google OAuth Setup

#### Step 1: Create Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Select **Web application**
6. Add authorized redirect URIs:
   ```
   https://tblvxsfmcqbltifoqrnx.supabase.co/auth/v1/callback
   ```
7. Copy the **Client ID** and **Client Secret**

#### Step 2: Configure in Supabase
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **Providers**
4. Find **Google** and click to expand
5. Enable Google provider
6. Paste your **Client ID** and **Client Secret**
7. Click **Save**

#### Step 3: Add Redirect URLs (if needed)
In Supabase Authentication settings:
- Add your production URL: `https://sultaniagadgets.com`
- Add local development URL: `http://localhost:3000`

---

### 2. Apple OAuth Setup

#### Step 1: Create Apple Service ID
1. Go to [Apple Developer Portal](https://developer.apple.com/account/)
2. Navigate to **Certificates, Identifiers & Profiles**
3. Click **Identifiers** → **+** (Add new)
4. Select **Services IDs** → Continue
5. Register a new Service ID:
   - Description: `Sultania Gadgets`
   - Identifier: `com.sultaniagadgets.auth` (or your bundle ID)
6. Enable **Sign in with Apple**
7. Configure:
   - Primary App ID: Select your app
   - Domains: `sultaniagadgets.com`
   - Return URLs: `https://tblvxsfmcqbltifoqrnx.supabase.co/auth/v1/callback`
8. Save

#### Step 2: Create Private Key
1. In Apple Developer Portal, go to **Keys**
2. Click **+** to create a new key
3. Name it (e.g., "Sultania Gadgets Auth Key")
4. Enable **Sign in with Apple**
5. Configure and select your Service ID
6. Download the `.p8` key file (save it securely!)
7. Note the **Key ID** shown

#### Step 3: Get Team ID
1. In Apple Developer Portal, click your name in top right
2. Note your **Team ID** (10-character string)

#### Step 4: Configure in Supabase
1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Providers**
3. Find **Apple** and click to expand
4. Enable Apple provider
5. Enter:
   - **Services ID**: Your Service ID (e.g., `com.sultaniagadgets.auth`)
   - **Team ID**: Your 10-character Team ID
   - **Key ID**: The Key ID from your .p8 file
   - **Private Key**: Paste the entire contents of your .p8 file
6. Click **Save**

---

## Testing

### Local Testing
1. Start your development server: `npm run dev`
2. Open the login modal
3. Click "Continue with Google" or "Continue with Apple"
4. Complete authentication
5. Verify you're redirected back and logged in

### Production Testing
1. Deploy to Vercel: `vercel --prod`
2. Visit https://sultaniagadgets.com
3. Test OAuth login flow
4. Verify profile creation

---

## Troubleshooting

### Google OAuth Issues

**Error: "redirect_uri_mismatch"**
- Ensure the redirect URI in Google Console matches exactly:
  `https://tblvxsfmcqbltifoqrnx.supabase.co/auth/v1/callback`

**Error: "Access blocked"**
- Your app needs to be verified by Google for production use
- During development, add test users in Google Console

### Apple OAuth Issues

**Error: "invalid_client"**
- Verify your Service ID is correct
- Check that the Team ID and Key ID match
- Ensure the private key is pasted correctly (including BEGIN/END lines)

**Error: "redirect_uri_mismatch"**
- Verify the Return URL in Apple Developer Portal matches:
  `https://tblvxsfmcqbltifoqrnx.supabase.co/auth/v1/callback`

### General Issues

**OAuth button doesn't work**
- Check browser console for errors
- Verify Supabase provider is enabled
- Check that redirect URLs are configured in Supabase settings

**User not redirected after login**
- Check the `redirectTo` URL in the code
- Verify `/auth/confirm` route exists and works

---

## Profile Creation for OAuth Users

When users sign in with Google or Apple, Supabase automatically creates a user account. However, they won't have profile details (phone, address, etc.) initially.

### Handling Missing Profile Data

You may want to:
1. Prompt OAuth users to complete their profile after first login
2. Show a profile completion banner
3. Require profile completion before checkout

This can be implemented by checking if the user has a complete profile in the `profiles` table.

---

## Security Notes

1. **Never commit credentials**: Keep Client Secrets and Private Keys secure
2. **Use environment variables**: Store sensitive data in `.env.local`
3. **Restrict domains**: Only allow your production domain in OAuth settings
4. **Monitor usage**: Check Supabase dashboard for suspicious activity

---

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Apple Sign In Documentation](https://developer.apple.com/sign-in-with-apple/)

---

## Status

- ✅ UI Implementation Complete
- ⏳ Google OAuth Configuration (requires setup in Supabase)
- ⏳ Apple OAuth Configuration (requires setup in Supabase)
- ⏳ Testing (after configuration)
