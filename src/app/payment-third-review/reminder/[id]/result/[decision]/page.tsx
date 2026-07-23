import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import type { PaymentReviewReminderDecision } from '@/entities/payment-third-review';
import { PaymentThirdReviewReminderResultPage } from '@/features/payment-third-review-reminder';

type Props = {
  params: Promise<{ decision: string; id: string }>;
};

const reminderDecisions: PaymentReviewReminderDecision[] = ['buy', 'cancel', 'hold'];

export const metadata: Metadata = {
  title: '결제 3심 리마인드 제출',
};

export default async function Page({ params }: Props) {
  const { decision, id } = await params;

  if (!isReminderDecision(decision)) {
    notFound();
  }

  return <PaymentThirdReviewReminderResultPage decision={decision} id={id} />;
}

// 리마인드 제출 경로의 decision 파라미터가 허용된 값인지 확인합니다.
function isReminderDecision(decision: string): decision is PaymentReviewReminderDecision {
  return reminderDecisions.includes(decision as PaymentReviewReminderDecision);
}
