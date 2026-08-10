import { z } from 'zod';

import type { NotificationSettings } from '@/entities/notification-settings';
import type { PaymentThirdReviewListItem } from '@/entities/payment-third-review/api/payment-third-review-list.schema';

const PaymentReviewFollowUpRealtimeRowSchema = z.object({
  id: z.string().uuid(),
  review_id: z.string().uuid(),
  followup_type: z.enum(['reminder', 'satisfaction']),
  status: z.enum(['scheduled', 'required', 'completed', 'canceled']),
});

export type PaymentThirdReviewRealtimeNotification = {
  followUpId: string;
  href: string;
  title: string;
  description: string;
};

export function getPaymentThirdReviewRealtimeNotification(
  value: unknown,
  settings: NotificationSettings,
  now = new Date(),
): PaymentThirdReviewRealtimeNotification | null {
  const parsedRow = PaymentReviewFollowUpRealtimeRowSchema.safeParse(value);

  if (!parsedRow.success || parsedRow.data.status !== 'required') {
    return null;
  }

  if (settings.quietHours && isDefaultQuietHours(now)) {
    return null;
  }

  const row = parsedRow.data;

  if (row.followup_type === 'reminder') {
    if (!settings.spendHold) {
      return null;
    }

    return {
      followUpId: row.id,
      href: `/payment-third-review/reminder/${row.review_id}`,
      title: '보류한 결제를 다시 확인해요',
      description: '지금의 마음과 필요 여부를 한 번 더 판단해보세요.',
    };
  }

  return {
    followUpId: row.id,
    href: `/payment-third-review/satisfaction-check/${row.review_id}`,
    title: '결제 만족도를 확인할 시간이에요',
    description: '결제 후 만족도를 기록해 다음 선택의 기준을 만들어보세요.',
  };
}

export function getMissedPaymentThirdReviewNotification(
  items: PaymentThirdReviewListItem[],
  settings: NotificationSettings,
  seenFollowUpIds: ReadonlySet<string>,
  now = new Date(),
) {
  for (const item of items) {
    const followUp = item.followUp;

    if (!followUp || seenFollowUpIds.has(followUp.id)) {
      continue;
    }

    const notification = getPaymentThirdReviewRealtimeNotification(
      {
        id: followUp.id,
        review_id: item.id,
        followup_type: followUp.type,
        status: followUp.status,
      },
      settings,
      now,
    );

    if (notification) {
      return notification;
    }
  }

  return null;
}

export function shouldUseRealtimeFallback(status: string) {
  return status === 'TIMED_OUT' || status === 'CHANNEL_ERROR' || status === 'CLOSED';
}

function isDefaultQuietHours(now: Date) {
  const hour = now.getHours();
  return hour >= 22 || hour < 8;
}
