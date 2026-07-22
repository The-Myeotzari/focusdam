import { describe, expect, it } from 'vitest';

import type { PaymentThirdReviewListItem } from '@/entities/payment-third-review/api/payment-third-review-list.schema';
import { mapPaymentThirdReviewListItemToHistoryRow } from './payment-review-list-item';

const now = new Date('2026-07-22T12:00:00+09:00');

function createListItem(
  overrides: Partial<PaymentThirdReviewListItem> = {},
): PaymentThirdReviewListItem {
  return {
    id: '10000000-0000-0000-0000-000000000001',
    itemName: '무선 이어폰',
    amountKrw: 62000,
    impulseStrength: 'high',
    outcomeType: 'buy',
    status: 'buy_satisfaction_scheduled',
    createdAt: '2026-07-22T09:00:00+09:00',
    followUp: {
      id: '30000000-0000-0000-0000-000000000001',
      type: 'satisfaction',
      sequence: 1,
      status: 'scheduled',
      scheduledAt: '2026-07-23T09:00:00+09:00',
      completedAt: null,
      reminderDecision: null,
      satisfactionScore: null,
      summary: null,
    },
    ...overrides,
  };
}

describe('mapPaymentThirdReviewListItemToHistoryRow', () => {
  it('formats raw API values for a scheduled list row', () => {
    expect(mapPaymentThirdReviewListItemToHistoryRow(createListItem(), now)).toEqual({
      id: '10000000-0000-0000-0000-000000000001',
      itemName: '무선 이어폰',
      date: '오늘',
      amount: '62,000원',
      impulseStrength: '높음',
      outcomeType: 'buy',
      status: 'buy_satisfaction_scheduled',
      followUpLabel: '24시간 뒤',
    });
  });

  it('shows a completed satisfaction score', () => {
    const item = createListItem({
      status: 'buy_satisfaction_completed',
      createdAt: '2026-07-21T10:00:00+09:00',
      followUp: {
        id: '30000000-0000-0000-0000-000000000001',
        type: 'satisfaction',
        sequence: 1,
        status: 'completed',
        scheduledAt: '2026-07-21T09:00:00+09:00',
        completedAt: '2026-07-21T10:00:00+09:00',
        reminderDecision: null,
        satisfactionScore: 4,
        summary: '만족',
      },
    });

    expect(mapPaymentThirdReviewListItemToHistoryRow(item, now)).toMatchObject({
      date: '어제',
      followUpLabel: '만족도 4/5',
    });
  });

  it('shows required and three-day reminder labels', () => {
    const requiredItem = createListItem({
      outcomeType: 'hold',
      status: 'rehold_reminder_required',
      followUp: {
        id: '30000000-0000-0000-0000-000000000002',
        type: 'reminder',
        sequence: 2,
        status: 'required',
        scheduledAt: '2026-07-22T09:00:00+09:00',
        completedAt: null,
        reminderDecision: null,
        satisfactionScore: null,
        summary: null,
      },
    });
    const scheduledItem = createListItem({
      outcomeType: 'hold',
      status: 'rehold_reminder_scheduled',
      followUp: {
        id: '30000000-0000-0000-0000-000000000003',
        type: 'reminder',
        sequence: 2,
        status: 'scheduled',
        scheduledAt: '2026-07-25T12:00:00+09:00',
        completedAt: null,
        reminderDecision: null,
        satisfactionScore: null,
        summary: null,
      },
    });

    expect(mapPaymentThirdReviewListItemToHistoryRow(requiredItem, now).followUpLabel).toBe(
      '지금 진행',
    );
    expect(mapPaymentThirdReviewListItemToHistoryRow(scheduledItem, now).followUpLabel).toBe(
      '3일 뒤',
    );
  });
});
