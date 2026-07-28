import { Api } from '@/shared/lib/api/api';
import {
  CompletePaymentThirdReviewReminderResponseSchema,
  type CompletePaymentThirdReviewReminderRequest,
  type CompletePaymentThirdReviewReminderResponse,
} from './payment-third-review-reminder.schema';

export function completePaymentThirdReviewReminderClient(
  id: string,
  input: CompletePaymentThirdReviewReminderRequest,
): Promise<CompletePaymentThirdReviewReminderResponse> {
  return Api.patch(
    `/payment-third-reviews/${encodeURIComponent(id)}/reminder`,
    CompletePaymentThirdReviewReminderResponseSchema,
    {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    },
  );
}
