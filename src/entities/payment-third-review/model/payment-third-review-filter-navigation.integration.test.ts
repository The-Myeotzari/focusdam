import { describe, expect, it } from 'vitest';

import {
  getPaymentThirdReviewDetailHref,
  getPaymentThirdReviewListHref,
  parsePaymentThirdReviewListFilter,
  type PaymentThirdReviewListFilter,
  withPaymentThirdReviewListFilter,
} from './payment-third-review-list-filter';

const REVIEW_ID = 'review-id';

function readFilterFromHref(href: string): PaymentThirdReviewListFilter {
  const url = new URL(href, 'https://focusdam.test');
  return parsePaymentThirdReviewListFilter(url.searchParams.get('filter') ?? undefined);
}

describe('결제 3심 필터 이동 경로', () => {
  it('목록에서 상세와 만족도 화면을 거쳐도 선택한 필터를 유지한다', () => {
    const listHref = getPaymentThirdReviewListHref('buy');
    const filter = readFilterFromHref(listHref);
    const detailHref = getPaymentThirdReviewDetailHref(REVIEW_ID, filter);
    const satisfactionHref = withPaymentThirdReviewListFilter(
      `/payment-third-review/satisfaction-check/${REVIEW_ID}`,
      readFilterFromHref(detailHref),
    );
    const returnListHref = getPaymentThirdReviewListHref(
      readFilterFromHref(satisfactionHref),
    );

    expect(detailHref).toBe('/payment-third-review/list/review-id?filter=buy');
    expect(satisfactionHref).toBe(
      '/payment-third-review/satisfaction-check/review-id?filter=buy',
    );
    expect(returnListHref).toBe('/payment-third-review/list?filter=buy');
  });

  it('목록에서 상세와 리마인드 결과 화면을 거쳐도 선택한 필터를 유지한다', () => {
    const detailHref = getPaymentThirdReviewDetailHref(REVIEW_ID, 'hold');
    const reminderHref = withPaymentThirdReviewListFilter(
      `/payment-third-review/reminder/${REVIEW_ID}`,
      readFilterFromHref(detailHref),
    );
    const reminderResultHref = withPaymentThirdReviewListFilter(
      `/payment-third-review/reminder/${REVIEW_ID}/result/hold`,
      readFilterFromHref(reminderHref),
    );
    const returnListHref = getPaymentThirdReviewListHref(
      readFilterFromHref(reminderResultHref),
    );

    expect(reminderHref).toBe('/payment-third-review/reminder/review-id?filter=hold');
    expect(reminderResultHref).toBe(
      '/payment-third-review/reminder/review-id/result/hold?filter=hold',
    );
    expect(returnListHref).toBe('/payment-third-review/list?filter=hold');
  });

  it('홈에서 필터 없이 진입하면 전체 필터로 초기화한다', () => {
    const filter = readFilterFromHref('/payment-third-review/list');

    expect(filter).toBe('all');
    expect(getPaymentThirdReviewDetailHref(REVIEW_ID, filter)).toBe(
      '/payment-third-review/list/review-id',
    );
  });
});
