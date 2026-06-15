-- Lumyn · subscription fields on profiles (paywall + trial sync)
alter table public.profiles
  add column if not exists is_subscribed boolean not null default false,
  add column if not exists trial_start_date timestamptz,
  add column if not exists subscription_plan text check (subscription_plan in ('weekly', 'quarterly'));

comment on column public.profiles.is_subscribed is
  'Premium access flag; synced when user starts trial or restores purchase.';

comment on column public.profiles.trial_start_date is
  'When the 3-day free trial began.';

comment on column public.profiles.subscription_plan is
  'Last selected plan: weekly or quarterly.';
