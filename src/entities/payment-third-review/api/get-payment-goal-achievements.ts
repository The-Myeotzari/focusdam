import type { SupabaseClient } from '@supabase/supabase-js';

import type {
  PaymentGoalAchievementSummary,
  PaymentReviewGoalAchievement,
} from './payment-goal-achievement.schema';
import type { PaymentReviewStatus } from '../model/payment-third-review.types';
import type { Database } from '@/shared/types/database.types';

type GoalAchievementRow = {
  achieved_amount_krw: number;
  achieved_at: string;
  goal_id: string;
  id: string;
  saved_review_count: number;
  target_amount_krw: number;
  trigger_review_id: string | null;
  payment_saving_goals: { name: string };
  payment_saving_entries: { amount_krw: number } | null;
  payment_reviews: { status: PaymentReviewStatus } | null;
};

type GoalAchievementResult =
  | { ok: true; items: PaymentReviewGoalAchievement[] }
  | { ok: false; errorMessage: string };

type GoalAchievementSummaryRow = {
  achieved_at: string;
  goal_id: string;
  id: string;
  target_amount_krw: number;
  payment_saving_goals: { name: string };
};

export async function getPaymentGoalAchievementIdBySavingEntryId(
  supabase: SupabaseClient<Database>,
  userId: string,
  savingEntryId: string,
) {
  const result = await supabase
    .from('payment_goal_achievements')
    .select('id')
    .eq('user_id', userId)
    .eq('trigger_saving_entry_id', savingEntryId)
    .maybeSingle();

  return result.error ? null : (result.data?.id ?? null);
}

export async function getLatestPaymentGoalAchievement(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<
  | { ok: true; item: PaymentGoalAchievementSummary | null }
  | { ok: false; errorMessage: string }
> {
  const result = await supabase
    .from('payment_goal_achievements')
    .select(
      [
        'id',
        'goal_id',
        'target_amount_krw',
        'achieved_at',
        'payment_saving_goals!inner(name)',
      ].join(','),
    )
    .eq('user_id', userId)
    .order('achieved_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (result.error) {
    return { ok: false, errorMessage: result.error.message };
  }

  if (!result.data) {
    return { ok: true, item: null };
  }

  const row = result.data as unknown as GoalAchievementSummaryRow;

  return {
    ok: true,
    item: {
      id: row.id,
      goalId: row.goal_id,
      goalName: row.payment_saving_goals.name,
      targetAmount: row.target_amount_krw,
      achievedAt: row.achieved_at,
    },
  };
}

export async function getPaymentGoalAchievements(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<GoalAchievementResult> {
  const result = await supabase
    .from('payment_goal_achievements')
    .select(
      [
        'id',
        'goal_id',
        'target_amount_krw',
        'achieved_amount_krw',
        'saved_review_count',
        'achieved_at',
        'trigger_review_id',
        'payment_saving_goals!inner(name)',
        'payment_saving_entries(amount_krw)',
        'payment_reviews(status)',
      ].join(','),
    )
    .eq('user_id', userId)
    .order('achieved_at', { ascending: false });

  if (result.error) {
    return { ok: false, errorMessage: result.error.message };
  }

  return {
    ok: true,
    items: (result.data as unknown as GoalAchievementRow[]).map(
      mapPaymentGoalAchievement,
    ),
  };
}

export async function getPaymentGoalAchievement(
  supabase: SupabaseClient<Database>,
  userId: string,
  id: string,
): Promise<
  | { ok: true; item: PaymentReviewGoalAchievement }
  | { ok: false; reason: 'not_found' | 'database_error'; errorMessage: string }
> {
  const result = await supabase
    .from('payment_goal_achievements')
    .select(
      [
        'id',
        'goal_id',
        'target_amount_krw',
        'achieved_amount_krw',
        'saved_review_count',
        'achieved_at',
        'trigger_review_id',
        'payment_saving_goals!inner(name)',
        'payment_saving_entries(amount_krw)',
        'payment_reviews(status)',
      ].join(','),
    )
    .eq('user_id', userId)
    .eq('id', id)
    .maybeSingle();

  if (result.error) {
    return {
      ok: false,
      reason: 'database_error',
      errorMessage: result.error.message,
    };
  }

  if (!result.data) {
    return {
      ok: false,
      reason: 'not_found',
      errorMessage: '목표 달성 기록을 찾을 수 없습니다.',
    };
  }

  return {
    ok: true,
    item: mapPaymentGoalAchievement(result.data as unknown as GoalAchievementRow),
  };
}

export function mapPaymentGoalAchievement(
  row: GoalAchievementRow,
): PaymentReviewGoalAchievement {
  const triggerSavedAmount = row.payment_saving_entries?.amount_krw ?? 0;
  const savedBeforeTrigger = Math.max(row.achieved_amount_krw - triggerSavedAmount, 0);
  const savedAmount = Math.min(
    triggerSavedAmount,
    Math.max(row.target_amount_krw - savedBeforeTrigger, 0),
  );

  return {
    id: row.id,
    goalId: row.goal_id,
    goalName: row.payment_saving_goals.name,
    targetAmount: row.target_amount_krw,
    achievedAmount: row.achieved_amount_krw,
    savedAmount,
    savedReviewCount: row.saved_review_count,
    achievedAt: row.achieved_at,
    triggerReviewId: row.trigger_review_id,
    triggerStatus: row.payment_reviews?.status ?? null,
  };
}
