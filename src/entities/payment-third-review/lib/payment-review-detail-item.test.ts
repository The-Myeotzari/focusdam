import { describe, expect, it } from 'vitest';

import type { PaymentThirdReviewDetail } from '@/entities/payment-third-review/api/payment-third-review-detail.schema';
import { mapPaymentThirdReviewDetailToHistoryItem } from './payment-review-detail-item';

const detail: PaymentThirdReviewDetail = {
  id: '10000000-0000-0000-0000-000000000001',
  itemName: '무선 이어폰',
  amountKrw: 62000,
  impulseStrength: 'high',
  initialDecision: 'buy',
  outcomeType: 'buy',
  status: 'buy_satisfaction_completed',
  reason: '업무에 필요',
  buyReason: null,
  createdAt: '2026-07-21T09:00:00+09:00',
  decidedAt: '2026-07-21T09:10:00+09:00',
  goal: {
    id: '20000000-0000-0000-0000-000000000001',
    name: '여행 자금',
    currentSavedAmountKrw: 700000,
    targetAmountKrw: 1000000,
  },
  followUps: [
    {
      id: '30000000-0000-0000-0000-000000000001',
      type: 'satisfaction',
      sequence: 1,
      status: 'completed',
      scheduledAt: '2026-07-22T09:00:00+09:00',
      completedAt: '2026-07-22T10:00:00+09:00',
      reminderDecision: null,
      satisfactionScore: 4,
      summary: '만족',
      memo: '잘 사용하고 있어요',
    },
  ],
};

describe('mapPaymentThirdReviewDetailToHistoryItem', () => {
  it('maps goal progress and a completed satisfaction result', () => {
    const item = mapPaymentThirdReviewDetailToHistoryItem(
      detail,
      new Date('2026-07-22T12:00:00+09:00'),
    );

    expect(item).toMatchObject({
      itemName: '무선 이어폰',
      date: '어제',
      amount: '62,000원',
      decision: '그래도 결제',
      reason: '업무에 필요',
      progressLabel: '여행 자금 70%',
      budgetImpactLabel: '이번 달 소비에 기록',
      satisfaction: {
        status: 'completed',
        result: { score: 4, summary: '만족', memo: '잘 사용하고 있어요' },
      },
    });
  });

  it('maps a completed rehold reminder result', () => {
    const item = mapPaymentThirdReviewDetailToHistoryItem({
      ...detail,
      initialDecision: 'hold',
      outcomeType: 'save',
      status: 'rehold_after_save',
      followUps: [
        {
          ...detail.followUps[0],
          type: 'reminder',
          sequence: 2,
          reminderDecision: 'cancel',
          satisfactionScore: null,
          summary: null,
        },
      ],
    });

    expect(item).toMatchObject({
      decision: '24시간 보류',
      followUpType: 'reminder',
      budgetImpactLabel: '62,000원 절약',
      reminder: {
        reminderCount: 2,
        status: 'completed',
        result: { completedType: 'after-rehold', decision: 'cancel' },
      },
    });
  });
});
