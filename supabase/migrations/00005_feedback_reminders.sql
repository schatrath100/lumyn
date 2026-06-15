-- Lumyn · in-app feedback + reminder frequency fields

alter table public.profiles
  add column if not exists reminder_frequency text not null default 'off'
    check (reminder_frequency in ('off', 'daily', 'weekly')),
  add column if not exists reminder_weekday smallint not null default 2
    check (reminder_weekday between 1 and 7);

comment on column public.profiles.reminder_frequency is
  'Practice reminder cadence: off, daily, or weekly.';

comment on column public.profiles.reminder_weekday is
  'For weekly reminders — calendar weekday 1=Sun … 7=Sat.';

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  message text not null,
  app_version text,
  created_at timestamptz not null default now(),
  constraint feedback_message_len check (char_length(message) between 1 and 140)
);

create index if not exists feedback_user_id_created_at_idx
  on public.feedback (user_id, created_at desc);

comment on table public.feedback is
  'In-app feedback from Settings; read in Supabase dashboard.';

alter table public.feedback enable row level security;

create policy "feedback_select_own" on public.feedback
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "feedback_insert_own" on public.feedback
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

grant select, insert on public.feedback to authenticated;

-- Include feedback in account deletion
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
  delete from public.feedback where user_id = auth.uid();
  delete from public.profiles where id = auth.uid();
end;
$$;
