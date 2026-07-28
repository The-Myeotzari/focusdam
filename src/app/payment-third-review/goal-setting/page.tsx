import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import type { Metadata } from 'next';

import { activePaymentSavingGoalQueryOptions } from '@/entities/payment-third-review/api/payment-third-review-query-options';
import { getActivePaymentSavingGoalServer } from '@/entities/payment-third-review/api/payment-third-review.server';
import { PaymentThirdReviewGoalSettingPage } from '@/features/payment-third-review-goal-setting';

export const metadata: Metadata = {
  title: '결제 3심 목표 설정',
};

export default async function Page() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    ...activePaymentSavingGoalQueryOptions(),
    queryFn: getActivePaymentSavingGoalServer,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PaymentThirdReviewGoalSettingPage />
    </HydrationBoundary>
  );
}
