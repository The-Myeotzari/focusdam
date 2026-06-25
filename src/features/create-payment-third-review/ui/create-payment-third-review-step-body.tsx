import type {
  CreatePaymentThirdReviewDraft,
  CreatePaymentThirdReviewDraftUpdater,
} from '@/features/create-payment-third-review/model/create-payment-third-review.draft';
import type { CreatePaymentThirdReviewStep } from '@/features/create-payment-third-review/model/create-payment-third-review.steps';
import { PaymentReviewCompleteStep } from '@/features/create-payment-third-review/ui/steps/payment-review-complete-step';
import { PaymentReviewStepFour } from '@/features/create-payment-third-review/ui/steps/payment-review-step-four';
import { PaymentReviewStepOne } from '@/features/create-payment-third-review/ui/steps/payment-review-step-one';
import { PaymentReviewStepThree } from '@/features/create-payment-third-review/ui/steps/payment-review-step-three';
import { PaymentReviewStepTwo } from '@/features/create-payment-third-review/ui/steps/payment-review-step-two';

type Props = {
  draft: CreatePaymentThirdReviewDraft;
  step: CreatePaymentThirdReviewStep;
  updateDraft: CreatePaymentThirdReviewDraftUpdater;
};

// 현재 스텝 값에 맞는 결제 3심 본문 컴포넌트를 선택합니다.
export function CreatePaymentThirdReviewStepBody({ draft, step, updateDraft }: Props) {
  if (step === 'step-1') {
    return <PaymentReviewStepOne draft={draft} updateDraft={updateDraft} />;
  }

  if (step === 'step-2') {
    return <PaymentReviewStepTwo draft={draft} updateDraft={updateDraft} />;
  }

  if (step === 'step-3') {
    return <PaymentReviewStepThree draft={draft} updateDraft={updateDraft} />;
  }

  if (step === 'step-4') {
    return <PaymentReviewStepFour draft={draft} />;
  }

  return <PaymentReviewCompleteStep draft={draft} updateDraft={updateDraft} />;
}
