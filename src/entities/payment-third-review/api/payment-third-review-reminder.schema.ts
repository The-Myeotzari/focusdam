import { z } from 'zod';

import { PaymentThirdReviewIdSchema } from './payment-third-review-detail.schema';
import { PaymentReviewOutcomeTypeSchema, PaymentReviewStatusSchema } from './payment-third-review-list.schema';

export const PaymentThirdReviewReminderDecisionSchema = z.enum(['buy', 'cancel', 'hold']);

export const CompletePaymentThirdReviewReminderRequestSchema = z.object({
  decision: PaymentThirdReviewReminderDecisionSchema,
  memo: z.string().trim().max(500),
});

export const CompletePaymentThirdReviewReminderResponseSchema = z.object({
  ok: z.literal(true),
  item: z.object({
    reviewId: PaymentThirdReviewIdSchema,
    followUpId: PaymentThirdReviewIdSchema,
    decision: PaymentThirdReviewReminderDecisionSchema,
    status: PaymentReviewStatusSchema,
    outcomeType: PaymentReviewOutcomeTypeSchema,
    completedAt: z.string(),
    nextFollowUpId: PaymentThirdReviewIdSchema.nullable(),
    savingEntryId: PaymentThirdReviewIdSchema.nullable(),
    goalAchievementId: PaymentThirdReviewIdSchema.nullable().optional(),
  }),
});

export type CompletePaymentThirdReviewReminderRequest = z.infer<
  typeof CompletePaymentThirdReviewReminderRequestSchema
>;
export type CompletePaymentThirdReviewReminderResponse = z.infer<
  typeof CompletePaymentThirdReviewReminderResponseSchema
>;
