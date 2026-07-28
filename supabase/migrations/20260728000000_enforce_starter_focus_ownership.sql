-- starter/focus 관계에서 행의 user_id와 참조 대상 소유자가 항상 같도록 강제한다.
-- 결제, 구독, 글쓰기 등 다른 협업 영역은 이 마이그레이션에서 변경하지 않는다.

create unique index if not exists starter_actions_id_user_id_key
  on public.starter_actions (id, user_id);

create unique index if not exists starter_schedules_id_user_id_key
  on public.starter_schedules (id, user_id);

create unique index if not exists starter_schedules_id_action_user_id_key
  on public.starter_schedules (id, starter_action_id, user_id);

create unique index if not exists focus_sessions_id_user_id_key
  on public.focus_sessions (id, user_id);

alter table public.starter_schedules
  drop constraint if exists starter_schedules_action_owner_fkey;

alter table public.starter_schedules
  add constraint starter_schedules_action_owner_fkey
  foreign key (starter_action_id, user_id)
  references public.starter_actions (id, user_id);

alter table public.focus_sessions
  drop constraint if exists focus_sessions_action_owner_fkey;

alter table public.focus_sessions
  add constraint focus_sessions_action_owner_fkey
  foreign key (starter_action_id, user_id)
  references public.starter_actions (id, user_id);

alter table public.focus_sessions
  drop constraint if exists focus_sessions_schedule_owner_fkey;

alter table public.focus_sessions
  add constraint focus_sessions_schedule_owner_fkey
  foreign key (schedule_id, user_id)
  references public.starter_schedules (id, user_id);

alter table public.focus_sessions
  drop constraint if exists focus_sessions_schedule_action_owner_fkey;

alter table public.focus_sessions
  add constraint focus_sessions_schedule_action_owner_fkey
  foreign key (schedule_id, starter_action_id, user_id)
  references public.starter_schedules (id, starter_action_id, user_id);

alter table public.focus_sessions
  drop constraint if exists focus_sessions_schedule_requires_action_check;

alter table public.focus_sessions
  add constraint focus_sessions_schedule_requires_action_check
  check (schedule_id is null or starter_action_id is not null);

alter table public.focus_session_events
  drop constraint if exists focus_session_events_session_owner_fkey;

alter table public.focus_session_events
  add constraint focus_session_events_session_owner_fkey
  foreign key (session_id, user_id)
  references public.focus_sessions (id, user_id);

alter table public.emotion_records
  drop constraint if exists emotion_records_session_owner_fkey;

alter table public.emotion_records
  add constraint emotion_records_session_owner_fkey
  foreign key (session_id, user_id)
  references public.focus_sessions (id, user_id);
