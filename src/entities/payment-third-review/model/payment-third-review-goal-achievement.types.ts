import type { PaymentReviewStatus } from './payment-third-review.types';

export type PaymentReviewGoal = {
  currentSavedAmount: number;
  id: string;
  name: string;
  targetAmount: number;
};

export type PaymentReviewGoalAchievement = {
  achievedAmount: number;
  achievedAt: string;
  goalId: string;
  goalName: string;
  id: string;
  savedAmount: number;
  savedReviewCount: number;
  targetAmount: number;
  triggerReviewId: string;
  triggerStatus: PaymentReviewStatus;
};
