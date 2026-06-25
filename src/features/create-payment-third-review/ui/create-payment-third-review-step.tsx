'use client';

import { useRouter } from 'next/navigation';

import { useCreatePaymentThirdReviewDraft } from '@/features/create-payment-third-review/lib/use-create-payment-third-review-draft';
import { createPaymentThirdReviewPayload } from '@/features/create-payment-third-review/model/create-payment-third-review.draft';
import {
  CREATE_PAYMENT_THIRD_REVIEW_STEPS,
  type CreatePaymentThirdReviewStep,
  getCreatePaymentThirdReviewStepConfig,
} from '@/features/create-payment-third-review/model/create-payment-third-review.steps';
import { CreatePaymentThirdReviewFooter } from '@/features/create-payment-third-review/ui/create-payment-third-review-footer';
import { CreatePaymentThirdReviewProgress } from '@/features/create-payment-third-review/ui/create-payment-third-review-progress';
import { CreatePaymentThirdReviewStepBody } from '@/features/create-payment-third-review/ui/create-payment-third-review-step-body';

type Props = {
  step: CreatePaymentThirdReviewStep;
};

// 결제 3심 생성의 헤더, 본문, 하단 액션을 하나의 스텝 화면으로 조합합니다.
export function CreatePaymentThirdReviewStep({ step }: Props) {
  const router = useRouter();
  const { draft, resetDraft, updateDraft } = useCreatePaymentThirdReviewDraft();
  const config = getCreatePaymentThirdReviewStepConfig(step);
  const stepIndex = CREATE_PAYMENT_THIRD_REVIEW_STEPS.findIndex(
    (item) => item.step === config.step,
  );
  const Icon = config.icon;

  // 완료 단계에서 누적 입력값을 전송 payload로 만들고 플로우를 종료합니다.
  const handleSubmit = () => {
    const payload = createPaymentThirdReviewPayload(draft);

    // TODO: 백엔드 연동 시 이 지점에서 payload를 Server Action 또는 mutation으로 전송합니다.
    console.info('create-payment-third-review payload', payload);
    resetDraft();
    router.push(config.nextHref);
  };

  return (
    <div className="flex flex-col">
      <CreatePaymentThirdReviewProgress stepIndex={stepIndex} />

      <section
        className="flex flex-1 flex-col justify-between pb-5"
        aria-labelledby="payment-review-step-title"
      >
        <div className="grid gap-8">
          <div className="flex flex-col items-center gap-4 px-2 pt-7 text-center">
            <span
              className="grid size-[72px] place-items-center rounded-full bg-[#dde3eb] text-[#3c5f7c]"
              aria-hidden="true"
            >
              <Icon size={34} strokeWidth={2.05} />
            </span>
            <div className="grid gap-2">
              <p className="text-xs font-semibold uppercase leading-4 tracking-[0.52px] text-[#3c5f7c]">
                {config.label}
              </p>
              <h1
                id="payment-review-step-title"
                className="whitespace-pre-line text-[30px] font-semibold leading-[38px] text-[#1a1c1e]"
              >
                {config.title}
              </h1>
              <p className="mx-auto text-[15px] font-medium leading-6 text-[#5f656c]">
                {config.description}
              </p>
            </div>
          </div>

          <CreatePaymentThirdReviewStepBody
            draft={draft}
            step={config.step}
            updateDraft={updateDraft}
          />
        </div>

        <CreatePaymentThirdReviewFooter
          isFinal={config.step === 'complete'}
          nextHref={config.nextHref}
          nextLabel={config.nextLabel}
          onSubmit={handleSubmit}
          previousHref={config.previousHref}
          secondaryHref={config.secondaryHref}
          secondaryLabel={config.secondaryLabel}
          showCancel={config.step === 'step-1'}
        />
      </section>
    </div>
  );
}
