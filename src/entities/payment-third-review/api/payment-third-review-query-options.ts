import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

import { getPaymentThirdReviewDetailClient } from './payment-third-review-detail.client';
import { getPaymentThirdReviewListClient } from './payment-third-review-list.client';
import type { PaymentThirdReviewListItem } from './payment-third-review-list.schema';
import { QUERY_KEYS } from '@/shared/constants/query-key';

export const PAYMENT_THIRD_REVIEW_LIST_PAGE_SIZE = 6;
export const PAYMENT_THIRD_REVIEW_STALE_TIME = 60_000;

export type PaymentThirdReviewListFilter = 'all' | PaymentThirdReviewListItem['outcomeType'];

export function paymentThirdReviewDetailQueryOptions(id: string) {
  return queryOptions({
    queryKey: QUERY_KEYS.paymentThirdReviews.detail(id),
    queryFn: () => getPaymentThirdReviewDetailClient(id),
    staleTime: PAYMENT_THIRD_REVIEW_STALE_TIME,
  });
}

export function paymentThirdReviewListInfiniteQueryOptions(
  filter: PaymentThirdReviewListFilter,
) {
  return infiniteQueryOptions({
    queryKey: QUERY_KEYS.paymentThirdReviews.list(filter),
    queryFn: ({ pageParam }) =>
      getPaymentThirdReviewListClient({
        outcomeType: filter === 'all' ? undefined : filter,
        page: pageParam,
        size: PAYMENT_THIRD_REVIEW_LIST_PAGE_SIZE,
      }),
    initialPageParam: 1,
    staleTime: PAYMENT_THIRD_REVIEW_STALE_TIME,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined,
  });
}
