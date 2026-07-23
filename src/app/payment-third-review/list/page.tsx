import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import type { Metadata } from 'next';

import {
  PAYMENT_THIRD_REVIEW_LIST_PAGE_SIZE,
  paymentThirdReviewListInfiniteQueryOptions,
} from '@/entities/payment-third-review/api/payment-third-review-query-options';
import { getPaymentThirdReviewListServer } from '@/entities/payment-third-review/api/payment-third-review.server';
import { PaymentThirdReviewListPage } from '@/widgets/payment-third-review-list';

export const metadata: Metadata = {
  title: '결제 3심 내역',
};

export default async function Page() {
  const queryClient = new QueryClient();
  const queryOptions = paymentThirdReviewListInfiniteQueryOptions('all');

  await queryClient.prefetchInfiniteQuery({
    ...queryOptions,
    queryFn: ({ pageParam }) =>
      getPaymentThirdReviewListServer({
        page: pageParam,
        size: PAYMENT_THIRD_REVIEW_LIST_PAGE_SIZE,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PaymentThirdReviewListPage />
    </HydrationBoundary>
  );
}
