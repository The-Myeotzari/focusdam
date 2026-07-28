import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import type { Metadata } from 'next';

import { activePaymentSavingGoalQueryOptions } from '@/entities/payment-third-review/api/payment-third-review-query-options';
import { getActivePaymentSavingGoalServer } from '@/entities/payment-third-review/api/payment-third-review.server';
import { PaymentThirdReviewCreatePage } from '@/widgets/payment-third-review-create-page';

export const metadata: Metadata = {
  title: '결제 3심 생성 - 3심',
};

export default async function Page() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    ...activePaymentSavingGoalQueryOptions(),
    queryFn: getActivePaymentSavingGoalServer,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PaymentThirdReviewCreatePage step="step-4" />
    </HydrationBoundary>
  );
}
