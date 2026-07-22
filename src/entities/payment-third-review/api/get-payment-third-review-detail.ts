import type { SupabaseClient } from '@supabase/supabase-js';

import type { PaymentThirdReviewDetail } from './payment-third-review-detail.schema';
import type { Database, Tables } from '@/shared/types/database.types';

type PaymentReviewRow = Pick<
  Tables<'payment_reviews'>,
  | 'id'
  | 'item_name'
  | 'amount_krw'
  | 'impulse_strength'
  | 'initial_decision'
  | 'outcome_type'
  | 'status'
  | 'reason'
  | 'buy_reason'
  | 'created_at'
  | 'decided_at'
  | 'goal_id'
>;

type PaymentReviewFollowUpRow = Pick<
  Tables<'payment_review_followups'>,
  | 'id'
  | 'followup_type'
  | 'sequence'
  | 'status'
  | 'scheduled_at'
  | 'completed_at'
  | 'reminder_decision'
  | 'satisfaction_score'
  | 'summary'
  | 'memo'
>;

type PaymentSavingGoalRow = Pick<
  Tables<'payment_saving_goals'>,
  'id' | 'name' | 'current_saved_amount_krw' | 'target_amount_krw'
>;

type PaymentThirdReviewDetailResult =
  | { ok: true; item: PaymentThirdReviewDetail }
  | { ok: false; reason: 'not_found' }
  | { ok: false; reason: 'database_error'; errorMessage: string };

const reviewColumns =
  'id,item_name,amount_krw,impulse_strength,initial_decision,outcome_type,status,reason,buy_reason,created_at,decided_at,goal_id' as const;
const followUpColumns =
  'id,followup_type,sequence,status,scheduled_at,completed_at,reminder_decision,satisfaction_score,summary,memo' as const;
const goalColumns = 'id,name,current_saved_amount_krw,target_amount_krw' as const;

export async function getPaymentThirdReviewDetail(
  supabase: SupabaseClient<Database>,
  userId: string,
  reviewId: string,
): Promise<PaymentThirdReviewDetailResult> {
  const { data: review, error: reviewError } = await supabase
    .from('payment_reviews')
    .select(reviewColumns)
    .eq('id', reviewId)
    .eq('user_id', userId)
    .is('deleted_at', null)
    .maybeSingle();

  if (reviewError) {
    return { ok: false, reason: 'database_error', errorMessage: reviewError.message };
  }

  if (!review) {
    return { ok: false, reason: 'not_found' };
  }

  const reviewRow = review satisfies PaymentReviewRow;
  const [followUpsResult, goalResult] = await Promise.all([
    supabase
      .from('payment_review_followups')
      .select(followUpColumns)
      .eq('review_id', reviewId)
      .eq('user_id', userId)
      .order('sequence', { ascending: false }),
    reviewRow.goal_id
      ? supabase
          .from('payment_saving_goals')
          .select(goalColumns)
          .eq('id', reviewRow.goal_id)
          .eq('user_id', userId)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);

  if (followUpsResult.error) {
    return {
      ok: false,
      reason: 'database_error',
      errorMessage: followUpsResult.error.message,
    };
  }

  if (goalResult.error) {
    return { ok: false, reason: 'database_error', errorMessage: goalResult.error.message };
  }

  return {
    ok: true,
    item: mapPaymentThirdReviewDetail(
      reviewRow,
      followUpsResult.data satisfies PaymentReviewFollowUpRow[],
      goalResult.data satisfies PaymentSavingGoalRow | null,
    ),
  };
}

export function mapPaymentThirdReviewDetail(
  review: PaymentReviewRow,
  followUps: PaymentReviewFollowUpRow[],
  goal: PaymentSavingGoalRow | null,
): PaymentThirdReviewDetail {
  return {
    id: review.id,
    itemName: review.item_name,
    amountKrw: review.amount_krw,
    impulseStrength: review.impulse_strength,
    initialDecision: review.initial_decision,
    outcomeType: review.outcome_type,
    status: review.status,
    reason: review.reason,
    buyReason: review.buy_reason,
    createdAt: review.created_at,
    decidedAt: review.decided_at,
    goal: goal
      ? {
          id: goal.id,
          name: goal.name,
          currentSavedAmountKrw: goal.current_saved_amount_krw,
          targetAmountKrw: goal.target_amount_krw,
        }
      : null,
    followUps: followUps.map((followUp) => ({
      id: followUp.id,
      type: followUp.followup_type,
      sequence: followUp.sequence,
      status: followUp.status,
      scheduledAt: followUp.scheduled_at,
      completedAt: followUp.completed_at,
      reminderDecision: followUp.reminder_decision,
      satisfactionScore: followUp.satisfaction_score,
      summary: followUp.summary,
      memo: followUp.memo,
    })),
  };
}
