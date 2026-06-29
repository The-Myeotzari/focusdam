import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import {
  getPaymentReviewGoalAchievementById,
  PAYMENT_REVIEW_GOAL_ACHIEVEMENTS,
} from '@/entities/payment-third-review';
import { PaymentThirdReviewGoalAchievementPage } from '@/features/payment-third-review-goal-achievement';

type Props = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: '결제 3심 목표 달성',
};

export function generateStaticParams() {
  return PAYMENT_REVIEW_GOAL_ACHIEVEMENTS.map((item) => ({ id: item.id }));
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const achievement = getPaymentReviewGoalAchievementById(id);

  if (!achievement) {
    notFound();
  }

  return <PaymentThirdReviewGoalAchievementPage achievement={achievement} />;
}
