import { z } from 'zod';

import { PaymentThirdReviewIdSchema } from './payment-third-review-detail.schema';

export const PaymentSavingGoalSchema = z.object({
  id: PaymentThirdReviewIdSchema,
  name: z.string(),
  currentSavedAmountKrw: z.number().int().nonnegative(),
  targetAmountKrw: z.number().int().positive(),
});

export const ActivePaymentSavingGoalResponseSchema = z.object({
  ok: z.literal(true),
  item: PaymentSavingGoalSchema.nullable(),
});

export const SavePaymentSavingGoalRequestSchema = z.object({
  name: z.string().trim().min(1, '목표 이름을 입력해주세요.').max(40),
  targetAmountKrw: z.number().int().min(1000, '목표 금액은 1,000원 이상이어야 합니다.').max(1_000_000_000),
});

export const SavePaymentSavingGoalResponseSchema = z.object({
  ok: z.literal(true),
  item: PaymentSavingGoalSchema,
});

export type PaymentSavingGoal = z.infer<typeof PaymentSavingGoalSchema>;
export type ActivePaymentSavingGoalResponse = z.infer<
  typeof ActivePaymentSavingGoalResponseSchema
>;
export type SavePaymentSavingGoalRequest = z.infer<
  typeof SavePaymentSavingGoalRequestSchema
>;
export type SavePaymentSavingGoalResponse = z.infer<
  typeof SavePaymentSavingGoalResponseSchema
>;
