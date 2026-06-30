'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Crown, PiggyBank, RotateCcw, Search, Timer } from 'lucide-react';

import type { WeeklyReviewListItem } from '@/entities/review';
import { useInfiniteScroll } from '@/shared/lib/use-infinite-scroll';

const PAGE_SIZE = 4;

type Props = {
  items: WeeklyReviewListItem[];
};

export function ReviewList({ items }: Props) {
  const yearOptions = useMemo(() => getYearOptions(items), [items]);
  const monthOptions = useMemo(() => getMonthOptions(items), [items]);
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');

  const filteredItems = useMemo(
    () =>
      items.filter((item) => {
        const yearMatched = selectedYear === 'all' || item.year === Number(selectedYear);
        const monthMatched = selectedMonth === 'all' || item.month === Number(selectedMonth);

        return yearMatched && monthMatched;
      }),
    [items, selectedMonth, selectedYear],
  );
  const { hasMore, loadMoreRef, visibleItems } = useInfiniteScroll({
    items: filteredItems,
    pageSize: PAGE_SIZE,
    resetKeys: [selectedMonth, selectedYear],
  });

  return (
    <>
      <section
        aria-label="리포트 검색"
        className="grid gap-3 rounded-[28px] bg-white px-5 py-5 shadow-[var(--shadow-card)]"
      >
        <div className="flex items-center gap-2 text-sm font-semibold leading-6 text-[#3c5f7c]">
          <Search size={17} strokeWidth={2} aria-hidden="true" />
          년도와 월로 검색
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="grid gap-1.5">
            <span className="text-xs font-semibold leading-5 text-[var(--color-outline)]">
              년도
            </span>
            <select
              value={selectedYear}
              onChange={(event) => setSelectedYear(event.target.value)}
              className="h-12 rounded-[16px] border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] px-3 text-sm font-semibold text-[var(--color-on-surface)]"
            >
              <option value="all">전체</option>
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}년
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs font-semibold leading-5 text-[var(--color-outline)]">
              월
            </span>
            <select
              value={selectedMonth}
              onChange={(event) => setSelectedMonth(event.target.value)}
              className="h-12 rounded-[16px] border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] px-3 text-sm font-semibold text-[var(--color-on-surface)]"
            >
              <option value="all">전체</option>
              {monthOptions.map((month) => (
                <option key={month} value={month}>
                  {month}월
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="text-xs font-medium leading-5 text-[var(--color-on-surface-variant)]">
          {filteredItems.length}개의 리포트가 있어요.
        </p>
      </section>

      <section className="grid gap-3" aria-label="주간 리포트 목록">
        {visibleItems.map((item) => (
          <ReviewListCard key={item.id} item={item} />
        ))}
      </section>

      {filteredItems.length === 0 ? (
        <p className="rounded-[24px] bg-[var(--color-surface-container-low)] px-5 py-6 text-center text-sm font-medium leading-6 text-[var(--color-on-surface-variant)]">
          선택한 기간의 리포트가 아직 없어요.
        </p>
      ) : null}

      {hasMore ? (
        <div
          ref={loadMoreRef}
          className="min-h-12 rounded-full bg-[var(--color-surface-container-low)] px-4 py-3 text-center text-sm font-semibold leading-6 text-[var(--color-on-surface-variant)]"
        >
          다음 리포트를 불러오는 중
        </div>
      ) : null}
    </>
  );
}

function ReviewListCard({ item }: { item: WeeklyReviewListItem }) {
  return (
    <article className="rounded-[28px] bg-white px-5 py-5 shadow-[var(--shadow-card)]">
      <Link href={item.href} className="block" aria-label={`${item.weekLabel} 요약 보기`}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="w-fit rounded-full bg-[#e8eef3] px-3 py-1 text-xs font-semibold leading-5 text-[#3c5f7c]">
              {item.weekLabel}
            </p>
            <h2 className="mt-3 text-[21px] font-semibold leading-8 text-[var(--color-on-surface)]">
              {item.title}
            </h2>
            <p className="mt-2 text-sm font-medium leading-6 text-[var(--color-on-surface-variant)]">
              {item.description}
            </p>
          </div>
          <span className="mt-1 grid size-9 shrink-0 place-items-center rounded-full bg-[var(--color-surface-container-low)] text-[#3c5f7c]">
            <ChevronRight size={18} strokeWidth={2} aria-hidden="true" />
          </span>
        </div>
      </Link>

      <dl className="mt-4 grid grid-cols-3 gap-2">
        <ReviewListMetric icon={Timer} label="착수" value={item.startedCount} />
        <ReviewListMetric icon={PiggyBank} label="절약" value={item.savedAmount} />
        <ReviewListMetric icon={RotateCcw} label="복귀" value={item.returnRate} />
      </dl>

      <Link
        href={item.plusHref}
        className="mt-4 flex min-h-11 items-center justify-center gap-2 rounded-full bg-[var(--color-surface-container-low)] px-4 text-sm font-semibold leading-5 text-[#3c5f7c]"
      >
        <Crown size={16} strokeWidth={1.9} aria-hidden="true" />
        상세 리포트 보기
      </Link>
    </article>
  );
}

type ReviewListMetricProps = {
  icon: typeof Timer;
  label: string;
  value: string;
};

function ReviewListMetric({ icon: Icon, label, value }: ReviewListMetricProps) {
  return (
    <div className="min-w-0 rounded-[18px] bg-[var(--color-surface-container-low)] px-3 py-3">
      <dt className="flex items-center gap-1.5 text-xs font-semibold leading-5 text-[var(--color-outline)]">
        <Icon size={14} strokeWidth={1.9} aria-hidden="true" />
        {label}
      </dt>
      <dd className="mt-1 truncate text-sm font-semibold leading-6 text-[var(--color-on-surface)]">
        {value}
      </dd>
    </div>
  );
}

function getYearOptions(items: WeeklyReviewListItem[]) {
  return Array.from(new Set(items.map((item) => item.year))).sort((a, b) => b - a);
}

function getMonthOptions(items: WeeklyReviewListItem[]) {
  return Array.from(new Set(items.map((item) => item.month))).sort((a, b) => b - a);
}
