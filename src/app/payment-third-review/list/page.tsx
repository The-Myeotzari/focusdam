import type { Metadata } from 'next';

import { PaymentThirdReviewListPage } from '@/widgets/payment-third-review-list';

export const metadata: Metadata = {
  title: '결제 3심 내역',
};

export default function Page() {
  return <PaymentThirdReviewListPage />;
}
