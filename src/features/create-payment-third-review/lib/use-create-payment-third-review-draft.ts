'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import {
  CREATE_PAYMENT_THIRD_REVIEW_DRAFT_STORAGE_KEY,
  createInitialPaymentThirdReviewDraft,
  type CreatePaymentThirdReviewDraft,
  type CreatePaymentThirdReviewDraftUpdater,
} from '@/features/create-payment-third-review/model/create-payment-third-review.draft';

// 결제 3심 생성 과정의 임시 입력값을 localStorage와 동기화합니다.
export function useCreatePaymentThirdReviewDraft() {
  const [draft, setDraft] = useState<CreatePaymentThirdReviewDraft>(
    createInitialPaymentThirdReviewDraft,
  );
  const [isHydrated, setIsHydrated] = useState(false);
  const skipNextPersistenceRef = useRef(false);

  useEffect(() => {
    const storedDraft = window.localStorage.getItem(CREATE_PAYMENT_THIRD_REVIEW_DRAFT_STORAGE_KEY);

    if (storedDraft) {
      try {
        setDraft({ ...createInitialPaymentThirdReviewDraft(), ...JSON.parse(storedDraft) });
      } catch {
        window.localStorage.removeItem(CREATE_PAYMENT_THIRD_REVIEW_DRAFT_STORAGE_KEY);
      }
    }

    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (skipNextPersistenceRef.current) {
      skipNextPersistenceRef.current = false;
      return;
    }

    window.localStorage.setItem(
      CREATE_PAYMENT_THIRD_REVIEW_DRAFT_STORAGE_KEY,
      JSON.stringify(draft),
    );
  }, [draft, isHydrated]);

  // 현재 드래프트에 변경된 필드만 병합합니다.
  const updateDraft: CreatePaymentThirdReviewDraftUpdater = useCallback((nextDraft) => {
    setDraft((currentDraft) => ({ ...currentDraft, ...nextDraft }));
  }, []);

  // 생성 플로우가 끝난 뒤 드래프트와 저장소 값을 초기화합니다.
  const resetDraft = useCallback(() => {
    skipNextPersistenceRef.current = true;
    setDraft(createInitialPaymentThirdReviewDraft());
    window.localStorage.removeItem(CREATE_PAYMENT_THIRD_REVIEW_DRAFT_STORAGE_KEY);
  }, []);

  return { draft, isHydrated, resetDraft, updateDraft };
}
