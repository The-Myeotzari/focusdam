type PaymentReviewGoalImpactInput = {
  amountKrw: number;
  currentSavedAmountKrw: number;
  targetAmountKrw: number;
};

export type PaymentReviewGoalImpact = {
  amountRatio: number;
  currentProgress: number;
  inputAmountKrw: number;
  isGoalAchieved: boolean;
  progressIncrease: number;
  projectedProgress: number;
  projectedSavedAmountKrw: number;
  remainingBeforeAmountKrw: number;
  remainingAmountKrw: number;
  exceededAmountKrw: number;
};

export function calculatePaymentReviewGoalImpact({
  amountKrw,
  currentSavedAmountKrw,
  targetAmountKrw,
}: PaymentReviewGoalImpactInput): PaymentReviewGoalImpact {
  const safeTargetAmount = Math.max(1, targetAmountKrw);
  const safeCurrentAmount = Math.max(0, currentSavedAmountKrw);
  const safeInputAmount = Math.max(0, amountKrw);
  const projectedSavedAmountKrw = safeCurrentAmount + safeInputAmount;
  const currentProgress = clampProgress(
    Math.round((safeCurrentAmount / safeTargetAmount) * 100),
  );
  const projectedProgress = clampProgress(
    Math.round((projectedSavedAmountKrw / safeTargetAmount) * 100),
  );

  return {
    amountRatio: Math.max(0, Math.round((safeInputAmount / safeTargetAmount) * 100)),
    currentProgress,
    inputAmountKrw: safeInputAmount,
    isGoalAchieved: projectedSavedAmountKrw >= safeTargetAmount,
    progressIncrease: Math.max(0, projectedProgress - currentProgress),
    projectedProgress,
    projectedSavedAmountKrw,
    remainingBeforeAmountKrw: Math.max(0, safeTargetAmount - safeCurrentAmount),
    remainingAmountKrw: Math.max(0, safeTargetAmount - projectedSavedAmountKrw),
    exceededAmountKrw: Math.max(0, projectedSavedAmountKrw - safeTargetAmount),
  };
}

function clampProgress(progress: number) {
  return Math.min(100, Math.max(0, progress));
}
