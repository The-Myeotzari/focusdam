-- 인증된 사용자가 자신의 계정과 모든 사용자 소유 데이터를 삭제한다.
-- public 데이터 삭제와 auth.users 삭제는 하나의 트랜잭션에서 실행된다.

drop policy if exists "Users can delete own export files" on storage.objects;

create policy "Users can delete own export files"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'data-exports'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create or replace function public.delete_current_user_account()
returns void
language plpgsql
security definer
set search_path = ''
as $function$
declare
  current_user_id uuid := (select auth.uid());
begin
  if current_user_id is null then
    raise exception 'authentication required'
      using errcode = '42501';
  end if;

  -- 자식 테이블부터 삭제해 기존 NO ACTION 외래키 제약을 지킨다.
  delete from public.data_jobs
   where user_id = current_user_id;

  delete from public.weekly_reviews
   where user_id = current_user_id;

  delete from public.writing_helper_histories
   where user_id = current_user_id;

  delete from public.payment_goal_achievements
   where user_id = current_user_id;

  delete from public.payment_saving_entries
   where user_id = current_user_id;

  delete from public.payment_review_followups
   where user_id = current_user_id;

  delete from public.payment_reviews
   where user_id = current_user_id;

  delete from public.payment_saving_goals
   where user_id = current_user_id;

  delete from public.emotion_records
   where user_id = current_user_id;

  delete from public.focus_session_events
   where user_id = current_user_id;

  delete from public.focus_sessions
   where user_id = current_user_id;

  delete from public.starter_schedules
   where user_id = current_user_id;

  delete from public.starter_actions
   where user_id = current_user_id;

  delete from public.user_subscriptions
   where user_id = current_user_id;

  delete from public.push_subscriptions
   where user_id = current_user_id;

  delete from public.notification_settings
   where user_id = current_user_id;

  delete from public.consent_events
   where user_id = current_user_id;

  delete from public.consent_settings
   where user_id = current_user_id;

  delete from public.profiles
   where user_id = current_user_id;

  delete from auth.users
   where id = current_user_id;

  if not found then
    raise exception 'authenticated user not found'
      using errcode = 'P0002';
  end if;
end;
$function$;

revoke all on function public.delete_current_user_account() from public;
revoke all on function public.delete_current_user_account() from anon;
grant execute on function public.delete_current_user_account() to authenticated;

-- PostgREST가 새 RPC를 즉시 인식하도록 스키마 캐시 갱신을 요청한다.
notify pgrst, 'reload schema';
