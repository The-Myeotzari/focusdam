'use client';

import { useQuery } from '@tanstack/react-query';
import { ClipboardCheck, PiggyBank, RotateCcw } from 'lucide-react';

import { paymentThirdReviewHomeQueryOptions } from '@/entities/payment-third-review/api/payment-third-review-query-options';
import type { PaymentThirdReviewHomeResponse } from '@/entities/payment-third-review/api/payment-third-review-home.schema';
import { formatPaymentReviewWon } from '@/entities/payment-third-review/lib/payment-review-amount';
import { mapPaymentThirdReviewListItemToHistoryRow } from '@/entities/payment-third-review/lib/payment-review-list-item';
import { SiteTopBar } from '@/shared/ui';
import type {
  PaymentReviewOverview,
  SummaryCard,
} from '@/widgets/payment-third-review-home/model/payment-third-review-home.types';
import { PaymentThirdReviewGoalSummary } from '@/widgets/payment-third-review-home/ui/payment-third-review-goal-summary';
import { PaymentThirdReviewHero } from '@/widgets/payment-third-review-home/ui/payment-third-review-hero';
import { PaymentThirdReviewReportPreview } from '@/widgets/payment-third-review-home/ui/payment-third-review-report-preview';

export function PaymentThirdReviewHomePage() {
  const homeQuery = useQuery(paymentThirdReviewHomeQueryOptions());

  return (
    <>
      <SiteTopBar title="결제 3심" backHref="/" skipHref="#report-preview" />
      <main className="flex flex-col gap-5 px-5 pb-8 pt-4">
        <PaymentThirdReviewHero />
        {homeQuery.isPending ? (
          <PaymentThirdReviewHomeSkeleton />
        ) : homeQuery.isError && !homeQuery.data ? (
          <PaymentThirdReviewHomeError onRetry={() => void homeQuery.refetch()} />
        ) : homeQuery.data ? (
          <PaymentThirdReviewHomeContent data={homeQuery.data} />
        ) : null}
      </main>
    </>
  );
}

function PaymentThirdReviewHomeContent({
  data,
}: {
  data: PaymentThirdReviewHomeResponse;
}) {
  const goal = data.activeGoal;
  const latestAchievement = data.latestGoalAchievement;
  const progress = goal
    ? Math.min(100, Math.round((goal.currentSavedAmountKrw / goal.targetAmountKrw) * 100))
    : 0;
  const overview: PaymentReviewOverview = goal
    ? {
        actionLabel: '목표 수정',
        goalName: goal.name,
        goalAmount: formatPaymentReviewWon(goal.targetAmountKrw),
        description: `${formatPaymentReviewWon(goal.currentSavedAmountKrw)} 모음 · ${progress}% 달성`,
        status: 'active',
      }
    : latestAchievement
      ? {
          actionLabel: '새 목표',
          goalName: latestAchievement.goalName,
          goalAmount: '목표 금액을 다 모았어요!',
          description: `${formatPaymentReviewWon(latestAchievement.targetAmount)} 목표를 달성했어요. 새로운 목표를 설정해볼까요?`,
          status: 'achieved',
        }
      : {
          actionLabel: '목표 설정',
          goalName: '활성 목표 없음',
          goalAmount: '목표를 설정해주세요',
          description: '절약한 금액을 모을 목표를 만들어보세요.',
          status: 'empty',
        };
  const summaryCards: SummaryCard[] = [
    {
      title: '절약 금액',
      value: formatPaymentReviewWon(data.stats.savedAmountKrw),
      description: `저축으로 바꾼 ${data.stats.saveCount}건`,
      icon: PiggyBank,
      tone: 'bg-[#e8f5f1] text-[#2d6a4f]',
    },
    {
      title: '진행 횟수',
      value: `${data.stats.totalCount}회`,
      description: `결제 ${data.stats.buyCount} · 보류 ${data.stats.holdCount}`,
      icon: ClipboardCheck,
      tone: 'bg-[#f3f0ff] text-[#645785]',
    },
  ];
  const recentItems = data.recentItems.map((item) =>
    mapPaymentThirdReviewListItemToHistoryRow(item),
  );

  return (
    <>
      <PaymentThirdReviewGoalSummary
        goalAchievementHref="/payment-third-review/goal-achievement"
        goalSettingHref="/payment-third-review/goal-setting"
        items={summaryCards}
        overview={overview}
      />
      <PaymentThirdReviewReportPreview items={recentItems} />
    </>
  );
}

function PaymentThirdReviewHomeSkeleton() {
  return (
    <div
      className="grid animate-pulse gap-5"
      role="status"
      aria-label="결제 3심 홈 정보를 불러오는 중입니다."
    >
      <section className="grid gap-3" aria-hidden="true">
        <span className="h-7 w-24 rounded-full bg-[#e5e8eb]" />
        <span className="h-28 rounded-[24px] bg-white" />
        <div className="grid grid-cols-2 gap-3">
          <span className="h-[156px] rounded-[24px] bg-white" />
          <span className="h-[156px] rounded-[24px] bg-white" />
        </div>
      </section>
      <section className="grid gap-3" aria-hidden="true">
        <span className="h-7 w-28 rounded-full bg-[#e5e8eb]" />
        <span className="h-24 rounded-[22px] bg-white" />
        <span className="h-24 rounded-[22px] bg-white" />
      </section>
    </div>
  );
}

function PaymentThirdReviewHomeError({ onRetry }: { onRetry: () => void }) {
  return (
    <section
      className="rounded-[24px] border border-[#eadfdd] bg-white px-5 py-9 text-center"
      role="alert"
    >
      <span className="mx-auto grid size-12 place-items-center rounded-full bg-[#f1f3f5] text-[#72777e]">
        <RotateCcw size={21} aria-hidden="true" />
      </span>
      <p className="mt-4 text-[16px] font-semibold leading-7 text-[#1a1c1e]">
        홈 정보를 불러오지 못했어요
      </p>
      <p className="mt-1 text-sm leading-6 text-[#72777e]">잠시 후 다시 시도해주세요.</p>
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
