import { describe, expect, it } from 'vitest';

import { PaymentThirdReviewListResponseSchema } from './payment-third-review-list.schema';

describe('PaymentThirdReviewListResponseSchema', () => {
  it('accepts PostgreSQL UUID values generated for deterministic test data', () => {
    const response = {
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
            id: '30000000-0000-0000-0000-000000000001',
            type: 'satisfaction',
            sequence: 1,
            status: 'scheduled',
            scheduledAt: '2026-07-23T09:00:00.000Z',
            completedAt: null,
            reminderDecision: null,
            satisfactionScore: null,
            summary: null,
          },
        },
      ],
      pagination: {
        page: 1,
        size: 6,
        totalElements: 1,
        totalPages: 1,
      },
    };

    expect(PaymentThirdReviewListResponseSchema.safeParse(response).success).toBe(true);
  });
});
