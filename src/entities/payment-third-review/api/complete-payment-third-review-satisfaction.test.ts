import { beforeEach, describe, expect, it, vi } from 'vitest';

import { completePaymentThirdReviewSatisfaction } from './complete-payment-third-review-satisfaction';

const input = { score: 4, summary: '만족', memo: '잘 사용하고 있어요' };
const reviewId = '10000000-0000-0000-0000-000000000001';
const followUpId = '30000000-0000-0000-0000-000000000001';

describe('completePaymentThirdReviewSatisfaction', () => {
  const rpc = vi.fn();

  beforeEach(() => {
    rpc.mockReset();
  });

  it('completes the follow-up and review through one RPC', async () => {
    rpc.mockResolvedValue({
      data: {
        ok: true,
        item: {
          reviewId,
          followUpId,
          status: 'completed',
          score: 4,
          summary: '만족',
          memo: '잘 사용하고 있어요',
          completedAt: '2026-08-07T05:30:00+00:00',
        },
      },
      error: null,
    });

    const result = await completePaymentThirdReviewSatisfaction(
      { rpc } as never,
      'user-1',
      reviewId,
      input,
    );

    expect(rpc).toHaveBeenCalledWith('complete_payment_third_review_satisfaction', {
      p_review_id: reviewId,
      p_score: 4,
      p_summary: '만족',
      p_memo: '잘 사용하고 있어요',
    });
    expect(result).toMatchObject({
      ok: true,
      item: { reviewId, followUpId, status: 'completed', score: 4 },
    });
  });

  it('returns a domain failure from the RPC', async () => {
    rpc.mockResolvedValue({ data: { ok: false, reason: 'not_ready' }, error: null });

    const result = await completePaymentThirdReviewSatisfaction(
      { rpc } as never,
      'user-1',
      reviewId,
      input,
    );

    expect(result).toEqual({ ok: false, reason: 'not_ready' });
  });

  it('returns a database failure without attempting a manual rollback', async () => {
    rpc.mockResolvedValue({ data: null, error: { message: 'transaction failed' } });

    const result = await completePaymentThirdReviewSatisfaction(
      { rpc } as never,
      'user-1',
      reviewId,
      input,
    );

    expect(rpc).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      ok: false,
      reason: 'database_error',
      errorMessage: 'transaction failed',
    });
  });

  it('rejects an invalid RPC response', async () => {
    rpc.mockResolvedValue({ data: { ok: true, item: null }, error: null });

    const result = await completePaymentThirdReviewSatisfaction(
      { rpc } as never,
      'user-1',
      reviewId,
      input,
    );

    expect(result).toEqual({
      ok: false,
      reason: 'database_error',
      errorMessage: '만족도 완료 응답 형식이 올바르지 않습니다.',
    });
  });
});
