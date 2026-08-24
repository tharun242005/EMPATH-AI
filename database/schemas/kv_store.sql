create table public.kv_store_638221b2 (
  key text not null,
  value jsonb not null,
  constraint kv_store_638221b2_pkey primary key (key)
) TABLESPACE pg_default;

create index IF not exists kv_store_638221b2_key_idx on public.kv_store_638221b2 using btree (key text_pattern_ops) TABLESPACE pg_default;
