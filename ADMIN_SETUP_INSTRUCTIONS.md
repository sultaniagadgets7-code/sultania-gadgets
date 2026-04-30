# Admin Panel Setup Instructions

## Problem:
Admin panel pehle kaam kar raha tha, ab nahi kar raha kyunki `is_admin` column profiles table mein missing hai.

## Solution (3 Steps):

### Step 1: Add is_admin Column to Database

1. **Supabase Dashboard Open Karo:**
   https://supabase.com/dashboard/project/tblvxsfmcqbltifoqrnx/editor

2. **SQL Editor Mein Jao**

3. **Yeh SQL Run Karo:**

```sql
-- Add is_admin column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT FALSE;

-- Create index
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin) WHERE is_admin = TRUE;
```

### Step 2: Make Your User Admin

**Option A: Agar aapka user already exist karta hai:**

```sql
-- Replace with your actual email
UPDATE profiles SET is_admin = TRUE WHERE email = 'your-email@example.com';
```

**Option B: Naya admin user create karo:**

```sql
DO $
DECLARE
  new_user_id UUID;
BEGIN
  -- Insert into auth.users
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@sultaniagadgets.com',
    crypt('Admin@123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  )
  RETURNING id INTO new_user_id;

  -- Create profile with admin flag
  INSERT INTO profiles (id, email, full_name, is_admin, created_at, updated_at)
  VALUES (
    new_user_id,
    'admin@sultaniagadgets.com',
    'Admin User',
    TRUE,
    NOW(),
    NOW()
  );
END $;
```

### Step 3: Login to Admin Panel

1. **Go to:** https://sultaniagadgets.com/admin/login

2. **Login with:**
   - Email: `admin@sultaniagadgets.com` (ya jo bhi aapne use kiya)
   - Password: `Admin@123` (ya jo bhi aapne set kiya)

3. **Admin panel access mil jayega!**

## Verification:

Admin users check karne ke liye:

```sql
SELECT id, email, full_name, is_admin, created_at 
FROM profiles 
WHERE is_admin = TRUE;
```

## Quick Fix (If Already Have User):

Agar aapka user already hai aur aap sirf admin banana chahte ho:

1. Supabase SQL Editor mein jao
2. Yeh run karo:

```sql
-- Add column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT FALSE;

-- Make your user admin (replace email)
UPDATE profiles SET is_admin = TRUE WHERE email = 'YOUR_EMAIL_HERE';
```

3. Login karo admin panel mein

## Files Created:
- `supabase/add_admin_column.sql` - Complete SQL script
- `ADMIN_SETUP_INSTRUCTIONS.md` - This file

## Current Status:
- ✅ Service role key fixed
- ✅ Environment variables set
- ✅ Queries fixed
- ⚠️ **PENDING: is_admin column add karna hai**
- ⚠️ **PENDING: Admin user banana hai**
