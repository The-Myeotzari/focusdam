export type PlusSubscriptionStatus = 'notSubscribed' | 'active' | 'canceled';

export type PlusSubscription = {
  canCancel: boolean;
  canceledAt?: string;
  currentPeriodEnd?: string;
  nextBillingDate?: string;
  paymentMethod?: string;
  planName?: string;
  status: PlusSubscriptionStatus;
};
