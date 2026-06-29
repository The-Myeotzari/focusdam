import type { Metadata } from 'next';

import { PAYMENT_REVIEW_GOAL_ACHIEVEMENTS } from '@/entities/payment-third-review';
import { PaymentThirdReviewGoalAchievementListPage } from '@/features/payment-third-review-goal-achievement';

export const metadata: Metadata = {
  title: '결제 3심 목표 달성 기록',
};

export default function Page() {
  return (
    <PaymentThirdReviewGoalAchievementListPage achievements={PAYMENT_REVIEW_GOAL_ACHIEVEMENTS} />
  );
}
