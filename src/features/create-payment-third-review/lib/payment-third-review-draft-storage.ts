import {
  CREATE_PAYMENT_THIRD_REVIEW_DRAFT_STORAGE_KEY,
  createInitialPaymentThirdReviewDraft,
  type CreatePaymentThirdReviewDraft,
} from '@/features/create-payment-third-review/model/create-payment-third-review.draft';

const CREATE_PAYMENT_THIRD_REVIEW_PATH = '/payment-third-review/create';

export function readPaymentThirdReviewDraft() {
  const storedDraft = window.localStorage.getItem(
    CREATE_PAYMENT_THIRD_REVIEW_DRAFT_STORAGE_KEY,
  );

  if (!storedDraft) {
    return createInitialPaymentThirdReviewDraft();
  }

  try {
    return {
      ...createInitialPaymentThirdReviewDraft(),
      ...(JSON.parse(storedDraft) as Partial<CreatePaymentThirdReviewDraft>),
    };
  } catch {
    clearPaymentThirdReviewDraft();
    return createInitialPaymentThirdReviewDraft();
  }
}

export function savePaymentThirdReviewDraft(draft: CreatePaymentThirdReviewDraft) {
  window.localStorage.setItem(
    CREATE_PAYMENT_THIRD_REVIEW_DRAFT_STORAGE_KEY,
    JSON.stringify(draft),
  );
}

export function clearPaymentThirdReviewDraft() {
  window.localStorage.removeItem(CREATE_PAYMENT_THIRD_REVIEW_DRAFT_STORAGE_KEY);
}

export function hasPaymentThirdReviewDraftInput(draft: CreatePaymentThirdReviewDraft) {
  return Boolean(
    draft.itemName.trim() ||
      draft.amount.trim() ||
      draft.impulseStrength ||
      draft.buyReason.trim(),
  );
}

export function isPaymentThirdReviewCreatePath(pathname: string) {
  return (
    pathname === CREATE_PAYMENT_THIRD_REVIEW_PATH ||
    pathname.startsWith(`${CREATE_PAYMENT_THIRD_REVIEW_PATH}/`)
  );
}
