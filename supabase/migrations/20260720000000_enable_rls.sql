-- User-owned data is isolated by auth.uid(). Service-role requests bypass RLS.

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'profiles',
    'consent_settings',
    'consent_events',
    'notification_settings',
    'push_subscriptions',
    'user_subscriptions',
    'starter_actions',
    'starter_schedules',
    'focus_sessions',
    'focus_session_events',
    'emotion_records',
    'payment_saving_goals',
    'payment_reviews',
    'payment_review_followups',
    'payment_saving_entries',
    'payment_goal_achievements',
    'writing_helper_histories',
    'weekly_reviews',
    'data_jobs'
  ] loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('drop policy if exists own_select on public.%I', table_name);
    execute format(
      'create policy own_select on public.%I for select to authenticated using ((select auth.uid()) = user_id)',
      table_name
    );
  end loop;
end
$$;

-- Tables whose records can be created by an authenticated user.
do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'profiles',
    'consent_settings',
    'consent_events',
    'notification_settings',
    'push_subscriptions',
    'starter_actions',
    'starter_schedules',
    'focus_sessions',
    'focus_session_events',
    'emotion_records',
    'payment_saving_goals',
    'payment_reviews',
    'payment_review_followups',
    'payment_saving_entries',
    'payment_goal_achievements',
    'writing_helper_histories',
    'data_jobs'
  ] loop
    execute format('drop policy if exists own_insert on public.%I', table_name);
    execute format(
      'create policy own_insert on public.%I for insert to authenticated with check ((select auth.uid()) = user_id)',
      table_name
    );
  end loop;
end
$$;

-- Append-only event/ledger records and service-managed records are intentionally excluded.
do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'profiles',
    'consent_settings',
    'notification_settings',
    'push_subscriptions',
    'starter_actions',
    'starter_schedules',
    'focus_sessions',
    'emotion_records',
    'payment_saving_goals',
    'payment_reviews',
    'payment_review_followups',
    'writing_helper_histories'
  ] loop
    execute format('drop policy if exists own_update on public.%I', table_name);
    execute format(
      'create policy own_update on public.%I for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id)',
      table_name
    );
  end loop;
end
$$;

-- Only records that are not retained as an audit trail can be hard-deleted by users.
do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'push_subscriptions',
    'starter_actions',
    'starter_schedules'
  ] loop
    execute format('drop policy if exists own_delete on public.%I', table_name);
    execute format(
      'create policy own_delete on public.%I for delete to authenticated using ((select auth.uid()) = user_id)',
      table_name
    );
  end loop;
end
$$;

-- Application catalogs are publicly readable and writable only through service-role access.
alter table public.starter_action_templates enable row level security;
drop policy if exists public_read on public.starter_action_templates;
create policy public_read
  on public.starter_action_templates
  for select
  to anon, authenticated
  using (true);

alter table public.plus_plans enable row level security;
drop policy if exists public_read on public.plus_plans;
create policy public_read
  on public.plus_plans
  for select
  to anon, authenticated
  using (true);
