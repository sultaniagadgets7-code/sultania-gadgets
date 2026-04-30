# 🗄️ Database Migrations - Simple Guide

## 📍 Where to Run
**Supabase SQL Editor**: https://supabase.com/dashboard/project/tblvxsfmcqbltifoqrnx/sql/new

---

## 📋 Run These Files in Order

### Step 1: Base Schema (if not already done)
**File**: `supabase/schema.sql`

**What it does**: Creates basic tables (products, categories, orders, etc.)

**How to run**:
1. Open the file in VS Code
2. Copy ALL content (Ctrl+A, Ctrl+C)
3. Paste in Supabase SQL Editor
4. Click "Run"

**Expected**: ✅ Success or "already exists" (both OK)

---

### Step 2: Add Missing Columns
**File**: `supabase/step1_add_columns.sql`

**What it does**: Adds user_id, coupon_id, courier, tracking_number columns

**How to run**:
1. Copy all content from file
2. Paste in Supabase SQL Editor
3. Click "Run"

**Expected**: ✅ Success or "column already exists" (both OK)

---

### Step 3: Create New Tables
**File**: `supabase/step2_create_tables.sql`

**What it does**: Creates coupons, bundles, profiles, wishlist, reviews, loyalty_points, abandoned_carts, exchange_requests

**How to run**:
1. Copy all content from file
2. Paste in Supabase SQL Editor
3. Click "Run"

**Expected**: ✅ Success or "table already exists" (both OK)

---

### Step 4: Add Indexes
**File**: `supabase/step3_indexes_constraints.sql`

**What it does**: Adds indexes for better performance

**How to run**:
1. Copy all content from file
2. Paste in Supabase SQL Editor
3. Click "Run"

**Expected**: ✅ Success or "index already exists" (both OK)

---

### Step 5: User Accounts & Profiles
**File**: `supabase/user_accounts.sql`

**What it does**: 
- Creates profiles table
- Adds user_id to orders
- Creates auto-profile trigger
- Creates wishlist & addresses tables

**How to run**:
1. Copy all content from file
2. Paste in Supabase SQL Editor
3. Click "Run"

**Expected**: ✅ Success (this is the FIXED version)

---

### Step 6: Admin Access
**File**: `supabase/admin_access.sql`

**What it does**: Grants admin permissions to all tables

**How to run**:
1. Copy all content from file
2. Paste in Supabase SQL Editor
3. Click "Run"

**Expected**: ✅ Success

---

### Step 7: RPC Functions & Security
**File**: `supabase/step4_rpc_rls.sql`

**What it does**: 
- Creates RPC functions (increment_coupon_usage, award_loyalty_points)
- Adds Row Level Security policies

**How to run**:
1. Copy all content from file
2. Paste in Supabase SQL Editor
3. Click "Run"

**Expected**: ✅ Success

---

### Step 8: Storage Bucket
**File**: `supabase/storage.sql`

**What it does**: Creates product-images bucket with upload permissions

**How to run**:
1. Copy all content from file
2. Paste in Supabase SQL Editor
3. Click "Run"

**Expected**: ✅ Success or "bucket already exists" (both OK)

---

### Step 9: Social Links
**File**: `supabase/social_links.sql`

**What it does**: Adds social media columns to site_settings

**How to run**:
1. Copy all content from file
2. Paste in Supabase SQL Editor
3. Click "Run"

**Expected**: ✅ Success or "column already exists" (both OK)

---

## ✅ Verification

After running all files, check if tables exist:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

**Expected tables** (should see these):
- abandoned_carts
- addresses
- bundle_items
- bundles
- categories
- coupons
- exchange_requests
- faq_items
- loyalty_points
- order_items
- orders
- product_images
- products
- profiles
- reviews
- site_settings
- testimonials
- wishlist

---

## 🚨 If You Get Errors

### "column already exists"
✅ **SAFE** - Ignore, means it was already added

### "table already exists"
✅ **SAFE** - Ignore, means it was already created

### "relation does not exist"
❌ **STOP** - You skipped a step, go back

### "column user_id does not exist"
❌ **STOP** - Make sure you're using the FIXED `user_accounts.sql` file

---

## 🎯 Quick Checklist

- [ ] Step 1: schema.sql
- [ ] Step 2: step1_add_columns.sql
- [ ] Step 3: step2_create_tables.sql
- [ ] Step 4: step3_indexes_constraints.sql
- [ ] Step 5: user_accounts.sql (FIXED version)
- [ ] Step 6: admin_access.sql
- [ ] Step 7: step4_rpc_rls.sql
- [ ] Step 8: storage.sql
- [ ] Step 9: social_links.sql
- [ ] Verify: Run verification query

---

## ⏱️ Time Required
**Total**: ~10 minutes (1 minute per file)

---

## 🎉 After Completion

Your database will be 100% ready with:
- ✅ All tables created
- ✅ All columns added
- ✅ All indexes optimized
- ✅ Admin permissions set
- ✅ Security policies active
- ✅ Storage bucket configured

Then your website will be **100% functional**! 🚀

---

**Pro Tip**: Copy-paste each file one by one. Don't rush. If you see "already exists" errors, that's perfectly fine!
