export type PlusSubscriptionStatus = 'active' | 'inactive' | 'pastDue';

export type PlusSubscription = {
  canCancel: boolean;
  nextBillingDate: string;
  paymentMethod: string;
  planName: string;
  status: PlusSubscriptionStatus;
};
