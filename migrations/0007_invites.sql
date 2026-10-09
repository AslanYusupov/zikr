create table if not exists zikr_invites (
  guest_id text primary key,
  host_id text not null,
  total integer not null default 0,
  updated_at timestamptz not null default now()
);

create index if not exists zikr_invites_host_idx on zikr_invites (host_id, total desc);
