# 🔑 Get R2 API Credentials - Step by Step

**You've already got your public URL!** ✅  
Now you need API credentials to upload images.

---

## 🎯 What You Need

You need 3 things:
1. **Account ID** (from URL)
2. **Access Key ID** (from API token)
3. **Secret Access Key** (from API token)

---

## 📍 Step 1: Get Account ID (1 minute)

### Look at Your Browser URL

Your browser URL looks like:
```
https://dash.cloudflare.com/XXXXXXXXXXXXXXXX/r2/buckets/sultania-gadgets-images
```

The **XXXXXXXXXXXXXXXX** part is your Account ID.

**Example**:
```
https://dash.cloudflare.com/abc123def456/r2/buckets/sultania-gadgets-images
                              ^^^^^^^^^^^^ This is your Account ID
```

**Copy your Account ID** and save it!

---

## 📍 Step 2: Create API Token (5 minutes)

### 2.1 Go to API Tokens

1. In your R2 dashboard, look at the **top right corner**
2. Click **"Manage R2 API Tokens"** button
3. OR go to: https://dash.cloudflare.com/profile/api-tokens

### 2.2 Create New Token

1. Click **"Create API Token"** button (blue button)
2. You'll see a form

### 2.3 Fill in the Form

**Token name**:
```
sultania-gadgets-upload
```

**Permissions**:
- Click the dropdown
- Select: **"Object Read & Write"**

**Bucket**:
- Click the dropdown
- Select: **"sultania-gadgets-images"**
- OR select "Apply to all buckets"

**TTL (Time to Live)**:
- Leave as default (Forever) or set expiration if you want

### 2.4 Create Token

Click **"Create API Token"** button at the bottom

---

## 📍 Step 3: Copy Credentials (IMPORTANT!)

### ⚠️ YOU'LL ONLY SEE THESE ONCE!

After creating the token, you'll see a screen with:

```
┌─────────────────────────────────────────────┐
│ API Token Created Successfully               │
│                                              │
│ Access Key ID:                               │
│ abc123def456ghi789jkl012                    │
│ [Copy]                                       │
│                                              │
│ Secret Access Key:                           │
│ xyz789uvw456rst123opq987mno654pqr321        │
│ [Copy]                                       │
│                                              │
│ ⚠️ Save these now! You won't see them again │
└─────────────────────────────────────────────┘
```

### Copy Both Values:

1. **Access Key ID**: Click [Copy] button
2. **Secret Access Key**: Click [Copy] button

**Save them somewhere safe!** (Notepad, text file, etc.)

---

## 📍 Step 4: Add to .env.local (2 minutes)

I've already added the R2 section to your `.env.local` file!

Now you just need to **replace the placeholder values**:

### Open `.env.local`

Find these lines at the bottom:
```env
# Cloudflare R2 Storage (for product images)
R2_ACCOUNT_ID=your_account_id_here
R2_ACCESS_KEY_ID=your_access_key_id_here
R2_SECRET_ACCESS_KEY=your_secret_access_key_here
R2_BUCKET_NAME=sultania-gadgets-images
R2_PUBLIC_URL=https://pub-bdcc7c4e796b4cf7a97402a408b5dc6c.r2.dev
```

### Replace with Your Values:

```env
# Cloudflare R2 Storage (for product images)
R2_ACCOUNT_ID=abc123def456
R2_ACCESS_KEY_ID=abc123def456ghi789jkl012
R2_SECRET_ACCESS_KEY=xyz789uvw456rst123opq987mno654pqr321
R2_BUCKET_NAME=sultania-gadgets-images
R2_PUBLIC_URL=https://pub-bdcc7c4e796b4cf7a97402a408b5dc6c.r2.dev
```

**Replace**:
- `your_account_id_here` → Your Account ID from Step 1
- `your_access_key_id_here` → Access Key ID from Step 3
- `your_secret_access_key_here` → Secret Access Key from Step 3

