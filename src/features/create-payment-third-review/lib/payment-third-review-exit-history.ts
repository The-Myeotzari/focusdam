const PAYMENT_REVIEW_EXIT_GUARD_BASE_STATE = '__paymentReviewExitGuardBase';
const PAYMENT_REVIEW_EXIT_GUARD_SENTINEL_STATE = '__paymentReviewExitGuardSentinel';

export const PAYMENT_REVIEW_STEP_ONE_PATH = '/payment-third-review/create/step-1';

function hasHistoryStateFlag(state: unknown, flag: string) {
  if (!state || typeof state !== 'object') {
    return false;
  }

  return (state as Record<string, unknown>)[flag] === true;
}

function withHistoryStateFlag(state: unknown, flag: string) {
  return {
    ...(state && typeof state === 'object' ? state : {}),
    [flag]: true,
  };
}

export function createPaymentThirdReviewExitGuardStates(state: unknown) {
  const baseState = withHistoryStateFlag(state, PAYMENT_REVIEW_EXIT_GUARD_BASE_STATE);

  return {
    baseState,
    sentinelState: withHistoryStateFlag(
      baseState,
      PAYMENT_REVIEW_EXIT_GUARD_SENTINEL_STATE,
    ),
  };
}

export function hasPaymentThirdReviewExitGuardState(state: unknown) {
  return (
    hasHistoryStateFlag(state, PAYMENT_REVIEW_EXIT_GUARD_BASE_STATE) ||
    hasHistoryStateFlag(state, PAYMENT_REVIEW_EXIT_GUARD_SENTINEL_STATE)
  );
}

export function isPaymentThirdReviewExitGuardBaseTransition(
  pathname: string,
  state: unknown,
) {
  return (
    pathname === PAYMENT_REVIEW_STEP_ONE_PATH &&
    hasHistoryStateFlag(state, PAYMENT_REVIEW_EXIT_GUARD_BASE_STATE) &&
    !hasHistoryStateFlag(state, PAYMENT_REVIEW_EXIT_GUARD_SENTINEL_STATE)
  );
}
