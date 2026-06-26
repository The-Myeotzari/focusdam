import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import {
  getPaymentReviewHistoryItemById,
  PAYMENT_REVIEW_HISTORY_ITEMS,
} from '@/entities/payment-third-review';
import { PaymentThirdReviewSatisfactionCheckPage } from '@/features/payment-third-review-satisfaction-check';

type Props = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: '결제 3심 만족도 체크',
};

export function generateStaticParams() {
  return PAYMENT_REVIEW_HISTORY_ITEMS.filter((item) => item.followUpType === 'satisfaction').map(
    (item) => ({ id: item.id }),
  );
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const item = getPaymentReviewHistoryItemById(id);

  if (!item || item.followUpType !== 'satisfaction') {
    notFound();
  }

  return <PaymentThirdReviewSatisfactionCheckPage item={item} />;
}
