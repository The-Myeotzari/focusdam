'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Banknote, Clock3, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import { paymentThirdReviewDetailQueryOptions } from '@/entities/payment-third-review/api/payment-third-review-query-options';
import { completePaymentThirdReviewReminderClient } from '@/entities/payment-third-review/api/payment-third-review-reminder.client';
import { mapPaymentThirdReviewDetailToHistoryItem } from '@/entities/payment-third-review/lib/payment-review-detail-item';
import {
  getPaymentThirdReviewDetailHref,
  getPaymentThirdReviewListHref,
  type PaymentThirdReviewListFilter,
  withPaymentThirdReviewListFilter,
} from '@/entities/payment-third-review/model/payment-third-review-list-filter';
import type {
  PaymentReviewHistoryItem,
  PaymentReviewReminderDecision,
  PaymentReviewReminderStatus,
} from '@/entities/payment-third-review';
import { PaymentReviewInfoRow } from '@/entities/payment-third-review';
import { QUERY_KEYS } from '@/shared/constants/query-key';
import { ApiRequestError } from '@/shared/lib/api/api';
import { SiteTopBar } from '@/shared/ui';

type Props = {
  decision: PaymentReviewReminderDecision;
  id: string;
  listFilter: PaymentThirdReviewListFilter;
};

const reminderDecisionResultMeta = {
  buy: {
    budgetImpact: '이번 달 소비에 기록',
    description: '시간이 지난 뒤에도 필요하다고 판단해 결제를 진행합니다.',
    icon: Banknote,
    nextAction: '현재 판단을 결제 결과로 기록합니다.',
    title: '결제를 진행할게요',
  },
  cancel: {
    budgetImpact: '소비하지 않음',
    description: '이번 결제를 진행하지 않고 목표를 지킵니다.',
    icon: XCircle,
    nextAction: '연결된 목표가 있다면 절약한 금액을 저축 이력에 기록합니다.',
    title: '결제하지 않을게요',
  },
  hold: {
    budgetImpact: '3일 뒤 다시 리마인드',
    description: '지금 결정하지 않고 조금 더 시간을 둡니다.',
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

export function PaymentThirdReviewReminderResultPage({ decision, id, listFilter }: Props) {
  const router = useRouter();
  const detailHref = getPaymentThirdReviewDetailHref(id, listFilter);
  const listHref = getPaymentThirdReviewListHref(listFilter);
  const reminderHref = withPaymentThirdReviewListFilter(
    `/payment-third-review/reminder/${id}`,
    listFilter,
  );
  const queryClient = useQueryClient();
  const [memo, setMemo] = useState('');
  const detailQuery = useQuery({
    ...paymentThirdReviewDetailQueryOptions(id),
    select: (response) => mapPaymentThirdReviewDetailToHistoryItem(response.item),
    retry: (failureCount, error) =>
      !(error instanceof ApiRequestError && error.body.status === 404) && failureCount < 2,
  });
  const reminderMutation = useMutation({
    mutationFn: () => completePaymentThirdReviewReminderClient(id, { decision, memo }),
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.paymentThirdReviews.all });
      router.replace(
        response.item.goalAchievementId
          ? `/payment-third-review/goal-achievement/${response.item.goalAchievementId}`
          : detailHref,
      );
    },
  });
  const item = detailQuery.data;
  const invalidReminderTarget = item && (item.followUpType !== 'reminder' || !item.reminder);

  return (
    <>
      <SiteTopBar
        title="결제 3심"
        backHref={reminderHref}
        skipHref="/payment-third-review"
      />
      {detailQuery.isPending ? (
        <ReminderResultSkeleton />
      ) : detailQuery.isError || invalidReminderTarget ? (
        <ReminderResultLoadError
          listHref={listHref}
          notFound={
            invalidReminderTarget ||
            (detailQuery.error instanceof ApiRequestError && detailQuery.error.body.status === 404)
          }
          onRetry={() => void detailQuery.refetch()}
        />
      ) : item?.reminder?.status !== 'required' ? (
        <ReminderResultUnavailable detailHref={detailHref} status={item?.reminder?.status} />
      ) : item ? (
        <ReminderResultContent
          decision={decision}
          item={item}
          memo={memo}
          isSubmitting={reminderMutation.isPending}
          submitError={getSubmitErrorMessage(reminderMutation.error)}
          onMemoChange={setMemo}
          onSubmit={() => reminderMutation.mutate()}
        />
      ) : null}
    </>
  );
}

