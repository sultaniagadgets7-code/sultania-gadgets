# 🎯 Next Step: Get API Token

**Account ID**: ✅ Done! (`ca209d6714254275c703d4511eba4b99`)  
**Public URL**: ✅ Done! (`https://pub-bdcc7c4e796b4cf7a97402a408b5dc6c.r2.dev`)

**Now you need**: API Token (Access Key ID + Secret Access Key)

---

## 🔑 Get API Token (5 minutes)

### Step 1: Click "Manage R2 API Tokens"

In your R2 dashboard, look at the **top right corner**.

You should see a button: **"Manage R2 API Tokens"**

Click it!

**OR** go directly to: https://dash.cloudflare.com/profile/api-tokens

---

### Step 2: Create API Token

1. Click **"Create API Token"** (blue button)
2. You'll see a form

---

### Step 3: Fill in the Form

**Token name**:
```
sultania-gadgets-upload
```

**Permissions**:
- Look for a dropdown that says "Permissions"
- Select: **"Object Read & Write"**

**Bucket** (if asked):
- Select: **"sultania-gadgets-images"**
- OR select "Apply to all buckets"

**TTL** (optional):
- Leave as default (Forever)

---

### Step 4: Create Token

Click **"Create API Token"** button at the bottom

---

### Step 5: COPY CREDENTIALS NOW! ⚠️

**IMPORTANT**: You'll only see these ONCE!

You'll see a screen with:

```
Access Key ID:
abc123def456ghi789jkl012
[Copy]

Secret Access Key:
xyz789uvw456rst123opq987mno654pqr321
[Copy]
```

**Click [Copy] for both!**

Save them in Notepad or somewhere safe!

---

### Step 6: Update .env.local

Open `.env.local` and find these lines:

```env
R2_ACCESS_KEY_ID=your_access_key_id_here
R2_SECRET_ACCESS_KEY=your_secret_access_key_here
```

Replace with your actual values:

```env
R2_ACCESS_KEY_ID=abc123def456ghi789jkl012
R2_SECRET_ACCESS_KEY=xyz789uvw456rst123opq987mno654pqr321
```

---

### Step 7: Test It!

```bash
cd sultania-gadgets
npx tsx scripts/test-r2.ts
```

**Expected output**:
```
✅ Upload successful!
URL: https://pub-bdcc7c4e796b4cf7a97402a408b5dc6c.r2.dev/test/logo.svg
```

Visit the URL - you should see your logo! 🎉

---

## 📋 Quick Checklist

- [ ] Click "Manage R2 API Tokens"
- [ ] Click "Create API Token"
- [ ] Fill in: Name = `sultania-gadgets-upload`
- [ ] Select: Permissions = "Object Read & Write"
- [ ] Click "Create API Token"
- [ ] Copy Access Key ID
- [ ] Copy Secret Access Key
- [ ] Update `.env.local` with both values
- [ ] Run: `npx tsx scripts/test-r2.ts`
- [ ] Test passed ✅

---

## 🎉 After Test Passes

Once the test works:

1. Add to Vercel:
   ```bash
   vercel env add R2_ACCOUNT_ID
   vercel env add R2_ACCESS_KEY_ID
   vercel env add R2_SECRET_ACCESS_KEY
   vercel env add R2_BUCKET_NAME
   vercel env add R2_PUBLIC_URL
   ```

2. Deploy:
   ```bash
   vercel --prod
   ```

3. Done! New product images will use R2! 🚀

---

## 📞 Need Help?

Let me know:
1. If you can't find "Manage R2 API Tokens" button
2. If you get any errors
3. When you've copied the credentials

I'll help you through it! 🎉

