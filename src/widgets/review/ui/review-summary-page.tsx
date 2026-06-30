import { WEEKLY_REVIEW_SUMMARY_ICONS, type WeeklyReview } from '@/entities/review';
import { SiteButton, SiteTopBar } from '@/shared/ui';

import { getMetricToneClassName } from './review-tone';

type Props = {
  review: WeeklyReview;
};

export function ReviewSummaryPage({ review }: Props) {
  return (
    <>
      <SiteTopBar title="주간 리포트" backHref="/" skipHref="/review/plus" skipLabel="Plus" />
      <main className="mx-auto flex min-h-[calc(100svh-56px)] w-full max-w-[430px] flex-col gap-5 px-5 pb-8 pt-4">
        <section aria-labelledby="review-summary-title">
          <p className="text-xs font-bold uppercase leading-5 tracking-[0.08em] text-[#3c5f7c]">
            Weekly Overview
          </p>
          <h1
            id="review-summary-title"
            className="mt-2 text-[28px] font-semibold leading-9 text-[var(--color-on-surface)]"
          >
            주간 개요
          </h1>
          <div className="mt-5 rounded-[24px] bg-[#e8f5f1] px-5 py-5">
            <p className="text-[22px] font-semibold leading-8 text-[#3c5f7c]">
              {review.summary.title}
            </p>
            <p className="mt-2 text-sm font-medium leading-6 text-[var(--color-on-surface-variant)]">
              {review.summary.description}
            </p>
          </div>
        </section>

        <section className="grid gap-3" aria-labelledby="review-summary-metrics">
          <h2
            id="review-summary-metrics"
            className="text-lg font-semibold leading-7 text-[var(--color-on-surface)]"
          >
            핵심 지표
          </h2>
          <div className="grid gap-3">
            {review.summaryMetrics.map((metric, index) => {
              const Icon = WEEKLY_REVIEW_SUMMARY_ICONS[index];

              return (
                <article
                  key={metric.id}
                  className="flex min-h-[74px] items-center gap-4 rounded-[24px] bg-white px-5 py-4 shadow-[var(--shadow-card)]"
                >
                  <span
                    className={`grid size-10 shrink-0 place-items-center rounded-full ${getMetricToneClassName(metric.tone)}`}
                    aria-hidden="true"
                  >
                    <Icon size={20} strokeWidth={1.9} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold leading-5 text-[var(--color-outline)]">
                      {metric.label}
                    </p>
                    <h3 className="text-[17px] font-semibold leading-7 text-[var(--color-on-surface)]">
                      {metric.value}
                    </h3>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <SiteButton href="/review/plus" className="mt-auto w-full">
          상세 보기
        </SiteButton>
      </main>
    </>
  );
}
