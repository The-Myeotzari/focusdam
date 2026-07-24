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

export type PaymentSavingGoal = z.infer<typeof PaymentSavingGoalSchema>;
export type ActivePaymentSavingGoalResponse = z.infer<
  typeof ActivePaymentSavingGoalResponseSchema
>;
