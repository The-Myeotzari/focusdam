import { describe, expect, it } from 'vitest';

import {
  getPaymentThirdReviewListHref,
  parsePaymentThirdReviewListFilter,
} from './payment-third-review-list-filter';

describe('paymentThirdReviewListFilter', () => {
  it('지원하는 필터 값을 그대로 사용한다', () => {
    expect(parsePaymentThirdReviewListFilter('buy')).toBe('buy');
    expect(parsePaymentThirdReviewListFilter(['hold'])).toBe('hold');
  });

  it('필터가 없거나 올바르지 않으면 전체로 초기화한다', () => {
    expect(parsePaymentThirdReviewListFilter(undefined)).toBe('all');
    expect(parsePaymentThirdReviewListFilter('unknown')).toBe('all');
  });

  it('전체를 제외한 필터를 목록 주소에 포함한다', () => {
    expect(getPaymentThirdReviewListHref('all')).toBe('/payment-third-review/list');
    expect(getPaymentThirdReviewListHref('buy')).toBe('/payment-third-review/list?filter=buy');
  });
});
