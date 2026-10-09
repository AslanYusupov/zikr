create table if not exists zikr_world (
  public_id text primary key,
  total integer not null default 0,
  updated_at timestamptz not null default now()
);

create index if not exists zikr_world_total_idx on zikr_world (total desc);
