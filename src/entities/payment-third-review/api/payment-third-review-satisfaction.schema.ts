import { z } from 'zod';

import { PaymentThirdReviewIdSchema } from './payment-third-review-detail.schema';

export const CompletePaymentThirdReviewSatisfactionRequestSchema = z.object({
  score: z.number().int().min(1).max(5),
  summary: z.string().trim().min(1).max(30),
  memo: z.string().trim().max(500),
});

export const CompletePaymentThirdReviewSatisfactionResponseSchema = z.object({
  ok: z.literal(true),
  item: z.object({
    reviewId: PaymentThirdReviewIdSchema,
    followUpId: PaymentThirdReviewIdSchema,
    status: z.literal('completed'),
    score: z.number().int().min(1).max(5),
    summary: z.string(),
    memo: z.string(),
    completedAt: z.string(),
  }),
});

export type CompletePaymentThirdReviewSatisfactionRequest = z.infer<
  typeof CompletePaymentThirdReviewSatisfactionRequestSchema
>;
export type CompletePaymentThirdReviewSatisfactionResponse = z.infer<
  typeof CompletePaymentThirdReviewSatisfactionResponseSchema
>;
