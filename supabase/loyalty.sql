-- Loyalty Points System
-- Rule: 1 point per Rs. 100 spent. 100 points = Rs. 100 discount

create table if not exists loyalty_points (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  points integer not null default 0,
  total_earned integer not null default 0,
  total_redeemed integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists loyalty_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  order_id uuid references orders(id) on delete set null,
  points integer not null,
  type text not null check (type in ('earned','redeemed','bonus')),
  description text,
  created_at timestamptz not null default now()
);

alter table loyalty_points enable row level security;
alter table loyalty_transactions enable row level security;

drop policy if exists "Users read own points" on loyalty_points;
create policy "Users read own points" on loyalty_points for select using (auth.uid() = user_id);

drop policy if exists "Users read own transactions" on loyalty_transactions;
create policy "Users read own transactions" on loyalty_transactions for select using (auth.uid() = user_id);

drop policy if exists "Admin manage loyalty" on loyalty_points;
create policy "Admin manage loyalty" on loyalty_points for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "Admin manage transactions" on loyalty_transactions;
create policy "Admin manage transactions" on loyalty_transactions for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

grant select on loyalty_points to authenticated;
grant select on loyalty_transactions to authenticated;
grant select, insert, update, delete on loyalty_points to authenticated;
grant select, insert on loyalty_transactions to authenticated;

-- Award points function: 1 point per Rs. 100
create or replace function award_loyalty_points(p_user_id uuid, p_order_id uuid, p_order_total numeric)
returns void language plpgsql security definer as $$
declare pts integer := floor(p_order_total / 100);
begin
  if pts <= 0 then return; end if;
  insert into loyalty_points (user_id, points, total_earned)
  values (p_user_id, pts, pts)
  on conflict (user_id) do update
  set points = loyalty_points.points + pts,
      total_earned = loyalty_points.total_earned + pts,
      updated_at = now();
  insert into loyalty_transactions (user_id, order_id, points, type, description)
  values (p_user_id, p_order_id, pts, 'earned', 'Points earned from order');
end;
$$;

grant execute on function award_loyalty_points(uuid, uuid, numeric) to authenticated;
