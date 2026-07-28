import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import type { Metadata } from 'next';

import {
  PAYMENT_THIRD_REVIEW_LIST_PAGE_SIZE,
  paymentThirdReviewListInfiniteQueryOptions,
} from '@/entities/payment-third-review/api/payment-third-review-query-options';
import { getPaymentThirdReviewListServer } from '@/entities/payment-third-review/api/payment-third-review.server';
import { parsePaymentThirdReviewListFilter } from '@/entities/payment-third-review/model/payment-third-review-list-filter';
import { PaymentThirdReviewListPage } from '@/widgets/payment-third-review-list';

type Props = {
  searchParams: Promise<{ filter?: string | string[] }>;
};

export const metadata: Metadata = {
  title: '결제 3심 내역',
};

export default async function Page({ searchParams }: Props) {
  const { filter } = await searchParams;
  const initialFilter = parsePaymentThirdReviewListFilter(filter);
  const queryClient = new QueryClient();
  const queryOptions = paymentThirdReviewListInfiniteQueryOptions(initialFilter);

  await queryClient.prefetchInfiniteQuery({
    ...queryOptions,
    queryFn: ({ pageParam }) =>
      getPaymentThirdReviewListServer({
        outcomeType: initialFilter === 'all' ? undefined : initialFilter,
        page: pageParam,
        size: PAYMENT_THIRD_REVIEW_LIST_PAGE_SIZE,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PaymentThirdReviewListPage initialFilter={initialFilter} />
    </HydrationBoundary>
  );
}
