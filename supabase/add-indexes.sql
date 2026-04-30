-- ============================================================
-- PERFORMANCE INDEXES — Run in Supabase SQL Editor
-- Speeds up all product/order/category queries significantly
-- ============================================================

-- Products
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured, is_active);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id, is_active);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

-- Product images
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id, sort_order);

-- Orders
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(phone);

-- Order items
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Categories
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON categories(sort_order);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- Reviews
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id, is_approved);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);

-- Coupons
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code, is_active);

-- Wishlist
CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON wishlist(user_id);

-- FAQ
CREATE INDEX IF NOT EXISTS idx_faq_items_active ON faq_items(is_active, sort_order);

-- Profiles
CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);

SELECT 'Indexes created successfully!' as status;
