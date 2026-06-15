-- Lumyn — single Supabase migration
-- Run in SQL Editor or: supabase db push
-- Requires: Auth enabled (anonymous + email optional)

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Profiles (1:1 with auth.users) — profile, settings, streak
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  user_name text not null default '',
  birth_date date,
  numerology_system text not null default 'chaldean'
    check (numerology_system in ('chaldean', 'pythagorean')),
  personal_number smallint check (personal_number between 1 and 33),
  life_path_number smallint check (life_path_number between 1 and 33),
  selected_intentions text[] not null default '{}',
  onboarding_complete boolean not null default false,
  streak integer not null default 0 check (streak >= 0),
  last_active_date date,
  dark_mode boolean not null default false,
  notif_enabled boolean not null default true,
  reminder_time text not null default '8:00 AM',
  mantra_ambient boolean not null default false,
  mantra_binaural boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- User-owned collections
-- ---------------------------------------------------------------------------
create table public.saved_combos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  words text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  word text not null,
  mood_before smallint not null check (mood_before between 1 and 5),
  mood_after smallint not null check (mood_after between 1 and 5),
  note text not null default '',
  created_at timestamptz not null default now()
);

create table public.synchronicity_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  word text not null,
  sign text not null,
  note text not null default '',
  created_at timestamptz not null default now()
);

create table public.saved_words (
  user_id uuid not null references public.profiles (id) on delete cascade,
  word text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, word)
);

-- ---------------------------------------------------------------------------
-- Community combo exchange (shared catalog)
-- ---------------------------------------------------------------------------
create table public.community_combos (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  words text[] not null,
  author_display text not null default 'Lumyn Community',
  tag text not null default 'General',
  resonance_number smallint,
  created_at timestamptz not null default now()
);

create table public.community_upvotes (
  user_id uuid not null references public.profiles (id) on delete cascade,
  combo_id uuid not null references public.community_combos (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, combo_id)
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------
create index saved_combos_user_id_idx on public.saved_combos (user_id);
create index journal_entries_user_id_created_idx on public.journal_entries (user_id, created_at desc);
create index synchronicity_entries_user_id_created_idx on public.synchronicity_entries (user_id, created_at desc);
create index community_upvotes_combo_id_idx on public.community_upvotes (combo_id);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- New auth user → empty profile
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Community combo upvote count (for feed)
-- ---------------------------------------------------------------------------
create or replace view public.community_combos_with_votes
with (security_invoker = true)
as
select
  c.id,
  c.name,
  c.words,
  c.author_display,
  c.tag,
  c.resonance_number,
  c.created_at,
  count(u.user_id)::integer as upvote_count
from public.community_combos c
left join public.community_upvotes u on u.combo_id = c.id
group by c.id;

-- ---------------------------------------------------------------------------
-- Delete all user data (App Store 5.1.1(v))
-- Client should also sign out; use Edge Function to delete auth.users if required.
-- ---------------------------------------------------------------------------
create or replace function public.delete_my_data()
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;
  delete from public.profiles where id = auth.uid();
end;
$$;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.saved_combos enable row level security;
alter table public.journal_entries enable row level security;
alter table public.synchronicity_entries enable row level security;
alter table public.saved_words enable row level security;
alter table public.community_combos enable row level security;
alter table public.community_upvotes enable row level security;

-- profiles
create policy "profiles_select_own" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);

create policy "profiles_insert_own" on public.profiles
  for insert to authenticated with check ((select auth.uid()) = id);

create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "profiles_delete_own" on public.profiles
  for delete to authenticated using ((select auth.uid()) = id);

-- saved_combos
create policy "combos_select_own" on public.saved_combos
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "combos_insert_own" on public.saved_combos
  for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "combos_update_own" on public.saved_combos
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "combos_delete_own" on public.saved_combos
  for delete to authenticated using ((select auth.uid()) = user_id);

-- journal_entries
create policy "journal_select_own" on public.journal_entries
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "journal_insert_own" on public.journal_entries
  for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "journal_update_own" on public.journal_entries
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "journal_delete_own" on public.journal_entries
  for delete to authenticated using ((select auth.uid()) = user_id);

-- synchronicity_entries
create policy "sync_select_own" on public.synchronicity_entries
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "sync_insert_own" on public.synchronicity_entries
  for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "sync_update_own" on public.synchronicity_entries
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "sync_delete_own" on public.synchronicity_entries
  for delete to authenticated using ((select auth.uid()) = user_id);

-- saved_words
create policy "saved_words_select_own" on public.saved_words
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "saved_words_insert_own" on public.saved_words
  for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "saved_words_delete_own" on public.saved_words
  for delete to authenticated using ((select auth.uid()) = user_id);

-- community_combos — readable by everyone authenticated
create policy "community_combos_select" on public.community_combos
  for select to authenticated using (true);

-- community_upvotes
create policy "upvotes_select" on public.community_upvotes
  for select to authenticated using (true);

create policy "upvotes_insert_own" on public.community_upvotes
  for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "upvotes_delete_own" on public.community_upvotes
  for delete to authenticated using ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- API grants (if Data API does not auto-expose new tables)
-- ---------------------------------------------------------------------------
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.saved_combos to authenticated;
grant select, insert, update, delete on public.journal_entries to authenticated;
grant select, insert, update, delete on public.synchronicity_entries to authenticated;
grant select, insert, delete on public.saved_words to authenticated;
grant select on public.community_combos to authenticated;
grant select, insert, delete on public.community_upvotes to authenticated;
grant select on public.community_combos_with_votes to authenticated;
grant execute on function public.delete_my_data() to authenticated;

-- ---------------------------------------------------------------------------
-- Seed community combos (matches app mock data)
-- ---------------------------------------------------------------------------
insert into public.community_combos (id, name, words, author_display, tag, resonance_number) values
  ('a0000001-0000-4000-8000-000000000001', 'Abundance Gateway', array['TOGETHER','COUNT','BRING'], 'Maya R.', 'Abundance', 1),
  ('a0000001-0000-4000-8000-000000000002', 'Heart Opening Flow', array['LOVE','ALLOW','RESTORE'], 'Jordan K.', 'Heart', 6),
  ('a0000001-0000-4000-8000-000000000003', 'Clarity Sequence', array['CRYSTAL','FIND','CLEAR'], 'Sam L.', 'Clarity', 7),
  ('a0000001-0000-4000-8000-000000000004', 'New Moon Ritual', array['DIVINE','OPEN','TOGETHER'], 'Ari P.', 'Spiritual', 1),
  ('a0000001-0000-4000-8000-000000000005', 'Full Moon Amplify', array['GLORIFY','ELATE','CHARM'], 'Nova T.', 'Joy', 3),
  ('a0000001-0000-4000-8000-000000000006', 'Deep Reset', array['CLEAR','WAFT','BETWEEN'], 'River S.', 'Spiritual', 7),
  ('a0000001-0000-4000-8000-000000000007', 'Momentum Stack', array['MOVE','REACH','SHIFT'], 'Casey M.', 'Growth', 5),
  ('a0000001-0000-4000-8000-000000000008', 'Magnetic Presence', array['CHARM','TOGETHER','BRING'], 'Eden W.', 'Attraction', 8)
on conflict (id) do nothing;
