import { useQuery } from '@tanstack/react-query';
import { ChevronDown, CircleDollarSign, Flag, TrendingUp } from 'lucide-react';
import { useState } from 'react';

import { activePaymentSavingGoalQueryOptions } from '@/entities/payment-third-review/api/payment-third-review-query-options';
import type { PaymentSavingGoal } from '@/entities/payment-third-review/api/payment-saving-goal.schema';
import { formatPaymentAmount } from '@/features/create-payment-third-review/lib/create-payment-third-review-format';
import {
  calculatePaymentReviewGoalImpact,
  type PaymentReviewGoalImpact,
} from '@/features/create-payment-third-review/lib/payment-review-goal-impact';
import type { CreatePaymentThirdReviewDraft } from '@/features/create-payment-third-review/model/create-payment-third-review.draft';
import { PaymentSavingGoalDialog } from '@/features/create-payment-third-review/ui/payment-saving-goal-dialog';

type Props = {
  draft: CreatePaymentThirdReviewDraft;
};

// 활성 저축 목표와 입력 금액을 비교해 현재 및 예상 달성도를 보여줍니다.
export function PaymentReviewStepFour({ draft }: Props) {
  const goalQuery = useQuery(activePaymentSavingGoalQueryOptions());
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);

  if (goalQuery.isPending) {
    return <PaymentReviewGoalImpactSkeleton />;
  }

  if (goalQuery.isError) {
    return <PaymentReviewGoalImpactError onRetry={() => void goalQuery.refetch()} />;
  }

  if (!goalQuery.data.item) {
    return (
      <>
        <PaymentReviewGoalEmpty
          amount={draft.amount}
          onOpenGoalDialog={() => setIsGoalDialogOpen(true)}
        />
        <PaymentSavingGoalDialog
          open={isGoalDialogOpen}
          onOpenChange={setIsGoalDialogOpen}
        />
      </>
    );
  }

  const amountKrw = Number(draft.amount.replace(/[^0-9]/g, '')) || 0;
  const impact = calculatePaymentReviewGoalImpact({
    amountKrw,
    currentSavedAmountKrw: goalQuery.data.item.currentSavedAmountKrw,
    targetAmountKrw: goalQuery.data.item.targetAmountKrw,
  });

  return (
    <PaymentReviewGoalImpactContent
      amount={draft.amount}
      goal={goalQuery.data.item}
      impact={impact}
    />
  );
}

