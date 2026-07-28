import type { SupabaseClient } from '@supabase/supabase-js';

import {
  CreatePaymentThirdReviewResponseSchema,
  type CreatePaymentThirdReviewRequest,
  type CreatePaymentThirdReviewResponse,
} from './payment-third-review-create.schema';
import { getPaymentGoalAchievementIdBySavingEntryId } from './get-payment-goal-achievements';
import type { Database } from '@/shared/types/database.types';

type CreatePaymentThirdReviewResult =
  | {
      ok: true;
      item: CreatePaymentThirdReviewResponse['item'];
    }
  | { ok: false; reason: 'database_error'; errorMessage: string };

export async function createPaymentThirdReview(
  supabase: SupabaseClient<Database>,
  userId: string,
  input: CreatePaymentThirdReviewRequest,
): Promise<CreatePaymentThirdReviewResult> {
  const { data, error } = await supabase.rpc('create_payment_third_review', {
    p_user_id: userId,
    p_item_name: input.itemName,
    p_amount_krw: input.amount,
    p_impulse_strength: input.impulseStrength,
    p_need_timing: input.needTiming,
    p_alternative_status: input.alternativeStatus,
    p_decision: input.decision,
    p_reason: createDecisionReason(input),
    p_reward: input.reward,
    p_satisfaction_reminder: input.satisfactionReminder,
    p_budget_category: input.budgetCategory,
    p_buy_reason: input.buyReason,
    p_saving_target: input.savingTarget,
  });

  if (error) {
    return { ok: false, reason: 'database_error', errorMessage: error.message };
  }

  const itemResult = CreatePaymentThirdReviewResponseSchema.shape.item.safeParse(data);

  if (!itemResult.success) {
    return {
      ok: false,
      reason: 'database_error',
      errorMessage: '생성된 결제 3심 응답 형식이 올바르지 않습니다.',
    };
  }

  const goalAchievementId = itemResult.data.savingEntryId
    ? await getPaymentGoalAchievementIdBySavingEntryId(
        supabase,
        userId,
        itemResult.data.savingEntryId,
      )
    : null;

  return { ok: true, item: { ...itemResult.data, goalAchievementId } };
}

function createDecisionReason(input: CreatePaymentThirdReviewRequest) {
  const timingLabels = {
    now: '지금 필요',
    tomorrow: '필요 여부가 애매함',
    low: '필요도가 낮음',
  };
  const alternativeLabels = {
    similar: '비슷한 물건 있음',
    replaceable: '다른 수단으로 대체 가능',
    none: '대체재 없음',
  };

  return `${timingLabels[input.needTiming]} · ${alternativeLabels[input.alternativeStatus]}`;
}
