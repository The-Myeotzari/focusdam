export type PaymentImpulseStrength = 'low' | 'medium' | 'high';

export type PaymentReviewDecision = 'hold' | 'buy' | 'memo';
export type PaymentNeedTiming = 'now' | 'tomorrow' | 'low';
export type PaymentAlternativeStatus = 'similar' | 'replaceable' | 'none';
export type PaymentSavingTarget = 'goal' | 'reward' | 'benefit';

export type CreatePaymentThirdReviewDraft = {
  itemName: string;
  amount: string;
  impulseStrength: PaymentImpulseStrength;
  needTiming: PaymentNeedTiming;
  alternativeStatus: PaymentAlternativeStatus;
  decision: PaymentReviewDecision;
  reward: string;
  satisfactionReminder: boolean;
  budgetCategory: string;
  buyReason: string;
  savingTarget: PaymentSavingTarget;
};

export type CreatePaymentThirdReviewDraftUpdater = (
  nextDraft: Partial<CreatePaymentThirdReviewDraft>,
) => void;

export const CREATE_PAYMENT_THIRD_REVIEW_DRAFT_STORAGE_KEY =
  'focusdam:create-payment-third-review-draft';

export const DEFAULT_CREATE_PAYMENT_THIRD_REVIEW_DRAFT: CreatePaymentThirdReviewDraft = {
  itemName: '무선 이어폰',
  amount: '62000',
  impulseStrength: 'high',
  needTiming: 'tomorrow',
  alternativeStatus: 'similar',
  decision: 'hold',
  reward: '따뜻한 음료',
  satisfactionReminder: true,
  budgetCategory: '생활비',
  buyReason: '',
  savingTarget: 'goal',
};

// 저장된 드래프트를 백엔드 전송용 payload 형태로 정규화합니다.
export function createPaymentThirdReviewPayload(draft: CreatePaymentThirdReviewDraft) {
  return {
    ...draft,
    amount: Number(draft.amount.replace(/[^0-9]/g, '')),
  };
}
