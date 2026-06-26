'use client';

import { useMemo, useState } from 'react';

import type { PaymentReviewHistoryItem } from '@/entities/payment-third-review';
import { PaymentReviewHistoryRow } from '@/entities/payment-third-review';

type Props = {
  items: PaymentReviewHistoryItem[];
};

type PaymentReviewListFilter = 'all' | PaymentReviewHistoryItem['decisionType'];

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

    return items.filter((item) => item.decisionType === selectedFilter);
  }, [items, selectedFilter]);

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

      <div className="grid gap-2">
        {filteredItems.map((item) => (
          <PaymentReviewHistoryRow
            key={item.id}
            href={`/payment-third-review/list/${item.id}`}
            item={item}
          />
        ))}
      </div>
    </div>
  );
}
