-- Run after migrations. A successful audit returns zero rows for both queries.

-- Every application table must have RLS enabled.
select c.relname as table_without_rls
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relkind = 'r'
  and c.relname in (
    'profiles', 'consent_settings', 'consent_events', 'notification_settings',
    'push_subscriptions', 'user_subscriptions', 'starter_action_templates',
    'starter_actions', 'starter_schedules', 'focus_sessions',
    'focus_session_events', 'emotion_records', 'payment_saving_goals',
    'payment_reviews', 'payment_review_followups', 'payment_saving_entries',
    'payment_goal_achievements', 'writing_helper_histories', 'weekly_reviews',
    'data_jobs', 'plus_plans'
  )
  and not c.relrowsecurity;

-- Every user-owned table must expose an authenticated owner-scoped SELECT policy.
with expected(table_name) as (
  select unnest(array[
    'profiles', 'consent_settings', 'consent_events', 'notification_settings',
    'push_subscriptions', 'user_subscriptions', 'starter_actions',
    'starter_schedules', 'focus_sessions', 'focus_session_events',
    'emotion_records', 'payment_saving_goals', 'payment_reviews',
    'payment_review_followups', 'payment_saving_entries',
    'payment_goal_achievements', 'writing_helper_histories', 'weekly_reviews',
    'data_jobs'
  ])
)
select expected.table_name as table_without_owner_select_policy
from expected
left join pg_policies policy
  on policy.schemaname = 'public'
  and policy.tablename = expected.table_name
  and policy.policyname = 'own_select'
  and policy.cmd = 'SELECT'
where policy.policyname is null;
