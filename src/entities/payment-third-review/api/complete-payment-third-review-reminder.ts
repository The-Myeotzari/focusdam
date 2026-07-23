import type { SupabaseClient } from '@supabase/supabase-js';

import type { CompletePaymentThirdReviewReminderRequest } from './payment-third-review-reminder.schema';
import type { PaymentReviewOutcomeType, PaymentReviewStatus } from '../model/payment-third-review.types';
import type { Database, Tables } from '@/shared/types/database.types';

type ReviewState = Pick<
  Tables<'payment_reviews'>,
  'id' | 'amount_krw' | 'goal_id' | 'outcome_type' | 'status'
>;
type FollowUpState = Pick<
  Tables<'payment_review_followups'>,
  'id' | 'sequence' | 'status'
>;

type CompleteReminderResult =
  | {
      ok: true;
      item: {
        reviewId: string;
        followUpId: string;
        decision: CompletePaymentThirdReviewReminderRequest['decision'];
        status: PaymentReviewStatus;
        outcomeType: PaymentReviewOutcomeType;
        completedAt: string;
        nextFollowUpId: string | null;
        savingEntryId: string | null;
      };
    }
  | { ok: false; reason: 'not_found' | 'invalid_type' | 'not_ready' | 'already_completed' }
  | { ok: false; reason: 'database_error'; errorMessage: string };

const requiredReviewStatuses = ['hold_reminder_required', 'rehold_reminder_required'] as const;

