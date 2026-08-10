import { describe, expect, it } from 'vitest';

import { DEFAULT_NOTIFICATION_SETTINGS } from '@/entities/notification-settings';
import {
  getMissedPaymentThirdReviewNotification,
  getPaymentThirdReviewRealtimeNotification,
  shouldUseRealtimeFallback,
} from './payment-third-review-realtime-notification';

const row = {
  id: '10000000-0000-4000-8000-000000000001',
  review_id: '20000000-0000-4000-8000-000000000001',
  followup_type: 'reminder',
  status: 'required',
};

describe('getPaymentThirdReviewRealtimeNotification', () => {
  it('보류 리마인드가 도래하면 해당 판단 화면으로 연결한다', () => {
    expect(
      getPaymentThirdReviewRealtimeNotification(
        row,
        DEFAULT_NOTIFICATION_SETTINGS,
        new Date('2026-08-07T14:00:00'),
      ),
    ).toMatchObject({
      href: '/payment-third-review/reminder/20000000-0000-4000-8000-000000000001',
      title: '보류한 결제를 다시 확인해요',
    });
  });

  it('소비 보류 알림을 끈 사용자의 리마인드는 표시하지 않는다', () => {
    expect(
      getPaymentThirdReviewRealtimeNotification(
        row,
        { ...DEFAULT_NOTIFICATION_SETTINGS, spendHold: false },
        new Date('2026-08-07T14:00:00'),
      ),
    ).toBeNull();
  });

  it('방해금지 시간에는 인앱 알림을 표시하지 않는다', () => {
    expect(
      getPaymentThirdReviewRealtimeNotification(
        row,
        DEFAULT_NOTIFICATION_SETTINGS,
        new Date('2026-08-07T23:00:00'),
      ),
    ).toBeNull();
  });

  it('만족도 확인은 만족도 화면으로 연결한다', () => {
    expect(
      getPaymentThirdReviewRealtimeNotification(
        { ...row, followup_type: 'satisfaction' },
        DEFAULT_NOTIFICATION_SETTINGS,
        new Date('2026-08-07T14:00:00'),
      ),
    ).toMatchObject({
      href:
        '/payment-third-review/satisfaction-check/20000000-0000-4000-8000-000000000001',
      title: '결제 만족도를 확인할 시간이에요',
    });
  });

  it('required 상태가 아니거나 행 형식이 잘못되면 무시한다', () => {
    expect(
      getPaymentThirdReviewRealtimeNotification(
        { ...row, status: 'scheduled' },
        DEFAULT_NOTIFICATION_SETTINGS,
        new Date('2026-08-07T14:00:00'),
      ),
    ).toBeNull();
    expect(
      getPaymentThirdReviewRealtimeNotification(
        { ...row, id: 'invalid-id' },
        DEFAULT_NOTIFICATION_SETTINGS,
        new Date('2026-08-07T14:00:00'),
      ),
    ).toBeNull();
  });
});

describe('getMissedPaymentThirdReviewNotification', () => {
  const listItem = {
    id: row.review_id,
    itemName: '테스트 결제',
    amountKrw: 10000,
    impulseStrength: 'medium' as const,
    outcomeType: 'hold' as const,
    status: 'hold_reminder_required' as const,
    createdAt: '2026-08-07T00:00:00.000Z',
    followUp: {
      id: row.id,
      type: 'reminder' as const,
      sequence: 1,
      status: 'required' as const,
      scheduledAt: '2026-08-07T00:00:00.000Z',
      completedAt: null,
      reminderDecision: null,
      satisfactionScore: null,
      summary: null,
    },
  };

  it('앱을 닫은 동안 도래한 첫 후속 작업을 복구한다', () => {
    expect(
      getMissedPaymentThirdReviewNotification(
        [listItem],
        DEFAULT_NOTIFICATION_SETTINGS,
        new Set(),
        new Date('2026-08-07T14:00:00'),
      ),
    ).toMatchObject({ followUpId: row.id });
  });

  it('현재 세션에서 이미 안내한 후속 작업은 다시 표시하지 않는다', () => {
    expect(
      getMissedPaymentThirdReviewNotification(
        [listItem],
        DEFAULT_NOTIFICATION_SETTINGS,
        new Set([row.id]),
        new Date('2026-08-07T14:00:00'),
      ),
    ).toBeNull();
  });
});

describe('shouldUseRealtimeFallback', () => {
  it.each(['TIMED_OUT', 'CHANNEL_ERROR', 'CLOSED'])(
    '%s 상태에서는 API 재조회로 보완한다',
    (status) => {
      expect(shouldUseRealtimeFallback(status)).toBe(true);
    },
  );

  it('정상 구독 상태에서는 fallback을 사용하지 않는다', () => {
    expect(shouldUseRealtimeFallback('SUBSCRIBED')).toBe(false);
  });
});
