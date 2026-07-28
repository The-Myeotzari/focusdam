'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';

import {
  clearPaymentThirdReviewDraft,
  hasPaymentThirdReviewDraftInput,
  isPaymentThirdReviewCreatePath,
  readPaymentThirdReviewDraft,
} from '@/features/create-payment-third-review/lib/payment-third-review-draft-storage';

type PendingNavigation =
  | { type: 'link'; href: string; isExternal: boolean }
  | { type: 'history' };

function hasStoredDraftInput() {
  return hasPaymentThirdReviewDraftInput(readPaymentThirdReviewDraft());
}

export function usePaymentThirdReviewExitGuard() {
  const router = useRouter();
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const pendingNavigationRef = useRef<PendingNavigation | null>(null);
  const historyTransitionRef = useRef<'leaving' | 'restoring' | null>(null);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasStoredDraftInput()) {
        return;
      }

      event.preventDefault();
      event.returnValue = '';
    };

    const handleBrowserBack = () => {
      if (historyTransitionRef.current === 'leaving') {
        historyTransitionRef.current = null;
        return;
      }

      if (historyTransitionRef.current === 'restoring') {
        historyTransitionRef.current = null;
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

      pendingNavigationRef.current = { type: 'history' };
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
      window.history.back();
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
