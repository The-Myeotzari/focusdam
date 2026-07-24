import {
  CreatePaymentThirdReviewResponseSchema,
  type CreatePaymentThirdReviewRequest,
} from './payment-third-review-create.schema';
import { Api } from '@/shared/lib/api/api';

export function createPaymentThirdReviewClient(input: CreatePaymentThirdReviewRequest) {
  return Api.post('/payment-third-reviews', CreatePaymentThirdReviewResponseSchema, {
    body: JSON.stringify(input),
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
}
