export type PaymentThirdReviewListFilter = 'all' | 'save' | 'buy' | 'hold';

const PAYMENT_THIRD_REVIEW_LIST_FILTERS = new Set<PaymentThirdReviewListFilter>([
  'all',
  'save',
  'buy',
  'hold',
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
