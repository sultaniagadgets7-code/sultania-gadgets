-- Check existing policies first
-- Run this to see what policies exist:
-- SELECT * FROM pg_policies WHERE tablename = 'orders';
-- SELECT * FROM pg_policies WHERE tablename = 'order_items';

-- ═══════════════════════════════════════════════════════════
-- FIX ORDERS TABLE ACCESS
-- ═══════════════════════════════════════════════════════════

-- Drop ALL existing policies on orders table
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'orders') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON orders';
    END LOOP;
END $$;

-- Now create fresh policies for orders
CREATE POLICY "Public can view orders by ID" ON orders
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can create orders" ON orders
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can update own orders" ON orders
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════
-- FIX ORDER_ITEMS TABLE ACCESS
-- ═══════════════════════════════════════════════════════════

-- Enable RLS on order_items
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies on order_items table
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'order_items') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON order_items';
    END LOOP;
END $$;

-- Create fresh policies for order_items
CREATE POLICY "Public can view order_items" ON order_items
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can create order_items" ON order_items
  FOR INSERT
  TO public
  WITH CHECK (true);
