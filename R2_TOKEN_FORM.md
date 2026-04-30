# 🔑 Fill Out API Token Form

You're on the right page! Here's exactly what to select:

---

## 📋 What You See

```
Permissions
Select edit or read permissions to apply to your accounts or websites for this token.

Resources
Account
Permissions
Select...
```

---

## ✅ What to Select

### 1. Click the "Select..." Dropdown

Under "Permissions", you'll see a dropdown that says **"Select..."**

Click on it!

### 2. Look for R2 Options

In the dropdown, scroll down and look for:
- **"R2"** section
- Or **"Object Storage"** section
- Or options with "R2" in the name

### 3. Select "Object Read & Write"

You should see options like:
- ❌ Object Read (not this one)
- ✅ **Object Read & Write** ← Select this one!
- ❌ Object Write (not this one)

**Click on "Object Read & Write"**

---

## 🎯 Alternative: If You Don't See R2 Options

If you don't see R2-specific options, try this:

### Option 1: Use "Admin Read & Write"
- Look for **"Admin Read & Write"**
- This gives full access (works but more than needed)

### Option 2: Go Back to R2 Dashboard
1. Close this page
2. Go back to your R2 bucket page
3. Look for **"Manage R2 API Tokens"** button (top right)
4. This should take you to R2-specific token creation

---

## 📝 After Selecting Permission

After you select "Object Read & Write", you might see:

### Bucket Selection (Optional)

```
Apply to specific buckets:
[ ] All buckets
[x] Specific buckets
    └─ Select bucket: [sultania-gadgets-images]
```

**Select**: `sultania-gadgets-images`

OR just select "All buckets" (easier)

---

## 🎯 Complete Form Should Look Like:

```
Token name: sultania-gadgets-upload

Permissions:
Account: [Your Account]
Permission: Object Read & Write
Bucket: sultania-gadgets-images (or All buckets)

TTL: Forever (or your choice)
```

---

## ✅ Then Click "Continue" or "Create Token"

After filling everything:
1. Click **"Continue to summary"** (if shown)
2. Then click **"Create Token"**

---

## 🎉 You'll Get Your Credentials!

After creating, you'll see:

```
Access Key ID: abc123def456...
Secret Access Key: xyz789uvw456...
```

**Copy both immediately!** You won't see them again!

---

## 🚨 Can't Find "Object Read & Write"?

### Try These Steps:

1. **Look for "R2" in the dropdown**
   - Scroll through all options
   - Look for anything with "R2" or "Object Storage"

2. **Use the search box** (if available)
   - Type: "R2"
   - Type: "Object"

3. **Alternative: Create from R2 Dashboard**
   - Go back to: https://dash.cloudflare.com/ca209d6714254275c703d4511eba4b99/r2
   - Click "Manage R2 API Tokens" (top right)
   - This gives you R2-specific token creation

---

## 📞 Still Stuck?

Tell me:
1. What options do you see in the "Select..." dropdown?
2. Do you see anything with "R2" or "Object" in it?
3. Can you take a screenshot of the dropdown options?

I'll help you find the right option! 🚀

