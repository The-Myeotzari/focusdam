export type PaymentReviewSatisfactionStatus = 'scheduled' | 'required' | 'completed';

export type PaymentReviewReminderStatus = 'scheduled' | 'required' | 'completed';

export type PaymentReviewReminderDecision = 'buy' | 'cancel' | 'hold';

export type PaymentReviewReminderCompletedType = 'default' | 'after-hold';

export type PaymentReviewReminderResult = {
  completedType: PaymentReviewReminderCompletedType;
  decision: PaymentReviewReminderDecision;
  memo: string;
  reminderCount: number;
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
  reason: string;
  followUpLabel: string;
  followUpType: 'reminder' | 'satisfaction' | 'saved';
  progressLabel: string;
  budgetImpactLabel: string;
  satisfaction?: {
    status: PaymentReviewSatisfactionStatus;
    result?: PaymentReviewSatisfactionResult;
  };
  reminder?: {
    status: PaymentReviewReminderStatus;
    result?: PaymentReviewReminderResult;
  };
};
