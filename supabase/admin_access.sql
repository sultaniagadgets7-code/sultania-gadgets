-- ============================================================
-- Admin Full Access — Run in Supabase SQL Editor
-- Grants authenticated role complete access to all tables
-- ============================================================

-- ── Categories ───────────────────────────────────────────────
drop policy if exists "Admin full access categories" on categories;
create policy "Admin full access categories"
  on categories for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

grant select, insert, update, delete on categories to authenticated;

-- ── Products ─────────────────────────────────────────────────
drop policy if exists "Admin full access products" on products;
create policy "Admin full access products"
  on products for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

grant select, insert, update, delete on products to authenticated;

-- ── Product Images ───────────────────────────────────────────
drop policy if exists "Admin full access product images" on product_images;
create policy "Admin full access product images"
  on product_images for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

grant select, insert, update, delete on product_images to authenticated;

-- ── Orders ───────────────────────────────────────────────────
drop policy if exists "Admin full access orders" on orders;
create policy "Admin full access orders"
  on orders for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

grant select, insert, update, delete on orders to authenticated;

-- ── Order Items ──────────────────────────────────────────────
drop policy if exists "Admin full access order items" on order_items;
create policy "Admin full access order items"
  on order_items for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

grant select, insert, update, delete on order_items to authenticated;

-- ── Reviews ──────────────────────────────────────────────────
drop policy if exists "reviews: admin all" on reviews;
create policy "reviews: admin all"
  on reviews for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

grant select, insert, update, delete on reviews to authenticated;

-- ── FAQ Items ────────────────────────────────────────────────
drop policy if exists "Admin full access faqs" on faq_items;
create policy "Admin full access faqs"
  on faq_items for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

grant select, insert, update, delete on faq_items to authenticated;

-- ── Testimonials ─────────────────────────────────────────────
drop policy if exists "Admin full access testimonials" on testimonials;
create policy "Admin full access testimonials"
  on testimonials for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

grant select, insert, update, delete on testimonials to authenticated;

-- ── Site Settings ────────────────────────────────────────────
drop policy if exists "Admin full access settings" on site_settings;
create policy "Admin full access settings"
  on site_settings for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

grant select, insert, update, delete on site_settings to authenticated;

-- ── Profiles ─────────────────────────────────────────────────
drop policy if exists "Admin full access profiles" on profiles;
create policy "Admin full access profiles"
  on profiles for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

grant select, insert, update, delete on profiles to authenticated;

-- ── Wishlist ─────────────────────────────────────────────────
drop policy if exists "Admin full access wishlist" on wishlist;
create policy "Admin full access wishlist"
  on wishlist for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

grant select, insert, update, delete on wishlist to authenticated;

-- ── Addresses ────────────────────────────────────────────────
drop policy if exists "Admin full access addresses" on addresses;
create policy "Admin full access addresses"
  on addresses for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

grant select, insert, update, delete on addresses to authenticated;

-- ── Grant schema usage ───────────────────────────────────────
grant usage on schema public to authenticated;
grant usage on schema public to anon;

-- ── Grant sequence access (for uuid generation) ──────────────
grant usage, select on all sequences in schema public to authenticated;
grant execute on all functions in schema public to authenticated;
