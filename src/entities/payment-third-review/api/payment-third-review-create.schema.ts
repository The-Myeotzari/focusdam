import { z } from 'zod';

import {
  PaymentReviewOutcomeTypeSchema,
  PaymentReviewStatusSchema,
} from './payment-third-review-list.schema';
import { PaymentThirdReviewIdSchema } from './payment-third-review-detail.schema';

export const CreatePaymentThirdReviewRequestSchema = z.object({
  itemName: z.string().trim().min(1, '품목명을 입력해주세요.').max(100),
  amount: z.number().int().positive('금액은 1원 이상이어야 합니다.').max(1_000_000_000),
  impulseStrength: z.enum(['low', 'medium', 'high']),
  needTiming: z.enum(['now', 'tomorrow', 'low']),
  alternativeStatus: z.enum(['similar', 'replaceable', 'none']),
  decision: z.enum(['hold', 'buy', 'memo']),
  reward: z.string().trim().max(100),
  satisfactionReminder: z.boolean(),
  budgetCategory: z.string().trim().max(50),
  buyReason: z.string().trim().max(500),
  savingTarget: z.enum(['goal', 'reward', 'benefit']),
});

export const CreatePaymentThirdReviewResponseSchema = z.object({
  ok: z.literal(true),
  item: z.object({
    id: PaymentThirdReviewIdSchema,
    status: PaymentReviewStatusSchema,
    outcomeType: PaymentReviewOutcomeTypeSchema,
    followUpId: PaymentThirdReviewIdSchema.nullable(),
    goalId: PaymentThirdReviewIdSchema.nullable(),
    savingEntryId: PaymentThirdReviewIdSchema.nullable(),
    goalAchievementId: PaymentThirdReviewIdSchema.nullable().optional(),
  }),
});

export type CreatePaymentThirdReviewRequest = z.infer<
  typeof CreatePaymentThirdReviewRequestSchema
>;
export type CreatePaymentThirdReviewResponse = z.infer<
  typeof CreatePaymentThirdReviewResponseSchema
>;
