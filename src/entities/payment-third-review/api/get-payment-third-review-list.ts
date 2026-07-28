import type { SupabaseClient } from '@supabase/supabase-js';

import type {
  PaymentThirdReviewListItem,
  PaymentThirdReviewListQuery,
} from '@/entities/payment-third-review/api/payment-third-review-list.schema';
import { createPaginationMeta, getPaginationRange } from '@/shared/lib/api/pagination';
import type { Database, Tables } from '@/shared/types/database.types';

type PaymentReviewRow = Pick<
  Tables<'payment_reviews'>,
  'id' | 'item_name' | 'amount_krw' | 'impulse_strength' | 'outcome_type' | 'status' | 'created_at'
>;

type PaymentReviewFollowUpRow = Pick<
  Tables<'payment_review_followups'>,
  | 'id'
  | 'review_id'
  | 'followup_type'
  | 'sequence'
  | 'status'
  | 'scheduled_at'
  | 'completed_at'
  | 'reminder_decision'
  | 'satisfaction_score'
  | 'summary'
  | 'created_at'
>;

type PaymentThirdReviewListResult =
  | {
      ok: true;
      items: PaymentThirdReviewListItem[];
      pagination: ReturnType<typeof createPaginationMeta>;
    }
  | {
      ok: false;
      errorMessage: string;
    };

const paymentReviewListColumns =
  'id,item_name,amount_krw,impulse_strength,outcome_type,status,created_at' as const;
const paymentReviewFollowUpColumns =
  'id,review_id,followup_type,sequence,status,scheduled_at,completed_at,reminder_decision,satisfaction_score,summary,created_at' as const;

// 결제 3심 내역 조회
export async function getPaymentThirdReviewList(
  supabase: SupabaseClient<Database>,
  userId: string,
  query: PaymentThirdReviewListQuery,
): Promise<PaymentThirdReviewListResult> {
  const { from, to } = getPaginationRange(query);
  const baseQuery = supabase
    .from('payment_reviews')
    .select(paymentReviewListColumns, { count: 'exact' })
    .eq('user_id', userId)
    .is('deleted_at', null);
  const filteredQuery = query.outcomeType
    ? baseQuery.eq('outcome_type', query.outcomeType)
    : baseQuery;
  const {
    count,
    data: reviews,
    error: reviewsError,
  } = await filteredQuery.order('created_at', { ascending: false }).range(from, to);

  if (reviewsError) {
    return { ok: false, errorMessage: reviewsError.message };
  }

  const reviewRows = reviews satisfies PaymentReviewRow[];
  const reviewIds = reviewRows.map((review) => review.id);

  if (reviewIds.length === 0) {
    return {
      ok: true,
      items: [],
      pagination: createPaginationMeta(query, count ?? 0),
    };
  }

  const { data: followUps, error: followUpsError } = await supabase
    .from('payment_review_followups')
    .select(paymentReviewFollowUpColumns)
    .eq('user_id', userId)
    .in('review_id', reviewIds)
    .order('created_at', { ascending: false })
    .order('sequence', { ascending: false });

  if (followUpsError) {
    return { ok: false, errorMessage: followUpsError.message };
  }

  const latestFollowUpByReviewId = new Map<string, PaymentReviewFollowUpRow>();

  for (const followUp of followUps satisfies PaymentReviewFollowUpRow[]) {
    if (!latestFollowUpByReviewId.has(followUp.review_id)) {
      latestFollowUpByReviewId.set(followUp.review_id, followUp);
    }
  }

  return {
    ok: true,
    items: reviewRows.map((review) =>
      mapPaymentThirdReviewListItem(review, latestFollowUpByReviewId.get(review.id) ?? null),
    ),
    pagination: createPaginationMeta(query, count ?? 0),
  };
}

export function mapPaymentThirdReviewListItem(
  review: PaymentReviewRow,
  followUp: PaymentReviewFollowUpRow | null,
): PaymentThirdReviewListItem {
  return {
    id: review.id,
    itemName: review.item_name,
    amountKrw: review.amount_krw,
    impulseStrength: review.impulse_strength,
    outcomeType: review.outcome_type,
    status: review.status,
    createdAt: review.created_at,
    followUp: followUp
      ? {
          id: followUp.id,
          type: followUp.followup_type,
          sequence: followUp.sequence,
          status: followUp.status,
          scheduledAt: followUp.scheduled_at,
          completedAt: followUp.completed_at,
          reminderDecision: followUp.reminder_decision,
          satisfactionScore: followUp.satisfaction_score,
          summary: followUp.summary,
        }
      : null,
  };
}
