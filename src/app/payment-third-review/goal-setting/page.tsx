import type { Metadata } from 'next';

import { PaymentThirdReviewGoalSettingPage } from '@/features/payment-third-review-goal-setting';

export const metadata: Metadata = {
  title: '결제 3심 목표 설정',
};

export default function Page() {
  return <PaymentThirdReviewGoalSettingPage />;
}
