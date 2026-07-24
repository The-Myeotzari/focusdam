import { describe, expect, it, vi } from 'vitest';

import { createPaymentThirdReview } from './create-payment-third-review';
import type { CreatePaymentThirdReviewRequest } from './payment-third-review-create.schema';

const baseInput: CreatePaymentThirdReviewRequest = {
  itemName: '무선 이어폰',
  amount: 62000,
  impulseStrength: 'high',
  needTiming: 'tomorrow',
  alternativeStatus: 'similar',
  decision: 'buy',
  reward: '따뜻한 음료',
  satisfactionReminder: true,
  budgetCategory: '생활비',
  buyReason: '이동 중 업무에 필요해요',
  savingTarget: 'goal',
};

const reviewId = '10000000-0000-0000-0000-000000000001';
const followUpId = '30000000-0000-0000-0000-000000000001';

describe('createPaymentThirdReview', () => {
  it('화면 입력값을 트랜잭션 함수 인자로 변환한다', async () => {
    const rpc = vi.fn().mockResolvedValue({
      data: {
        id: reviewId,
        status: 'buy_satisfaction_scheduled',
        outcomeType: 'buy',
        followUpId,
        goalId: null,
        savingEntryId: null,
      },
      error: null,
    });

    const result = await createPaymentThirdReview(
      { rpc } as never,
      'user-1',
      baseInput,
    );

    expect(rpc).toHaveBeenCalledWith('create_payment_third_review', {
      p_user_id: 'user-1',
      p_item_name: '무선 이어폰',
      p_amount_krw: 62000,
      p_impulse_strength: 'high',
      p_need_timing: 'tomorrow',
      p_alternative_status: 'similar',
      p_decision: 'buy',
      p_reason: '필요 여부가 애매함 · 비슷한 물건 있음',
      p_reward: '따뜻한 음료',
      p_satisfaction_reminder: true,
      p_budget_category: '생활비',
      p_buy_reason: '이동 중 업무에 필요해요',
      p_saving_target: 'goal',
    });
    expect(result).toEqual({
      ok: true,
      item: {
        id: reviewId,
        status: 'buy_satisfaction_scheduled',
        outcomeType: 'buy',
        followUpId,
        goalId: null,
        savingEntryId: null,
      },
    });
  });

  it('Supabase 함수 오류를 DB 오류로 반환한다', async () => {
    const rpc = vi.fn().mockResolvedValue({
      data: null,
      error: { message: 'transaction failed' },
    });

    const result = await createPaymentThirdReview(
      { rpc } as never,
      'user-1',
      baseInput,
    );

    expect(result).toEqual({
      ok: false,
      reason: 'database_error',
      errorMessage: 'transaction failed',
    });
  });

  it('함수 응답을 스키마로 검증한다', async () => {
    const rpc = vi.fn().mockResolvedValue({
      data: { id: 'invalid-id', status: 'unknown' },
      error: null,
    });

    const result = await createPaymentThirdReview(
      { rpc } as never,
      'user-1',
      baseInput,
    );

    expect(result).toEqual({
      ok: false,
      reason: 'database_error',
      errorMessage: '생성된 결제 3심 응답 형식이 올바르지 않습니다.',
    });
  });
});
