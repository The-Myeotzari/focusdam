'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, SmilePlus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { paymentThirdReviewDetailQueryOptions } from '@/entities/payment-third-review/api/payment-third-review-query-options';
import { completePaymentThirdReviewSatisfactionClient } from '@/entities/payment-third-review/api/payment-third-review-satisfaction.client';
import { mapPaymentThirdReviewDetailToHistoryItem } from '@/entities/payment-third-review/lib/payment-review-detail-item';
import {
  getPaymentThirdReviewDetailHref,
  getPaymentThirdReviewListHref,
  type PaymentThirdReviewListFilter,
} from '@/entities/payment-third-review/model/payment-third-review-list-filter';
import { PaymentReviewInfoRow } from '@/entities/payment-third-review';
import type { PaymentReviewHistoryItem } from '@/entities/payment-third-review';
import { QUERY_KEYS } from '@/shared/constants/query-key';
import { ApiRequestError } from '@/shared/lib/api/api';
import { SiteTopBar } from '@/shared/ui';

type Props = {
  id: string;
  listFilter: PaymentThirdReviewListFilter;
};

type SatisfactionOption = {
  label: string;
  score: number;
  summary: string;
};

const satisfactionOptions: SatisfactionOption[] = [
  { label: '매우 아쉬움', score: 1, summary: '매우 낮음' },
  { label: '아쉬움', score: 2, summary: '낮음' },
  { label: '보통', score: 3, summary: '보통' },
  { label: '만족', score: 4, summary: '만족' },
  { label: '매우 만족', score: 5, summary: '매우 만족' },
];

export function PaymentThirdReviewSatisfactionCheckPage({ id, listFilter }: Props) {
  const router = useRouter();
  const detailHref = getPaymentThirdReviewDetailHref(id, listFilter);
  const listHref = getPaymentThirdReviewListHref(listFilter);
  const queryClient = useQueryClient();
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [memo, setMemo] = useState('');
  const detailQuery = useQuery({
    ...paymentThirdReviewDetailQueryOptions(id),
    select: (response) => mapPaymentThirdReviewDetailToHistoryItem(response.item),
    retry: (failureCount, error) =>
      !(error instanceof ApiRequestError && error.body.status === 404) && failureCount < 2,
  });
  const satisfactionMutation = useMutation({
    mutationFn: (option: SatisfactionOption) =>
      completePaymentThirdReviewSatisfactionClient(id, {
        score: option.score,
        summary: option.summary,
        memo,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.paymentThirdReviews.all });
      router.replace(detailHref);
    },
  });
  const item = detailQuery.data;
  const selectedOption = satisfactionOptions.find((option) => option.score === selectedScore);
  const invalidSatisfactionTarget =
    item && (item.followUpType !== 'satisfaction' || !item.satisfaction);

  const handleSubmit = () => {
    if (selectedOption && !satisfactionMutation.isPending) {
      satisfactionMutation.mutate(selectedOption);
    }
  };

  return (
    <>
      <SiteTopBar
        title="만족도 체크"
        backHref={detailHref}
        skipHref="/payment-third-review"
      />
      {detailQuery.isPending ? (
        <SatisfactionCheckSkeleton />
      ) : detailQuery.isError || invalidSatisfactionTarget ? (
        <SatisfactionCheckLoadError
          listHref={listHref}
          notFound={
            invalidSatisfactionTarget ||
            (detailQuery.error instanceof ApiRequestError && detailQuery.error.body.status === 404)
          }
          onRetry={() => void detailQuery.refetch()}
        />
      ) : item ? (
        <SatisfactionCheckContent
          detailHref={detailHref}
          item={item}
          memo={memo}
          selectedScore={selectedScore}
          isSubmitting={satisfactionMutation.isPending}
          submitError={getSubmitErrorMessage(satisfactionMutation.error)}
          onMemoChange={setMemo}
          onScoreChange={setSelectedScore}
          onSubmit={handleSubmit}
        />
      ) : null}
    </>
  );
}

