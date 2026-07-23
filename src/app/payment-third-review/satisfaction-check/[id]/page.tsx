import type { Metadata } from 'next';

import { PaymentThirdReviewSatisfactionCheckPage } from '@/features/payment-third-review-satisfaction-check';

type Props = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: '결제 3심 만족도 체크',
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  return <PaymentThirdReviewSatisfactionCheckPage id={id} />;
}
