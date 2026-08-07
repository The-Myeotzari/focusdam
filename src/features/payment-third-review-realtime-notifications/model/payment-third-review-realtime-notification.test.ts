import { describe, expect, it } from 'vitest';

import { DEFAULT_NOTIFICATION_SETTINGS } from '@/entities/notification-settings';
import { getPaymentThirdReviewRealtimeNotification } from './payment-third-review-realtime-notification';

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
