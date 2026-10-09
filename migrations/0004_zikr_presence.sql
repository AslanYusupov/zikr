create table if not exists zikr_presence (
  public_id text primary key,
  country text not null default '',
  day_key text not null default '',
  day_total integer not null default 0,
  xp integer not null default 0,
  total integer not null default 0,
  seen_at timestamptz not null default now()
);

create index if not exists zikr_presence_seen_idx on zikr_presence (seen_at desc);
create index if not exists zikr_presence_day_idx on zikr_presence (day_key, day_total desc);
create index if not exists zikr_presence_xp_idx on zikr_presence (xp desc);
