-- Lumyn · allow authenticated users to publish combos to community exchange
alter table public.community_combos
  add column if not exists submitted_by uuid references public.profiles (id) on delete set null;

create index if not exists community_combos_submitted_by_idx
  on public.community_combos (submitted_by);

comment on column public.community_combos.submitted_by is
  'Profile that published this combo; null for seeded catalog entries.';

create policy "community_combos_insert_own" on public.community_combos
  for insert to authenticated
  with check (submitted_by = (select auth.uid()));

grant insert on public.community_combos to authenticated;
