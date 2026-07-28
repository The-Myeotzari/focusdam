export type PaymentReviewSatisfactionStatus = 'scheduled' | 'required' | 'completed';

export type PaymentReviewReminderStatus = 'scheduled' | 'required' | 'completed';

export type PaymentReviewReminderDecision = 'buy' | 'cancel' | 'hold';

export const PAYMENT_REVIEW_OUTCOME_TYPES = ['buy', 'hold', 'save'] as const;

export type PaymentReviewOutcomeType = (typeof PAYMENT_REVIEW_OUTCOME_TYPES)[number];

export type PaymentReviewReminderCompletedType = 'after-first-hold' | 'after-rehold';

export type PaymentReviewStatus =
  | 'buy_satisfaction_scheduled'
  | 'buy_satisfaction_required'
  | 'buy_satisfaction_completed'
  | 'save_completed'
  | 'hold_reminder_scheduled'
  | 'hold_reminder_required'
  | 'hold_after_buy'
  | 'hold_after_save'
  | 'hold_after_hold_scheduled'
  | 'rehold_reminder_scheduled'
  | 'rehold_reminder_required'
  | 'rehold_after_buy'
  | 'rehold_after_save'
  | 'rehold_after_hold_scheduled';

export type PaymentReviewReminderResult = {
  completedType: PaymentReviewReminderCompletedType;
  decision: PaymentReviewReminderDecision;
  memo: string;
  submittedAt: string;
};

export type PaymentReviewSatisfactionResult = {
  checkedAt: string;
  memo: string;
  score: number;
  summary: string;
};

export type PaymentReviewHistoryItem = {
  id: string;
  itemName: string;
  date: string;
  amount: string;
  impulseStrength: '낮음' | '보통' | '높음';
  decision: '24시간 보류' | '취소하고 목표에 저축' | '그래도 결제';
  decisionType: 'hold' | 'save' | 'buy';
  outcomeType: PaymentReviewOutcomeType;
  reason: string;
  followUpLabel: string;
  followUpType: 'reminder' | 'satisfaction' | 'saved';
  progressLabel: string;
  savedAmount?: number;
  budgetImpactLabel: string;
  status: PaymentReviewStatus;
  satisfaction?: {
    status: PaymentReviewSatisfactionStatus;
    result?: PaymentReviewSatisfactionResult;
  };
  reminder?: {
    reminderCount: number;
    status: PaymentReviewReminderStatus;
    result?: PaymentReviewReminderResult;
  };
};
