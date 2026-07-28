'use client';

import { usePaymentThirdReviewExitGuard } from '@/features/create-payment-third-review/lib/use-payment-third-review-exit-guard';
import type { CreatePaymentThirdReviewStep as CreatePaymentThirdReviewStepName } from '@/features/create-payment-third-review/model/create-payment-third-review.steps';
import { CreatePaymentThirdReviewStep } from '@/features/create-payment-third-review/ui/create-payment-third-review-step';
import { PaymentThirdReviewExitDialog } from '@/features/create-payment-third-review/ui/payment-third-review-exit-dialog';
import { SiteTopBar } from '@/shared/ui/site-top-bar';

type Props = {
  step: CreatePaymentThirdReviewStepName;
};

export function PaymentThirdReviewCreatePage({ step }: Props) {
  const {
    cancelExit,
    confirmExit,
    handleNavigationCapture,
    isExitDialogOpen,
  } = usePaymentThirdReviewExitGuard();

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
        onCancel={cancelExit}
        onConfirm={confirmExit}
      />
    </main>
  );
}
