import { z } from 'zod';

import { PAYMENT_REVIEW_OUTCOME_TYPES } from '@/entities/payment-third-review/model/payment-third-review.types';
import { PaginationMetaSchema, PaginationQuerySchema } from '@/shared/lib/api/pagination';

const PaymentThirdReviewDatabaseIdSchema = z.string().regex(
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  '올바른 결제 3심 ID가 아닙니다.',
);

export const PaymentReviewOutcomeTypeSchema = z.enum(PAYMENT_REVIEW_OUTCOME_TYPES);

export const PaymentReviewStatusSchema = z.enum([
  'buy_satisfaction_scheduled',
  'buy_satisfaction_required',
  'buy_satisfaction_completed',
  'save_completed',
  'hold_reminder_scheduled',
  'hold_reminder_required',
  'hold_after_buy',
  'hold_after_save',
  'hold_after_hold_scheduled',
  'rehold_reminder_scheduled',
  'rehold_reminder_required',
  'rehold_after_buy',
  'rehold_after_save',
  'rehold_after_hold_scheduled',
]);

export const PaymentThirdReviewListQuerySchema = PaginationQuerySchema.extend({
  outcomeType: PaymentReviewOutcomeTypeSchema.optional(),
});

export const PaymentThirdReviewListItemSchema = z.object({
  id: PaymentThirdReviewDatabaseIdSchema,
  itemName: z.string(),
  amountKrw: z.number().int().nonnegative(),
  impulseStrength: z.enum(['low', 'medium', 'high']),
  outcomeType: PaymentReviewOutcomeTypeSchema,
  status: PaymentReviewStatusSchema,
  createdAt: z.string(),
  followUp: z
    .object({
      id: PaymentThirdReviewDatabaseIdSchema,
      type: z.enum(['reminder', 'satisfaction']),
      sequence: z.number().int().positive(),
      status: z.enum(['scheduled', 'required', 'completed', 'canceled']),
      scheduledAt: z.string(),
      completedAt: z.string().nullable(),
      reminderDecision: z.enum(['buy', 'cancel', 'hold']).nullable(),
      satisfactionScore: z.number().int().min(1).max(5).nullable(),
      summary: z.string().nullable(),
    })
    .nullable(),
});

export const PaymentThirdReviewListResponseSchema = z.object({
  ok: z.literal(true),
  items: z.array(PaymentThirdReviewListItemSchema),
  pagination: PaginationMetaSchema,
});

export type PaymentThirdReviewListQuery = z.infer<typeof PaymentThirdReviewListQuerySchema>;
export type PaymentThirdReviewListItem = z.infer<typeof PaymentThirdReviewListItemSchema>;
export type PaymentThirdReviewListResponse = z.infer<
  typeof PaymentThirdReviewListResponseSchema
>;
