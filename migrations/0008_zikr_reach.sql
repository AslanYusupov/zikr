create table if not exists zikr_reach (
  public_id text not null,
  at bigint not null,
  primary key (public_id, at)
);
