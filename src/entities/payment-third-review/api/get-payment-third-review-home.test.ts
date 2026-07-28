import { describe, expect, it } from 'vitest';

import { createPaymentThirdReviewHomeStats } from './get-payment-third-review-home';

describe('createPaymentThirdReviewHomeStats', () => {
  it('판단 유형별 건수와 저축으로 바꾼 금액을 집계한다', () => {
    expect(
      createPaymentThirdReviewHomeStats([
        { amount_krw: 12000, outcome_type: 'buy' },
        { amount_krw: 86000, outcome_type: 'save' },
        { amount_krw: 24000, outcome_type: 'hold' },
        { amount_krw: 14000, outcome_type: 'save' },
      ]),
    ).toEqual({
      totalCount: 4,
      buyCount: 1,
      saveCount: 2,
      holdCount: 1,
      savedAmountKrw: 100000,
    });
  });

  it('내역이 없으면 모든 집계값을 0으로 반환한다', () => {
    expect(createPaymentThirdReviewHomeStats([])).toEqual({
      totalCount: 0,
      buyCount: 0,
      saveCount: 0,
      holdCount: 0,
      savedAmountKrw: 0,
    });
  });
});
