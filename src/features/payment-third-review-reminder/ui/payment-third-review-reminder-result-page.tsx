'use client';

import { useRouter } from 'next/navigation';
import { Banknote, Clock3, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';

import type {
  PaymentReviewHistoryItem,
  PaymentReviewReminderDecision,
} from '@/entities/payment-third-review';
import {
  getGoalAchievementHrefAfterSaving,
  parsePaymentReviewWon,
  PaymentReviewInfoRow,
} from '@/entities/payment-third-review';
import { SiteTopBar } from '@/shared/ui';

type Props = {
  decision: PaymentReviewReminderDecision;
  item: PaymentReviewHistoryItem;
};

const reminderDecisionResultMeta = {
  buy: {
    budgetImpact: '이번 달 소비에 기록',
    description: '24시간 뒤에도 필요하다고 판단해 결제를 진행합니다.',
    icon: Banknote,
    nextAction: '결제 후 24시간 뒤 만족도 체크를 예약합니다.',
    title: '결제를 진행할게요',
  },
  cancel: {
    budgetImpact: '소비하지 않음',
    description: '이번 결제를 진행하지 않고 목표를 지킵니다.',
    icon: XCircle,
    nextAction: '절약한 금액은 목표 저축 후보로 기록합니다.',
    title: '결제하지 않을게요',
  },
  hold: {
    budgetImpact: '3일 뒤 다시 리마인드',
    description: '지금 당장 결정하지 않고 조금 더 시간을 둡니다.',
    icon: Clock3,
    nextAction: '3일 뒤 같은 항목을 다시 확인합니다.',
    title: '조금 더 보류할게요',
  },
} satisfies Record<
  PaymentReviewReminderDecision,
  {
    budgetImpact: string;
    description: string;
    icon: typeof Banknote;
    nextAction: string;
    title: string;
  }
>;

// 리마인드 판단 선택값에 맞는 최종 제출 화면을 렌더링합니다.
export function PaymentThirdReviewReminderResultPage({ decision, item }: Props) {
  const router = useRouter();
  const [memo, setMemo] = useState('');
  const meta = reminderDecisionResultMeta[decision];
  const Icon = meta.icon;
  const submittedDecisionLabel = useMemo(() => getReminderDecisionLabel(decision), [decision]);

  // 리마인드 최종 판단 payload를 제출하고 상세 화면으로 이동합니다.
  const handleSubmit = () => {
    const savedAmount = decision === 'cancel' ? parsePaymentReviewWon(item.amount) : 0;
    const goalAchievementHref =
      decision === 'cancel'
        ? getGoalAchievementHrefAfterSaving({
            savedAmount,
            triggerReviewId: item.id,
            triggerStatus: 'hold_after_save',
          })
        : null;
    const payload = {
      decision,
      memo,
      paymentThirdReviewId: item.id,
      reminderAfterDays: decision === 'hold' ? 3 : null,
      savedAmount,
    };

    console.group('[payment-third-review] reminder payload');
    console.log(payload);
    console.info('goalAchievementHref', goalAchievementHref);
    console.groupEnd();
    // TODO: 백엔드 연동 시 여기에서 리마인드 최종 판단 payload를 Server Action 또는 mutation으로 넘기면 됩니다.
    // TODO: 결제 미진행으로 목표 달성 시 백엔드 응답의 achievementId로 목표 달성 화면에 이동하면 됩니다.

    router.replace(goalAchievementHref ?? `/payment-third-review/list/${item.id}`);
  };

  return (
    <>
      <SiteTopBar
        title="결제 3심"
        backHref={`/payment-third-review/reminder/${item.id}`}
        skipHref="/payment-third-review"
      />
      <main className="mx-auto flex min-h-[calc(100svh-56px)] w-full max-w-[430px] flex-col gap-5 px-5 pb-8 pt-4">
        <section className="rounded-[32px] bg-[#3c5f7c] p-6 text-white shadow-[0_16px_34px_rgba(60,95,124,0.16)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold leading-6 text-white/70">{item.itemName}</p>
              <h1 className="mt-1 text-[28px] font-semibold leading-9">{meta.title}</h1>
            </div>
            <span className="grid size-14 shrink-0 place-items-center rounded-full bg-white/15">
              <Icon size={28} strokeWidth={2.1} aria-hidden="true" />
            </span>
          </div>
          <p className="mt-5 text-[15px] leading-7 text-white/78">{meta.description}</p>
        </section>

        <section className="grid gap-3" aria-labelledby="payment-review-reminder-result-summary">
          <h2
            id="payment-review-reminder-result-summary"
            className="text-lg font-semibold leading-7 text-[#1a1c1e]"
          >
            제출 요약
          </h2>
          <div className="rounded-[28px] bg-white px-5 py-1 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
            <PaymentReviewInfoRow label="품목" value={item.itemName} />
            <PaymentReviewInfoRow label="금액" value={item.amount} />
            <PaymentReviewInfoRow label="판단" value={submittedDecisionLabel} />
            <PaymentReviewInfoRow label="후속 처리" value={meta.budgetImpact} />
          </div>
        </section>

        <section className="rounded-[26px] border border-[#e4e7eb] bg-white/55 px-5 py-4">
          <p className="text-xs font-semibold leading-5 text-[#72777e]">다음 단계</p>
          <p className="mt-1 text-[17px] font-semibold leading-7 text-[#1a1c1e]">
            {meta.nextAction}
          </p>
        </section>

        <label className="grid gap-2">
          <span className="text-sm font-semibold leading-6 text-[#72777e]">메모</span>
          <textarea
            value={memo}
            onChange={(event) => setMemo(event.target.value)}
            rows={4}
            placeholder="이번 판단의 이유를 남겨보세요."
            className="resize-none rounded-[24px] border border-transparent bg-white px-5 py-4 text-[16px] font-medium leading-7 text-[#1a1c1e] shadow-[0_4px_12px_rgba(0,0,0,0.04)] outline-none placeholder:text-[#9da3aa] focus:border-[#3c5f7c]"
          />
        </label>

        <div className="mt-auto grid gap-2 pt-4">
          <button
            type="button"
            onClick={handleSubmit}
            className="flex min-h-[62px] w-full items-center justify-center rounded-full bg-[#3c5f7c] px-6 text-[17px] font-semibold leading-7 text-white shadow-[0_20px_25px_-5px_rgba(60,95,124,0.2)]"
          >
            제출하기
          </button>
        </div>
      </main>
    </>
  );
}

// 리마인드 최종 판단 값을 사용자에게 보여줄 라벨로 변환합니다.
function getReminderDecisionLabel(decision: PaymentReviewReminderDecision) {
  if (decision === 'buy') {
    return '결제 진행';
  }

  if (decision === 'cancel') {
    return '결제 미진행';
  }

  return '보류';
}
