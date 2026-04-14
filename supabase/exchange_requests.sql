create table if not exists exchange_requests (
  id uuid primary key default gen_random_uuid(),
  order_id text,
  customer_name text not null,
  phone text not null,
  product_name text not null,
  reason text not null,
  description text,
  status text not null default 'pending'
    check (status in ('pending','approved','rejected','resolved')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table exchange_requests enable row level security;

drop policy if exists "Public insert exchange requests" on exchange_requests;
create policy "Public insert exchange requests"
  on exchange_requests for insert to anon, authenticated with check (true);

drop policy if exists "Admin manage exchange requests" on exchange_requests;
create policy "Admin manage exchange requests"
  on exchange_requests for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

grant insert on exchange_requests to anon;
grant select, insert, update, delete on exchange_requests to authenticated;
