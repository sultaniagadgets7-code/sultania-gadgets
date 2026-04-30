-- ============================================================
-- Sultania Gadgets — Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- CATEGORIES
-- ============================================================
create table if not exists categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_categories_slug on categories(slug);

-- ============================================================
-- PRODUCTS
-- ============================================================
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  title text not null,
  short_description text,
  description text,
  category_id uuid references categories(id) on delete set null,
  price numeric(10,2) not null check (price >= 0),
  compare_at_price numeric(10,2) check (compare_at_price >= 0),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  sku text,
  condition text not null default 'New',
  badge text,
  compatibility text,
  specs_json jsonb,
  whats_in_box text,
  is_featured boolean not null default false,
  is_new_arrival boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_products_slug on products(slug);
create index if not exists idx_products_category on products(category_id);
create index if not exists idx_products_active on products(is_active);
create index if not exists idx_products_featured on products(is_featured);

-- ============================================================
-- PRODUCT IMAGES
-- ============================================================
create table if not exists product_images (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  image_url text not null,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_product_images_product on product_images(product_id);

-- ============================================================
-- ORDERS
-- ============================================================
create type if not exists order_status as enum ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled');
create type if not exists order_source as enum ('website', 'whatsapp');

create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  customer_name text not null,
  phone text not null,
  city text not null,
  address text not null,
  notes text,
  status order_status not null default 'pending',
  subtotal numeric(10,2) not null check (subtotal >= 0),
  delivery_fee numeric(10,2) not null default 200 check (delivery_fee >= 0),
  total numeric(10,2) not null check (total >= 0),
  order_source order_source not null default 'website',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_orders_status on orders(status);
create index if not exists idx_orders_created on orders(created_at desc);

-- ============================================================
-- ORDER ITEMS
-- ============================================================
create table if not exists order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  product_title_snapshot text not null,
  price_snapshot numeric(10,2) not null check (price_snapshot >= 0),
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz not null default now()
);

create index if not exists idx_order_items_order on order_items(order_id);

-- ============================================================
-- FAQ ITEMS
-- ============================================================
create table if not exists faq_items (
  id uuid primary key default uuid_generate_v4(),
  question text not null,
  answer text not null,
  product_id uuid references products(id) on delete cascade,
  sort_order integer not null default 0,
  is_active boolean not null default true
);

create index if not exists idx_faq_product on faq_items(product_id);

-- ============================================================
-- TESTIMONIALS
-- ============================================================
create table if not exists testimonials (
  id uuid primary key default uuid_generate_v4(),
  customer_name text not null,
  quote text not null,
  location text,
  is_featured boolean not null default true,
  created_at timestamptz not null default now()
);

-- ============================================================
-- SITE SETTINGS
-- ============================================================
create table if not exists site_settings (
  id uuid primary key default uuid_generate_v4(),
  whatsapp_number text not null default '923001234567',
  support_text text,
  shipping_text text,
  cod_enabled boolean not null default true,
  store_city text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- FUNCTION: Decrement stock safely
-- ============================================================
create or replace function decrement_stock(product_id uuid, qty integer)
returns void as $$
begin
  update products
  set stock_quantity = greatest(0, stock_quantity - qty),
      updated_at = now()
  where id = product_id;
end;
$$ language plpgsql security definer;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Public read access for store data
alter table categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table faq_items enable row level security;
alter table testimonials enable row level security;
alter table site_settings enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Public can read active products, categories, faqs, testimonials, settings
create policy "Public read categories" on categories for select using (true);
create policy "Public read active products" on products for select using (is_active = true);
create policy "Public read product images" on product_images for select using (true);
create policy "Public read active faqs" on faq_items for select using (is_active = true);
create policy "Public read featured testimonials" on testimonials for select using (is_featured = true);
create policy "Public read site settings" on site_settings for select using (true);

-- Public can insert orders (COD flow)
create policy "Public insert orders" on orders for insert with check (true);
create policy "Public insert order items" on order_items for insert with check (true);

-- Authenticated (admin) can do everything
create policy "Admin full access categories" on categories for all using (auth.role() = 'authenticated');
create policy "Admin full access products" on products for all using (auth.role() = 'authenticated');
create policy "Admin full access product images" on product_images for all using (auth.role() = 'authenticated');
create policy "Admin full access orders" on orders for all using (auth.role() = 'authenticated');
create policy "Admin full access order items" on order_items for all using (auth.role() = 'authenticated');
create policy "Admin full access faqs" on faq_items for all using (auth.role() = 'authenticated');
create policy "Admin full access testimonials" on testimonials for all using (auth.role() = 'authenticated');
create policy "Admin full access settings" on site_settings for all using (auth.role() = 'authenticated');
