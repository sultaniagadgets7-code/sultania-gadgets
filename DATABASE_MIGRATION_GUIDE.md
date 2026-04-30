# 🗄️ Database Migration Guide

## ⚠️ CRITICAL: Run SQL Files in This EXACT Order

Follow these steps in your **Supabase SQL Editor** (https://supabase.com/dashboard/project/YOUR_PROJECT/sql/new):

---

## 📋 Step-by-Step Execution

### 1️⃣ **Base Schema** (if not already run)
```sql
-- File: schema.sql
-- Creates: products, categories, orders, order_items, site_settings tables
```
✅ Run this first if you haven't already set up the basic tables.

---

### 2️⃣ **Add Missing Columns**
```sql
-- File: step1_add_columns.sql
-- Adds: user_id, coupon_id, discount_amount, courier, tracking_number, etc.
```
✅ This adds columns to existing tables without breaking anything.

---

### 3️⃣ **Create New Tables**
```sql
-- File: step2_create_tables.sql
-- Creates: coupons, bundles, bundle_items, profiles, wishlist, reviews, loyalty_points, abandoned_carts, exchange_requests
```
✅ Creates all the missing tables needed for features.

---

### 4️⃣ **Add Indexes & Constraints**
```sql
-- File: step3_indexes_constraints.sql
-- Adds: Foreign keys, indexes for performance
```
✅ Optimizes database performance with proper indexes.

---

### 5️⃣ **User Accounts & Profiles**
```sql
-- File: user_accounts.sql
-- Creates: profiles table (if not exists), wishlist, addresses
-- Adds: user_id foreign key to orders
-- Creates: Auto-profile creation trigger
```
✅ **FIXED VERSION** - Adds column first, then constraint separately.

---

### 6️⃣ **Admin Access**
```sql
-- File: admin_access.sql
-- Adds: is_admin column to profiles
-- Creates: Admin RLS policies
```
✅ Sets up admin permissions.

---

### 7️⃣ **RPC Functions & RLS Policies**
```sql
-- File: step4_rpc_rls.sql
-- Creates: RPC functions for cart operations
-- Adds: Row Level Security policies
```
✅ Adds security policies and helper functions.

---

### 8️⃣ **Storage Bucket**
```sql
-- File: storage.sql
-- Creates: product-images bucket
-- Adds: Upload/read policies
```
✅ Sets up image storage with proper permissions.

---

### 9️⃣ **Social Links**
```sql
-- File: social_links.sql
-- Adds: Social media columns to site_settings
```
✅ Adds social media integration.

---

## 🎯 After Migration: Create Admin User

Once all SQL files run successfully, create your admin account:

```sql
-- Replace 'YOUR-USER-ID' with your actual Supabase Auth user ID
-- Find it in: Authentication > Users > Copy User ID

INSERT INTO profiles (id, is_admin, full_name)
VALUES ('YOUR-USER-ID', TRUE, 'Admin Name')
ON CONFLICT (id) DO UPDATE SET is_admin = TRUE;
```

**How to find your User ID:**
1. Go to Supabase Dashboard
2. Click **Authentication** → **Users**
3. Find your email (sultaniagadgets7@gmail.com)
4. Click on it and copy the **User ID** (UUID format)

---

## ✅ Verification Checklist

After running all migrations, verify these tables exist:

```sql
-- Run this query to check all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

**Expected tables:**
- ✅ abandoned_carts
- ✅ addresses
- ✅ bundle_items
- ✅ bundles
- ✅ categories
- ✅ coupons
- ✅ exchange_requests
- ✅ loyalty_points
- ✅ order_items
- ✅ orders
- ✅ product_images
- ✅ products
- ✅ profiles
- ✅ reviews
- ✅ site_settings
- ✅ wishlist

---

## 🚨 If You Get Errors

### Error: "column already exists"
✅ **Safe to ignore** - means that column was already added.

### Error: "table already exists"
✅ **Safe to ignore** - means that table was already created.

### Error: "relation does not exist"
❌ **Stop!** - You skipped a step. Go back and run the previous SQL file.

### Error: "column user_id does not exist"
❌ **Fixed!** - The new `user_accounts.sql` file fixes this. Run it again.

---

## 📊 Quick Status Check

Run this to see what's missing:

```sql
-- Check if profiles table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'profiles'
);

-- Check if user_id column exists in orders
SELECT EXISTS (
  SELECT FROM information_schema.columns 
  WHERE table_name = 'orders' AND column_name = 'user_id'
);

-- Check if coupons table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'coupons'
);
```

---

## 🎉 Success!

Once all migrations complete:
1. ✅ All tables created
2. ✅ All columns added
3. ✅ All indexes created
4. ✅ Admin user created
5. ✅ Storage bucket configured

Your database is now fully set up! 🚀

---

## 📞 Need Help?

If you encounter any errors:
1. Copy the exact error message
2. Note which SQL file caused it
3. Share both with me for quick resolution
