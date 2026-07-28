import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { paymentGoalAchievementDetailQueryOptions } from '@/entities/payment-third-review/api/payment-third-review-query-options';
import { getPaymentGoalAchievementServer } from '@/entities/payment-third-review/api/payment-third-review.server';
import { PaymentThirdReviewGoalAchievementPage } from '@/features/payment-third-review-goal-achievement';

type Props = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: '결제 3심 목표 달성',
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  const response = await getPaymentGoalAchievementServer(id).catch(() => undefined);

  if (response === null) {
    notFound();
  }

  const queryClient = new QueryClient();

  if (response) {
    queryClient.setQueryData(
      paymentGoalAchievementDetailQueryOptions(id).queryKey,
      response,
    );
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PaymentThirdReviewGoalAchievementPage id={id} />
    </HydrationBoundary>
  );
}
