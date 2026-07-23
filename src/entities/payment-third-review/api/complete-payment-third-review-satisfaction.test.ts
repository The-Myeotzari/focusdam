import { describe, expect, it, vi } from 'vitest';

import { completePaymentThirdReviewSatisfaction } from './complete-payment-third-review-satisfaction';

function createQuery(result: unknown) {
  const builder = {
    eq: vi.fn(),
    is: vi.fn(),
    limit: vi.fn(),
    maybeSingle: vi.fn(),
    order: vi.fn(),
    select: vi.fn(),
    update: vi.fn(),
  };

  builder.eq.mockReturnValue(builder);
  builder.is.mockReturnValue(builder);
  builder.limit.mockReturnValue(builder);
  builder.order.mockReturnValue(builder);
  builder.select.mockReturnValue(builder);
  builder.update.mockReturnValue(builder);
  builder.maybeSingle.mockResolvedValue(result);

  return builder;
}

const input = { score: 4, summary: '만족', memo: '잘 사용하고 있어요' };
const reviewId = '10000000-0000-0000-0000-000000000001';
const followUpId = '30000000-0000-0000-0000-000000000001';

describe('completePaymentThirdReviewSatisfaction', () => {
  it('completes the required follow-up and review state', async () => {
    const reviewQuery = createQuery({
      data: { id: reviewId, outcome_type: 'buy', status: 'buy_satisfaction_required' },
      error: null,
    });
    const followUpQuery = createQuery({
      data: { id: followUpId, status: 'required' },
      error: null,
    });
    const followUpUpdate = createQuery({ data: { id: followUpId }, error: null });
    const reviewUpdate = createQuery({ data: { id: reviewId }, error: null });
    const paymentReviewQueries = [reviewQuery, reviewUpdate];
    const followUpQueries = [followUpQuery, followUpUpdate];
    const from = vi.fn((table: string) =>
      table === 'payment_reviews' ? paymentReviewQueries.shift() : followUpQueries.shift(),
    );

    const result = await completePaymentThirdReviewSatisfaction(
      { from } as never,
      'user-1',
      reviewId,
      input,
    );

    expect(reviewQuery.eq).toHaveBeenCalledWith('user_id', 'user-1');
    expect(followUpQuery.eq).toHaveBeenCalledWith('followup_type', 'satisfaction');
    expect(followUpUpdate.update).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'completed',
        satisfaction_score: 4,
        summary: '만족',
        memo: '잘 사용하고 있어요',
      }),
    );
    expect(reviewUpdate.update).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'buy_satisfaction_completed' }),
    );
    expect(result).toMatchObject({
      ok: true,
      item: { reviewId, followUpId, status: 'completed', score: 4 },
    });
  });

  it('rejects a satisfaction check that is still scheduled', async () => {
    const reviewQuery = createQuery({
      data: { id: reviewId, outcome_type: 'buy', status: 'buy_satisfaction_scheduled' },
      error: null,
    });
    const followUpQuery = createQuery({
      data: { id: followUpId, status: 'scheduled' },
      error: null,
    });
    const from = vi
      .fn()
      .mockReturnValueOnce(reviewQuery)
      .mockReturnValueOnce(followUpQuery);

    const result = await completePaymentThirdReviewSatisfaction(
      { from } as never,
      'user-1',
      reviewId,
      input,
    );

    expect(from).toHaveBeenCalledTimes(2);
    expect(result).toEqual({ ok: false, reason: 'not_ready' });
  });

  it('rolls back the follow-up when the review update fails', async () => {
    const reviewQuery = createQuery({
      data: { id: reviewId, outcome_type: 'buy', status: 'buy_satisfaction_required' },
      error: null,
    });
    const followUpQuery = createQuery({
      data: { id: followUpId, status: 'required' },
      error: null,
    });
    const followUpUpdate = createQuery({ data: { id: followUpId }, error: null });
    const reviewUpdate = createQuery({ data: null, error: { message: 'review update failed' } });
    const rollbackUpdate = createQuery({ data: null, error: null });
    rollbackUpdate.eq
      .mockReturnValueOnce(rollbackUpdate)
      .mockReturnValueOnce(rollbackUpdate)
      .mockResolvedValueOnce({ data: null, error: null });
    const paymentReviewQueries = [reviewQuery, reviewUpdate];
    const followUpQueries = [followUpQuery, followUpUpdate, rollbackUpdate];
    const from = vi.fn((table: string) =>
      table === 'payment_reviews' ? paymentReviewQueries.shift() : followUpQueries.shift(),
    );

    const result = await completePaymentThirdReviewSatisfaction(
      { from } as never,
      'user-1',
      reviewId,
      input,
    );

    expect(rollbackUpdate.update).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'required', satisfaction_score: null }),
    );
    expect(result).toEqual({
      ok: false,
      reason: 'database_error',
      errorMessage: 'review update failed',
    });
  });
});
