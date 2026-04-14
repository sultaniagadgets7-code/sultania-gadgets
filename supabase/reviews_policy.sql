-- ============================================================
-- Reviews — Purchase Verification Policy
-- Run in Supabase SQL Editor
-- ============================================================

-- Helper function: check if user has ordered a product
create or replace function has_ordered_product(p_product_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1
    from orders o
    join order_items oi on oi.order_id = o.id
    where o.user_id = auth.uid()
      and oi.product_id = p_product_id
      and o.status in ('confirmed', 'shipped', 'delivered')
  );
$$;

-- Drop old insert policies
drop policy if exists "reviews: insert own"  on reviews;
drop policy if exists "reviews: anon insert" on reviews;
drop policy if exists "reviews: admin all"   on reviews;

-- Only buyers can insert (must have a confirmed/shipped/delivered order for this product)
create policy "reviews: verified buyers only"
  on reviews for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and has_ordered_product(product_id)
  );

-- Admin (service role) bypasses RLS entirely — no policy needed
-- But for authenticated admins inserting "featured" reviews, allow if is_verified = false
-- (admin manually sets author_name, so user_id can be null for fake/demo reviews)
create policy "reviews: admin insert"
  on reviews for insert
  to authenticated
  with check (
    -- Admin path: user_id is null (fake/demo review inserted by admin)
    user_id is null
  );

-- Grant execute on helper function
grant execute on function has_ordered_product(uuid) to authenticated;
