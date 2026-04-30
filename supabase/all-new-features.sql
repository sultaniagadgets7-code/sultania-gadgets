-- ============================================
-- ALL NEW FEATURES - COMBINED SQL MIGRATION
-- Run this entire file in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. BLOG SYSTEM
-- ============================================

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  author_id UUID REFERENCES auth.users(id),
  category TEXT,
  tags TEXT[],
  published BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- Blog categories table
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog comments table
CREATE TABLE IF NOT EXISTS blog_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  content TEXT NOT NULL,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for blog
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_comments_post ON blog_comments(post_id);

-- RLS for blog
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read published posts" ON blog_posts;
CREATE POLICY "Public can read published posts"
  ON blog_posts FOR SELECT
  USING (published = true);

DROP POLICY IF EXISTS "Public can read categories" ON blog_categories;
CREATE POLICY "Public can read categories"
  ON blog_categories FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public can read approved comments" ON blog_comments;
CREATE POLICY "Public can read approved comments"
  ON blog_comments FOR SELECT
  USING (approved = true);

DROP POLICY IF EXISTS "Authenticated users can create comments" ON blog_comments;
CREATE POLICY "Authenticated users can create comments"
  ON blog_comments FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Blog update timestamp function
CREATE OR REPLACE FUNCTION update_blog_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS blog_posts_updated_at ON blog_posts;
CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_updated_at();

-- ============================================
-- 2. NEWSLETTER SYSTEM
-- ============================================

-- Newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  source TEXT,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Newsletter campaigns table
CREATE TABLE IF NOT EXISTS newsletter_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  sent_at TIMESTAMPTZ,
  sent_count INTEGER DEFAULT 0,
  open_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for newsletter
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_status ON newsletter_subscribers(status);

-- RLS for newsletter
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_campaigns ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "No public access to subscribers" ON newsletter_subscribers;
CREATE POLICY "No public access to subscribers"
  ON newsletter_subscribers FOR ALL
  USING (false);

DROP POLICY IF EXISTS "No public access to campaigns" ON newsletter_campaigns;
CREATE POLICY "No public access to campaigns"
  ON newsletter_campaigns FOR ALL
  USING (false);

-- ============================================
-- 3. PRODUCT VARIANTS SYSTEM
-- ============================================

-- Product variants table
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT UNIQUE,
  price DECIMAL(10, 2),
  stock INTEGER DEFAULT 0,
  image TEXT,
  attributes JSONB,
  is_default BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Variant attributes table
CREATE TABLE IF NOT EXISTS variant_attributes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  attribute_name TEXT NOT NULL,
  attribute_values TEXT[],
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for variants
CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_variants_sku ON product_variants(sku);
CREATE INDEX IF NOT EXISTS idx_variant_attrs_product ON variant_attributes(product_id);

-- RLS for variants
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE variant_attributes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read active variants" ON product_variants;
CREATE POLICY "Public can read active variants"
  ON product_variants FOR SELECT
  USING (active = true);

DROP POLICY IF EXISTS "Public can read variant attributes" ON variant_attributes;
CREATE POLICY "Public can read variant attributes"
  ON variant_attributes FOR SELECT
  USING (true);

-- Variant update timestamp function
CREATE OR REPLACE FUNCTION update_variant_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS variants_updated_at ON product_variants;
CREATE TRIGGER variants_updated_at
  BEFORE UPDATE ON product_variants
  FOR EACH ROW
  EXECUTE FUNCTION update_variant_updated_at();

-- Function to get product total stock (including variants)
CREATE OR REPLACE FUNCTION get_product_total_stock(p_id UUID)
RETURNS INTEGER AS $$
DECLARE
  total_stock INTEGER;
  has_variants BOOLEAN;
BEGIN
  -- Check if product has variants
  SELECT EXISTS(
    SELECT 1 FROM product_variants 
    WHERE product_id = p_id AND active = true
  ) INTO has_variants;
  
  IF has_variants THEN
    -- Sum variant stock
    SELECT COALESCE(SUM(stock), 0)
    INTO total_stock
    FROM product_variants
    WHERE product_id = p_id AND active = true;
  ELSE
    -- Use product stock
    SELECT stock INTO total_stock
    FROM products
    WHERE id = p_id;
  END IF;
  
  RETURN total_stock;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================

-- Verify tables were created
SELECT 
  'blog_posts' as table_name, 
  COUNT(*) as row_count 
FROM blog_posts
UNION ALL
SELECT 'blog_categories', COUNT(*) FROM blog_categories
UNION ALL
SELECT 'blog_comments', COUNT(*) FROM blog_comments
UNION ALL
SELECT 'newsletter_subscribers', COUNT(*) FROM newsletter_subscribers
UNION ALL
SELECT 'newsletter_campaigns', COUNT(*) FROM newsletter_campaigns
UNION ALL
SELECT 'product_variants', COUNT(*) FROM product_variants
UNION ALL
SELECT 'variant_attributes', COUNT(*) FROM variant_attributes;
