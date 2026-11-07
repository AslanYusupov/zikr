alter table zikr_presence add column if not exists concealed boolean not null default false;
alter table zikr_presence add column if not exists tap_since timestamptz;
alter table zikr_presence add column if not exists last_tap_at timestamptz;
