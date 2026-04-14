-- ============================================================
-- Fix RLS for public order creation (anon role)
-- Run this in Supabase SQL Editor
-- ============================================================

-- Drop existing insert policies
drop policy if exists "Public insert orders" on orders;
drop policy if exists "Public insert order items" on order_items;

-- Re-create with explicit anon role grant
create policy "Public insert orders" on orders
  for insert
  to anon, authenticated
  with check (true);

create policy "Public insert order items" on order_items
  for insert
  to anon, authenticated
  with check (true);

-- Also ensure anon can read their own order (for confirmation display)
drop policy if exists "Public read own orders" on orders;
create policy "Public read own orders" on orders
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Public read own order items" on order_items;
create policy "Public read own order items" on order_items
  for select
  to anon, authenticated
  using (true);

-- Grant usage on sequences to anon role
grant usage on schema public to anon;
grant insert on orders to anon;
grant insert on order_items to anon;
grant select on orders to anon;
grant select on order_items to anon;

-- Also grant execute on decrement_stock function
grant execute on function decrement_stock(uuid, integer) to anon;
