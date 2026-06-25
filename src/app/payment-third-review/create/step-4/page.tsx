import type { Metadata } from 'next';

import { PaymentThirdReviewCreatePage } from '@/widgets/payment-third-review-create-page';

export const metadata: Metadata = {
  title: '결제 3심 생성 - 3심',
};

export default function Page() {
  return <PaymentThirdReviewCreatePage step="step-4" />;
}
