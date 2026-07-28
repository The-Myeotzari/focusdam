import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import type { Metadata } from 'next';

import { paymentGoalAchievementListQueryOptions } from '@/entities/payment-third-review/api/payment-third-review-query-options';
import { getPaymentGoalAchievementsServer } from '@/entities/payment-third-review/api/payment-third-review.server';
import { PaymentThirdReviewGoalAchievementListPage } from '@/features/payment-third-review-goal-achievement';

export const metadata: Metadata = {
  title: '결제 3심 목표 달성 기록',
};

export default async function Page() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    ...paymentGoalAchievementListQueryOptions(),
    queryFn: getPaymentGoalAchievementsServer,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PaymentThirdReviewGoalAchievementListPage />
    </HydrationBoundary>
  );
}
