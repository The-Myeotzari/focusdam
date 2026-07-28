import {
  PaymentGoalAchievementDetailResponseSchema,
  PaymentGoalAchievementListResponseSchema,
} from './payment-goal-achievement.schema';
import { Api } from '@/shared/lib/api/api';

export function getPaymentGoalAchievementsClient() {
  return Api.get(
    '/payment-third-reviews/goal-achievements',
    PaymentGoalAchievementListResponseSchema,
    { credentials: 'include' },
  );
}

export function getPaymentGoalAchievementClient(id: string) {
  return Api.get(
    `/payment-third-reviews/goal-achievements/${id}`,
    PaymentGoalAchievementDetailResponseSchema,
    { credentials: 'include' },
  );
}
