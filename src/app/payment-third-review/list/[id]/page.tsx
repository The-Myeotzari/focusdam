import type { Metadata } from 'next';

import { PaymentThirdReviewDetailPage } from '@/widgets/payment-third-review-detail';

type Props = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: '결제 3심 상세',
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  return <PaymentThirdReviewDetailPage id={id} />;
}
