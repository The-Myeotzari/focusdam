-- 저축 기록을 기준으로 목표 누적 금액과 달성 기록을 트랜잭션 종료 시점에 동기화합니다.
-- create_payment_third_review RPC와 Route Handler 양쪽에서 저축 기록을 만들더라도
-- payment_saving_entries를 단일 기준으로 사용하므로 금액이 중복 반영되지 않습니다.

create unique index if not exists payment_saving_goals_one_active_per_user_idx
  on public.payment_saving_goals (user_id)
  where status = 'active';

create unique index if not exists payment_goal_achievements_goal_id_idx
  on public.payment_goal_achievements (goal_id);

create or replace function public.sync_payment_saving_goal_after_entry()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  goal_row public.payment_saving_goals%rowtype;
  saved_amount bigint;
  saved_review_count integer;
begin
  select *
    into goal_row
    from public.payment_saving_goals
   where id = new.goal_id
     and user_id = new.user_id
   for update;

  if not found or goal_row.status = 'archived' then
    return null;
  end if;

  select
    coalesce(sum(amount_krw), 0),
    count(distinct review_id)::integer
    into saved_amount, saved_review_count
    from public.payment_saving_entries
   where goal_id = new.goal_id
     and user_id = new.user_id;

  update public.payment_saving_goals
     set current_saved_amount_krw = saved_amount,
         status = case
           when saved_amount >= target_amount_krw then 'achieved'
           else 'active'
         end,
         updated_at = now()
   where id = new.goal_id
     and user_id = new.user_id;

  if saved_amount >= goal_row.target_amount_krw then
    insert into public.payment_goal_achievements (
      user_id,
      goal_id,
      trigger_review_id,
      trigger_saving_entry_id,
      target_amount_krw,
      achieved_amount_krw,
      saved_review_count,
      achieved_at
    )
    values (
      new.user_id,
      new.goal_id,
      new.review_id,
      new.id,
      goal_row.target_amount_krw,
      saved_amount,
      saved_review_count,
      now()
    )
    on conflict (goal_id) do nothing;
  end if;

  return null;
end;
$$;

drop trigger if exists sync_payment_saving_goal_after_entry
  on public.payment_saving_entries;

create constraint trigger sync_payment_saving_goal_after_entry
after insert or update of amount_krw, goal_id, user_id
on public.payment_saving_entries
deferrable initially deferred
for each row
execute function public.sync_payment_saving_goal_after_entry();
