-- ============================================================
-- HIGH LOAD OPTIMIZATIONS
-- Additional indexes and optimizations for handling high traffic
-- Run these in Supabase SQL Editor when traffic increases
-- ============================================================

-- ── Full-Text Search Index ──────────────────────────────────
-- Speeds up product search significantly
CREATE INDEX IF NOT EXISTS idx_products_title_search 
ON products USING gin(to_tsvector('english', title));

CREATE INDEX IF NOT EXISTS idx_products_description_search 
ON products USING gin(to_tsvector('english', description));

-- Usage in queries:
-- SELECT * FROM products 
-- WHERE to_tsvector('english', title) @@ to_tsquery('english', 'wireless & earbuds');

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
-- Active coupons lookup
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
ON loyalty_points(user_id, created_at DESC);

-- ── Blog Performance ─────────────────────────────────────────
-- Published blog posts
CREATE INDEX IF NOT EXISTS idx_blog_posts_published 
ON blog_posts(is_published, published_at DESC) 
WHERE is_published = true;

-- Blog post slug lookup
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug 
ON blog_posts(slug) 
WHERE is_published = true;

-- ── Materialized Views for Heavy Queries ────────────────────
-- Top rated products (refresh periodically)
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_top_rated_products AS
SELECT 
  p.*,
  COALESCE(AVG(r.rating), 0) as avg_rating,
  COUNT(r.id) as review_count
FROM products p
LEFT JOIN reviews r ON r.product_id = p.id AND r.is_approved = true
WHERE p.is_active = true
GROUP BY p.id
HAVING COUNT(r.id) > 0
ORDER BY avg_rating DESC, review_count DESC
LIMIT 20;

CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_top_rated_products_id 
ON mv_top_rated_products(id);

-- Refresh command (run periodically):
-- REFRESH MATERIALIZED VIEW CONCURRENTLY mv_top_rated_products;

-- ── Database Statistics ──────────────────────────────────────
-- Update statistics for query planner
ANALYZE products;
ANALYZE orders;
ANALYZE order_items;
ANALYZE categories;
ANALYZE reviews;
ANALYZE coupons;

-- ── Connection Pooling Settings ──────────────────────────────
-- These are set at Supabase project level, not via SQL
-- But document recommended settings:

/*
Recommended Supabase Settings for High Load:

1. Connection Pooling:
   - Pool Mode: Transaction
   - Pool Size: 15-20 (free tier)
   - Max Client Connections: 60 (free tier limit)

2. Statement Timeout:
   - Set to 30s to prevent long-running queries

3. Idle Transaction Timeout:
   - Set to 10s to free up connections

4. Enable Connection Pooler:
   - Use pooler.supabase.com endpoint
   - Not direct database connection
*/

-- ── Query Performance Monitoring ─────────────────────────────
-- Enable pg_stat_statements for query analysis
-- (Requires superuser, may not be available on free tier)

-- View slow queries:
-- SELECT 
--   query,
--   calls,
--   total_time,
--   mean_time,
--   max_time
-- FROM pg_stat_statements
-- ORDER BY mean_time DESC
-- LIMIT 20;

-- ── Vacuum and Maintenance ───────────────────────────────────
-- Run periodically to maintain performance
-- (Supabase handles this automatically, but can run manually)

-- VACUUM ANALYZE products;
-- VACUUM ANALYZE orders;
-- VACUUM ANALYZE order_items;

-- ── Success Message ──────────────────────────────────────────
SELECT 'High-load optimizations applied successfully!' as status,
       'Remember to refresh materialized views periodically' as note;

-- ── Monitoring Queries ───────────────────────────────────────
-- Check index usage
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan as index_scans,
  idx_tup_read as tuples_read,
  idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;

-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check active connections
SELECT 
  count(*) as active_connections,
  max_conn as max_connections,
  round(100.0 * count(*) / max_conn, 2) as percent_used
FROM pg_stat_activity, 
     (SELECT setting::int as max_conn FROM pg_settings WHERE name = 'max_connections') mc
WHERE state = 'active';
