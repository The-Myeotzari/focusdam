import { z } from 'zod';

import { PaymentThirdReviewListItemSchema } from './payment-third-review-list.schema';
import { PaymentSavingGoalSchema } from './payment-saving-goal.schema';
import { PaymentGoalAchievementSummarySchema } from './payment-goal-achievement.schema';

export const PaymentThirdReviewHomeStatsSchema = z.object({
  totalCount: z.number().int().nonnegative(),
  buyCount: z.number().int().nonnegative(),
  saveCount: z.number().int().nonnegative(),
  holdCount: z.number().int().nonnegative(),
  savedAmountKrw: z.number().int().nonnegative(),
});

export const PaymentThirdReviewHomeResponseSchema = z.object({
  ok: z.literal(true),
  stats: PaymentThirdReviewHomeStatsSchema,
  activeGoal: PaymentSavingGoalSchema.nullable(),
  latestGoalAchievement: PaymentGoalAchievementSummarySchema.nullable(),
  recentItems: z.array(PaymentThirdReviewListItemSchema).max(3),
});

export type PaymentThirdReviewHomeStats = z.infer<
  typeof PaymentThirdReviewHomeStatsSchema
>;
export type PaymentThirdReviewHomeResponse = z.infer<
  typeof PaymentThirdReviewHomeResponseSchema
>;