**Don't change**:
- `R2_BUCKET_NAME` (already correct)
- `R2_PUBLIC_URL` (already correct)

---

## ✅ Verification

### Your `.env.local` should look like:

```env
# Cloudflare R2 Storage (for product images)
R2_ACCOUNT_ID=abc123def456
R2_ACCESS_KEY_ID=abc123def456ghi789jkl012
R2_SECRET_ACCESS_KEY=xyz789uvw456rst123opq987mno654pqr321
R2_BUCKET_NAME=sultania-gadgets-images
R2_PUBLIC_URL=https://pub-bdcc7c4e796b4cf7a97402a408b5dc6c.r2.dev
```

All 5 values should be filled in (no "your_xxx_here" placeholders).

---

## 🧪 Step 5: Test It! (2 minutes)

Run the test script:

```bash
cd sultania-gadgets
npx tsx scripts/test-r2.ts
```

### Expected Output:

```
🧪 Testing Cloudflare R2 Setup...

1️⃣ Checking environment variables...
✅ All environment variables present

2️⃣ Testing file upload...
✅ Upload successful!
   URL: https://pub-bdcc7c4e796b4cf7a97402a408b5dc6c.r2.dev/test/logo.svg

📸 Visit this URL to see your image:
   https://pub-bdcc7c4e796b4cf7a97402a408b5dc6c.r2.dev/test/logo.svg

3️⃣ Testing file listing...
✅ Found 1 file(s) in test/ folder
   Files:
   - test/logo.svg

✅ R2 Setup Complete!
```

### Visit the URL

Open the URL in your browser:
```
https://pub-bdcc7c4e796b4cf7a97402a408b5dc6c.r2.dev/test/logo.svg
```

You should see your logo! ✅

---

## 🚨 Troubleshooting

### Error: "Missing environment variables"

**Solution**: Check `.env.local` has all 5 R2 variables filled in

### Error: "Access Denied"

**Solution**: 
1. Check Access Key ID is correct
2. Check Secret Access Key is correct
3. Make sure you copied them correctly (no extra spaces)

### Error: "Invalid credentials"

**Solution**:
1. Go back to Cloudflare
2. Delete the old token
3. Create a new token
4. Copy the new credentials
5. Update `.env.local`

### Error: "Bucket not found"

**Solution**: Check `R2_BUCKET_NAME` is exactly: `sultania-gadgets-images`

---

## 📋 Quick Checklist

- [ ] Got Account ID from browser URL
- [ ] Created API token in Cloudflare
- [ ] Copied Access Key ID
- [ ] Copied Secret Access Key
- [ ] Updated `.env.local` with all 3 values
- [ ] Ran test script: `npx tsx scripts/test-r2.ts`
- [ ] Test passed ✅
- [ ] Visited test URL and saw image ✅

---

## 🚀 Next Steps

After test passes:

### 1. Add to Vercel (5 minutes)

```bash
vercel env add R2_ACCOUNT_ID
# Paste your account ID

vercel env add R2_ACCESS_KEY_ID
# Paste your access key ID

vercel env add R2_SECRET_ACCESS_KEY
# Paste your secret access key

vercel env add R2_BUCKET_NAME
# Type: sultania-gadgets-images

vercel env add R2_PUBLIC_URL
# Paste: https://pub-bdcc7c4e796b4cf7a97402a408b5dc6c.r2.dev
```

### 2. Deploy to Production

```bash
vercel --prod
```

### 3. Done! 🎉

New product images will automatically use R2!

---

## 💡 Pro Tips

### 1. Save Your Credentials

Save your API credentials in a password manager or secure note.

### 2. Don't Share

Never share your Secret Access Key publicly or commit it to Git.

### 3. Rotate Regularly

For security, create new API tokens every few months.

---

## 📞 Need Help?

If you get stuck:
1. Check the error message
2. Verify all credentials are correct
3. Try creating a new API token
4. Run test script again

Let me know which step you're on! 🚀

