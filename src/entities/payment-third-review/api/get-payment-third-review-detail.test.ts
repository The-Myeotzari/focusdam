import { describe, expect, it, vi } from 'vitest';

import { getPaymentThirdReviewDetail } from './get-payment-third-review-detail';

function createSingleQuery(result: unknown) {
  const builder = {
    eq: vi.fn(),
    is: vi.fn(),
    maybeSingle: vi.fn(),
    select: vi.fn(),
  };

  builder.select.mockReturnValue(builder);
  builder.eq.mockReturnValue(builder);
  builder.is.mockReturnValue(builder);
  builder.maybeSingle.mockResolvedValue(result);

  return builder;
}

function createFollowUpQuery(result: unknown) {
  const builder = {
    eq: vi.fn(),
    order: vi.fn(),
    select: vi.fn(),
  };

  builder.select.mockReturnValue(builder);
  builder.eq.mockReturnValue(builder);
  builder.order.mockResolvedValue(result);

  return builder;
}

describe('getPaymentThirdReviewDetail', () => {
  it('queries owner-scoped review, follow-ups, and goal data', async () => {
    const reviewQuery = createSingleQuery({
      data: {
        id: '10000000-0000-0000-0000-000000000001',
        item_name: '무선 이어폰',
        amount_krw: 62000,
        impulse_strength: 'high',
        initial_decision: 'buy',
        outcome_type: 'buy',
        status: 'buy_satisfaction_completed',
        reason: '업무에 필요',
        buy_reason: null,
        created_at: '2026-07-21T09:00:00.000Z',
        decided_at: '2026-07-21T09:10:00.000Z',
        goal_id: '20000000-0000-0000-0000-000000000001',
      },
      error: null,
    });
    const followUpQuery = createFollowUpQuery({
      data: [
        {
          id: '30000000-0000-0000-0000-000000000001',
          followup_type: 'satisfaction',
          sequence: 1,
          status: 'completed',
          scheduled_at: '2026-07-22T09:00:00.000Z',
          completed_at: '2026-07-22T10:00:00.000Z',
          reminder_decision: null,
          satisfaction_score: 4,
          summary: '만족',
          memo: '잘 사용하고 있어요',
        },
      ],
      error: null,
    });
    const goalQuery = createSingleQuery({
      data: {
        id: '20000000-0000-0000-0000-000000000001',
        name: '여행 자금',
        current_saved_amount_krw: 700000,
        target_amount_krw: 1000000,
      },
      error: null,
    });
    const from = vi.fn((table: string) => {
      if (table === 'payment_reviews') return reviewQuery;
      if (table === 'payment_review_followups') return followUpQuery;
      return goalQuery;
    });

    const result = await getPaymentThirdReviewDetail(
      { from } as never,
      'user-1',
      '10000000-0000-0000-0000-000000000001',
    );

    expect(reviewQuery.eq).toHaveBeenCalledWith('user_id', 'user-1');
    expect(followUpQuery.eq).toHaveBeenCalledWith('user_id', 'user-1');
    expect(goalQuery.eq).toHaveBeenCalledWith('user_id', 'user-1');
    expect(result).toMatchObject({
      ok: true,
      item: {
        itemName: '무선 이어폰',
        goal: { name: '여행 자금', currentSavedAmountKrw: 700000 },
        followUps: [{ satisfactionScore: 4, memo: '잘 사용하고 있어요' }],
      },
    });
  });

  it('returns not found without querying related tables', async () => {
    const reviewQuery = createSingleQuery({ data: null, error: null });
    const from = vi.fn(() => reviewQuery);

    const result = await getPaymentThirdReviewDetail(
      { from } as never,
      'user-1',
      '10000000-0000-0000-0000-000000000099',
    );

    expect(from).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ ok: false, reason: 'not_found' });
  });

  it('returns a database error from the review query', async () => {
    const reviewQuery = createSingleQuery({
      data: null,
      error: { message: 'database unavailable' },
    });

    const result = await getPaymentThirdReviewDetail(
      { from: vi.fn(() => reviewQuery) } as never,
      'user-1',
      '10000000-0000-0000-0000-000000000001',
    );

    expect(result).toEqual({
      ok: false,
      reason: 'database_error',
      errorMessage: 'database unavailable',
    });
  });
});
