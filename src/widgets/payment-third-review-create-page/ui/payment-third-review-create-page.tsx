'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type MouseEvent } from 'react';

import {
  clearPaymentThirdReviewDraft,
  hasPaymentThirdReviewDraftInput,
  isPaymentThirdReviewCreatePath,
  readPaymentThirdReviewDraft,
} from '@/features/create-payment-third-review/lib/payment-third-review-draft-storage';
import type { CreatePaymentThirdReviewStep as CreatePaymentThirdReviewStepName } from '@/features/create-payment-third-review/model/create-payment-third-review.steps';
import { CreatePaymentThirdReviewStep } from '@/features/create-payment-third-review/ui/create-payment-third-review-step';
import { PaymentThirdReviewExitDialog } from '@/features/create-payment-third-review/ui/payment-third-review-exit-dialog';
import { SiteTopBar } from '@/shared/ui/site-top-bar';

type Props = {
  step: CreatePaymentThirdReviewStepName;
};

type PendingNavigation =
  | { type: 'link'; href: string }
  | { type: 'history' };

export function PaymentThirdReviewCreatePage({ step }: Props) {
  const router = useRouter();
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const pendingNavigationRef = useRef<PendingNavigation | null>(null);
  const historyTransitionRef = useRef<'leaving' | 'restoring' | null>(null);

  useEffect(() => {
    const hasDraftInput = () =>
      hasPaymentThirdReviewDraftInput(readPaymentThirdReviewDraft());

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasDraftInput()) {
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

      if (!hasDraftInput()) {
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

  const handleNavigationCapture = (event: MouseEvent<HTMLElement>) => {
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

    if (!href) {
      return;
    }

    const destination = new URL(href, window.location.origin);

    if (isPaymentThirdReviewCreatePath(destination.pathname)) {
      return;
    }

    if (!hasPaymentThirdReviewDraftInput(readPaymentThirdReviewDraft())) {
      clearPaymentThirdReviewDraft();
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    pendingNavigationRef.current = {
      type: 'link',
      href: `${destination.pathname}${destination.search}${destination.hash}`,
    };
    setIsExitDialogOpen(true);
  };

  const handleCancelExit = () => {
    pendingNavigationRef.current = null;
    setIsExitDialogOpen(false);
  };

  const handleConfirmExit = () => {
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

    router.push(pendingNavigation.href);
  };

  return (
    <main
      onClickCapture={handleNavigationCapture}
      className="mx-auto flex min-h-[100svh] w-full max-w-[430px] flex-col bg-[#faf9fc] font-['42dot_Sans','Hanken_Grotesk','Noto_Sans_KR',sans-serif]"
    >
      <SiteTopBar
        title="결제 3심"
        backHref="/payment-third-review"
        skipHref="/payment-third-review"
        className="sticky top-0 z-20"
      />
      <div className="flex flex-1 flex-col px-5 pb-0 pt-4">
        <CreatePaymentThirdReviewStep step={step} />
      </div>

      <PaymentThirdReviewExitDialog
        open={isExitDialogOpen}
        onCancel={handleCancelExit}
        onConfirm={handleConfirmExit}
      />
    </main>
  );
}
