import {
  PaymentThirdReviewDetailResponseSchema,
  type PaymentThirdReviewDetailResponse,
} from './payment-third-review-detail.schema';
import { Api } from '@/shared/lib/api/api';

export function getPaymentThirdReviewDetailClient(
  id: string,
): Promise<PaymentThirdReviewDetailResponse> {
  return Api.get(
    `/payment-third-reviews/${encodeURIComponent(id)}`,
    PaymentThirdReviewDetailResponseSchema,
    { credentials: 'include' },
  );
}
