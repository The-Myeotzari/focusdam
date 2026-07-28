import { z } from 'zod';

import { PaymentReviewStatusSchema } from './payment-third-review-list.schema';
import { PaymentThirdReviewIdSchema } from './payment-third-review-detail.schema';

export const PaymentGoalAchievementSchema = z.object({
  id: PaymentThirdReviewIdSchema,
  goalId: PaymentThirdReviewIdSchema,
  goalName: z.string().min(1),
  targetAmount: z.number().int().nonnegative(),
  achievedAmount: z.number().int().nonnegative(),
  savedAmount: z.number().int().nonnegative(),
  savedReviewCount: z.number().int().nonnegative(),
  achievedAt: z.string().datetime({ offset: true }),
  triggerReviewId: PaymentThirdReviewIdSchema.nullable(),
  triggerStatus: PaymentReviewStatusSchema.nullable(),
});

export const PaymentGoalAchievementListResponseSchema = z.object({
  ok: z.literal(true),
  items: z.array(PaymentGoalAchievementSchema),
});

export const PaymentGoalAchievementDetailResponseSchema = z.object({
  ok: z.literal(true),
  item: PaymentGoalAchievementSchema,
});

export const PaymentGoalAchievementSummarySchema = PaymentGoalAchievementSchema.pick({
  id: true,
  goalId: true,
  goalName: true,
  targetAmount: true,
  achievedAt: true,
});

export type PaymentReviewGoalAchievement = z.infer<
  typeof PaymentGoalAchievementSchema
>;
export type PaymentGoalAchievementListResponse = z.infer<
  typeof PaymentGoalAchievementListResponseSchema
>;
export type PaymentGoalAchievementDetailResponse = z.infer<
  typeof PaymentGoalAchievementDetailResponseSchema
>;
export type PaymentGoalAchievementSummary = z.infer<
  typeof PaymentGoalAchievementSummarySchema
>;
