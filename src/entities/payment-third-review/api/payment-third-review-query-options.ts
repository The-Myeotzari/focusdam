import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

import type { PaymentThirdReviewListFilter } from '../model/payment-third-review-list-filter';
import { getPaymentThirdReviewDetailClient } from './payment-third-review-detail.client';
import { getPaymentThirdReviewHomeClient } from './payment-third-review-home.client';
import { getPaymentThirdReviewListClient } from './payment-third-review-list.client';
import { getActivePaymentSavingGoalClient } from './payment-saving-goal.client';
import {
  getPaymentGoalAchievementClient,
  getPaymentGoalAchievementsClient,
} from './payment-goal-achievement.client';
import { QUERY_KEYS } from '@/shared/constants/query-key';

export const PAYMENT_THIRD_REVIEW_LIST_PAGE_SIZE = 6;
export const PAYMENT_THIRD_REVIEW_STALE_TIME = 60_000;

export function activePaymentSavingGoalQueryOptions() {
  return queryOptions({
    queryKey: QUERY_KEYS.paymentThirdReviews.activeGoal,
    queryFn: getActivePaymentSavingGoalClient,
    staleTime: PAYMENT_THIRD_REVIEW_STALE_TIME,
  });
}

export function paymentGoalAchievementListQueryOptions() {
  return queryOptions({
    queryKey: QUERY_KEYS.paymentThirdReviews.goalAchievements,
    queryFn: getPaymentGoalAchievementsClient,
    staleTime: PAYMENT_THIRD_REVIEW_STALE_TIME,
  });
}

export function paymentGoalAchievementDetailQueryOptions(id: string) {
  return queryOptions({
    queryKey: QUERY_KEYS.paymentThirdReviews.goalAchievement(id),
    queryFn: () => getPaymentGoalAchievementClient(id),
    staleTime: PAYMENT_THIRD_REVIEW_STALE_TIME,
  });
}

export function paymentThirdReviewDetailQueryOptions(id: string) {
  return queryOptions({
    queryKey: QUERY_KEYS.paymentThirdReviews.detail(id),
    queryFn: () => getPaymentThirdReviewDetailClient(id),
    staleTime: PAYMENT_THIRD_REVIEW_STALE_TIME,
  });
}

export function paymentThirdReviewHomeQueryOptions() {
  return queryOptions({
    queryKey: QUERY_KEYS.paymentThirdReviews.home,
    queryFn: getPaymentThirdReviewHomeClient,
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
