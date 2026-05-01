-- ============================================================
-- Fix Missing Columns
-- Run this in Supabase SQL Editor
-- ============================================================

-- Add emoji column to categories (missing from original schema)
ALTER TABLE categories ADD COLUMN IF NOT EXISTS emoji text DEFAULT '📦';

-- Add user_id to orders (for logged-in user orders)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

-- Add coupon support to orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS coupon_id uuid;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_amount numeric(10,2) DEFAULT 0;

-- Add internal notes to orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS notes_internal text;

-- Add courier/tracking to orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS courier text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_number text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS dispatched_at timestamptz;

-- Add COD collection tracking
ALTER TABLE orders ADD COLUMN IF NOT EXISTS cod_collected boolean DEFAULT false;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS cod_collected_at timestamptz;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS cod_collected_by text;

-- Add order source
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_source text DEFAULT 'website';

-- Add delivery fee to orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_fee numeric(10,2) DEFAULT 200;

-- Add site settings columns
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS delivery_fee numeric(10,2) DEFAULT 200;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS announcement_text text;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_headline text;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_subtext text;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS social_whatsapp text;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS social_facebook text;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS social_instagram text;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS social_tiktok text;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS social_youtube text;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS social_twitter text;

-- Add profiles table if missing
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  phone text,
  city text,
  address text,
  loyalty_points integer DEFAULT 0,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY IF NOT EXISTS "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY IF NOT EXISTS "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Add wishlist table if missing
CREATE TABLE IF NOT EXISTS wishlist (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Users manage own wishlist" ON wishlist FOR ALL USING (auth.uid() = user_id);

-- Add reviews table if missing
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name text NOT NULL,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title text,
  body text NOT NULL,
  is_verified boolean DEFAULT false,
  is_approved boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Public read approved reviews" ON reviews FOR SELECT USING (is_approved = true);
CREATE POLICY IF NOT EXISTS "Authenticated can insert reviews" ON reviews FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Add coupons table if missing
CREATE TABLE IF NOT EXISTS coupons (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  code text NOT NULL UNIQUE,
  discount_type text NOT NULL CHECK (discount_type IN ('percent', 'flat')),
  discount_value numeric(10,2) NOT NULL,
  min_order_value numeric(10,2) DEFAULT 0,
  max_uses integer,
  used_count integer DEFAULT 0,
  expires_at timestamptz,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Public read active coupons" ON coupons FOR SELECT USING (is_active = true);
CREATE POLICY IF NOT EXISTS "Authenticated manage coupons" ON coupons FOR ALL USING (auth.role() = 'authenticated');

-- Add bundles table if missing
CREATE TABLE IF NOT EXISTS bundles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  discount_percent numeric(5,2) DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bundle_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  bundle_id uuid NOT NULL REFERENCES bundles(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity integer DEFAULT 1
);

ALTER TABLE bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bundle_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Public read active bundles" ON bundles FOR SELECT USING (is_active = true);
CREATE POLICY IF NOT EXISTS "Public read bundle items" ON bundle_items FOR SELECT USING (true);

-- Add blog_posts table if missing
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  content text,
  featured_image text,
  category text,
  tags text[],
  published boolean DEFAULT false,
  published_at timestamptz,
  views integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Public read published posts" ON blog_posts FOR SELECT USING (published = true);
CREATE POLICY IF NOT EXISTS "Authenticated manage posts" ON blog_posts FOR ALL USING (auth.role() = 'authenticated');

-- Loyalty points RPC function
CREATE OR REPLACE FUNCTION award_loyalty_points(
  p_user_id uuid,
  p_order_id uuid,
  p_order_total numeric
) RETURNS void AS $$
BEGIN
  INSERT INTO profiles (id, loyalty_points)
  VALUES (p_user_id, FLOOR(p_order_total / 100))
  ON CONFLICT (id) DO UPDATE
  SET loyalty_points = profiles.loyalty_points + FLOOR(p_order_total / 100);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment coupon usage RPC
CREATE OR REPLACE FUNCTION increment_coupon_usage(coupon_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE coupons SET used_count = used_count + 1 WHERE id = coupon_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verify everything
SELECT 'Categories emoji column: ' || CASE WHEN EXISTS (
  SELECT 1 FROM information_schema.columns 
  WHERE table_name = 'categories' AND column_name = 'emoji'
) THEN 'EXISTS ✅' ELSE 'MISSING ❌' END as status;

SELECT 'Orders user_id column: ' || CASE WHEN EXISTS (
  SELECT 1 FROM information_schema.columns 
  WHERE table_name = 'orders' AND column_name = 'user_id'
) THEN 'EXISTS ✅' ELSE 'MISSING ❌' END as status;

SELECT 'Profiles table: ' || CASE WHEN EXISTS (
  SELECT 1 FROM information_schema.tables 
  WHERE table_name = 'profiles'
) THEN 'EXISTS ✅' ELSE 'MISSING ❌' END as status;
