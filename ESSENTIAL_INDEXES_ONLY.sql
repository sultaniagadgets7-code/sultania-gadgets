-- ============================================================
-- ESSENTIAL INDEXES ONLY
-- Only the most important indexes, guaranteed to work
-- Run in Supabase SQL Editor
-- ============================================================

-- ── Products Table ───────────────────────────────────────────
-- Full-text search on title
CREATE INDEX IF NOT EXISTS idx_products_title_search 
ON products USING gin(to_tsvector('english', title));

-- Featured products
CREATE INDEX IF NOT EXISTS idx_products_featured_active 
ON products(is_featured, is_active, created_at DESC) 
WHERE is_featured = true AND is_active = true;

-- New arrivals
CREATE INDEX IF NOT EXISTS idx_products_new_arrival 
ON products(is_new_arrival, is_active, created_at DESC) 
WHERE is_new_arrival = true AND is_active = true;

-- Products by category
CREATE INDEX IF NOT EXISTS idx_products_category_active 
ON products(category_id, is_active, created_at DESC) 
WHERE is_active = true;

-- Products with discounts (deals)
CREATE INDEX IF NOT EXISTS idx_products_with_discount 
ON products(compare_at_price, price, is_active) 
WHERE compare_at_price IS NOT NULL AND is_active = true;

-- Low stock products
CREATE INDEX IF NOT EXISTS idx_products_low_stock 
ON products(stock_quantity, is_active) 
WHERE is_active = true AND stock_quantity <= 10;

-- ── Orders Table ─────────────────────────────────────────────
-- User orders with status
CREATE INDEX IF NOT EXISTS idx_orders_user_status 
ON orders(user_id, status, created_at DESC);

-- Pending orders for admin
CREATE INDEX IF NOT EXISTS idx_orders_pending 
ON orders(status, created_at DESC) 
WHERE status = 'pending';

-- ── Coupons Table ────────────────────────────────────────────
-- Active coupons lookup
CREATE INDEX IF NOT EXISTS idx_coupons_active 
ON coupons(code, is_active, expires_at) 
WHERE is_active = true;

-- ── Update Statistics ────────────────────────────────────────
ANALYZE products;
ANALYZE orders;
ANALYZE order_items;
ANALYZE categories;
ANALYZE coupons;

-- ── Success ──────────────────────────────────────────────────
SELECT 'Essential indexes created successfully!' as status;

-- ── Verify Indexes ───────────────────────────────────────────
SELECT 
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('products', 'orders', 'coupons')
ORDER BY tablename, indexname;
