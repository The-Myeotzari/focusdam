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

-- starter/focus 관계가 같은 사용자의 행만 참조하도록 복합 FK를 가져야 한다.
with expected(table_name, constraint_name) as (
  values
    ('starter_schedules', 'starter_schedules_action_owner_fkey'),
    ('focus_sessions', 'focus_sessions_action_owner_fkey'),
    ('focus_sessions', 'focus_sessions_schedule_action_owner_fkey'),
    ('focus_session_events', 'focus_session_events_session_owner_fkey'),
    ('emotion_records', 'emotion_records_session_owner_fkey')
)
select expected.table_name, expected.constraint_name
from expected
left join pg_constraint constraint_info
  on constraint_info.conname = expected.constraint_name
left join pg_class table_info
  on table_info.oid = constraint_info.conrelid
left join pg_namespace schema_info
  on schema_info.oid = table_info.relnamespace
  and schema_info.nspname = 'public'
where constraint_info.oid is null
   or table_info.relname <> expected.table_name
   or schema_info.oid is null;
