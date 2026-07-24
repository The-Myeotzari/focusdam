import type { CreatePaymentThirdReviewRequest } from '@/entities/payment-third-review/api/payment-third-review-create.schema';

export type PaymentImpulseStrength = 'low' | 'medium' | 'high';

export type PaymentReviewDecision = 'hold' | 'buy' | 'memo';
export type PaymentNeedTiming = 'now' | 'tomorrow' | 'low';
export type PaymentAlternativeStatus = 'similar' | 'replaceable' | 'none';
export type PaymentSavingTarget = 'goal' | 'reward' | 'benefit';

export type CreatePaymentThirdReviewDraft = {
  itemName: string;
  amount: string;
  impulseStrength: PaymentImpulseStrength | '';
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

// 결제 3심 생성 플로우에서 사용할 새 draft 객체를 생성합니다.
export function createInitialPaymentThirdReviewDraft(): CreatePaymentThirdReviewDraft {
  return {
    itemName: '',
    amount: '',
    impulseStrength: '',
    needTiming: 'tomorrow',
    alternativeStatus: 'similar',
    decision: 'hold',
    reward: '따뜻한 음료',
    satisfactionReminder: true,
    budgetCategory: '생활비',
    buyReason: '',
    savingTarget: 'goal',
  };
}

// 저장된 드래프트를 백엔드 전송용 payload 형태로 정규화합니다.
export function createPaymentThirdReviewPayload(
  draft: CreatePaymentThirdReviewDraft,
): CreatePaymentThirdReviewRequest | null {
  const amount = Number(draft.amount.replace(/[^0-9]/g, ''));

  if (!draft.impulseStrength || !Number.isSafeInteger(amount) || amount <= 0) {
    return null;
  }

  return {
    ...draft,
    amount,
    impulseStrength: draft.impulseStrength,
  };
}
