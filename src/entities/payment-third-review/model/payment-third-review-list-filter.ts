import {
  PAYMENT_REVIEW_OUTCOME_TYPES,
  type PaymentReviewOutcomeType,
} from './payment-third-review.types';

export type PaymentThirdReviewListFilter = 'all' | PaymentReviewOutcomeType;

const PAYMENT_THIRD_REVIEW_LIST_FILTERS = new Set<PaymentThirdReviewListFilter>([
  'all',
  ...PAYMENT_REVIEW_OUTCOME_TYPES,
]);

export function parsePaymentThirdReviewListFilter(
  value: string | string[] | undefined,
): PaymentThirdReviewListFilter {
  const candidate = Array.isArray(value) ? value[0] : value;

  return candidate && PAYMENT_THIRD_REVIEW_LIST_FILTERS.has(candidate as PaymentThirdReviewListFilter)
    ? (candidate as PaymentThirdReviewListFilter)
    : 'all';
}

export function getPaymentThirdReviewListHref(filter: PaymentThirdReviewListFilter) {
  return filter === 'all'
    ? '/payment-third-review/list'
    : `/payment-third-review/list?filter=${filter}`;
}

export function withPaymentThirdReviewListFilter(
  href: string,
  filter: PaymentThirdReviewListFilter,
) {
  if (filter === 'all') {
    return href;
  }

  const separator = href.includes('?') ? '&' : '?';
  return `${href}${separator}filter=${filter}`;
}

export function getPaymentThirdReviewDetailHref(
  id: string,
  filter: PaymentThirdReviewListFilter,
) {
  return withPaymentThirdReviewListFilter(`/payment-third-review/list/${id}`, filter);
}
