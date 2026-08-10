import { describe, expect, it } from 'vitest';

import { getPaymentThirdReviewLoadErrorActionLabel } from './payment-third-review-load-error';

describe('getPaymentThirdReviewLoadErrorActionLabel', () => {
  it('재조회 중에는 진행 상태를 안내한다', () => {
    expect(getPaymentThirdReviewLoadErrorActionLabel(true)).toBe('불러오는 중...');
  });

  it('대기 중에는 화면별 라벨 또는 기본 재조회 라벨을 반환한다', () => {
    expect(getPaymentThirdReviewLoadErrorActionLabel(false)).toBe('다시 불러오기');
    expect(getPaymentThirdReviewLoadErrorActionLabel(false, '다시 확인')).toBe('다시 확인');
  });
});
