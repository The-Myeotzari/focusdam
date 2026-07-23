import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import type { PaymentReviewReminderDecision } from '@/entities/payment-third-review';
import { paymentThirdReviewDetailQueryOptions } from '@/entities/payment-third-review/api/payment-third-review-query-options';
import { getPaymentThirdReviewDetailServer } from '@/entities/payment-third-review/api/payment-third-review.server';
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

  const response = await getPaymentThirdReviewDetailServer(id).catch(() => undefined);

  if (response === null) {
    notFound();
  }

  const queryClient = new QueryClient();
  if (response) {
    queryClient.setQueryData(paymentThirdReviewDetailQueryOptions(id).queryKey, response);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PaymentThirdReviewReminderResultPage decision={decision} id={id} />
    </HydrationBoundary>
  );
}

// 리마인드 제출 경로의 decision 파라미터가 허용된 값인지 확인합니다.
function isReminderDecision(decision: string): decision is PaymentReviewReminderDecision {
  return reminderDecisions.includes(decision as PaymentReviewReminderDecision);
}
