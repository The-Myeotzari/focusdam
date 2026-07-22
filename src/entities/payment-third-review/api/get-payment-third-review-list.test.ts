import { describe, expect, it, vi } from 'vitest';

import { getPaymentThirdReviewList } from './get-payment-third-review-list';

function createReviewQuery(result: unknown) {
  const builder = {
    eq: vi.fn(),
    is: vi.fn(),
    order: vi.fn(),
    range: vi.fn(),
    select: vi.fn(),
  };

  builder.select.mockReturnValue(builder);
  builder.eq.mockReturnValue(builder);
  builder.is.mockReturnValue(builder);
  builder.order.mockReturnValue(builder);
  builder.range.mockResolvedValue(result);

  return builder;
}

function createFollowUpQuery(result: unknown) {
  const builder = {
    eq: vi.fn(),
    in: vi.fn(),
    order: vi.fn(),
    select: vi.fn(),
  };

  builder.select.mockReturnValue(builder);
  builder.eq.mockReturnValue(builder);
  builder.in.mockReturnValue(builder);
  builder.order.mockReturnValueOnce(builder).mockResolvedValueOnce(result);

  return builder;
}

describe('getPaymentThirdReviewList', () => {
  it('queries an owner-scoped page and maps the latest follow-up', async () => {
    const reviewQuery = createReviewQuery({
      count: 8,
      data: [
        {
          id: '10000000-0000-0000-0000-000000000001',
          item_name: '무선 이어폰',
          amount_krw: 62000,
          impulse_strength: 'high',
          outcome_type: 'buy',
          status: 'buy_satisfaction_scheduled',
          created_at: '2026-07-22T09:00:00.000Z',
        },
      ],
      error: null,
    });
    const followUpQuery = createFollowUpQuery({
      data: [
        {
          id: '30000000-0000-0000-0000-000000000002',
          review_id: '10000000-0000-0000-0000-000000000001',
          followup_type: 'satisfaction',
          sequence: 2,
          status: 'scheduled',
          scheduled_at: '2026-07-24T09:00:00.000Z',
          completed_at: null,
          reminder_decision: null,
          satisfaction_score: null,
          summary: null,
          created_at: '2026-07-23T09:00:00.000Z',
        },
        {
          id: '30000000-0000-0000-0000-000000000001',
          review_id: '10000000-0000-0000-0000-000000000001',
          followup_type: 'reminder',
          sequence: 1,
          status: 'completed',
          scheduled_at: '2026-07-23T09:00:00.000Z',
          completed_at: '2026-07-23T10:00:00.000Z',
          reminder_decision: 'buy',
          satisfaction_score: null,
          summary: null,
          created_at: '2026-07-22T09:00:00.000Z',
        },
      ],
      error: null,
    });
    const from = vi.fn((table: string) => {
      if (table === 'payment_reviews') {
        return reviewQuery;
      }

      return followUpQuery;
    });

    const result = await getPaymentThirdReviewList({ from } as never, 'user-1', {
      outcomeType: 'buy',
      page: 2,
      size: 2,
    });

    expect(reviewQuery.eq).toHaveBeenCalledWith('user_id', 'user-1');
    expect(reviewQuery.eq).toHaveBeenCalledWith('outcome_type', 'buy');
    expect(reviewQuery.is).toHaveBeenCalledWith('deleted_at', null);
    expect(reviewQuery.range).toHaveBeenCalledWith(2, 3);
    expect(followUpQuery.eq).toHaveBeenCalledWith('user_id', 'user-1');
    expect(followUpQuery.in).toHaveBeenCalledWith('review_id', [
      '10000000-0000-0000-0000-000000000001',
    ]);
    expect(result).toEqual({
      ok: true,
      items: [
        {
          id: '10000000-0000-0000-0000-000000000001',
          itemName: '무선 이어폰',
          amountKrw: 62000,
          impulseStrength: 'high',
          outcomeType: 'buy',
          status: 'buy_satisfaction_scheduled',
          createdAt: '2026-07-22T09:00:00.000Z',
          followUp: {
            id: '30000000-0000-0000-0000-000000000002',
            type: 'satisfaction',
            sequence: 2,
            status: 'scheduled',
            scheduledAt: '2026-07-24T09:00:00.000Z',
            completedAt: null,
            reminderDecision: null,
            satisfactionScore: null,
            summary: null,
          },
        },
      ],
      pagination: {
        page: 2,
        size: 2,
        totalElements: 8,
        totalPages: 4,
      },
    });
  });

  it('does not query follow-ups when the requested page is empty', async () => {
    const reviewQuery = createReviewQuery({ count: 0, data: [], error: null });
    const from = vi.fn(() => reviewQuery);

    const result = await getPaymentThirdReviewList({ from } as never, 'user-1', {
      page: 1,
      size: 6,
    });

    expect(from).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      ok: true,
      items: [],
      pagination: {
        page: 1,
        size: 6,
        totalElements: 0,
        totalPages: 0,
      },
    });
  });

  it('returns the database error without querying follow-ups', async () => {
    const reviewQuery = createReviewQuery({
      count: null,
      data: null,
      error: { message: 'database unavailable' },
    });
    const from = vi.fn(() => reviewQuery);

    const result = await getPaymentThirdReviewList({ from } as never, 'user-1', {
      page: 1,
      size: 6,
    });

    expect(from).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ ok: false, errorMessage: 'database unavailable' });
  });
});
