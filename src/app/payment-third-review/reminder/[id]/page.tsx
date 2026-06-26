import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import {
  getPaymentReviewHistoryItemById,
  PAYMENT_REVIEW_HISTORY_ITEMS,
} from '@/entities/payment-third-review';
import { PaymentThirdReviewReminderPage } from '@/features/payment-third-review-reminder';

type Props = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: '결제 3심 리마인드',
};

export function generateStaticParams() {
  return PAYMENT_REVIEW_HISTORY_ITEMS.filter((item) => item.followUpType === 'reminder').map(
    (item) => ({ id: item.id }),
  );
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const item = getPaymentReviewHistoryItemById(id);

  if (!item || item.followUpType !== 'reminder') {
    notFound();
  }

  return <PaymentThirdReviewReminderPage item={item} />;
}
