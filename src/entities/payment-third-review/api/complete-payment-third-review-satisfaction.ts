import type { SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';

import {
  CompletePaymentThirdReviewSatisfactionResponseSchema,
  type CompletePaymentThirdReviewSatisfactionRequest,
} from './payment-third-review-satisfaction.schema';
import type { Database } from '@/shared/types/database.types';

const CompleteSatisfactionRpcResultSchema = z.discriminatedUnion('ok', [
  CompletePaymentThirdReviewSatisfactionResponseSchema,
  z.object({
    ok: z.literal(false),
    reason: z.enum(['not_found', 'invalid_type', 'not_ready', 'already_completed']),
  }),
]);

type CompleteSatisfactionResult =
  | z.infer<typeof CompleteSatisfactionRpcResultSchema>
  | { ok: false; reason: 'database_error'; errorMessage: string };

export async function completePaymentThirdReviewSatisfaction(
  supabase: SupabaseClient<Database>,
  _userId: string,
  reviewId: string,
  input: CompletePaymentThirdReviewSatisfactionRequest,
): Promise<CompleteSatisfactionResult> {
  const { data, error } = await supabase.rpc('complete_payment_third_review_satisfaction', {
    p_review_id: reviewId,
    p_score: input.score,
    p_summary: input.summary,
    p_memo: input.memo,
  });

  if (error) {
    return { ok: false, reason: 'database_error', errorMessage: error.message };
  }

  const result = CompleteSatisfactionRpcResultSchema.safeParse(data);

  if (!result.success) {
    return {
      ok: false,
      reason: 'database_error',
      errorMessage: '만족도 완료 응답 형식이 올바르지 않습니다.',
    };
  }

  return result.data;
}
