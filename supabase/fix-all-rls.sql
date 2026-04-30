-- ═══════════════════════════════════════════════════════════════════
-- COMPLETE RLS FIX FOR SULTANIA GADGETS
-- Run this entire script in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════════

-- ───────────────────────────────────────────────────────────────────
-- 1. FIX ORDERS TABLE
-- ───────────────────────────────────────────────────────────────────

-- Drop ALL existing policies on orders
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'orders') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON orders';
    END LOOP;
END $$;

-- Create new policies for orders
CREATE POLICY "Public can view all orders" ON orders
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can create orders" ON orders
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update own orders" ON orders
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR user_id IS NULL)
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- ───────────────────────────────────────────────────────────────────
-- 2. FIX ORDER_ITEMS TABLE
-- ───────────────────────────────────────────────────────────────────

-- Enable RLS on order_items if not already enabled
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies on order_items
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'order_items') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON order_items';
    END LOOP;
END $$;

-- Create new policies for order_items
CREATE POLICY "Public can view all order_items" ON order_items
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can create order_items" ON order_items
  FOR INSERT
  TO public
  WITH CHECK (true);

-- ───────────────────────────────────────────────────────────────────
-- 3. VERIFY POLICIES WERE CREATED
-- ───────────────────────────────────────────────────────────────────

-- Check orders policies
SELECT 'Orders policies:' as info;
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename = 'orders';

-- Check order_items policies
SELECT 'Order Items policies:' as info;
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename = 'order_items';
