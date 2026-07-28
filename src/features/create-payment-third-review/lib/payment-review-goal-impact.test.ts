import { describe, expect, it } from 'vitest';

import { calculatePaymentReviewGoalImpact } from './payment-review-goal-impact';

describe('calculatePaymentReviewGoalImpact', () => {
  it('입력 금액을 저축했을 때 예상 달성도와 남은 금액을 계산한다', () => {
    const impact = calculatePaymentReviewGoalImpact({
      amountKrw: 280000,
      currentSavedAmountKrw: 580000,
      targetAmountKrw: 1000000,
    });

    expect(impact).toEqual({
      amountRatio: 28,
      currentProgress: 58,
      inputAmountKrw: 280000,
      isGoalAchieved: false,
      progressIncrease: 28,
      projectedProgress: 86,
      projectedSavedAmountKrw: 860000,
      remainingBeforeAmountKrw: 420000,
      remainingAmountKrw: 140000,
      exceededAmountKrw: 0,
    });
  });

  it('예상 금액이 목표를 넘으면 달성도를 100%로 제한하고 초과 금액을 계산한다', () => {
    const impact = calculatePaymentReviewGoalImpact({
      amountKrw: 280000,
      currentSavedAmountKrw: 900000,
      targetAmountKrw: 1000000,
    });

    expect(impact.projectedProgress).toBe(100);
    expect(impact.progressIncrease).toBe(10);
    expect(impact.isGoalAchieved).toBe(true);
    expect(impact.exceededAmountKrw).toBe(180000);
    expect(impact.remainingAmountKrw).toBe(0);
  });
});
