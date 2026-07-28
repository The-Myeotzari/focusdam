import { PaymentThirdReviewHomeResponseSchema } from './payment-third-review-home.schema';
import { Api } from '@/shared/lib/api/api';

export function getPaymentThirdReviewHomeClient() {
  return Api.get('/payment-third-reviews/home', PaymentThirdReviewHomeResponseSchema, {
    credentials: 'include',
  });
}
