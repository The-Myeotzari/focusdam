import { Api } from '@/shared/lib/api/api';
import {
  CompletePaymentThirdReviewSatisfactionResponseSchema,
  type CompletePaymentThirdReviewSatisfactionRequest,
  type CompletePaymentThirdReviewSatisfactionResponse,
} from './payment-third-review-satisfaction.schema';

export function completePaymentThirdReviewSatisfactionClient(
  id: string,
  input: CompletePaymentThirdReviewSatisfactionRequest,
): Promise<CompletePaymentThirdReviewSatisfactionResponse> {
  return Api.patch(
    `/payment-third-reviews/${encodeURIComponent(id)}/satisfaction`,
    CompletePaymentThirdReviewSatisfactionResponseSchema,
    {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    },
  );
}
