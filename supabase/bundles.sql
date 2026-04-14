create table if not exists bundles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  discount_percent integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists bundle_items (
  id uuid primary key default gen_random_uuid(),
  bundle_id uuid not null references bundles(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  quantity integer not null default 1
);

alter table bundles enable row level security;
alter table bundle_items enable row level security;

drop policy if exists "Public read active bundles" on bundles;
create policy "Public read active bundles" on bundles for select using (is_active = true);

drop policy if exists "Public read bundle items" on bundle_items;
create policy "Public read bundle items" on bundle_items for select using (true);

drop policy if exists "Admin manage bundles" on bundles;
create policy "Admin manage bundles" on bundles for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "Admin manage bundle items" on bundle_items;
create policy "Admin manage bundle items" on bundle_items for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

grant select on bundles to anon, authenticated;
grant select on bundle_items to anon, authenticated;
grant select, insert, update, delete on bundles to authenticated;
grant select, insert, update, delete on bundle_items to authenticated;
