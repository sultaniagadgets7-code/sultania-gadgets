-- ============================================================
-- Add is_admin column to profiles table
-- Run this in Supabase SQL Editor
-- ============================================================

-- Add is_admin column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT FALSE;

-- Create index for fast admin checks
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin) WHERE is_admin = TRUE;

-- Update RLS policies to allow admins to read all profiles
DROP POLICY IF EXISTS "profiles: admins read all" ON profiles;
CREATE POLICY "profiles: admins read all"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Grant admin access to all tables (read-only via RLS)
-- Admins will use service role key for write operations

COMMENT ON COLUMN profiles.is_admin IS 'Admin flag - grants access to admin panel';

-- ============================================================
-- Create your first admin user
-- Replace email and password with your desired credentials
-- ============================================================

-- Option 1: If you already have a user, make them admin
-- UPDATE profiles SET is_admin = TRUE WHERE email = 'your-email@example.com';

-- Option 2: Create a new admin user (uncomment and modify)
/*
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

  RAISE NOTICE 'Admin user created with email: admin@sultaniagadgets.com';
END $;
*/

-- ============================================================
-- Verification
-- ============================================================

-- Check if column was added
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'profiles' AND column_name = 'is_admin';

-- List all admin users
SELECT id, email, full_name, is_admin, created_at 
FROM profiles 
WHERE is_admin = TRUE;
