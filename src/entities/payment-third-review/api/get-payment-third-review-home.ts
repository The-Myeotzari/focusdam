import type { SupabaseClient } from '@supabase/supabase-js';

import { getActivePaymentSavingGoal } from './get-active-payment-saving-goal';
import { getPaymentThirdReviewList } from './get-payment-third-review-list';
import type {
  PaymentThirdReviewHomeResponse,
  PaymentThirdReviewHomeStats,
} from './payment-third-review-home.schema';
import type { Database, Tables } from '@/shared/types/database.types';

type PaymentReviewSummaryRow = Pick<
  Tables<'payment_reviews'>,
  'amount_krw' | 'outcome_type'
>;

type PaymentThirdReviewHomeResult =
  | { ok: true; data: PaymentThirdReviewHomeResponse }
  | { ok: false; errorMessage: string };

export async function getPaymentThirdReviewHome(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<PaymentThirdReviewHomeResult> {
  const [recentResult, goalResult, summaryResult] = await Promise.all([
    getPaymentThirdReviewList(supabase, userId, { page: 1, size: 3 }),
    getActivePaymentSavingGoal(supabase, userId),
    supabase
      .from('payment_reviews')
      .select('amount_krw,outcome_type')
      .eq('user_id', userId)
      .is('deleted_at', null),
  ]);

  if (!recentResult.ok) {
    return { ok: false, errorMessage: recentResult.errorMessage };
  }

  if (!goalResult.ok) {
    return { ok: false, errorMessage: goalResult.errorMessage };
  }

  if (summaryResult.error) {
    return { ok: false, errorMessage: summaryResult.error.message };
  }

  return {
    ok: true,
    data: {
      ok: true,
      stats: createPaymentThirdReviewHomeStats(
        summaryResult.data satisfies PaymentReviewSummaryRow[],
      ),
      activeGoal: goalResult.item,
      recentItems: recentResult.items,
    },
  };
}

export function createPaymentThirdReviewHomeStats(
  reviews: PaymentReviewSummaryRow[],
): PaymentThirdReviewHomeStats {
  return reviews.reduce<PaymentThirdReviewHomeStats>(
    (stats, review) => ({
      totalCount: stats.totalCount + 1,
      buyCount: stats.buyCount + Number(review.outcome_type === 'buy'),
      saveCount: stats.saveCount + Number(review.outcome_type === 'save'),
      holdCount: stats.holdCount + Number(review.outcome_type === 'hold'),
      savedAmountKrw:
        stats.savedAmountKrw +
        (review.outcome_type === 'save' ? review.amount_krw : 0),
    }),
    {
      totalCount: 0,
      buyCount: 0,
      saveCount: 0,
      holdCount: 0,
      savedAmountKrw: 0,
    },
  );
}
