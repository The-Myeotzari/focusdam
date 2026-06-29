'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { getGoalAchievementHrefAfterSaving } from '@/entities/payment-third-review';
import { useCreatePaymentThirdReviewDraft } from '@/features/create-payment-third-review/lib/use-create-payment-third-review-draft';
import { createPaymentThirdReviewPayload } from '@/features/create-payment-third-review/model/create-payment-third-review.draft';
import {
  CREATE_PAYMENT_THIRD_REVIEW_PROGRESS_STEPS,
  type CreatePaymentThirdReviewStep,
  getCreatePaymentThirdReviewStepConfig,
  getPaymentReviewDecisionHref,
  getPaymentReviewReportPreviousHref,
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
  const { draft, isHydrated, resetDraft, updateDraft } = useCreatePaymentThirdReviewDraft();
  const config = getCreatePaymentThirdReviewStepConfig(step);
  const stepIndex = CREATE_PAYMENT_THIRD_REVIEW_PROGRESS_STEPS.findIndex(
    (item) => item.step === config.step,
  );
  const Icon = config.icon;
  const nextHref =
    config.step === 'complete' ? getPaymentReviewDecisionHref(draft.decision) : config.nextHref;
  const secondaryHref =
    config.step === 'report'
      ? getPaymentReviewReportPreviousHref(draft.decision)
      : config.secondaryHref;
  const isStepOneReady =
    draft.itemName.trim().length > 0 && draft.amount.trim().length > 0 && Boolean(draft.impulseStrength);
  const shouldShowHero = config.showHero ?? true;
  const shouldShowProgress = config.showProgress ?? true;

  useEffect(() => {
    const isDraftEmpty = !draft.itemName.trim() && !draft.amount.trim();

    if (isHydrated && config.step !== 'step-1' && isDraftEmpty) {
      router.replace('/payment-third-review/list');
    }
  }, [config.step, draft.amount, draft.itemName, isHydrated, router]);

  // 완료 단계에서 누적 입력값을 전송 payload로 만들고 플로우를 종료합니다.
  const handleSubmit = () => {
    const payload = createPaymentThirdReviewPayload(draft);
    const goalAchievementHref =
      draft.decision === 'memo' && draft.savingTarget === 'goal'
        ? getGoalAchievementHrefAfterSaving({
            savedAmount: payload.amount,
            triggerStatus: 'save_completed',
          })
        : null;

    console.groupCollapsed('[결제 3심 생성] 제출 payload');
    console.info('draft', draft);
    console.info('payload', payload);
    console.info('goalAchievementHref', goalAchievementHref);
    console.groupEnd();

    // TODO: 백엔드 연동 시 여기에서 payload를 Server Action 또는 mutation으로 넘기면 됩니다.
    // TODO: 저축 반영 후 목표 달성 시 백엔드 응답의 achievementId로 목표 달성 화면에 이동하면 됩니다.
    resetDraft();
    router.replace(goalAchievementHref ?? config.nextHref);
  };

  return (
    <div className="flex flex-col">
      {shouldShowProgress ? <CreatePaymentThirdReviewProgress stepIndex={stepIndex} /> : null}

      <section
        className="flex flex-1 flex-col justify-between pb-5"
        aria-label={shouldShowHero ? undefined : config.title.replace(/\n/g, ' ')}
        aria-labelledby={shouldShowHero ? 'payment-review-step-title' : undefined}
      >
        <div className="grid gap-8">
          {shouldShowHero ? (
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
          ) : null}

          <CreatePaymentThirdReviewStepBody
            draft={draft}
            step={config.step}
            updateDraft={updateDraft}
          />
        </div>

        <CreatePaymentThirdReviewFooter
          isFinal={config.submitOnNext === true}
          isNextDisabled={config.step === 'step-1' && !isStepOneReady}
          nextHref={nextHref}
          nextLabel={config.nextLabel}
          onSubmit={handleSubmit}
          previousHref={config.previousHref}
          secondaryHref={secondaryHref}
          secondaryLabel={config.secondaryLabel}
          showCancel={config.step === 'step-1'}
        />
      </section>
    </div>
  );
}
