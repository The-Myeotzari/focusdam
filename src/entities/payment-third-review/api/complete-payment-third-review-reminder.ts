import type { SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';

import { getPaymentGoalAchievementIdBySavingEntryId } from './get-payment-goal-achievements';
import {
  CompletePaymentThirdReviewReminderResponseSchema,
  type CompletePaymentThirdReviewReminderRequest,
} from './payment-third-review-reminder.schema';
import type { Database } from '@/shared/types/database.types';

const CompleteReminderRpcResultSchema = z.discriminatedUnion('ok', [
  CompletePaymentThirdReviewReminderResponseSchema,
  z.object({
    ok: z.literal(false),
    reason: z.enum(['not_found', 'invalid_type', 'not_ready', 'already_completed']),
  }),
]);

type CompleteReminderResult =
  | z.infer<typeof CompleteReminderRpcResultSchema>
  | { ok: false; reason: 'database_error'; errorMessage: string };

export async function completePaymentThirdReviewReminder(
  supabase: SupabaseClient<Database>,
  userId: string,
  reviewId: string,
  input: CompletePaymentThirdReviewReminderRequest,
): Promise<CompleteReminderResult> {
  const { data, error } = await supabase.rpc('complete_payment_third_review_reminder', {
    p_review_id: reviewId,
    p_decision: input.decision,
    p_memo: input.memo,
  });

  if (error) {
    return { ok: false, reason: 'database_error', errorMessage: error.message };
  }

  const result = CompleteReminderRpcResultSchema.safeParse(data);

  if (!result.success) {
    return {
      ok: false,
      reason: 'database_error',
      errorMessage: '리마인드 완료 응답 형식이 올바르지 않습니다.',
    };
  }

  if (!result.data.ok || !result.data.item.savingEntryId) {
    return result.data;
  }

  const goalAchievementId = await getPaymentGoalAchievementIdBySavingEntryId(
    supabase,
    userId,
    result.data.item.savingEntryId,
  );

  return {
    ok: true,
    item: {
      ...result.data.item,
      goalAchievementId,
    },
  };
}
