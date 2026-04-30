-- ============================================================
-- SAFE OPTIMIZATIONS - Run these without errors
-- These are compatible with your current schema
-- Run in Supabase SQL Editor
-- ============================================================

-- ── Full-Text Search Index ──────────────────────────────────
-- Speeds up product search significantly
CREATE INDEX IF NOT EXISTS idx_products_title_search 
ON products USING gin(to_tsvector('english', title));

-- ── Composite Indexes for Common Queries ────────────────────
-- Homepage featured products
CREATE INDEX IF NOT EXISTS idx_products_featured_active_created 
ON products(is_featured, is_active, created_at DESC) 
WHERE is_featured = true AND is_active = true;

-- New arrivals
CREATE INDEX IF NOT EXISTS idx_products_new_arrival_active 
ON products(is_new_arrival, is_active, created_at DESC) 
WHERE is_new_arrival = true AND is_active = true;

-- Category products
CREATE INDEX IF NOT EXISTS idx_products_category_active_created 
ON products(category_id, is_active, created_at DESC) 
WHERE is_active = true;

-- Deals (products with compare_at_price)
CREATE INDEX IF NOT EXISTS idx_products_deals 
ON products(compare_at_price, price, is_active) 
WHERE compare_at_price IS NOT NULL AND is_active = true;

-- ── Order Performance ────────────────────────────────────────
-- User orders with status
CREATE INDEX IF NOT EXISTS idx_orders_user_status_created 
ON orders(user_id, status, created_at DESC);

-- Pending orders for admin
CREATE INDEX IF NOT EXISTS idx_orders_pending 
ON orders(status, created_at DESC) 
WHERE status = 'pending';

-- ── Stock Management ─────────────────────────────────────────
-- Low stock products
CREATE INDEX IF NOT EXISTS idx_products_low_stock 
ON products(stock_quantity, is_active) 
WHERE is_active = true AND stock_quantity <= 10;

-- Out of stock products
CREATE INDEX IF NOT EXISTS idx_products_out_of_stock 
ON products(stock_quantity, is_active) 
WHERE is_active = true AND stock_quantity = 0;

-- ── Coupon Performance ───────────────────────────────────────
-- Active coupons lookup (fixed for your schema)
CREATE INDEX IF NOT EXISTS idx_coupons_active_code 
ON coupons(code, is_active, expires_at) 
WHERE is_active = true;

-- ── Bundle Performance ───────────────────────────────────────
-- Active bundles
CREATE INDEX IF NOT EXISTS idx_bundles_active 
ON bundles(is_active, created_at DESC) 
WHERE is_active = true;

-- ── Loyalty Points ───────────────────────────────────────────
-- User loyalty points lookup
CREATE INDEX IF NOT EXISTS idx_loyalty_points_user 
ON loyalty_points(user_id);

-- ── Blog Performance ─────────────────────────────────────────
-- Published blog posts
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at 
ON blog_posts(published, published_at DESC) 
WHERE published = true;

-- Blog post slug lookup
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug_published 
ON blog_posts(slug) 
WHERE published = true;

-- ── Database Statistics ──────────────────────────────────────
-- Update statistics for query planner
ANALYZE products;
ANALYZE orders;
ANALYZE order_items;
ANALYZE categories;
ANALYZE coupons;

-- ── Success Message ──────────────────────────────────────────
SELECT 'Safe optimizations applied successfully!' as status;

-- ── Check Results ────────────────────────────────────────────
-- View all indexes on products table
SELECT 
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'products'
ORDER BY indexname;
