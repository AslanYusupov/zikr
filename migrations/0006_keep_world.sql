-- Keep every number already stored by the previous version.
-- zikr_world is the old public rating. Nothing here deletes or resets it.
alter table zikr_presence add column if not exists tap_since timestamptz;
alter table zikr_presence add column if not exists last_tap_at timestamptz;

insert into zikr_presence (public_id, country, day_key, day_total, xp, total, seen_at)
select public_id, '', '', 0, total, total, updated_at
from zikr_world
on conflict (public_id) do update set
  total = greatest(zikr_presence.total, excluded.total),
  xp = greatest(zikr_presence.xp, excluded.xp);
