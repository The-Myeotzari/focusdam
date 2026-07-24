'use client';

import { useEffect, type MouseEvent } from 'react';

import {
  clearPaymentThirdReviewDraft,
  isPaymentThirdReviewCreatePath,
} from '@/features/create-payment-third-review/lib/payment-third-review-draft-storage';
import type { CreatePaymentThirdReviewStep as CreatePaymentThirdReviewStepName } from '@/features/create-payment-third-review/model/create-payment-third-review.steps';
import { CreatePaymentThirdReviewStep } from '@/features/create-payment-third-review/ui/create-payment-third-review-step';
import { SiteTopBar } from '@/shared/ui/site-top-bar';

type Props = {
  step: CreatePaymentThirdReviewStepName;
};

export function PaymentThirdReviewCreatePage({ step }: Props) {
  useEffect(() => {
    const handleBrowserBack = () => {
      if (!isPaymentThirdReviewCreatePath(window.location.pathname)) {
        clearPaymentThirdReviewDraft();
      }
    };

    window.addEventListener('popstate', handleBrowserBack);

    return () => {
      window.removeEventListener('popstate', handleBrowserBack);
    };
  }, []);

  const handleNavigationCapture = (event: MouseEvent<HTMLElement>) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    const link = event.target.closest('a');
    const href = link?.getAttribute('href');

    if (!href) {
      return;
    }

    const destination = new URL(href, window.location.origin);

    if (!isPaymentThirdReviewCreatePath(destination.pathname)) {
      clearPaymentThirdReviewDraft();
    }
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
    </main>
  );
}
