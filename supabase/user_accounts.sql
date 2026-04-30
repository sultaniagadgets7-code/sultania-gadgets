-- ============================================================
-- Sultania Gadgets — User Account System
-- Run this in Supabase SQL Editor
-- ============================================================


-- ============================================================
-- SECTION 1: PROFILES
-- Stores public user data linked to auth.users
-- ============================================================

create table if not exists profiles (
  id          uuid        primary key references auth.users(id) on delete cascade,
  full_name   text,
  email       text,
  phone       text,
  city        text,
  address     text,
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Index for fast lookups
create index if not exists idx_profiles_id on profiles(id);

-- Enable RLS
alter table profiles enable row level security;

-- Policies
drop policy if exists "profiles: select own" on profiles;
create policy "profiles: select own"
  on profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles: insert own" on profiles;
create policy "profiles: insert own"
  on profiles for insert
  with check (auth.uid() = id);

drop policy if exists "profiles: update own" on profiles;
create policy "profiles: update own"
  on profiles for update
  using (auth.uid() = id);


-- ============================================================
-- SECTION 2: AUTO-CREATE PROFILE ON SIGNUP
-- Trigger fires after a new user is inserted into auth.users
-- ============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, created_at, updated_at)
  values (
    new.id,
    new.email,
    now(),
    now()
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Drop existing trigger if present, then recreate
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();


-- ============================================================
-- SECTION 3: WISHLIST
-- Stores products saved by users
-- ============================================================

create table if not exists wishlist (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users(id) on delete cascade,
  product_id  uuid        not null references products(id) on delete cascade,
  created_at  timestamptz not null default now(),

  -- Prevent duplicate saves
  unique (user_id, product_id)
);

-- Indexes
create index if not exists idx_wishlist_user_id    on wishlist(user_id);
create index if not exists idx_wishlist_product_id on wishlist(product_id);

-- Enable RLS
alter table wishlist enable row level security;

-- Policies
drop policy if exists "wishlist: select own" on wishlist;
create policy "wishlist: select own"
  on wishlist for select
  using (auth.uid() = user_id);

drop policy if exists "wishlist: insert own" on wishlist;
create policy "wishlist: insert own"
  on wishlist for insert
  with check (auth.uid() = user_id);

drop policy if exists "wishlist: delete own" on wishlist;
create policy "wishlist: delete own"
  on wishlist for delete
  using (auth.uid() = user_id);


-- ============================================================
-- SECTION 4: ADDRESSES
-- Stores saved shipping addresses per user
-- ============================================================

create table if not exists addresses (
  id           uuid        primary key default gen_random_uuid(),
  user_id      uuid        not null references auth.users(id) on delete cascade,
  full_name    text        not null,
  phone        text        not null,
  address_line text        not null,
  city         text        not null,
  country      text        not null default 'Pakistan',
  postal_code  text,
  created_at   timestamptz not null default now()
);

-- Index
create index if not exists idx_addresses_user_id on addresses(user_id);

-- Enable RLS
alter table addresses enable row level security;

-- Policies
drop policy if exists "addresses: select own" on addresses;
create policy "addresses: select own"
  on addresses for select
  using (auth.uid() = user_id);

drop policy if exists "addresses: insert own" on addresses;
create policy "addresses: insert own"
  on addresses for insert
  with check (auth.uid() = user_id);

drop policy if exists "addresses: update own" on addresses;
create policy "addresses: update own"
  on addresses for update
  using (auth.uid() = user_id);

drop policy if exists "addresses: delete own" on addresses;
create policy "addresses: delete own"
  on addresses for delete
  using (auth.uid() = user_id);


-- ============================================================
-- SECTION 5: LINK ORDERS TO USERS
-- Adds optional user_id to orders so logged-in users
-- can view their order history
-- ============================================================

-- First add the column without constraint
ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id UUID;

-- Add city/address to profiles if not already present
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS address TEXT;

-- Add the foreign key constraint separately
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'orders_user_id_fkey' 
    AND table_name = 'orders'
  ) THEN
    ALTER TABLE orders ADD CONSTRAINT orders_user_id_fkey 
      FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Create index
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

-- Allow users to read their own orders
DROP POLICY IF EXISTS "Users read own orders" ON orders;
DROP POLICY IF EXISTS "orders: select own" ON orders;

CREATE POLICY "orders: select own"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);


-- ============================================================
-- SECTION 6: GRANT PERMISSIONS
-- Allow authenticated role to access these tables
-- ============================================================

grant usage on schema public to authenticated;

grant select, insert, update         on profiles  to authenticated;
grant select, insert, delete         on wishlist  to authenticated;
grant select, insert, update, delete on addresses to authenticated;
grant select                         on orders    to authenticated;
grant select                         on order_items to authenticated;
grant select                         on products  to authenticated;
grant select                         on product_images to authenticated;
grant select                         on categories to authenticated;
