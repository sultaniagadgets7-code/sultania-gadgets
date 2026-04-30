-- ============================================================
-- FIX ADMIN PANEL - Run this in Supabase SQL Editor
-- This fixes all RLS policies so admin can manage everything
-- ============================================================

-- ── 1. ADMIN ROLE SETUP ──────────────────────────────────────
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT FALSE;

INSERT INTO profiles (id, is_admin)
SELECT id, TRUE FROM auth.users WHERE email = 'sultaniagadgets7@gmail.com'
ON CONFLICT (id) DO UPDATE SET is_admin = TRUE;

-- ── 2. ORDERS - Allow admin full access ──────────────────────
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view all orders" ON orders;
DROP POLICY IF EXISTS "Public can create orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can update own orders" ON orders;
DROP POLICY IF EXISTS "Admin full access orders" ON orders;
DROP POLICY IF EXISTS "Anyone can insert orders" ON orders;
DROP POLICY IF EXISTS "Anyone can read orders" ON orders;

CREATE POLICY "Anyone can insert orders" ON orders
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Anyone can read orders" ON orders
  FOR SELECT TO public USING (true);

CREATE POLICY "Authenticated can update orders" ON orders
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated can delete orders" ON orders
  FOR DELETE TO authenticated USING (true);

-- ── 3. ORDER_ITEMS - Allow admin full access ─────────────────
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view all order_items" ON order_items;
DROP POLICY IF EXISTS "Public can create order_items" ON order_items;
DROP POLICY IF EXISTS "Admin full access order_items" ON order_items;

CREATE POLICY "Anyone can insert order_items" ON order_items
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Anyone can read order_items" ON order_items
  FOR SELECT TO public USING (true);

CREATE POLICY "Authenticated can update order_items" ON order_items
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- ── 4. PRODUCTS - Allow admin full access ────────────────────
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read active products" ON products;
DROP POLICY IF EXISTS "Admin manage products" ON products;
DROP POLICY IF EXISTS "Authenticated manage products" ON products;

CREATE POLICY "Public read active products" ON products
  FOR SELECT TO public USING (true);

CREATE POLICY "Authenticated manage products" ON products
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ── 5. PRODUCT_IMAGES - Allow admin full access ──────────────
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read product images" ON product_images;
DROP POLICY IF EXISTS "Authenticated manage product images" ON product_images;

CREATE POLICY "Public read product images" ON product_images
  FOR SELECT TO public USING (true);

CREATE POLICY "Authenticated manage product images" ON product_images
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ── 6. CATEGORIES - Allow admin full access ──────────────────
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read categories" ON categories;
DROP POLICY IF EXISTS "Authenticated manage categories" ON categories;

CREATE POLICY "Public read categories" ON categories
  FOR SELECT TO public USING (true);

CREATE POLICY "Authenticated manage categories" ON categories
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ── 7. COUPONS - Allow admin full access ─────────────────────
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read active coupons" ON coupons;
DROP POLICY IF EXISTS "Authenticated manage coupons" ON coupons;

CREATE POLICY "Public read active coupons" ON coupons
  FOR SELECT TO public USING (is_active = true);

CREATE POLICY "Authenticated manage coupons" ON coupons
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ── 8. REVIEWS - Allow admin full access ─────────────────────
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read approved reviews" ON reviews;
DROP POLICY IF EXISTS "Authenticated users can insert reviews" ON reviews;
DROP POLICY IF EXISTS "Authenticated manage reviews" ON reviews;

CREATE POLICY "Anyone can read approved reviews" ON reviews
  FOR SELECT TO public USING (is_approved = true);

CREATE POLICY "Authenticated users can insert reviews" ON reviews
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated manage reviews" ON reviews
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ── 9. TESTIMONIALS - Allow admin full access ────────────────
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read featured testimonials" ON testimonials;
DROP POLICY IF EXISTS "Authenticated manage testimonials" ON testimonials;

CREATE POLICY "Public read featured testimonials" ON testimonials
  FOR SELECT TO public USING (true);

CREATE POLICY "Authenticated manage testimonials" ON testimonials
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ── 10. FAQ_ITEMS - Allow admin full access ──────────────────
ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read active faqs" ON faq_items;
DROP POLICY IF EXISTS "Authenticated manage faqs" ON faq_items;

CREATE POLICY "Public read active faqs" ON faq_items
  FOR SELECT TO public USING (is_active = true);

CREATE POLICY "Authenticated manage faqs" ON faq_items
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ── 11. SITE_SETTINGS - Allow admin full access ──────────────
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read site settings" ON site_settings;
DROP POLICY IF EXISTS "Authenticated manage site settings" ON site_settings;

CREATE POLICY "Public read site settings" ON site_settings
  FOR SELECT TO public USING (true);

CREATE POLICY "Authenticated manage site settings" ON site_settings
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ── 12. BUNDLES - Allow admin full access ────────────────────
ALTER TABLE bundles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read active bundles" ON bundles;
DROP POLICY IF EXISTS "Authenticated manage bundles" ON bundles;

CREATE POLICY "Public read active bundles" ON bundles
  FOR SELECT TO public USING (true);

CREATE POLICY "Authenticated manage bundles" ON bundles
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ── 13. BUNDLE_ITEMS ─────────────────────────────────────────
ALTER TABLE bundle_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read bundle items" ON bundle_items;
DROP POLICY IF EXISTS "Authenticated manage bundle items" ON bundle_items;

CREATE POLICY "Public read bundle items" ON bundle_items
  FOR SELECT TO public USING (true);

CREATE POLICY "Authenticated manage bundle items" ON bundle_items
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ── 14. EXCHANGE_REQUESTS ────────────────────────────────────
ALTER TABLE exchange_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public insert exchange requests" ON exchange_requests;
DROP POLICY IF EXISTS "Admin manage exchange requests" ON exchange_requests;

CREATE POLICY "Public insert exchange requests" ON exchange_requests
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Authenticated manage exchange requests" ON exchange_requests
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ── 15. ABANDONED_CARTS ──────────────────────────────────────
ALTER TABLE abandoned_carts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public insert abandoned carts" ON abandoned_carts;
DROP POLICY IF EXISTS "Public update own cart" ON abandoned_carts;
DROP POLICY IF EXISTS "Admin read abandoned carts" ON abandoned_carts;

CREATE POLICY "Public manage abandoned carts" ON abandoned_carts
  FOR ALL TO public USING (true) WITH CHECK (true);

-- ── 16. PROFILES ─────────────────────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own profile" ON profiles;
DROP POLICY IF EXISTS "Authenticated read all profiles" ON profiles;

CREATE POLICY "Users can manage own profile" ON profiles
  FOR ALL TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Authenticated read all profiles" ON profiles
  FOR SELECT TO authenticated USING (true);

-- ── VERIFY ───────────────────────────────────────────────────
SELECT 
  u.email,
  p.is_admin,
  CASE WHEN p.is_admin THEN '✅ Admin OK' ELSE '❌ Not admin' END as admin_status
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'sultaniagadgets7@gmail.com';
