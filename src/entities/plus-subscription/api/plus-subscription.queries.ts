import type { PlusSubscription } from '../model/plus-subscription.types';

const DEFAULT_PLUS_SUBSCRIPTION: PlusSubscription = {
  canCancel: true,
  nextBillingDate: '2026-07-10',
  paymentMethod: '카드',
  planName: '월간 Plus',
  status: 'active',
};

function isPlusSubscription(value: unknown): value is PlusSubscription {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const subscription = value as Record<string, unknown>;

  return (
    typeof subscription.canCancel === 'boolean' &&
    typeof subscription.nextBillingDate === 'string' &&
    typeof subscription.paymentMethod === 'string' &&
    typeof subscription.planName === 'string' &&
    ['active', 'inactive', 'pastDue'].includes(String(subscription.status))
  );
}

export async function getPlusSubscription(): Promise<PlusSubscription> {
  const endpoint = process.env.PLUS_SUBSCRIPTION_API_URL;

  if (!endpoint) {
    return DEFAULT_PLUS_SUBSCRIPTION;
  }

  try {
    const response = await fetch(endpoint, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return DEFAULT_PLUS_SUBSCRIPTION;
    }

    const data: unknown = await response.json();
    return isPlusSubscription(data) ? data : DEFAULT_PLUS_SUBSCRIPTION;
  } catch {
    return DEFAULT_PLUS_SUBSCRIPTION;
  }
}
