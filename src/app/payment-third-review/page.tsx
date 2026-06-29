import type { Metadata } from 'next';

import { PaymentThirdReviewHomePage } from '@/widgets/payment-third-review-home';

export const metadata: Metadata = {
  title: '결제 3심',
};

export default function Page() {
  return <PaymentThirdReviewHomePage />;
}
