-- ============================================================
-- Sultania Gadgets — Database Patch
-- Run this in Supabase SQL Editor if not already applied
-- ============================================================

-- ── 1. orders table: add coupon & discount columns ───────────
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS coupon_id     UUID REFERENCES coupons(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS discount_amount INTEGER NOT NULL DEFAULT 0;

-- ── 2. orders table: add dispatch / COD tracking columns ─────
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS courier         TEXT,
  ADD COLUMN IF NOT EXISTS tracking_number TEXT,
  ADD COLUMN IF NOT EXISTS dispatched_at   TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS cod_collected   BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS cod_collected_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS cod_collected_by TEXT,
  ADD COLUMN IF NOT EXISTS notes_internal  TEXT;

-- ── 3. orders table: add user_id FK if missing ───────────────
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- ── 4. profiles table ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name  TEXT,
  phone      TEXT,
  city       TEXT,
  address    TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own profile" ON profiles;
CREATE POLICY "Users can manage own profile" ON profiles
  FOR ALL USING (auth.uid() = id);

-- ── 5. wishlist table ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wishlist (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own wishlist" ON wishlist;
CREATE POLICY "Users manage own wishlist" ON wishlist
  FOR ALL USING (auth.uid() = user_id);

-- ── 6. reviews table ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  rating      SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title       TEXT,
  body        TEXT NOT NULL,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  is_approved BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read approved reviews" ON reviews;
CREATE POLICY "Anyone can read approved reviews" ON reviews
  FOR SELECT USING (is_approved = TRUE);
DROP POLICY IF EXISTS "Authenticated users can insert reviews" ON reviews;
CREATE POLICY "Authenticated users can insert reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ── 7. coupons table ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS coupons (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code            TEXT NOT NULL UNIQUE,
  discount_type   TEXT NOT NULL CHECK (discount_type IN ('percent', 'flat')),
  discount_value  NUMERIC NOT NULL,
  min_order_value NUMERIC NOT NULL DEFAULT 0,
  max_uses        INTEGER,
  used_count      INTEGER NOT NULL DEFAULT 0,
  expires_at      TIMESTAMPTZ,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── 8. loyalty_points table ───────────────────────────────────
CREATE TABLE IF NOT EXISTS loyalty_points (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  points         INTEGER NOT NULL DEFAULT 0,
  total_earned   INTEGER NOT NULL DEFAULT 0,
  total_redeemed INTEGER NOT NULL DEFAULT 0,
  UNIQUE(user_id)
);
ALTER TABLE loyalty_points ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users read own loyalty" ON loyalty_points;
CREATE POLICY "Users read own loyalty" ON loyalty_points
  FOR SELECT USING (auth.uid() = user_id);

-- ── 9. loyalty_transactions table ────────────────────────────
CREATE TABLE IF NOT EXISTS loyalty_transactions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id    UUID REFERENCES orders(id) ON DELETE SET NULL,
  points      INTEGER NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('earned', 'redeemed', 'bonus')),
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE loyalty_transactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users read own transactions" ON loyalty_transactions;
CREATE POLICY "Users read own transactions" ON loyalty_transactions
  FOR SELECT USING (auth.uid() = user_id);

-- ── 10. bundles table ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bundles (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title            TEXT NOT NULL,
  slug             TEXT NOT NULL UNIQUE,
  description      TEXT,
  discount_percent NUMERIC NOT NULL DEFAULT 0,
  is_active        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bundle_items (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bundle_id  UUID NOT NULL REFERENCES bundles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity   INTEGER NOT NULL DEFAULT 1
);

-- ── 11. RPC: decrement_stock ──────────────────────────────────
CREATE OR REPLACE FUNCTION decrement_stock(product_id UUID, qty INTEGER)
RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
  UPDATE products
  SET stock_quantity = GREATEST(0, stock_quantity - qty),
      updated_at = NOW()
  WHERE id = product_id;
END;
$$;

-- ── 12. RPC: increment_coupon_usage ──────────────────────────
CREATE OR REPLACE FUNCTION increment_coupon_usage(coupon_id UUID)
RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
  UPDATE coupons SET used_count = used_count + 1 WHERE id = coupon_id;
END;
$$;

-- ── 13. RPC: award_loyalty_points (idempotent per order) ──────
-- Awards 1 point per Rs. 100 spent. Safe to call multiple times
-- for the same order — duplicate transactions are skipped.
CREATE OR REPLACE FUNCTION award_loyalty_points(
  p_user_id    UUID,
  p_order_id   UUID,
  p_order_total NUMERIC
)
RETURNS VOID LANGUAGE plpgsql AS $$
DECLARE
  v_points INTEGER;
BEGIN
  v_points := FLOOR(p_order_total / 100)::INTEGER;
  IF v_points <= 0 THEN RETURN; END IF;

  -- Skip if already awarded for this order
  IF EXISTS (
    SELECT 1 FROM loyalty_transactions
    WHERE order_id = p_order_id AND type = 'earned'
  ) THEN RETURN; END IF;

  -- Upsert loyalty_points row
  INSERT INTO loyalty_points (user_id, points, total_earned, total_redeemed)
  VALUES (p_user_id, v_points, v_points, 0)
  ON CONFLICT (user_id) DO UPDATE
    SET points       = loyalty_points.points + v_points,
        total_earned = loyalty_points.total_earned + v_points;

  -- Record transaction
  INSERT INTO loyalty_transactions (user_id, order_id, points, type, description)
  VALUES (p_user_id, p_order_id, v_points, 'earned',
          'Earned from order #' || UPPER(SUBSTRING(p_order_id::TEXT, 1, 8)));
END;
$$;

-- ── 14. site_settings table ───────────────────────────────────
CREATE TABLE IF NOT EXISTS site_settings (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  whatsapp_number   TEXT NOT NULL DEFAULT '923001234567',
  support_text      TEXT,
  shipping_text     TEXT,
  cod_enabled       BOOLEAN NOT NULL DEFAULT TRUE,
  store_city        TEXT,
  delivery_fee      INTEGER NOT NULL DEFAULT 200,
  announcement_text TEXT,
  hero_headline     TEXT,
  hero_subtext      TEXT,
  social_whatsapp   TEXT,
  social_facebook   TEXT,
  social_instagram  TEXT,
  social_tiktok     TEXT,
  social_youtube    TEXT,
  social_twitter    TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Add missing columns if table already exists
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS delivery_fee      INTEGER NOT NULL DEFAULT 200;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS announcement_text TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_headline     TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_subtext      TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS social_whatsapp   TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS social_facebook   TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS social_instagram  TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS social_tiktok     TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS social_youtube    TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS social_twitter    TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS support_text      TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS shipping_text     TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS store_city        TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS cod_enabled       BOOLEAN NOT NULL DEFAULT TRUE;

-- Insert a default row if none exists
INSERT INTO site_settings (whatsapp_number)
SELECT '923001234567'
WHERE NOT EXISTS (SELECT 1 FROM site_settings);

-- ── 15. abandoned_carts table ─────────────────────────────────
CREATE TABLE IF NOT EXISTS abandoned_carts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id   TEXT NOT NULL,
  phone        TEXT,
  items        JSONB NOT NULL DEFAULT '[]',
  total        NUMERIC NOT NULL DEFAULT 0,
  reminder_sent BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE abandoned_carts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public insert abandoned carts" ON abandoned_carts;
CREATE POLICY "Public insert abandoned carts" ON abandoned_carts
  FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public update own cart" ON abandoned_carts;
CREATE POLICY "Public update own cart" ON abandoned_carts
  FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Admin read abandoned carts" ON abandoned_carts;
CREATE POLICY "Admin read abandoned carts" ON abandoned_carts
  FOR SELECT USING (auth.role() = 'authenticated');

-- ── 16. exchange_requests table ───────────────────────────────
CREATE TABLE IF NOT EXISTS exchange_requests (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id      TEXT,
  customer_name TEXT NOT NULL,
  phone         TEXT NOT NULL,
  product_name  TEXT NOT NULL,
  reason        TEXT NOT NULL,
  description   TEXT,
  status        TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','approved','rejected','resolved')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE exchange_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public insert exchange requests" ON exchange_requests;
CREATE POLICY "Public insert exchange requests" ON exchange_requests
  FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admin manage exchange requests" ON exchange_requests;
CREATE POLICY "Admin manage exchange requests" ON exchange_requests
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
