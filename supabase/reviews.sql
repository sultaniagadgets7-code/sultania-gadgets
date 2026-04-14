-- ============================================================
-- Product Reviews
-- Run in Supabase SQL Editor
-- ============================================================

create table if not exists reviews (
  id          uuid        primary key default gen_random_uuid(),
  product_id  uuid        not null references products(id) on delete cascade,
  user_id     uuid        references auth.users(id) on delete set null,
  author_name text        not null,
  rating      smallint    not null check (rating >= 1 and rating <= 5),
  title       text,
  body        text        not null,
  is_verified boolean     not null default false,
  is_approved boolean     not null default true,
  created_at  timestamptz not null default now()
);

create index if not exists idx_reviews_product  on reviews(product_id);
create index if not exists idx_reviews_user     on reviews(user_id);
create index if not exists idx_reviews_approved on reviews(is_approved);

alter table reviews enable row level security;

-- Anyone can read approved reviews
drop policy if exists "reviews: public read" on reviews;
create policy "reviews: public read"
  on reviews for select
  using (is_approved = true);

-- Authenticated users can insert their own review
drop policy if exists "reviews: insert own" on reviews;
create policy "reviews: insert own"
  on reviews for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Anon users can also submit (guest reviews)
drop policy if exists "reviews: anon insert" on reviews;
create policy "reviews: anon insert"
  on reviews for insert
  to anon
  with check (user_id is null);

-- Users can delete their own review
drop policy if exists "reviews: delete own" on reviews;
create policy "reviews: delete own"
  on reviews for delete
  using (auth.uid() = user_id);

-- Admin full access
drop policy if exists "reviews: admin all" on reviews;
create policy "reviews: admin all"
  on reviews for all
  using (auth.role() = 'authenticated');

grant select on reviews to anon;
grant select, insert, delete on reviews to authenticated;
