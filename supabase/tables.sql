-- Extensions (safe to re-run)
create extension if not exists pgcrypto;

-- DAYS table
create table if not exists public.days (
  id date primary key,
  tz text not null default 'America/Detroit',
  moon_sign text not null,
  moon_degree numeric,
  decan int check (decan between 1 and 3),
  phase_name text not null,
  phase_angle numeric,
  minor_arcana text,
  major_arcana text,
  sign_color text,
  meaning_combined text,
  computed_at_utc timestamptz default now()
);

alter table public.days enable row level security;

-- COMMENTS table
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  day_id date not null references public.days(id) on delete cascade,
  visitor_id text not null,
  body text not null check (length(body) <= 2000),
  created_at timestamptz not null default now()
);

create index if not exists comments_day_idx on public.comments(day_id);

alter table public.comments enable row level security;

-- RLS policies
do $$ begin
  -- DAYS
  if not exists (select 1 from pg_policies where policyname = 'days_read') then
    create policy days_read
      on public.days
      for select
      to anon, authenticated
      using (true);
  end if;

  if not exists (select 1 from pg_policies where policyname = 'days_insert_service') then
    create policy days_insert_service
      on public.days
      for insert
      to service_role
      with check (true);
  end if;

  -- COMMENTS
  if not exists (select 1 from pg_policies where policyname = 'comments_read') then
    create policy comments_read
      on public.comments
      for select
      to anon, authenticated
      using (true);
  end if;

  if not exists (select 1 from pg_policies where policyname = 'comments_insert') then
    create policy comments_insert
      on public.comments
      for insert
      to anon, authenticated
      with check (
        char_length(visitor_id) > 0
        and day_id is not null
        and body is not null
        and char_length(body) <= 2000
      );
  end if;
end $$;