function PaymentReviewGoalImpactContent({
  amount,
  goal,
  impact,
}: {
  amount: string;
  goal: PaymentSavingGoal;
  impact: PaymentReviewGoalImpact;
}) {
  return (
    <div className="grid gap-4">
      <details className="group rounded-[28px] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
        <summary className="flex cursor-pointer list-none items-center gap-3 p-5 [&::-webkit-details-marker]:hidden">
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#dde3eb4d] text-[#3c5f7c]">
            <Flag size={22} strokeWidth={2.1} aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-xs font-medium leading-5 text-[#72777e]">
              {goal.name}
            </span>
            <span className="block text-[24px] font-semibold leading-8 text-[#1a1c1e]">
              {formatWon(goal.targetAmountKrw)}
            </span>
          </span>
          <span className="shrink-0 rounded-full bg-[#eef2f5] px-3 py-1.5 text-sm font-semibold text-[#3c5f7c]">
            {impact.currentProgress}%
          </span>
          <ChevronDown
            size={20}
            strokeWidth={2.1}
            className="shrink-0 text-[#858b91] transition-transform group-open:rotate-180"
            aria-hidden="true"
          />
          <span className="sr-only">목표 상세 정보 열기</span>
        </summary>

        <div className="px-5 pb-5">
          <div className="grid grid-cols-2 gap-3 border-t border-[#edf0f2] pt-4">
            <GoalAmountSummary label="현재 모은 금액" value={goal.currentSavedAmountKrw} />
            <GoalAmountSummary
              label="목표까지"
              value={impact.remainingBeforeAmountKrw}
              align="right"
            />
          </div>
          <ProgressBar progress={impact.currentProgress} />
        </div>
      </details>

      <section className="rounded-[28px] bg-[#e6f4f1] p-5">
        <div className="flex items-center gap-3">
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#dde3eb4d] text-[#3c5f7c]">
            <TrendingUp size={22} strokeWidth={2.1} aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-semibold leading-5 text-[#527064]">입력 금액</p>
            <p className="text-[20px] font-semibold leading-7 text-[#1a1c1e]">
              {formatPaymentAmount(amount)}
            </p>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-[26px] font-semibold leading-9 text-[#1a1c1e]">
            {getImpactTitle(impact)}
          </p>
          <div className="mt-2 flex items-center justify-between gap-4 text-sm font-semibold">
            <span className="text-[#3c5f7c]">현재 {impact.currentProgress}%</span>
            <span className="text-[#2d6a4f]">예상 {impact.projectedProgress}%</span>
          </div>
        </div>
        <ProjectedProgressBar
          currentProgress={impact.currentProgress}
          projectedProgress={impact.projectedProgress}
        />

        <p className="mt-4 rounded-[20px] bg-white/70 px-4 py-3 text-sm font-medium leading-6 text-[#52615b]">
          {getImpactDescription(impact)}
        </p>
      </section>
    </div>
  );
}

function GoalAmountSummary({
  align = 'left',
  label,
  value,
}: {
  align?: 'left' | 'right';
  label: string;
  value: number;
}) {
  return (
    <div className={align === 'right' ? 'text-right' : undefined}>
      <p className="text-xs font-medium leading-5 text-[#858b91]">{label}</p>
      <p className="mt-0.5 text-[17px] font-semibold leading-7 text-[#1a1c1e]">
        {formatWon(value)}
      </p>
    </div>
  );
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div
      className="mt-4 h-3 overflow-hidden rounded-full bg-[#dadadc]"
      role="progressbar"
      aria-label="현재 목표 달성도"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
    >
      <div
        className="h-full rounded-full bg-[#3c5f7c]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

function ProjectedProgressBar({
  currentProgress,
  projectedProgress,
}: {
  currentProgress: number;
  projectedProgress: number;
}) {
  return (
    <div
      className="relative mt-4 h-3 overflow-hidden rounded-full bg-white/70"
      role="progressbar"
      aria-label="저축 선택 시 예상 목표 달성도"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={projectedProgress}
    >
      <div
        className="absolute inset-y-0 left-0 rounded-full bg-[#78ad96]"
        style={{ width: `${projectedProgress}%` }}
      />
      <div
        className="absolute inset-y-0 left-0 rounded-full bg-[#3c5f7c]"
        style={{ width: `${currentProgress}%` }}
      />
    </div>
  );
}

function PaymentReviewGoalEmpty({
  amount,
  onOpenGoalDialog,
}: {
  amount: string;
  onOpenGoalDialog: () => void;
}) {
  return (
    <section className="rounded-[28px] bg-white p-6 text-center shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
      <span className="mx-auto grid size-12 place-items-center rounded-full bg-[#f1f3f5] text-[#72777e]">
        <CircleDollarSign size={22} strokeWidth={2.1} aria-hidden="true" />
      </span>
      <h2 className="mt-4 text-[18px] font-semibold leading-7 text-[#1a1c1e]">
        설정된 저축 목표가 없어요
      </h2>
      <p className="mt-1 text-sm leading-6 text-[#72777e]">
        {formatPaymentAmount(amount)}이 목표에 미치는 영향을 확인하려면 목표를 먼저 설정해주세요.
      </p>
      <button
        type="button"
        onClick={onOpenGoalDialog}
        className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-[#3c5f7c] px-5 text-sm font-semibold text-white"
      >
        목표 설정하기
      </button>
    </section>
  );
}

function PaymentReviewGoalImpactError({ onRetry }: { onRetry: () => void }) {
  return (
    <section className="rounded-[28px] border border-[#eadfdd] bg-white p-6 text-center" role="alert">
      <p className="text-[16px] font-semibold leading-7 text-[#1a1c1e]">
        목표 정보를 불러오지 못했어요
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 min-h-10 rounded-full bg-[#3c5f7c] px-5 text-sm font-semibold text-white"
      >
        다시 불러오기
      </button>
    </section>
  );
}

function PaymentReviewGoalImpactSkeleton() {
  return (
    <div className="grid animate-pulse gap-4" role="status" aria-label="목표 영향을 불러오는 중입니다.">
      <div className="h-44 rounded-[28px] bg-white" aria-hidden="true" />
      <div className="h-64 rounded-[28px] bg-[#e6f4f1]" aria-hidden="true" />
    </div>
  );
}

function getImpactDescription(impact: PaymentReviewGoalImpact) {
  if (impact.isGoalAchieved) {
    if (impact.remainingBeforeAmountKrw === 0) {
      return '이미 목표를 달성했어요. 입력 금액은 다음 목표를 위해 남겨둘 수 있어요.';
    }

    return impact.exceededAmountKrw > 0
      ? `${formatWon(impact.remainingBeforeAmountKrw)}만 더하면 달성해요. 나머지 ${formatWon(impact.exceededAmountKrw)}은 다음 목표를 위해 남길 수 있어요.`
      : `${formatWon(impact.remainingBeforeAmountKrw)}을 저축하면 목표를 정확히 달성해요.`;
  }

  return `${formatWon(impact.inputAmountKrw)}을 목표에 더하면, 목표까지 ${formatWon(impact.remainingAmountKrw)} 남아요.`;
}

function getImpactTitle(impact: PaymentReviewGoalImpact) {
  if (impact.remainingBeforeAmountKrw === 0) {
    return '이미 목표를 달성했어요';
  }

  if (impact.isGoalAchieved) {
    return '이 금액이면 목표를 달성해요';
  }

  return `달성도가 ${impact.progressIncrease}%p 올라가요`;
}

function formatWon(amount: number) {
  return `${amount.toLocaleString('ko-KR')}원`;
}
