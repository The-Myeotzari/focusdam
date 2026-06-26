import type { Metadata } from 'next';

import { PAYMENT_REVIEW_HISTORY_ITEMS } from '@/entities/payment-third-review';
import { PaymentThirdReviewDetailPage } from '@/widgets/payment-third-review-detail';

type Props = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: '결제 3심 상세',
};

export function generateStaticParams() {
  return PAYMENT_REVIEW_HISTORY_ITEMS.map((item) => ({ id: item.id }));
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  return <PaymentThirdReviewDetailPage id={id} />;
}
