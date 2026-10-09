create table if not exists zikr_saves (
  user_id text primary key,
  display_name text not null,
  invite_code text not null unique,
  invited_by text,
  total integer not null default 0,
  level integer not null default 1,
  best_day integer not null default 0,
  public_board boolean not null default true,
  payload text not null,
  updated_at timestamptz not null default now()
);

create index if not exists zikr_saves_board_idx on zikr_saves (public_board, total desc);
create index if not exists zikr_saves_invited_idx on zikr_saves (invited_by);
