import type { Metadata } from 'next';

import { PaymentThirdReviewCreatePage } from '@/widgets/payment-third-review-create-page';

export const metadata: Metadata = {
  title: '결제 3심 생성 - 목표 저축',
};

export default function Page() {
  return <PaymentThirdReviewCreatePage step="save" />;
}