function ReminderResultContent({
  decision,
  item,
  memo,
  isSubmitting,
  submitError,
  onMemoChange,
  onSubmit,
}: {
  decision: PaymentReviewReminderDecision;
  item: PaymentReviewHistoryItem;
  memo: string;
  isSubmitting: boolean;
  submitError: string | null;
  onMemoChange: (memo: string) => void;
  onSubmit: () => void;
}) {
  const meta = reminderDecisionResultMeta[decision];
  const Icon = meta.icon;
  const submittedDecisionLabel = useMemo(() => getReminderDecisionLabel(decision), [decision]);

  return (
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
        <p className="mt-5 text-[15px] leading-7 text-white/80">{meta.description}</p>
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
          onChange={(event) => onMemoChange(event.target.value)}
          disabled={isSubmitting}
          maxLength={500}
          rows={4}
          placeholder="이번 판단의 이유를 남겨보세요."
          className="resize-none rounded-[24px] border border-transparent bg-white px-5 py-4 text-[16px] font-medium leading-7 text-[#1a1c1e] shadow-[0_4px_12px_rgba(0,0,0,0.04)] outline-none placeholder:text-[#9da3aa] focus:border-[#3c5f7c] disabled:opacity-60"
        />
      </label>

      {submitError ? (
        <p className="rounded-2xl bg-[#f9e9e6] px-4 py-3 text-sm leading-6 text-[#9f3e30]" role="alert">
          {submitError}
        </p>
      ) : null}

      <div className="mt-auto grid gap-2 pt-4">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex min-h-[62px] w-full items-center justify-center rounded-full bg-[#3c5f7c] px-6 text-[17px] font-semibold leading-7 text-white shadow-[0_20px_25px_-5px_rgba(60,95,124,0.2)] disabled:bg-[#9ba9b4]"
        >
          {isSubmitting ? '저장 중...' : '제출하기'}
        </button>
      </div>
    </main>
  );
}

function ReminderResultUnavailable({
  detailHref,
  status,
}: {
  detailHref: string;
  status: PaymentReviewReminderStatus | undefined;
}) {
  return (
    <main className="mx-auto grid min-h-[calc(100svh-56px)] w-full max-w-[430px] place-content-center px-5 py-10 text-center">
      <Clock3 className="mx-auto text-[#94640a]" size={36} aria-hidden="true" />
      <h1 className="mt-4 text-xl font-semibold text-[#1a1c1e]">
        {status === 'completed' ? '이미 판단을 완료했어요' : '아직 판단할 수 없어요'}
      </h1>
      <Link
        href={detailHref}
        className="mt-6 flex min-h-12 items-center justify-center rounded-full bg-[#3c5f7c] px-5 text-sm font-semibold text-white"
      >
        상세로 돌아가기
      </Link>
    </main>
  );
}

function ReminderResultSkeleton() {
  return (
    <main
      className="mx-auto grid min-h-[calc(100svh-56px)] w-full max-w-[430px] animate-pulse gap-5 px-5 pb-8 pt-4"
      role="status"
      aria-label="리마인드 제출 정보를 불러오는 중입니다."
    >
      <div className="h-52 rounded-[32px] bg-[#dce3e8]" aria-hidden="true" />
      <div className="h-56 rounded-[28px] bg-white" aria-hidden="true" />
      <div className="h-24 rounded-[26px] bg-white" aria-hidden="true" />
    </main>
  );
}

function ReminderResultLoadError({
  listHref,
  notFound,
  onRetry,
}: {
  listHref: string;
  notFound: boolean;
  onRetry: () => void;
}) {
  return (
    <main className="mx-auto grid min-h-[calc(100svh-56px)] w-full max-w-[430px] place-content-center px-5 py-10 text-center">
      <Clock3 className="mx-auto text-[#94640a]" size={36} aria-hidden="true" />
      <h1 className="mt-4 text-xl font-semibold text-[#1a1c1e]">
        {notFound ? '리마인드 대상을 찾을 수 없어요' : '정보를 불러오지 못했어요'}
      </h1>
      {notFound ? (
        <Link
          href={listHref}
          className="mt-6 flex min-h-12 items-center justify-center rounded-full bg-[#3c5f7c] px-5 text-sm font-semibold text-white"
        >
          목록으로 돌아가기
        </Link>
      ) : (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 min-h-12 rounded-full bg-[#3c5f7c] px-5 text-sm font-semibold text-white"
        >
          다시 불러오기
        </button>
      )}
    </main>
  );
}

function getReminderDecisionLabel(decision: PaymentReviewReminderDecision) {
  if (decision === 'buy') return '결제 진행';
  if (decision === 'cancel') return '결제 미진행';
  return '보류';
}

function getSubmitErrorMessage(error: Error | null) {
  if (!error) return null;

  if (error instanceof ApiRequestError && error.body.status === 409) {
    return `${error.body.detail} 최신 상태를 다시 확인해주세요.`;
  }

  return '리마인드 판단을 저장하지 못했어요. 잠시 후 다시 시도해주세요.';
}
