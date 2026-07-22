'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { FileSearch } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { PaymentReviewHistoryRow } from '@/entities/payment-third-review';
import { getPaymentThirdReviewListClient } from '@/entities/payment-third-review/api/payment-third-review-list.client';
import type { PaymentThirdReviewListItem } from '@/entities/payment-third-review/api/payment-third-review-list.schema';
import { mapPaymentThirdReviewListItemToHistoryRow } from '@/entities/payment-third-review/lib/payment-review-list-item';
import { QUERY_KEYS } from '@/shared/constants/query-key';
import { PaymentThirdReviewListSkeleton } from '@/widgets/payment-third-review-list/ui/payment-third-review-list-skeleton';

const PAGE_SIZE = 6;

type PaymentReviewListFilter = 'all' | PaymentThirdReviewListItem['outcomeType'];

const filterOptions: Array<{ label: string; value: PaymentReviewListFilter }> = [
  { label: '전체', value: 'all' },
  { label: '저축', value: 'save' },
  { label: '결제', value: 'buy' },
  { label: '보류', value: 'hold' },
];

// 결제 3심 내역을 API에서 페이지 단위로 조회하고 판단 유형별로 보여줌
export function PaymentThirdReviewListFilter() {
  const [selectedFilter, setSelectedFilter] = useState<PaymentReviewListFilter>('all');
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const listQuery = useInfiniteQuery({
    queryKey: QUERY_KEYS.paymentThirdReviews.list(selectedFilter),
    queryFn: ({ pageParam }) =>
      getPaymentThirdReviewListClient({
        outcomeType: selectedFilter === 'all' ? undefined : selectedFilter,
        page: pageParam,
        size: PAGE_SIZE,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined,
  });
  const items = useMemo(
    () =>
      listQuery.data?.pages
        .flatMap((page) => page.items)
        .map((item) => mapPaymentThirdReviewListItemToHistoryRow(item)) ?? [],
    [listQuery.data],
  );
  const { fetchNextPage, hasNextPage, isFetchingNextPage } = listQuery;

  useEffect(() => {
    const target = loadMoreRef.current;

    if (!target || !hasNextPage || isFetchingNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          void fetchNextPage();
        }
      },
      { rootMargin: '180px 0px' },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className="grid gap-3">
      <div
        className="grid grid-cols-4 rounded-full bg-[#ebeaf0] p-1"
        role="tablist"
        aria-label="결제 3심 판단 필터"
      >
        {filterOptions.map((option) => {
          const isSelected = selectedFilter === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setSelectedFilter(option.value)}
              className={[
                'min-h-9 rounded-full text-sm font-semibold leading-5 transition-colors',
                isSelected
                  ? 'bg-white text-[#1a1c1e] shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
                  : 'text-[#72777e]',
              ].join(' ')}
              role="tab"
              aria-selected={isSelected}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {listQuery.isPending ? (
        <PaymentThirdReviewListSkeleton />
      ) : listQuery.isError ? (
        <PaymentThirdReviewListError onRetry={() => void listQuery.refetch()} />
      ) : items.length === 0 ? (
        <PaymentThirdReviewListEmpty filter={selectedFilter} />
      ) : (
        <>
          <div className="grid gap-2">
            {items.map((item) => (
              <PaymentReviewHistoryRow
                key={item.id}
                href={`/payment-third-review/list/${item.id}`}
                item={item}
              />
            ))}
          </div>

          {listQuery.hasNextPage ? (
            <div ref={loadMoreRef} className="min-h-8">
              {listQuery.isFetchingNextPage ? (
                <PaymentThirdReviewListSkeleton
                  count={2}
                  label="다음 결제 3심 내역을 불러오는 중입니다."
                />
              ) : null}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

function PaymentThirdReviewListEmpty({ filter }: { filter: PaymentReviewListFilter }) {
  const emptyState = {
    all: {
      title: '아직 결제 3심 내역이 없어요',
      description: '결제 전 한 번 더 점검하면 이곳에 기록이 쌓여요.',
    },
    save: {
      title: '저축으로 바꾼 내역이 없어요',
      description: '결제하지 않은 금액을 목표 저축으로 연결해보세요.',
    },
    buy: {
      title: '결제를 진행한 내역이 없어요',
      description: '필요한 소비를 선택하면 만족도 확인까지 기록해드려요.',
    },
    hold: {
      title: '보류 중인 내역이 없어요',
      description: '조금 더 고민하고 싶은 결제를 24시간 보류할 수 있어요.',
    },
  }[filter];

  return (
    <div className="rounded-[24px] bg-white px-5 py-10 text-center shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
      <span className="mx-auto grid size-12 place-items-center rounded-full bg-[#f1f3f5] text-[#72777e]">
        <FileSearch size={22} strokeWidth={2} aria-hidden="true" />
      </span>
      <p className="mt-4 text-[16px] font-semibold leading-7 text-[#1a1c1e]">{emptyState.title}</p>
      <p className="mx-auto mt-1 max-w-[280px] text-sm leading-6 text-[#72777e]">
        {emptyState.description}
      </p>
    </div>
  );
}

function PaymentThirdReviewListError({ onRetry }: { onRetry: () => void }) {
  return (
    <div
      className="rounded-[24px] border border-[#eadfdd] bg-white px-5 py-9 text-center shadow-[0_4px_12px_rgba(0,0,0,0.04)]"
      role="alert"
    >
      <p className="text-[16px] font-semibold leading-7 text-[#1a1c1e]">내역을 불러오지 못했어요</p>
      <p className="mt-1 text-sm leading-6 text-[#72777e]">잠시 후 다시 시도해주세요.</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 min-h-10 rounded-full bg-[#3c5f7c] px-5 text-sm font-semibold text-white"
      >
        다시 불러오기
      </button>
    </div>
  );
}
