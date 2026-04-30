-- Product variants table
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- e.g., "Black - 64GB", "Red - Large"
  sku TEXT UNIQUE,
  price DECIMAL(10, 2), -- Override product price if different
  stock INTEGER DEFAULT 0,
  image TEXT, -- Variant-specific image
  attributes JSONB, -- { "color": "Black", "size": "Large", "storage": "64GB" }
  is_default BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Variant attributes table (for filtering)
CREATE TABLE IF NOT EXISTS variant_attributes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  attribute_name TEXT NOT NULL, -- "Color", "Size", "Storage"
  attribute_values TEXT[], -- ["Black", "White", "Red"]
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_variants_sku ON product_variants(sku);
CREATE INDEX IF NOT EXISTS idx_variant_attrs_product ON variant_attributes(product_id);

-- RLS Policies
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE variant_attributes ENABLE ROW LEVEL SECURITY;

-- Public can read active variants
CREATE POLICY "Public can read active variants"
  ON product_variants FOR SELECT
  USING (active = true);

-- Public can read variant attributes
CREATE POLICY "Public can read variant attributes"
  ON variant_attributes FOR SELECT
  USING (true);

-- Update timestamp function (create if not exists)
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update timestamp trigger
CREATE TRIGGER variants_updated_at
  BEFORE UPDATE ON product_variants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Function to get product stock (including variants)
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
