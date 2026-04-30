-- ============================================================
-- FIX ADMIN ACCESS - Run this in Supabase SQL Editor
-- ============================================================

-- Step 1: Add is_admin column if it doesn't exist
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT FALSE;

-- Step 2: Set your account as admin
UPDATE profiles 
SET is_admin = TRUE 
WHERE id = (
  SELECT id FROM auth.users 
  WHERE email = 'sultaniagadgets7@gmail.com'
);

-- Step 3: If profile row doesn't exist, create it
INSERT INTO profiles (id, is_admin)
SELECT id, TRUE
FROM auth.users
WHERE email = 'sultaniagadgets7@gmail.com'
ON CONFLICT (id) DO UPDATE SET is_admin = TRUE;

-- Step 4: Verify admin status
SELECT 
  u.email,
  u.id,
  p.is_admin,
  CASE 
    WHEN p.is_admin = TRUE THEN '✅ Admin access granted'
    ELSE '❌ Not admin'
  END as status
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'sultaniagadgets7@gmail.com';

-- If you see "✅ Admin access granted", you're all set!
-- If you see "❌ Not admin", run this again:
-- UPDATE profiles SET is_admin = TRUE WHERE id = (SELECT id FROM auth.users WHERE email = 'sultaniagadgets7@gmail.com');
