-- ============================================================
-- Add Admin Role to Profiles Table
-- Run this in Supabase SQL Editor
-- ============================================================

-- Add is_admin column to profiles table
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT FALSE;

-- Set your admin account as admin (replace with your actual user ID)
-- To find your user ID: SELECT id, email FROM auth.users;
-- UPDATE profiles SET is_admin = TRUE WHERE id = 'YOUR_USER_ID_HERE';

-- Example: If your email is sultaniagadgets7@gmail.com
-- First, find your user ID:
-- SELECT id FROM auth.users WHERE email = 'sultaniagadgets7@gmail.com';
-- Then update:
-- UPDATE profiles SET is_admin = TRUE WHERE id = (SELECT id FROM auth.users WHERE email = 'sultaniagadgets7@gmail.com');

-- Or run this one-liner to set admin by email:
UPDATE profiles 
SET is_admin = TRUE 
WHERE id = (SELECT id FROM auth.users WHERE email = 'sultaniagadgets7@gmail.com');

-- Verify admin status
SELECT p.id, u.email, p.is_admin 
FROM profiles p 
JOIN auth.users u ON p.id = u.id 
WHERE p.is_admin = TRUE;