function SatisfactionCheckContent({
  detailHref,
  item,
  memo,
  selectedScore,
  isSubmitting,
  submitError,
  onMemoChange,
  onScoreChange,
  onSubmit,
}: {
  detailHref: string;
  item: PaymentReviewHistoryItem;
  memo: string;
  selectedScore: number | null;
  isSubmitting: boolean;
  submitError: string | null;
  onMemoChange: (memo: string) => void;
  onScoreChange: (score: number) => void;
  onSubmit: () => void;
}) {
  const isRequired = item.satisfaction?.status === 'required';
  const selectedOption = satisfactionOptions.find((option) => option.score === selectedScore);

  return (
    <main className="mx-auto flex min-h-[calc(100svh-56px)] w-full max-w-[430px] flex-col gap-5 px-5 pb-8 pt-4">
      <section className="rounded-[32px] bg-[#e6f1ee] p-6">
        <span className="grid size-14 place-items-center rounded-full bg-white/70 text-[#3c5f7c]">
          <SmilePlus size={28} strokeWidth={2.1} aria-hidden="true" />
        </span>
        <p className="mt-6 text-sm font-semibold leading-6 text-[#3c5f7c]">{item.itemName}</p>
        <h1 className="mt-1 text-[30px] font-semibold leading-[40px] text-[#1a1c1e]">
          결제 후 만족도는
          <br />
          어땠나요?
        </h1>
        <p className="mt-4 text-[15px] leading-7 text-[#595f66]">
          {item.amount} 결제가 실제로 만족스러웠는지 기록해요.
        </p>
      </section>

      {item.satisfaction?.status === 'completed' && item.satisfaction.result ? (
        <SatisfactionResult item={item} />
      ) : null}

      {item.satisfaction?.status === 'scheduled' ? (
        <section className="rounded-[26px] border border-[#dce3ea] bg-white/60 px-5 py-4">
          <p className="text-xs font-semibold leading-5 text-[#72777e]">체크 예정</p>
          <p className="mt-1 text-[17px] font-semibold leading-7 text-[#1a1c1e]">
            {item.followUpLabel} 만족도를 확인해요
          </p>
        </section>
      ) : null}

      {isRequired ? (
        <section className="grid gap-3" aria-labelledby="satisfaction-check-form-title">
          <h2
            id="satisfaction-check-form-title"
            className="text-lg font-semibold leading-7 text-[#1a1c1e]"
          >
            만족도 선택
          </h2>
          <div
            className="grid grid-cols-5 gap-1.5 rounded-[24px] bg-white p-2 shadow-[0_4px_12px_rgba(0,0,0,0.04)]"
            role="radiogroup"
            aria-label="결제 만족도"
          >
            {satisfactionOptions.map((option) => (
              <SatisfactionChoice
                key={option.score}
                checked={selectedScore === option.score}
                disabled={isSubmitting}
                option={option}
                onClick={() => onScoreChange(option.score)}
              />
            ))}
          </div>

          <div
            className={[
              'min-h-[68px] rounded-[20px] px-4 py-3 transition-colors',
              selectedOption ? 'bg-[#e6f1ee]' : 'bg-[#f1f3f5]',
            ].join(' ')}
            aria-live="polite"
          >
            <p className="text-xs font-semibold leading-5 text-[#72777e]">선택한 만족도</p>
            <p className="mt-0.5 text-[16px] font-semibold leading-6 text-[#1a1c1e]">
              {selectedOption
                ? `${selectedOption.label} · ${selectedOption.score}/5`
                : '1점부터 5점 중 하나를 선택해주세요'}
            </p>
          </div>

          <label className="grid gap-2">
            <span className="text-sm font-semibold leading-6 text-[#72777e]">회고 메모</span>
            <textarea
              value={memo}
              onChange={(event) => onMemoChange(event.target.value)}
              disabled={isSubmitting}
              maxLength={500}
              rows={4}
              placeholder="실제로 잘 썼는지, 아쉬웠던 점이 있었는지 적어보세요."
              className="resize-none rounded-[24px] border border-transparent bg-white px-5 py-4 text-[16px] font-medium leading-7 text-[#1a1c1e] shadow-[0_4px_12px_rgba(0,0,0,0.04)] outline-none placeholder:text-[#9da3aa] focus:border-[#3c5f7c] disabled:opacity-60"
            />
          </label>

          {submitError ? (
            <p className="rounded-2xl bg-[#f9e9e6] px-4 py-3 text-sm leading-6 text-[#9f3e30]" role="alert">
              {submitError}
            </p>
          ) : null}
        </section>
      ) : null}

      <div className="mt-auto grid gap-2 pt-4">
        {isRequired ? (
          <button
            type="button"
            onClick={onSubmit}
            disabled={!selectedOption || isSubmitting}
            className={[
              'flex min-h-[62px] w-full items-center justify-center rounded-full px-6 text-[17px] font-semibold leading-7 text-white',
              selectedOption && !isSubmitting
                ? 'bg-[#3c5f7c] shadow-[0_20px_25px_-5px_rgba(60,95,124,0.2)]'
                : 'cursor-not-allowed bg-[#d7dde3]',
            ].join(' ')}
          >
            {isSubmitting ? '저장 중...' : '체크 완료'}
          </button>
        ) : (
          <Link
            href={detailHref}
            className="flex min-h-[62px] w-full items-center justify-center rounded-full bg-[#3c5f7c] px-6 text-[17px] font-semibold leading-7 text-white shadow-[0_20px_25px_-5px_rgba(60,95,124,0.2)]"
          >
            상세로 돌아가기
          </Link>
        )}
      </div>
    </main>
  );
}

