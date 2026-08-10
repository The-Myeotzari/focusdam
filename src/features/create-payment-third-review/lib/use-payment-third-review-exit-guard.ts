'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';

import {
  clearPaymentThirdReviewDraft,
  hasPaymentThirdReviewDraftInput,
  isPaymentThirdReviewCreatePath,
  readPaymentThirdReviewDraft,
} from '@/features/create-payment-third-review/lib/payment-third-review-draft-storage';
import {
  PAYMENT_REVIEW_STEP_ONE_PATH,
  createPaymentThirdReviewExitGuardStates,
  hasPaymentThirdReviewExitGuardState,
  isPaymentThirdReviewExitGuardBaseTransition,
} from '@/features/create-payment-third-review/lib/payment-third-review-exit-history';

type PendingNavigation =
  | { type: 'link'; href: string; isExternal: boolean }
  | { type: 'history'; delta: number };

function hasStoredDraftInput() {
  return hasPaymentThirdReviewDraftInput(readPaymentThirdReviewDraft());
}

export function usePaymentThirdReviewExitGuard() {
  const router = useRouter();
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const pendingNavigationRef = useRef<PendingNavigation | null>(null);
  const historyTransitionRef = useRef<'leaving' | 'restoring' | null>(null);

  useEffect(() => {
    const currentHref = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    const isStepOne = window.location.pathname === PAYMENT_REVIEW_STEP_ONE_PATH;
    const hasGuardState = hasPaymentThirdReviewExitGuardState(window.history.state);

    // 첫 단계에 동일 URL의 보호용 history 항목을 추가해 브라우저 뒤로가기가
    // 생성 화면을 벗어나기 전에 현재 컴포넌트에서 먼저 처리되도록 합니다.
    if (isStepOne && !hasGuardState) {
      const { baseState, sentinelState } = createPaymentThirdReviewExitGuardStates(
        window.history.state,
      );
      window.history.replaceState(baseState, '', currentHref);
      window.history.pushState(sentinelState, '', currentHref);
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasStoredDraftInput()) {
        return;
      }

      event.preventDefault();
      event.returnValue = '';
    };

    const handleBrowserBack = (event: PopStateEvent) => {
      if (historyTransitionRef.current === 'leaving') {
        historyTransitionRef.current = null;
        return;
      }

      if (historyTransitionRef.current === 'restoring') {
        historyTransitionRef.current = null;
        setIsExitDialogOpen(true);
        return;
      }

      const reachedStepOneGuardBase = isPaymentThirdReviewExitGuardBaseTransition(
        window.location.pathname,
        event.state,
      );

      if (reachedStepOneGuardBase) {
        if (!hasStoredDraftInput()) {
          historyTransitionRef.current = 'leaving';
          window.history.back();
          return;
        }

        const { sentinelState } = createPaymentThirdReviewExitGuardStates(event.state);
        window.history.pushState(sentinelState, '', currentHref);
        pendingNavigationRef.current = { type: 'history', delta: -2 };
        setIsExitDialogOpen(true);
        return;
      }

      if (isPaymentThirdReviewCreatePath(window.location.pathname)) {
        return;
      }

      if (!hasStoredDraftInput()) {
        clearPaymentThirdReviewDraft();
        return;
      }

      pendingNavigationRef.current = { type: 'history', delta: -1 };
      historyTransitionRef.current = 'restoring';
      window.history.forward();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handleBrowserBack);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handleBrowserBack);
    };
  }, []);

  const handleNavigationCapture = useCallback((event: MouseEvent<HTMLElement>) => {
    if (
      event.button !== 0 ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      !(event.target instanceof Element)
    ) {
      return;
    }

    const link = event.target.closest('a');
    const href = link?.getAttribute('href');

    if (
      !link ||
      !href ||
      link.hasAttribute('download') ||
      (link.target && link.target !== '_self')
    ) {
      return;
    }

    const destination = new URL(href, window.location.href);

    if (
      destination.origin === window.location.origin &&
      isPaymentThirdReviewCreatePath(destination.pathname)
    ) {
      return;
    }

    if (!hasStoredDraftInput()) {
      clearPaymentThirdReviewDraft();
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    pendingNavigationRef.current = {
      type: 'link',
      href:
        destination.origin === window.location.origin
          ? `${destination.pathname}${destination.search}${destination.hash}`
          : destination.href,
      isExternal: destination.origin !== window.location.origin,
    };
    setIsExitDialogOpen(true);
  }, []);

  const cancelExit = useCallback(() => {
    pendingNavigationRef.current = null;
    setIsExitDialogOpen(false);
  }, []);

  const confirmExit = useCallback(() => {
    const pendingNavigation = pendingNavigationRef.current;

    if (!pendingNavigation) {
      setIsExitDialogOpen(false);
      return;
    }

    clearPaymentThirdReviewDraft();
    pendingNavigationRef.current = null;
    setIsExitDialogOpen(false);

    if (pendingNavigation.type === 'history') {
      historyTransitionRef.current = 'leaving';
      window.history.go(pendingNavigation.delta);
      return;
    }

    if (pendingNavigation.isExternal) {
      window.location.assign(pendingNavigation.href);
      return;
    }

    router.replace(pendingNavigation.href);
  }, [router]);

  return {
    cancelExit,
    confirmExit,
    handleNavigationCapture,
    isExitDialogOpen,
  };
}
