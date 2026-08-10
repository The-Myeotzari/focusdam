import { describe, expect, it } from 'vitest';

import { getPaymentThirdReviewSubmitErrorMessage } from './payment-third-review-submit-error';
import { ApiRequestError } from '@/shared/lib/api/api';

function createApiError(status: number, detail = '요청을 처리할 수 없어요.') {
  return new ApiRequestError({
    detail,
    path: '/api/payment-third-reviews',
    status,
    timestamp: '2026-08-10T00:00:00.000Z',
    title: 'TEST_ERROR',
    type: 'about:blank',
  });
}

describe('getPaymentThirdReviewSubmitErrorMessage', () => {
  it('인증·충돌·검증 오류를 사용자가 대응할 수 있는 문구로 변환한다', () => {
    expect(getPaymentThirdReviewSubmitErrorMessage(createApiError(401), 'create')).toBe(
      '로그인이 만료됐어요. 다시 로그인한 뒤 시도해주세요.',
    );
    expect(getPaymentThirdReviewSubmitErrorMessage(createApiError(409, '이미 처리됐어요.'), 'reminder')).toBe(
      '이미 처리됐어요. 최신 상태를 다시 확인해주세요.',
    );
    expect(getPaymentThirdReviewSubmitErrorMessage(createApiError(422, '금액이 올바르지 않아요.'), 'goal')).toBe(
      '금액이 올바르지 않아요.',
    );
  });

  it('요청 과다와 서버 오류에 안전한 공통 문구를 제공한다', () => {
    expect(getPaymentThirdReviewSubmitErrorMessage(createApiError(429), 'satisfaction')).toBe(
      '요청이 많아요. 잠시 기다린 뒤 다시 시도해주세요.',
    );
    expect(getPaymentThirdReviewSubmitErrorMessage(createApiError(500, 'DB 오류'), 'goal')).toBe(
      '목표를 저장하지 못했어요. 잠시 후 다시 시도해주세요.',
    );
  });

  it('오류가 없으면 메시지를 표시하지 않는다', () => {
    expect(getPaymentThirdReviewSubmitErrorMessage(null, 'create')).toBeNull();
  });
});
