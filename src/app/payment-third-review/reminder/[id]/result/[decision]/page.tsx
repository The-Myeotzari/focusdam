import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import type { PaymentReviewReminderDecision } from '@/entities/payment-third-review';
import {
  getPaymentReviewHistoryItemById,
  PAYMENT_REVIEW_HISTORY_ITEMS,
} from '@/entities/payment-third-review';
import { PaymentThirdReviewReminderResultPage } from '@/features/payment-third-review-reminder';

type Props = {
  params: Promise<{ decision: string; id: string }>;
};

const reminderDecisions: PaymentReviewReminderDecision[] = ['buy', 'cancel', 'hold'];

export const metadata: Metadata = {
  title: '결제 3심 리마인드 제출',
};

export function generateStaticParams() {
  return PAYMENT_REVIEW_HISTORY_ITEMS.filter((item) => item.followUpType === 'reminder').flatMap(
    (item) => reminderDecisions.map((decision) => ({ decision, id: item.id })),
  );
}

export default async function Page({ params }: Props) {
  const { decision, id } = await params;
  const item = getPaymentReviewHistoryItemById(id);

  if (!item || item.followUpType !== 'reminder' || !isReminderDecision(decision)) {
    notFound();
  }

  return <PaymentThirdReviewReminderResultPage decision={decision} item={item} />;
}

// 리마인드 제출 경로의 decision 파라미터가 허용된 값인지 확인합니다.
function isReminderDecision(decision: string): decision is PaymentReviewReminderDecision {
  return reminderDecisions.includes(decision as PaymentReviewReminderDecision);
}
