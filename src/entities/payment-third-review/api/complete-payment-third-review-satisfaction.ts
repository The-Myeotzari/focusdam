import type { SupabaseClient } from '@supabase/supabase-js';

import type { CompletePaymentThirdReviewSatisfactionRequest } from './payment-third-review-satisfaction.schema';
import type { Database, Tables } from '@/shared/types/database.types';

type ReviewState = Pick<Tables<'payment_reviews'>, 'id' | 'outcome_type' | 'status'>;
type FollowUpState = Pick<Tables<'payment_review_followups'>, 'id' | 'status'>;

type CompleteSatisfactionResult =
  | {
      ok: true;
      item: {
        reviewId: string;
        followUpId: string;
        status: 'completed';
        score: number;
        summary: string;
        memo: string;
        completedAt: string;
      };
    }
  | {
      ok: false;
      reason: 'not_found' | 'invalid_type' | 'not_ready' | 'already_completed';
    }
  | { ok: false; reason: 'database_error'; errorMessage: string };

export async function completePaymentThirdReviewSatisfaction(
  supabase: SupabaseClient<Database>,
  userId: string,
  reviewId: string,
  input: CompletePaymentThirdReviewSatisfactionRequest,
): Promise<CompleteSatisfactionResult> {
  const { data: review, error: reviewError } = await supabase
    .from('payment_reviews')
    .select('id,outcome_type,status')
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

  const reviewState = review satisfies ReviewState;

  if (reviewState.outcome_type !== 'buy') {
    return { ok: false, reason: 'invalid_type' };
  }

  const { data: followUp, error: followUpError } = await supabase
    .from('payment_review_followups')
    .select('id,status')
    .eq('review_id', reviewId)
    .eq('user_id', userId)
    .eq('followup_type', 'satisfaction')
    .order('sequence', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (followUpError) {
    return { ok: false, reason: 'database_error', errorMessage: followUpError.message };
  }

  if (!followUp) {
    return { ok: false, reason: 'invalid_type' };
  }

  const followUpState = followUp satisfies FollowUpState;

  if (
    reviewState.status === 'buy_satisfaction_completed' ||
    followUpState.status === 'completed'
  ) {
    return { ok: false, reason: 'already_completed' };
  }

  if (
    reviewState.status !== 'buy_satisfaction_required' ||
    followUpState.status !== 'required'
  ) {
    return { ok: false, reason: 'not_ready' };
  }

  const completedAt = new Date().toISOString();
  const followUpUpdate = await supabase
    .from('payment_review_followups')
    .update({
      status: 'completed',
      satisfaction_score: input.score,
      summary: input.summary,
      memo: input.memo || null,
      completed_at: completedAt,
      updated_at: completedAt,
    })
    .eq('id', followUpState.id)
    .eq('user_id', userId)
    .eq('status', 'required')
    .select('id')
    .maybeSingle();

  if (followUpUpdate.error) {
    return {
      ok: false,
      reason: 'database_error',
      errorMessage: followUpUpdate.error.message,
    };
  }

  if (!followUpUpdate.data) {
    return { ok: false, reason: 'not_ready' };
  }

  const reviewUpdate = await supabase
    .from('payment_reviews')
    .update({ status: 'buy_satisfaction_completed', updated_at: completedAt })
    .eq('id', reviewId)
    .eq('user_id', userId)
    .eq('status', 'buy_satisfaction_required')
    .select('id')
    .maybeSingle();

  if (reviewUpdate.error || !reviewUpdate.data) {
    const rollback = await supabase
      .from('payment_review_followups')
      .update({
        status: 'required',
        satisfaction_score: null,
        summary: null,
        memo: null,
        completed_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', followUpState.id)
      .eq('user_id', userId)
      .eq('status', 'completed');

    const errorMessage = reviewUpdate.error?.message ?? '결제 3심 상태가 변경되었습니다.';
    const rollbackMessage = rollback.error ? ` 복구 실패: ${rollback.error.message}` : '';

    return {
      ok: false,
      reason: reviewUpdate.error ? 'database_error' : 'not_ready',
      errorMessage: `${errorMessage}${rollbackMessage}`,
    } as CompleteSatisfactionResult;
  }

  return {
    ok: true,
    item: {
      reviewId,
      followUpId: followUpState.id,
      status: 'completed',
      score: input.score,
      summary: input.summary,
      memo: input.memo,
      completedAt,
    },
  };
}
