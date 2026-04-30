-- Add is_new_arrival column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_new_arrival boolean NOT NULL DEFAULT false;

-- Create index for faster queries on new arrivals
CREATE INDEX IF NOT EXISTS idx_products_new_arrival ON products(is_new_arrival) WHERE is_new_arrival = true;

-- Add comment for documentation
COMMENT ON COLUMN products.is_new_arrival IS 'When true, product appears in the New Arrivals section on homepage';
