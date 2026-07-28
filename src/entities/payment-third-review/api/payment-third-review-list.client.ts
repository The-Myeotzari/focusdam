import {
  PaymentThirdReviewListResponseSchema,
  type PaymentThirdReviewListQuery,
} from '@/entities/payment-third-review/api/payment-third-review-list.schema';
import { Api } from '@/shared/lib/api/api';

export async function getPaymentThirdReviewListClient({
  outcomeType,
  page,
  size,
}: PaymentThirdReviewListQuery) {
  const searchParams = new URLSearchParams({
    page: String(page),
    size: String(size),
  });

  if (outcomeType) {
    searchParams.set('outcomeType', outcomeType);
  }

  return Api.get(
    `/payment-third-reviews?${searchParams.toString()}`,
    PaymentThirdReviewListResponseSchema,
    { credentials: 'include' },
  );
}