export async function completePaymentThirdReviewReminder(
  supabase: SupabaseClient<Database>,
  userId: string,
  reviewId: string,
  input: CompletePaymentThirdReviewReminderRequest,
): Promise<CompleteReminderResult> {
  const { data: review, error: reviewError } = await supabase
    .from('payment_reviews')
    .select('id,amount_krw,goal_id,outcome_type,status')
    .eq('id', reviewId)
    .eq('user_id', userId)
    .is('deleted_at', null)
    .maybeSingle();

  if (reviewError) {
    return databaseError(reviewError.message);
  }

  if (!review) {
    return { ok: false, reason: 'not_found' };
  }

  const reviewState = review satisfies ReviewState;
  const { data: followUp, error: followUpError } = await supabase
    .from('payment_review_followups')
    .select('id,sequence,status')
    .eq('review_id', reviewId)
    .eq('user_id', userId)
    .eq('followup_type', 'reminder')
    .order('sequence', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (followUpError) {
    return databaseError(followUpError.message);
  }

  if (!followUp) {
    return { ok: false, reason: 'invalid_type' };
  }

  const followUpState = followUp satisfies FollowUpState;

  if (followUpState.status === 'completed') {
    return { ok: false, reason: 'already_completed' };
  }

  if (
    !requiredReviewStatuses.includes(
      reviewState.status as (typeof requiredReviewStatuses)[number],
    ) ||
    followUpState.status !== 'required'
  ) {
    return { ok: false, reason: 'not_ready' };
  }

  const isRehold =
    reviewState.status === 'rehold_reminder_required' || followUpState.sequence > 1;
  const nextState = getReminderNextState(input.decision, isRehold);
  const completedAt = new Date().toISOString();
  const followUpUpdate = await supabase
    .from('payment_review_followups')
    .update({
      status: 'completed',
      reminder_decision: input.decision,
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
    return databaseError(followUpUpdate.error.message);
  }

  if (!followUpUpdate.data) {
    return { ok: false, reason: 'not_ready' };
  }

  const reviewUpdate = await supabase
    .from('payment_reviews')
    .update({
      status: nextState.status,
      outcome_type: nextState.outcomeType,
      updated_at: completedAt,
    })
    .eq('id', reviewId)
    .eq('user_id', userId)
    .eq('status', reviewState.status)
    .select('id')
    .maybeSingle();

  if (reviewUpdate.error || !reviewUpdate.data) {
    const rollbackError = await rollbackReminderFollowUp(
      supabase,
      userId,
      followUpState.id,
    );

    return databaseError(
      appendRollbackError(
        reviewUpdate.error?.message ?? '결제 3심 상태가 변경되었습니다.',
        rollbackError,
      ),
    );
  }

  let nextFollowUpId: string | null = null;
  let savingEntryId: string | null = null;

  if (input.decision === 'hold') {
    const scheduledAt = new Date(Date.parse(completedAt) + 3 * 86_400_000).toISOString();
    const nextFollowUp = await supabase
      .from('payment_review_followups')
      .insert({
        user_id: userId,
        review_id: reviewId,
        followup_type: 'reminder',
        sequence: followUpState.sequence + 1,
        status: 'scheduled',
        scheduled_at: scheduledAt,
      })
      .select('id')
      .maybeSingle();

    if (nextFollowUp.error || !nextFollowUp.data) {
      const rollbackError = await rollbackReminderCompletion(
        supabase,
        userId,
        reviewState,
        followUpState.id,
      );

      return databaseError(
        appendRollbackError(
          nextFollowUp.error?.message ?? '다음 리마인드를 생성하지 못했습니다.',
          rollbackError,
        ),
      );
    }

    nextFollowUpId = nextFollowUp.data.id;
  }

  if (input.decision === 'cancel' && reviewState.goal_id) {
    const savingEntry = await supabase
      .from('payment_saving_entries')
      .insert({
        user_id: userId,
        goal_id: reviewState.goal_id,
        review_id: reviewId,
        followup_id: followUpState.id,
        amount_krw: reviewState.amount_krw,
        source: isRehold ? 'rehold_cancel' : 'hold_cancel',
        note: input.memo || null,
      })
      .select('id')
      .maybeSingle();

    if (savingEntry.error || !savingEntry.data) {
      const rollbackError = await rollbackReminderCompletion(
        supabase,
        userId,
        reviewState,
        followUpState.id,
      );

      return databaseError(
        appendRollbackError(
          savingEntry.error?.message ?? '저축 기록을 생성하지 못했습니다.',
          rollbackError,
        ),
      );
    }

    savingEntryId = savingEntry.data.id;
  }

  return {
    ok: true,
    item: {
      reviewId,
      followUpId: followUpState.id,
      decision: input.decision,
      status: nextState.status,
      outcomeType: nextState.outcomeType,
      completedAt,
      nextFollowUpId,
      savingEntryId,
    },
  };
}

function getReminderNextState(
  decision: CompletePaymentThirdReviewReminderRequest['decision'],
  isRehold: boolean,
): { status: PaymentReviewStatus; outcomeType: PaymentReviewOutcomeType } {
  if (decision === 'buy') {
    return {
      status: isRehold ? 'rehold_after_buy' : 'hold_after_buy',
      outcomeType: 'buy',
    };
  }

  if (decision === 'cancel') {
    return {
      status: isRehold ? 'rehold_after_save' : 'hold_after_save',
      outcomeType: 'save',
    };
  }

  return {
    status: isRehold ? 'rehold_after_hold_scheduled' : 'hold_after_hold_scheduled',
    outcomeType: 'hold',
  };
}

async function rollbackReminderFollowUp(
  supabase: SupabaseClient<Database>,
  userId: string,
  followUpId: string,
) {
  const rollback = await supabase
    .from('payment_review_followups')
    .update({
      status: 'required',
      reminder_decision: null,
      memo: null,
      completed_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', followUpId)
    .eq('user_id', userId)
    .eq('status', 'completed');

  return rollback.error?.message ?? null;
}

async function rollbackReminderCompletion(
  supabase: SupabaseClient<Database>,
  userId: string,
  review: ReviewState,
  followUpId: string,
) {
  const [reviewRollback, followUpRollback] = await Promise.all([
    supabase
      .from('payment_reviews')
      .update({
        status: review.status,
        outcome_type: review.outcome_type,
        updated_at: new Date().toISOString(),
      })
      .eq('id', review.id)
      .eq('user_id', userId),
    rollbackReminderFollowUp(supabase, userId, followUpId),
  ]);

  return reviewRollback.error?.message ?? followUpRollback;
}

function databaseError(errorMessage: string): CompleteReminderResult {
  return { ok: false, reason: 'database_error', errorMessage };
}

function appendRollbackError(errorMessage: string, rollbackError: string | null) {
  return rollbackError ? `${errorMessage} 복구 실패: ${rollbackError}` : errorMessage;
}
