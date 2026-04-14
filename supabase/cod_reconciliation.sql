-- COD Collection Reconciliation
alter table orders add column if not exists cod_collected boolean not null default false;
alter table orders add column if not exists cod_collected_at timestamptz;
alter table orders add column if not exists cod_collected_by text;

-- Courier / dispatch tracking
alter table orders add column if not exists tracking_number text;
alter table orders add column if not exists courier text;
alter table orders add column if not exists dispatched_at timestamptz;