function SatisfactionChoice({
  checked,
  disabled,
  onClick,
  option,
}: {
  checked: boolean;
  disabled: boolean;
  onClick: () => void;
  option: SatisfactionOption;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        'flex min-h-[94px] min-w-0 flex-col items-center justify-center gap-2 rounded-[18px] border px-1 py-2 text-center transition-colors disabled:opacity-60',
        checked
          ? 'border-[#3c5f7c] bg-[#edf2f5] text-[#3c5f7c]'
          : 'border-transparent bg-white text-[#72777e]',
      ].join(' ')}
      role="radio"
      aria-checked={checked}
      aria-label={`${option.label} ${option.score}점`}
    >
      <span
        className={[
          'grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold',
          checked ? 'bg-[#3c5f7c] text-white' : 'bg-[#f1f3f5] text-[#72777e]',
        ].join(' ')}
      >
        {checked ? <Check size={16} strokeWidth={2.6} aria-hidden="true" /> : option.score}
      </span>
      <span className="break-keep text-[11px] font-semibold leading-4">
        {option.label}
      </span>
    </button>
  );
}

function SatisfactionResult({ item }: { item: PaymentReviewHistoryItem }) {
  const result = item.satisfaction?.result;

  if (!result) {
    return null;
  }

  return (
    <section className="rounded-[28px] bg-white px-5 py-1 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
      <PaymentReviewInfoRow label="체크 일자" value={result.checkedAt} />
      <PaymentReviewInfoRow label="만족도" value={`${result.summary} ${result.score}/5`} />
      <PaymentReviewInfoRow label="회고 메모" value={result.memo} />
    </section>
  );
}

function SatisfactionCheckSkeleton() {
  return (
    <main
      className="mx-auto grid min-h-[calc(100svh-56px)] w-full max-w-[430px] animate-pulse gap-5 px-5 pb-8 pt-4"
      role="status"
      aria-label="만족도 체크 정보를 불러오는 중입니다."
    >
      <div className="h-64 rounded-[32px] bg-[#dce9e6]" aria-hidden="true" />
      <div className="grid gap-2" aria-hidden="true">
        <span className="h-7 w-28 rounded-full bg-[#e5e8eb]" />
        <span className="h-[110px] rounded-[24px] bg-white" />
        <span className="h-[68px] rounded-[20px] bg-[#eef0f2]" />
      </div>
    </main>
  );
}

function SatisfactionCheckLoadError({
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
      <span className="mx-auto grid size-14 place-items-center rounded-full bg-[#e6f1ee] text-[#3c5f7c]">
        <SmilePlus size={26} aria-hidden="true" />
      </span>
      <h1 className="mt-4 text-xl font-semibold text-[#1a1c1e]">
        {notFound ? '만족도 체크 대상을 찾을 수 없어요' : '정보를 불러오지 못했어요'}
      </h1>
      <p className="mt-2 text-sm leading-6 text-[#72777e]">
        {notFound ? '삭제되었거나 만족도 체크 대상이 아닌 내역이에요.' : '잠시 후 다시 시도해주세요.'}
      </p>
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

function getSubmitErrorMessage(error: Error | null) {
  if (!error) {
    return null;
  }

  if (error instanceof ApiRequestError && error.body.status === 409) {
    return `${error.body.detail} 최신 상태를 다시 확인해주세요.`;
  }

  return '만족도 체크를 저장하지 못했어요. 잠시 후 다시 시도해주세요.';
}
