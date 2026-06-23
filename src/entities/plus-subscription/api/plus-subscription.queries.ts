import type { PlusSubscription } from '../model/plus-subscription.types';

const DEFAULT_PLUS_SUBSCRIPTIONS: Record<PlusSubscription['status'], PlusSubscription> = {
  notSubscribed: {
    canCancel: false,
    status: 'notSubscribed',
  },
  active: {
    canCancel: true,
    currentPeriodEnd: '2026-07-10',
    nextBillingDate: '2026-07-10',
    paymentMethod: '카드',
    planName: '월간 Plus',
    status: 'active',
  },
  canceled: {
    canCancel: false,
    canceledAt: '2026-06-20',
    currentPeriodEnd: '2026-07-10',
    paymentMethod: '카드',
    planName: '월간 Plus',
    status: 'canceled',
  },
};

function isPlusSubscription(value: unknown): value is PlusSubscription {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const subscription = value as Record<string, unknown>;

  return (
    typeof subscription.canCancel === 'boolean' &&
    ['notSubscribed', 'active', 'canceled'].includes(String(subscription.status))
  );
}

function getMockPlusSubscription() {
  const status = process.env.PLUS_SUBSCRIPTION_MOCK_STATUS;

  if (status === 'active' || status === 'canceled' || status === 'notSubscribed') {
    return DEFAULT_PLUS_SUBSCRIPTIONS[status];
  }

  // 여기에서 구독 상태 변경해서 확인 가능
  return DEFAULT_PLUS_SUBSCRIPTIONS.active;
}

export async function getPlusSubscription(): Promise<PlusSubscription> {
  const endpoint = process.env.PLUS_SUBSCRIPTION_API_URL;

  if (!endpoint) {
    return getMockPlusSubscription();
  }

  try {
    const response = await fetch(endpoint, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return getMockPlusSubscription();
    }

    const data: unknown = await response.json();
    return isPlusSubscription(data) ? data : getMockPlusSubscription();
  } catch {
    return getMockPlusSubscription();
  }
}
