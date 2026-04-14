create table if not exists abandoned_carts (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  phone text,
  items jsonb not null default '[]',
  total numeric not null default 0,
  reminder_sent boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table abandoned_carts enable row level security;
create policy "Public insert abandoned carts" on abandoned_carts for insert to anon, authenticated with check (true);
create policy "Public update own cart" on abandoned_carts for update to anon, authenticated using (true);
create policy "Admin read abandoned carts" on abandoned_carts for select using (auth.role() = 'authenticated');
grant insert, update on abandoned_carts to anon, authenticated;
grant select on abandoned_carts to authenticated;
