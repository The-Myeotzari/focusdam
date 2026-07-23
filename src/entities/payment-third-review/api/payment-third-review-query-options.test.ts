import { describe, expect, it } from 'vitest';

import {
  PAYMENT_THIRD_REVIEW_LIST_PAGE_SIZE,
  PAYMENT_THIRD_REVIEW_STALE_TIME,
  paymentThirdReviewDetailQueryOptions,
  paymentThirdReviewListInfiniteQueryOptions,
} from './payment-third-review-query-options';

describe('paymentThirdReviewDetailQueryOptions', () => {
  it('상세 화면과 서버 hydration이 동일한 쿼리 키와 캐시 시간을 사용한다', () => {
    const options = paymentThirdReviewDetailQueryOptions('review-1');

    expect(options.queryKey).toEqual(['payment-third-reviews', 'detail', 'review-1']);
    expect(options.staleTime).toBe(PAYMENT_THIRD_REVIEW_STALE_TIME);
  });
});

describe('paymentThirdReviewListInfiniteQueryOptions', () => {
  it('첫 페이지와 다음 페이지를 같은 페이지 크기로 조회하도록 설정한다', () => {
    const options = paymentThirdReviewListInfiniteQueryOptions('all');

    expect(options.queryKey).toEqual(['payment-third-reviews', 'list', 'all']);
    expect(options.initialPageParam).toBe(1);
    expect(options.staleTime).toBe(PAYMENT_THIRD_REVIEW_STALE_TIME);
    expect(PAYMENT_THIRD_REVIEW_LIST_PAGE_SIZE).toBe(6);
    expect(
      options.getNextPageParam?.(
        {
          ok: true,
          items: [],
          pagination: { page: 1, size: 6, totalElements: 12, totalPages: 2 },
        },
        [],
        1,
        [],
      ),
    ).toBe(2);
    expect(
      options.getNextPageParam?.(
        {
          ok: true,
          items: [],
          pagination: { page: 2, size: 6, totalElements: 12, totalPages: 2 },
        },
        [],
        2,
        [],
      ),
    ).toBeUndefined();
  });
});
