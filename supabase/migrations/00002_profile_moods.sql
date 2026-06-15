-- Lumyn — profile contact fields + mood check-in history
-- Run after 00001_lumyn_schema.sql on https://dmwsfygtexkrcgjkmafg.supabase.co

-- ---------------------------------------------------------------------------
-- Extend profiles (optional contact + avatar)
-- ---------------------------------------------------------------------------
alter table public.profiles
  add column if not exists first_name text not null default '',
  add column if not exists last_name text not null default '',
  add column if not exists email text not null default '',
  add column if not exists avatar_emoji text not null default '✦';

-- ---------------------------------------------------------------------------
-- Mood check-ins (home tiles + colour grid)
-- ---------------------------------------------------------------------------
create table if not exists public.mood_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  mood_id text not null,
  mood_label text not null,
  match_word text not null,
  source text not null check (source in ('tile', 'color_grid')),
  created_at timestamptz not null default now()
);

create index if not exists mood_checkins_user_id_created_idx
  on public.mood_checkins (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.mood_checkins enable row level security;

create policy "mood_checkins_select_own" on public.mood_checkins
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "mood_checkins_insert_own" on public.mood_checkins
  for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "mood_checkins_delete_own" on public.mood_checkins
  for delete to authenticated using ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- API grants
-- ---------------------------------------------------------------------------
grant select, insert, delete on public.mood_checkins to authenticated;
