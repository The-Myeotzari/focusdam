'use client';

import { useMemo, useState } from 'react';

import type { PaymentReviewHistoryItem } from '@/entities/payment-third-review';
import { PaymentReviewHistoryRow } from '@/entities/payment-third-review';
import { useInfiniteScroll } from '@/shared/lib/use-infinite-scroll';

type Props = {
  items: PaymentReviewHistoryItem[];
};

const PAGE_SIZE = 6;

type PaymentReviewListFilter = 'all' | PaymentReviewHistoryItem['outcomeType'];

const filterOptions: Array<{ label: string; value: PaymentReviewListFilter }> = [
  { label: '전체', value: 'all' },
  { label: '저축', value: 'save' },
  { label: '결제', value: 'buy' },
  { label: '보류', value: 'hold' },
];

// 결제 3심 내역을 판단 유형별 토글로 필터링해 보여줍니다.
export function PaymentThirdReviewListFilter({ items }: Props) {
  const [selectedFilter, setSelectedFilter] = useState<PaymentReviewListFilter>('all');
  const filteredItems = useMemo(() => {
    if (selectedFilter === 'all') {
      return items;
    }

    return items.filter((item) => item.outcomeType === selectedFilter);
  }, [items, selectedFilter]);
  const { hasMore, loadMoreRef, visibleItems } = useInfiniteScroll({
    items: filteredItems,
    pageSize: PAGE_SIZE,
    resetKeys: [selectedFilter],
  });

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

      {filteredItems.length === 0 ? (
        <div className="rounded-[24px] bg-white px-5 py-10 text-center shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
          <p className="text-[16px] font-semibold leading-7 text-[#1a1c1e]">
            아직 결제 3심 내역이 없습니다.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-2">
            {visibleItems.map((item) => (
              <PaymentReviewHistoryRow
                key={item.id}
                href={`/payment-third-review/list/${item.id}`}
                item={item}
              />
            ))}
          </div>

          {hasMore ? (
            <div
              ref={loadMoreRef}
              className="min-h-11 rounded-full bg-[#ebeaf0] px-4 py-2.5 text-center text-sm font-semibold leading-6 text-[#72777e]"
            >
              다음 내역을 불러오는 중
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
