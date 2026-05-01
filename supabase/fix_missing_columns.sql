-- ============================================================
-- Fix Missing Columns & Tables
-- Run this in Supabase SQL Editor
-- ============================================================

-- ── Categories: add emoji column ─────────────────────────────
ALTER TABLE categories ADD COLUMN IF NOT EXISTS emoji text DEFAULT '📦';

-- ── Orders: add missing columns ──────────────────────────────
ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS coupon_id uuid;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_amount numeric(10,2) DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS notes_internal text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS courier text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_number text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS dispatched_at timestamptz;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS cod_collected boolean DEFAULT false;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS cod_collected_at timestamptz;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS cod_collected_by text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_fee numeric(10,2) DEFAULT 200;

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

-- ── Site Settings: add missing columns ───────────────────────
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

-- ── Profiles table ───────────────────────────────────────────
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

DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- ── Wishlist table ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wishlist (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own wishlist" ON wishlist;
CREATE POLICY "Users manage own wishlist" ON wishlist FOR ALL USING (auth.uid() = user_id);

-- ── Reviews table ────────────────────────────────────────────
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

DROP POLICY IF EXISTS "Public read approved reviews" ON reviews;
CREATE POLICY "Public read approved reviews" ON reviews FOR SELECT USING (is_approved = true);

DROP POLICY IF EXISTS "Authenticated can insert reviews" ON reviews;
CREATE POLICY "Authenticated can insert reviews" ON reviews FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ── Coupons table ────────────────────────────────────────────
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

DROP POLICY IF EXISTS "Public read active coupons" ON coupons;
CREATE POLICY "Public read active coupons" ON coupons FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Authenticated manage coupons" ON coupons;
CREATE POLICY "Authenticated manage coupons" ON coupons FOR ALL USING (auth.role() = 'authenticated');

-- ── Bundles tables ───────────────────────────────────────────
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

DROP POLICY IF EXISTS "Public read active bundles" ON bundles;
CREATE POLICY "Public read active bundles" ON bundles FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public read bundle items" ON bundle_items;
CREATE POLICY "Public read bundle items" ON bundle_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated manage bundles" ON bundles;
CREATE POLICY "Authenticated manage bundles" ON bundles FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated manage bundle items" ON bundle_items;
CREATE POLICY "Authenticated manage bundle items" ON bundle_items FOR ALL USING (auth.role() = 'authenticated');

-- ── Blog Posts table ─────────────────────────────────────────
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

DROP POLICY IF EXISTS "Public read published posts" ON blog_posts;
CREATE POLICY "Public read published posts" ON blog_posts FOR SELECT USING (published = true);

DROP POLICY IF EXISTS "Authenticated manage posts" ON blog_posts;
CREATE POLICY "Authenticated manage posts" ON blog_posts FOR ALL USING (auth.role() = 'authenticated');

-- ── Newsletter Subscribers table ─────────────────────────────
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  source text DEFAULT 'website',
  subscribed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can subscribe" ON newsletter_subscribers;
CREATE POLICY "Public can subscribe" ON newsletter_subscribers FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated manage newsletter" ON newsletter_subscribers;
CREATE POLICY "Authenticated manage newsletter" ON newsletter_subscribers FOR ALL USING (auth.role() = 'authenticated');

-- ── RPC Functions ────────────────────────────────────────────
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

CREATE OR REPLACE FUNCTION increment_coupon_usage(coupon_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE coupons SET used_count = used_count + 1 WHERE id = coupon_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_stock(product_id uuid, qty integer)
RETURNS void AS $$
BEGIN
  UPDATE products
  SET stock_quantity = GREATEST(0, stock_quantity - qty),
      updated_at = now()
  WHERE id = product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── Make yourself admin ──────────────────────────────────────
-- Uncomment and replace email to make a user admin:
-- UPDATE profiles SET is_admin = TRUE WHERE email = 'sultaniagadgets7@gmail.com';

-- ── Verification ─────────────────────────────────────────────
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
