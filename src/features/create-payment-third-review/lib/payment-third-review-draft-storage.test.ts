import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  clearPaymentThirdReviewDraft,
  isPaymentThirdReviewCreatePath,
  readPaymentThirdReviewDraft,
  savePaymentThirdReviewDraft,
} from './payment-third-review-draft-storage';
import {
  CREATE_PAYMENT_THIRD_REVIEW_DRAFT_STORAGE_KEY,
  createInitialPaymentThirdReviewDraft,
} from '@/features/create-payment-third-review/model/create-payment-third-review.draft';

describe('paymentThirdReviewDraftStorage', () => {
  const values = new Map<string, string>();
  const localStorage = {
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    removeItem: vi.fn((key: string) => values.delete(key)),
    setItem: vi.fn((key: string, value: string) => values.set(key, value)),
  };

  beforeEach(() => {
    values.clear();
    vi.clearAllMocks();
    vi.stubGlobal('window', { localStorage });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('초안을 저장하고 다시 읽는다', () => {
    const draft = {
      ...createInitialPaymentThirdReviewDraft(),
      itemName: '무선 이어폰',
      amount: '280000',
      impulseStrength: 'high' as const,
    };

    savePaymentThirdReviewDraft(draft);

    expect(readPaymentThirdReviewDraft()).toEqual(draft);
  });

  it('생성 플로우 종료 시 저장된 초안을 제거한다', () => {
    values.set(CREATE_PAYMENT_THIRD_REVIEW_DRAFT_STORAGE_KEY, '{}');

    clearPaymentThirdReviewDraft();

    expect(values.has(CREATE_PAYMENT_THIRD_REVIEW_DRAFT_STORAGE_KEY)).toBe(false);
  });

  it('생성 단계 내부 경로와 외부 경로를 구분한다', () => {
    expect(isPaymentThirdReviewCreatePath('/payment-third-review/create/step-1')).toBe(true);
    expect(isPaymentThirdReviewCreatePath('/payment-third-review/create/report')).toBe(true);
    expect(isPaymentThirdReviewCreatePath('/payment-third-review')).toBe(false);
    expect(isPaymentThirdReviewCreatePath('/payment-third-review/list')).toBe(false);
  });
});
