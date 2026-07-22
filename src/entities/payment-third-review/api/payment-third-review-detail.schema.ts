import { z } from 'zod';

import {
  PaymentReviewOutcomeTypeSchema,
  PaymentReviewStatusSchema,
} from '@/entities/payment-third-review/api/payment-third-review-list.schema';

export const PaymentThirdReviewIdSchema = z.string().regex(
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  '올바른 결제 3심 ID가 아닙니다.',
);

export const PaymentThirdReviewDetailSchema = z.object({
  id: PaymentThirdReviewIdSchema,
  itemName: z.string(),
  amountKrw: z.number().int().nonnegative(),
  impulseStrength: z.enum(['low', 'medium', 'high']),
  initialDecision: z.enum(['hold', 'buy', 'save']),
  outcomeType: PaymentReviewOutcomeTypeSchema,
  status: PaymentReviewStatusSchema,
  reason: z.string().nullable(),
  buyReason: z.string().nullable(),
  createdAt: z.string(),
  decidedAt: z.string(),
  goal: z
    .object({
      id: PaymentThirdReviewIdSchema,
      name: z.string(),
      currentSavedAmountKrw: z.number().int().nonnegative(),
      targetAmountKrw: z.number().int().positive(),
    })
    .nullable(),
  followUps: z.array(
    z.object({
      id: PaymentThirdReviewIdSchema,
      type: z.enum(['reminder', 'satisfaction']),
      sequence: z.number().int().positive(),
      status: z.enum(['scheduled', 'required', 'completed', 'canceled']),
      scheduledAt: z.string(),
      completedAt: z.string().nullable(),
      reminderDecision: z.enum(['buy', 'cancel', 'hold']).nullable(),
      satisfactionScore: z.number().int().min(1).max(5).nullable(),
      summary: z.string().nullable(),
      memo: z.string().nullable(),
    }),
  ),
});

export const PaymentThirdReviewDetailResponseSchema = z.object({
  ok: z.literal(true),
  item: PaymentThirdReviewDetailSchema,
});

export type PaymentThirdReviewDetail = z.infer<typeof PaymentThirdReviewDetailSchema>;
export type PaymentThirdReviewDetailResponse = z.infer<
  typeof PaymentThirdReviewDetailResponseSchema
>;
