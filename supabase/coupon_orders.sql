-- Add coupon support to orders
alter table orders add column if not exists coupon_id uuid references coupons(id) on delete set null;
alter table orders add column if not exists discount_amount numeric(10,2) not null default 0;

-- Function to increment coupon usage count
create or replace function increment_coupon_usage(coupon_id uuid)
returns void language plpgsql security definer as $$
begin
  update coupons set used_count = used_count + 1 where id = coupon_id;
end;
$$;

grant execute on function increment_coupon_usage(uuid) to authenticated, anon;
