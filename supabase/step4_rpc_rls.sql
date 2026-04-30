-- STEP 4: Add RPC functions and RLS policies
-- Run this after step3_indexes_constraints.sql

-- RPC FUNCTIONS
CREATE OR REPLACE FUNCTION increment_coupon_usage(coupon_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE coupons
  SET used_count = used_count + 1
  WHERE id = coupon_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION award_loyalty_points(
  p_user_id UUID,
  p_order_id UUID,
  p_order_total NUMERIC
)
RETURNS VOID AS $$
DECLARE
  points_to_award INTEGER;
BEGIN
  IF EXISTS (SELECT 1 FROM loyalty_points WHERE order_id = p_order_id) THEN
    RETURN;
  END IF;

  points_to_award := FLOOR(p_order_total / 100);

  IF points_to_award > 0 THEN
    INSERT INTO loyalty_points (user_id, order_id, points, reason)
    VALUES (p_user_id, p_order_id, points_to_award, 'Order purchase');
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ROW LEVEL SECURITY POLICIES

-- Coupons
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read active coupons" ON coupons;
DROP POLICY IF EXISTS "Admin full access coupons" ON coupons;
CREATE POLICY "Public read active coupons" ON coupons FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admin full access coupons" ON coupons FOR ALL USING (auth.role() = 'authenticated');

-- Bundles
ALTER TABLE bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bundle_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read active bundles" ON bundles;
DROP POLICY IF EXISTS "Public read bundle items" ON bundle_items;
DROP POLICY IF EXISTS "Admin full access bundles" ON bundles;
DROP POLICY IF EXISTS "Admin full access bundle items" ON bundle_items;
CREATE POLICY "Public read active bundles" ON bundles FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public read bundle items" ON bundle_items FOR SELECT USING (TRUE);
CREATE POLICY "Admin full access bundles" ON bundles FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access bundle items" ON bundle_items FOR ALL USING (auth.role() = 'authenticated');

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users read own profile" ON profiles;
DROP POLICY IF EXISTS "Users update own profile" ON profiles;
DROP POLICY IF EXISTS "Admin full access profiles" ON profiles;
CREATE POLICY "Users read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admin full access profiles" ON profiles FOR ALL USING (auth.role() = 'authenticated');

-- Wishlist
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own wishlist" ON wishlist;
CREATE POLICY "Users manage own wishlist" ON wishlist FOR ALL USING (auth.uid() = user_id);

-- Reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read approved reviews" ON reviews;
DROP POLICY IF EXISTS "Users create reviews" ON reviews;
DROP POLICY IF EXISTS "Admin full access reviews" ON reviews;
CREATE POLICY "Public read approved reviews" ON reviews FOR SELECT USING (is_approved = TRUE);
CREATE POLICY "Users create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin full access reviews" ON reviews FOR ALL USING (auth.role() = 'authenticated');

-- Loyalty Points
ALTER TABLE loyalty_points ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users read own points" ON loyalty_points;
DROP POLICY IF EXISTS "Admin full access loyalty" ON loyalty_points;
CREATE POLICY "Users read own points" ON loyalty_points FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admin full access loyalty" ON loyalty_points FOR ALL USING (auth.role() = 'authenticated');

-- Abandoned Carts
ALTER TABLE abandoned_carts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin read abandoned carts" ON abandoned_carts;
DROP POLICY IF EXISTS "Public insert abandoned carts" ON abandoned_carts;
CREATE POLICY "Admin read abandoned carts" ON abandoned_carts FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Public insert abandoned carts" ON abandoned_carts FOR INSERT WITH CHECK (TRUE);

-- Exchange Requests
ALTER TABLE exchange_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public insert exchange requests" ON exchange_requests;
DROP POLICY IF EXISTS "Admin full access exchange requests" ON exchange_requests;
CREATE POLICY "Public insert exchange requests" ON exchange_requests FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admin full access exchange requests" ON exchange_requests FOR ALL USING (auth.role() = 'authenticated');
