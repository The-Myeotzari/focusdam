import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import type { Metadata } from 'next';

import { paymentThirdReviewHomeQueryOptions } from '@/entities/payment-third-review/api/payment-third-review-query-options';
import { getPaymentThirdReviewHomeServer } from '@/entities/payment-third-review/api/payment-third-review.server';
import { PaymentThirdReviewHomePage } from '@/widgets/payment-third-review-home';

export const metadata: Metadata = {
  title: '결제 3심',
};

export default async function Page() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    ...paymentThirdReviewHomeQueryOptions(),
    queryFn: getPaymentThirdReviewHomeServer,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PaymentThirdReviewHomePage />
    </HydrationBoundary>
  );
}
