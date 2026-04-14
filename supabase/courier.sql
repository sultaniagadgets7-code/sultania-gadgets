alter table orders add column if not exists tracking_number text;
alter table orders add column if not exists courier text;
alter table orders add column if not exists dispatched_at timestamptz;
