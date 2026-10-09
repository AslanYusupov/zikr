alter table zikr_presence add column if not exists tap_since timestamptz;
alter table zikr_presence add column if not exists last_tap_at timestamptz;

create index if not exists zikr_presence_tap_idx on zikr_presence (last_tap_at desc);
