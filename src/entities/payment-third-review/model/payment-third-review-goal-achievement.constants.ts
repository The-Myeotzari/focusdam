import type {
  PaymentReviewGoal,
  PaymentReviewGoalAchievement,
} from './payment-third-review-goal-achievement.types';
import type { PaymentReviewStatus } from './payment-third-review.types';

type GoalAchievementHrefParams = {
  savedAmount: number;
  triggerReviewId?: string;
  triggerStatus?: PaymentReviewStatus;
};

export const PAYMENT_REVIEW_ACTIVE_GOAL: PaymentReviewGoal = {
  currentSavedAmount: 62000,
  id: 'goal-001',
  name: '여행비 / 비상금',
  targetAmount: 86000,
};

export const PAYMENT_REVIEW_GOAL_ACHIEVEMENTS: PaymentReviewGoalAchievement[] = [
  {
    achievedAmount: 86000,
    achievedAt: '오늘',
    goalId: PAYMENT_REVIEW_ACTIVE_GOAL.id,
    goalName: PAYMENT_REVIEW_ACTIVE_GOAL.name,
    id: 'pga-001',
    savedAmount: 24000,
    savedReviewCount: 5,
    targetAmount: PAYMENT_REVIEW_ACTIVE_GOAL.targetAmount,
    triggerReviewId: 'ptr-003',
    triggerStatus: 'save_completed',
  },
];

// 목표 달성 기록 id에 맞는 달성 항목을 반환합니다.
export function getPaymentReviewGoalAchievementById(id: string) {
  return PAYMENT_REVIEW_GOAL_ACHIEVEMENTS.find((item) => item.id === id);
}

// 저축 반영 금액이 현재 목표를 달성시키는지 확인합니다.
export function createGoalAchievementPreviewAfterSaving({
  savedAmount,
  triggerReviewId,
  triggerStatus,
}: {
  savedAmount: number;
  triggerReviewId: string;
  triggerStatus: PaymentReviewStatus;
}) {
  const achievedAmount = PAYMENT_REVIEW_ACTIVE_GOAL.currentSavedAmount + savedAmount;

  if (
    savedAmount <= 0 ||
    PAYMENT_REVIEW_ACTIVE_GOAL.currentSavedAmount >= PAYMENT_REVIEW_ACTIVE_GOAL.targetAmount ||
    achievedAmount < PAYMENT_REVIEW_ACTIVE_GOAL.targetAmount
  ) {
    return null;
  }

  return {
    achievedAmount,
    achievedAt: '오늘',
    goalId: PAYMENT_REVIEW_ACTIVE_GOAL.id,
    goalName: PAYMENT_REVIEW_ACTIVE_GOAL.name,
    id: 'preview',
    savedAmount,
    savedReviewCount: 5,
    targetAmount: PAYMENT_REVIEW_ACTIVE_GOAL.targetAmount,
    triggerReviewId,
    triggerStatus,
  } satisfies PaymentReviewGoalAchievement;
}

// 저축 반영 후 목표 달성 화면으로 이동해야 하는지 확인하고 href를 반환합니다.
export function getGoalAchievementHrefAfterSaving({
  savedAmount,
  triggerReviewId = 'pending',
  triggerStatus = 'save_completed',
}: GoalAchievementHrefParams) {
  const achievement = createGoalAchievementPreviewAfterSaving({
    savedAmount,
    triggerReviewId,
    triggerStatus,
  });

  if (!achievement) {
    return null;
  }

  return `/payment-third-review/goal-achievement/${PAYMENT_REVIEW_GOAL_ACHIEVEMENTS[0].id}`;
}
