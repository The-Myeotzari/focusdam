import { describe, expect, it } from 'vitest';

import {
  PAYMENT_REVIEW_STEP_ONE_PATH,
  createPaymentThirdReviewExitGuardStates,
  hasPaymentThirdReviewExitGuardState,
  isPaymentThirdReviewExitGuardBaseTransition,
} from './payment-third-review-exit-history';

describe('payment third review exit history', () => {
  it('기존 Next.js history 상태를 보존하며 보호 항목을 만든다', () => {
    const states = createPaymentThirdReviewExitGuardStates({ __NA: true, key: 'next' });

    expect(states.baseState).toMatchObject({ __NA: true, key: 'next' });
    expect(states.sentinelState).toMatchObject({ __NA: true, key: 'next' });
    expect(hasPaymentThirdReviewExitGuardState(states.baseState)).toBe(true);
    expect(hasPaymentThirdReviewExitGuardState(states.sentinelState)).toBe(true);
  });

  it('첫 단계에서 sentinel 이전 base 항목에 도달했을 때만 이탈로 판단한다', () => {
    const { baseState, sentinelState } = createPaymentThirdReviewExitGuardStates({});

    expect(
      isPaymentThirdReviewExitGuardBaseTransition(PAYMENT_REVIEW_STEP_ONE_PATH, baseState),
    ).toBe(true);
    expect(
      isPaymentThirdReviewExitGuardBaseTransition(
        PAYMENT_REVIEW_STEP_ONE_PATH,
        sentinelState,
      ),
    ).toBe(false);
    expect(
      isPaymentThirdReviewExitGuardBaseTransition(
        '/payment-third-review/create/step-2',
        baseState,
      ),
    ).toBe(false);
  });
});
